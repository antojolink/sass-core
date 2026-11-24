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
}));

jest.mock('../src/repositories/categoriaRepo', () => ({
  findAllByTenant: jest.fn(),
  findByIdAndTenant: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

const usuarioRepo = require('../src/repositories/usuarioRepo');
const categoriaRepo = require('../src/repositories/categoriaRepo');
const { createApp } = require('../src/app');

describe('Categorías CRUD & Multi-Tenant Isolation (#4)', () => {
  const tenantId = '22222222-2222-4222-8222-222222222222';
  const catId = '33333333-3333-4333-8333-333333333333';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    process.env.COGNITO_USER_POOL_ID = 'us-east-1_testpool';
    process.env.COGNITO_CLIENT_ID = 'testclientid';
    mockVerify.mockResolvedValue({ sub: 'sub-1', email: 'owner@tacos.com' });
    usuarioRepo.findByCognitoSub.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      cognitoSub: 'sub-1',
      email: 'owner@tacos.com',
      rol: 'ADMIN',
      restauranteId: tenantId,
    });
  });

  test('GET /categorias lists categories scoped to req.tenantId', async () => {
    categoriaRepo.findAllByTenant.mockResolvedValueOnce([
      { id: catId, restauranteId: tenantId, nombre: 'Tacos', orden: 1 },
    ]);

    const app = createApp();
    const res = await request(app)
      .get('/categorias')
      .set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(categoriaRepo.findAllByTenant).toHaveBeenCalledWith(tenantId);
  });

  test('POST /categorias creates category (201)', async () => {
    categoriaRepo.create.mockResolvedValueOnce({
      id: catId,
      restauranteId: tenantId,
      nombre: 'Postres',
      orden: 3,
    });

    const app = createApp();
    const res = await request(app)
      .post('/categorias')
      .set('Authorization', 'Bearer token')
      .send({ nombre: 'Postres', orden: 3 });

    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe('Postres');
    expect(categoriaRepo.create).toHaveBeenCalledWith(tenantId, { nombre: 'Postres', orden: 3 });
  });

  test('PUT /categorias/:id updates category (200) and returns 404 for another tenant', async () => {
    categoriaRepo.update.mockResolvedValueOnce({
      id: catId,
      restauranteId: tenantId,
      nombre: 'Tacos Especiales',
      orden: 1,
    });

    const app = createApp();
    const okRes = await request(app)
      .put(`/categorias/${catId}`)
      .set('Authorization', 'Bearer token')
      .send({ nombre: 'Tacos Especiales', orden: 1 });

    expect(okRes.status).toBe(200);
    expect(okRes.body.nombre).toBe('Tacos Especiales');

    categoriaRepo.update.mockResolvedValueOnce(null);
    const otherTenantRes = await request(app)
      .put(`/categorias/${catId}`)
      .set('Authorization', 'Bearer token')
      .send({ nombre: 'Hack' });

    expect(otherTenantRes.status).toBe(404);
    expect(otherTenantRes.body.error.code).toBe('NOT_FOUND');
  });

  test('DELETE /categorias/:id deletes category (204) and returns 404 if not owned by tenant', async () => {
    categoriaRepo.remove.mockResolvedValueOnce(true);

    const app = createApp();
    const okRes = await request(app)
      .delete(`/categorias/${catId}`)
      .set('Authorization', 'Bearer token');

    expect(okRes.status).toBe(204);

    categoriaRepo.remove.mockResolvedValueOnce(false);
    const missingRes = await request(app)
      .delete(`/categorias/${catId}`)
      .set('Authorization', 'Bearer token');

    expect(missingRes.status).toBe(404);
  });

  test('Invalid UUID in :id returns 400 VALIDATION_ERROR', async () => {
    const app = createApp();
    const res = await request(app)
      .delete('/categorias/not-a-uuid')
      .set('Authorization', 'Bearer token');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
