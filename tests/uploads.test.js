const request = require('supertest');

const mockVerify = jest.fn();
jest.mock('aws-jwt-verify', () => ({
  CognitoJwtVerifier: {
    create: jest.fn(() => ({
      verify: mockVerify,
    })),
  },
}));

const mockGetSignedUrl = jest.fn();
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: mockGetSignedUrl,
}));

jest.mock('../src/repositories/usuarioRepo', () => ({
  findByCognitoSub: jest.fn(),
  create: jest.fn(),
}));

jest.mock('../src/repositories/restauranteRepo', () => ({
  findById: jest.fn(),
}));

const usuarioRepo = require('../src/repositories/usuarioRepo');
const restauranteRepo = require('../src/repositories/restauranteRepo');
const { createApp } = require('../src/app');

describe('Uploads Presigned URL Endpoint (#7)', () => {
  const tenantId = '22222222-2222-4222-8222-222222222222';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    process.env.COGNITO_USER_POOL_ID = 'us-east-1_testpool';
    process.env.COGNITO_CLIENT_ID = 'testclientid';
    process.env.AWS_REGION = 'us-east-1';
    process.env.IMAGES_BUCKET = 'antojolink-images-test';
    process.env.IMAGES_BASE_URL = 'https://cdn.antojolink.com';

    mockVerify.mockResolvedValue({ sub: 'sub-1', email: 'owner@tacos.com' });
    usuarioRepo.findByCognitoSub.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      cognitoSub: 'sub-1',
      email: 'owner@tacos.com',
      rol: 'ADMIN',
      restauranteId: tenantId,
    });
    restauranteRepo.findById.mockResolvedValue({
      id: tenantId,
      nombre: 'Tacos Pepe',
      slug: 'tacos-pepe',
    });
    mockGetSignedUrl.mockResolvedValue('https://s3.amazonaws.com/presigned-put-url');
  });

  test.each([
    ['producto', 'image/jpeg', 'jpg'],
    ['logo', 'image/png', 'png'],
    ['producto', 'image/webp', 'webp'],
  ])(
    'POST /uploads/presign returns 200 with uploadUrl and publicUrl for %s (%s)',
    async (tipo, contentType, ext) => {
      const app = createApp();
      const res = await request(app)
        .post('/uploads/presign')
        .set('Authorization', 'Bearer token')
        .send({ tipo, contentType });

      expect(res.status).toBe(200);
      expect(res.body.uploadUrl).toBe('https://s3.amazonaws.com/presigned-put-url');
      expect(res.body.publicUrl).toMatch(
        new RegExp(`^https://cdn\\.antojolink\\.com/uploads/tacos-pepe/[0-9a-f-]+\\.${ext}$`)
      );

      expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
      const [, command, options] = mockGetSignedUrl.mock.calls[0];
      expect(command.input).toMatchObject({
        Bucket: 'antojolink-images-test',
        ContentType: contentType,
      });
      expect(command.input.Key).toMatch(new RegExp(`^uploads/tacos-pepe/[0-9a-f-]+\\.${ext}$`));
      expect(options).toEqual({ expiresIn: 300 });
    }
  );

  test('POST /uploads/presign rejects invalid MIME type with 400 VALIDATION_ERROR', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/uploads/presign')
      .set('Authorization', 'Bearer token')
      .send({ tipo: 'producto', contentType: 'application/pdf' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('POST /uploads/presign rejects invalid tipo with 400 VALIDATION_ERROR', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/uploads/presign')
      .set('Authorization', 'Bearer token')
      .send({ tipo: 'banner', contentType: 'image/png' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
