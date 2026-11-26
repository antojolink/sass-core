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

describe('Restaurantes Endpoints (#3)', () => {
  const userId = '11111111-1111-4111-8111-111111111111';
  const tenantId = '22222222-2222-4222-8222-222222222222';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    process.env.COGNITO_USER_POOL_ID = 'us-east-1_testpool';
    process.env.COGNITO_CLIENT_ID = 'testclientid';
    mockVerify.mockResolvedValue({ sub: 'sub-1', email: 'owner@tacos.com' });
  });

  test('POST /restaurantes creates restaurant, generates normalized slug, and links user (201)', async () => {
    usuarioRepo.findByCognitoSub.mockResolvedValueOnce({
      id: userId,
      cognitoSub: 'sub-1',
      email: 'owner@tacos.com',
      rol: 'ADMIN',
      restauranteId: null,
    });
    restauranteRepo.findBySlug.mockResolvedValueOnce(null);
    restauranteRepo.create.mockResolvedValueOnce({
      id: tenantId,
      nombre: 'Taquería El Güero!',
      slug: 'taqueria-el-guero',
      temaColor: '#E63946',
      logoUrl: null,
      telefono: '3312345678',
    });
    usuarioRepo.updateRestauranteId.mockResolvedValueOnce();

    const app = createApp();
    const res = await request(app)
      .post('/restaurantes')
      .set('Authorization', 'Bearer token')
      .send({
        nombre: 'Taquería El Güero!',
        telefono: '3312345678',
      });

    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('taqueria-el-guero');
    expect(usuarioRepo.updateRestauranteId).toHaveBeenCalledWith(userId, tenantId);
  });

  test('POST /restaurantes resolves slug collision by appending -2', async () => {
    usuarioRepo.findByCognitoSub.mockResolvedValueOnce({
      id: userId,
      cognitoSub: 'sub-1',
      email: 'owner@tacos.com',
      rol: 'ADMIN',
      restauranteId: null,
    });
    restauranteRepo.findBySlug
      .mockResolvedValueOnce({ id: 'existing-id', slug: 'tacos-pepe' })
      .mockResolvedValueOnce(null);
    restauranteRepo.create.mockImplementationOnce(async (data) => ({
      id: tenantId,
      ...data,
    }));
    usuarioRepo.updateRestauranteId.mockResolvedValueOnce();

    const app = createApp();
    const res = await request(app)
      .post('/restaurantes')
      .set('Authorization', 'Bearer token')
      .send({ nombre: 'Tacos Pepe' });

    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('tacos-pepe-2');
  });

  test('POST /restaurantes returns 409 CONFLICT if user already has a restaurant', async () => {
    usuarioRepo.findByCognitoSub.mockResolvedValueOnce({
      id: userId,
      cognitoSub: 'sub-1',
      email: 'owner@tacos.com',
      rol: 'ADMIN',
      restauranteId: tenantId,
    });

    const app = createApp();
    const res = await request(app)
      .post('/restaurantes')
      .set('Authorization', 'Bearer token')
      .send({ nombre: 'Otro Restaurante' });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  test('POST /restaurantes returns 400 VALIDATION_ERROR on missing/invalid body', async () => {
    usuarioRepo.findByCognitoSub.mockResolvedValueOnce({
      id: userId,
      cognitoSub: 'sub-1',
      email: 'owner@tacos.com',
      rol: 'ADMIN',
      restauranteId: null,
    });

    const app = createApp();
    const res = await request(app)
      .post('/restaurantes')
      .set('Authorization', 'Bearer token')
      .send({ nombre: '' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('GET /restaurantes/me returns 200 with tenant restaurant', async () => {
    usuarioRepo.findByCognitoSub.mockResolvedValueOnce({
      id: userId,
      cognitoSub: 'sub-1',
      email: 'owner@tacos.com',
      rol: 'ADMIN',
      restauranteId: tenantId,
    });
    restauranteRepo.findById.mockResolvedValueOnce({
      id: tenantId,
      nombre: 'Tacos Pepe',
      slug: 'tacos-pepe',
      temaColor: '#D62828',
      logoUrl: null,
      telefono: '3312345678',
    });

    const app = createApp();
    const res = await request(app)
      .get('/restaurantes/me')
      .set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(tenantId);
  });

  test('PUT /restaurantes/me updates allowed fields and does NOT change slug', async () => {
    usuarioRepo.findByCognitoSub.mockResolvedValueOnce({
      id: userId,
      cognitoSub: 'sub-1',
      email: 'owner@tacos.com',
      rol: 'ADMIN',
      restauranteId: tenantId,
    });
    restauranteRepo.update.mockResolvedValueOnce({
      id: tenantId,
      nombre: 'Tacos Pepe Renovado',
      slug: 'tacos-pepe',
      temaColor: '#1D3557',
      plantilla: 'maiz',
      logoUrl: 'https://cdn.example.com/logo.png',
      telefono: '3399999999',
    });

    const app = createApp();
    const res = await request(app)
      .put('/restaurantes/me')
      .set('Authorization', 'Bearer token')
      .send({
        nombre: 'Tacos Pepe Renovado',
        slug: 'hacked-slug',
        temaColor: '#1D3557',
        plantilla: 'maiz',
        logoUrl: 'https://cdn.example.com/logo.png',
        telefono: '3399999999',
      });

    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('tacos-pepe');
    expect(res.body.plantilla).toBe('maiz');
    expect(restauranteRepo.update).toHaveBeenCalledWith(tenantId, {
      nombre: 'Tacos Pepe Renovado',
      temaColor: '#1D3557',
      plantilla: 'maiz',
      logoUrl: 'https://cdn.example.com/logo.png',
      telefono: '3399999999',
    });
  });
});
