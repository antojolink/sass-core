const request = require('supertest');
const { createApp } = require('../src/app');
const { AppError } = require('../src/utils/errors');
const pkg = require('../package.json');

describe('Health & CORS (T01, T02)', () => {
  const originalCorsOrigins = process.env.CORS_ORIGINS;

  beforeEach(() => {
    process.env.CORS_ORIGINS = 'https://app.antojolink.com,http://localhost:5173';
  });

  afterAll(() => {
    process.env.CORS_ORIGINS = originalCorsOrigins;
  });

  test('T01: GET /health returns 200 with status ok and version', async () => {
    const app = createApp();
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'ok',
      version: pkg.version,
    });
  });

  test('T02: CORS allows configured origins and omits header for disallowed origins', async () => {
    const app = createApp();

    const allowedRes = await request(app)
      .get('/health')
      .set('Origin', 'https://app.antojolink.com');

    expect(allowedRes.status).toBe(200);
    expect(allowedRes.headers['access-control-allow-origin']).toBe('https://app.antojolink.com');

    const disallowedRes = await request(app)
      .get('/health')
      .set('Origin', 'https://evil.example.com');

    expect(disallowedRes.status).toBe(200);
    expect(disallowedRes.headers['access-control-allow-origin']).toBeUndefined();

    const noOriginRes = await request(app).get('/health');
    expect(noOriginRes.status).toBe(200);
  });

  test('Unknown route returns 404 with standard error contract', async () => {
    const app = createApp();
    const res = await request(app).get('/non-existent-route');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: expect.any(String),
        details: [],
      },
    });
  });

  test('Error handler formats AppError and unexpected errors consistently', async () => {
    const app = createApp({
      extraRoutes: (router) => {
        router.get('/test-app-error', () => {
          throw new AppError(409, 'CONFLICT', 'Already exists', [{ field: 'slug' }]);
        });
        router.get('/test-unexpected-error', () => {
          throw new Error('Boom');
        });
      },
    });

    const appErrRes = await request(app).get('/test-app-error');
    expect(appErrRes.status).toBe(409);
    expect(appErrRes.body).toEqual({
      error: {
        code: 'CONFLICT',
        message: 'Already exists',
        details: [{ field: 'slug' }],
      },
    });

    const unexpectedRes = await request(app).get('/test-unexpected-error');
    expect(unexpectedRes.status).toBe(500);
    expect(unexpectedRes.body).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: [],
      },
    });
  });
});
