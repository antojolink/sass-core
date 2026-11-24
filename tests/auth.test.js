const request = require('supertest');

const mockVerify = jest.fn();
jest.mock('aws-jwt-verify', () => ({
  CognitoJwtVerifier: {
    create: jest.fn(() => ({
      verify: mockVerify,
    })),
  },
}));

jest.mock('../src/repositories/usuarioRepo', () => ({
  findByCognitoSub: jest.fn(),
  create: jest.fn(),
  updateRestauranteId: jest.fn(),
}));

jest.mock('../src/repositories/restauranteRepo', () => ({
  findById: jest.fn(),
  findBySlug: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));

const usuarioRepo = require('../src/repositories/usuarioRepo');
const restauranteRepo = require('../src/repositories/restauranteRepo');
const { createApp } = require('../src/app');

describe('Auth & Multi-Tenant Middleware (#5)', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    process.env.COGNITO_USER_POOL_ID = 'us-east-1_testpool';
    process.env.COGNITO_CLIENT_ID = 'testclientid';
    process.env.DEV_AUTH_BYPASS = 'false';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('Missing Authorization header returns 401 UNAUTHORIZED', async () => {
    const app = createApp();
    const res = await request(app).get('/restaurantes/me');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  test('Invalid JWT token returns 401 UNAUTHORIZED', async () => {
    mockVerify.mockRejectedValueOnce(new Error('Token expired'));
    const app = createApp();
    const res = await request(app)
      .get('/restaurantes/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  test('Auto-provisions usuario on first authenticated request and returns 403 TENANT_REQUIRED when no restaurant', async () => {
    mockVerify.mockResolvedValueOnce({
      sub: 'cognito-sub-new',
      email: 'nuevo@antojolink.com',
    });
    usuarioRepo.findByCognitoSub.mockResolvedValueOnce(null);
    usuarioRepo.create.mockResolvedValueOnce({
      id: '11111111-1111-4111-8111-111111111111',
      cognitoSub: 'cognito-sub-new',
      email: 'nuevo@antojolink.com',
      rol: 'ADMIN',
      restauranteId: null,
    });

    const app = createApp();
    const res = await request(app)
      .get('/restaurantes/me')
      .set('Authorization', 'Bearer valid-token');

    expect(usuarioRepo.create).toHaveBeenCalledWith({
      cognitoSub: 'cognito-sub-new',
      email: 'nuevo@antojolink.com',
      rol: 'ADMIN',
    });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('TENANT_REQUIRED');
  });

  test('DEV_AUTH_BYPASS is ignored in test and production environments', async () => {
    process.env.DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'test';

    const appTest = createApp();
    const resTest = await request(appTest)
      .get('/restaurantes/me')
      .set('x-dev-sub', 'dev-sub-1')
      .set('x-dev-email', 'dev@test.com');

    expect(resTest.status).toBe(401);

    process.env.NODE_ENV = 'production';
    const appProd = createApp();
    const resProd = await request(appProd)
      .get('/restaurantes/me')
      .set('x-dev-sub', 'dev-sub-1');

    expect(resProd.status).toBe(401);
  });

  test('DEV_AUTH_BYPASS works ONLY when NODE_ENV=development and DEV_AUTH_BYPASS=true', async () => {
    process.env.NODE_ENV = 'development';
    process.env.DEV_AUTH_BYPASS = 'true';

    usuarioRepo.findByCognitoSub.mockResolvedValueOnce({
      id: '11111111-1111-4111-8111-111111111111',
      cognitoSub: 'dev-sub-1',
      email: 'dev@antojolink.com',
      rol: 'ADMIN',
      restauranteId: '22222222-2222-4222-8222-222222222222',
    });
    restauranteRepo.findById.mockResolvedValueOnce({
      id: '22222222-2222-4222-8222-222222222222',
      nombre: 'Tacos Dev',
      slug: 'tacos-dev',
      temaColor: '#E63946',
      logoUrl: null,
      telefono: null,
    });

    const app = createApp();
    const res = await request(app)
      .get('/restaurantes/me')
      .set('x-dev-sub', 'dev-sub-1')
      .set('x-dev-email', 'dev@antojolink.com');

    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('tacos-dev');
  });
});
