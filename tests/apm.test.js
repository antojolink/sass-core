const { Writable } = require('stream');
const request = require('supertest');

const mockOpenSegment = jest.fn(() => (req, res, next) => next());
const mockCloseSegment = jest.fn(() => (req, res, next) => next());
const mockCapturePostgres = jest.fn((pg) => pg);
const mockCaptureAWSv3Client = jest.fn((client) => client);

jest.mock('aws-xray-sdk', () => ({
  express: {
    openSegment: mockOpenSegment,
    closeSegment: mockCloseSegment,
  },
  capturePostgres: mockCapturePostgres,
  captureAWSv3Client: mockCaptureAWSv3Client,
}));

const { createApp } = require('../src/app');
const { createLogger } = require('../src/config/logger');
const xray = require('../src/config/xray');

describe('APM, X-Ray & Structured Logging (#18)', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NODE_ENV = 'test';
    delete process.env.AWS_XRAY_DISABLED;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('GET /debug/error returns 500 and emits JSON error log with string level and HTTP metadata when not in production', async () => {
    process.env.NODE_ENV = 'development';
    process.env.AWS_XRAY_DISABLED = 'true';

    const logChunks = [];
    const destination = new Writable({
      write(chunk, _encoding, callback) {
        logChunks.push(chunk.toString());
        callback();
      },
    });

    const testLogger = createLogger({ level: 'info', destination });
    const app = createApp({ logger: testLogger });

    const res = await request(app)
      .get('/debug/error')
      .set('x-amzn-trace-id', 'Root=1-67890-abcdef');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: [],
      },
    });

    const parsedLogs = logChunks
      .join('')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));

    const errorLog = parsedLogs.find((entry) => entry.level === 'error');
    expect(errorLog).toBeDefined();

    const httpLog = parsedLogs.find((entry) => entry.req && entry.res);
    expect(httpLog).toBeDefined();
    expect(httpLog.req).toMatchObject({ method: 'GET', url: '/debug/error' });
    expect(httpLog.res).toMatchObject({ statusCode: 500 });
    expect(typeof httpLog.responseTime).toBe('number');
    expect(httpLog.traceId).toBe('Root=1-67890-abcdef');
  });

  test('GET /debug/error is NOT mounted in production and returns 404', async () => {
    process.env.NODE_ENV = 'production';
    process.env.AWS_XRAY_DISABLED = 'true';

    const app = createApp();
    const res = await request(app).get('/debug/error');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  test('X-Ray is disabled in test or when AWS_XRAY_DISABLED=true, and enabled otherwise', () => {
    process.env.NODE_ENV = 'test';
    expect(xray.isXrayEnabled()).toBe(false);

    process.env.NODE_ENV = 'production';
    process.env.AWS_XRAY_DISABLED = 'true';
    expect(xray.isXrayEnabled()).toBe(false);

    delete process.env.AWS_XRAY_DISABLED;
    process.env.APP_ENV = 'prod';
    expect(xray.isXrayEnabled()).toBe(true);

    const openMw = xray.openSegmentMiddleware();
    const closeMw = xray.closeSegmentMiddleware();
    expect(typeof openMw).toBe('function');
    expect(typeof closeMw).toBe('function');
    expect(mockOpenSegment).toHaveBeenCalledWith('antojolink-api-prod');
    expect(mockCloseSegment).toHaveBeenCalledTimes(1);

    const fakePg = { name: 'pg' };
    xray.capturePostgres(fakePg);
    expect(mockCapturePostgres).toHaveBeenCalledWith(fakePg);

    const fakeS3 = { name: 's3' };
    xray.captureAWSv3Client(fakeS3);
    expect(mockCaptureAWSv3Client).toHaveBeenCalledWith(fakeS3);
  });
});
