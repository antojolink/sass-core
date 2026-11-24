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
  findByIdAndTenant: jest.fn(),
}));

jest.mock('../src/repositories/productoRepo', () => ({
  findAllByTenant: jest.fn(),
  findByIdAndTenant: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateDisponibilidad: jest.fn(),
  remove: jest.fn(),
}));

const usuarioRepo = require('../src/repositories/usuarioRepo');
const categoriaRepo = require('../src/repositories/categoriaRepo');
const productoRepo = require('../src/repositories/productoRepo');
const { createApp } = require('../src/app');

describe('Productos CRUD, Price Normalization & Availability (#4)', () => {
  const tenantId = '22222222-2222-4222-8222-222222222222';
  const catId = '33333333-3333-4333-8333-333333333333';
  const prodId = '44444444-4444-4444-8444-444444444444';

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

  test('GET /productos lists products and supports optional ?categoriaId filter', async () => {
    productoRepo.findAllByTenant.mockResolvedValueOnce([
      { id: prodId, categoriaId: catId, restauranteId: tenantId, nombre: 'Taco al Pastor', precio: '25.00', disponible: true },
    ]);

    const app = createApp();
    const res = await request(app)
      .get(`/productos?categoriaId=${catId}`)
      .set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(productoRepo.findAllByTenant).toHaveBeenCalledWith(tenantId, { categoriaId: catId });
  });

  test('POST /productos normalizes price (45.5 -> "45.50") and creates product (201)', async () => {
    categoriaRepo.findByIdAndTenant.mockResolvedValueOnce({ id: catId, restauranteId: tenantId });
    productoRepo.create.mockImplementationOnce(async (tid, data) => ({
      id: prodId,
      restauranteId: tid,
      ...data,
    }));

    const app = createApp();
    const res = await request(app)
      .post('/productos')
      .set('Authorization', 'Bearer token')
      .send({
        categoriaId: catId,
        nombre: 'Quesadilla Especial',
        descripcion: 'Con queso Oaxaca',
        precio: 45.5,
      });

    expect(res.status).toBe(201);
    expect(res.body.precio).toBe('45.50');
    expect(productoRepo.create).toHaveBeenCalledWith(
      tenantId,
      expect.objectContaining({ precio: '45.50', disponible: true })
    );
  });

  test('POST /productos rejects negative or non-numeric price with 400 VALIDATION_ERROR', async () => {
    const app = createApp();

    const negRes = await request(app)
      .post('/productos')
      .set('Authorization', 'Bearer token')
      .send({
        categoriaId: catId,
        nombre: 'Taco Gratis Negativo',
        precio: -10,
      });
    expect(negRes.status).toBe(400);
    expect(negRes.body.error.code).toBe('VALIDATION_ERROR');

    const nanRes = await request(app)
      .post('/productos')
      .set('Authorization', 'Bearer token')
      .send({
        categoriaId: catId,
        nombre: 'Taco NaN',
        precio: 'abc',
      });
    expect(nanRes.status).toBe(400);
    expect(nanRes.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('POST /productos returns 404 when categoriaId does not belong to tenant', async () => {
    categoriaRepo.findByIdAndTenant.mockResolvedValueOnce(null);

    const app = createApp();
    const res = await request(app)
      .post('/productos')
      .set('Authorization', 'Bearer token')
      .send({
        categoriaId: catId,
        nombre: 'Taco Ajeno',
        precio: '25.00',
      });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  test('PUT /productos/:id updates product (200) and returns 404 for cross-tenant product', async () => {
    productoRepo.update.mockResolvedValueOnce({
      id: prodId,
      categoriaId: catId,
      restauranteId: tenantId,
      nombre: 'Taco Actualizado',
      precio: '30.00',
      disponible: true,
    });

    const app = createApp();
    const okRes = await request(app)
      .put(`/productos/${prodId}`)
      .set('Authorization', 'Bearer token')
      .send({ nombre: 'Taco Actualizado', precio: 30 });

    expect(okRes.status).toBe(200);
    expect(okRes.body.precio).toBe('30.00');

    productoRepo.update.mockResolvedValueOnce(null);
    const notFoundRes = await request(app)
      .put(`/productos/${prodId}`)
      .set('Authorization', 'Bearer token')
      .send({ nombre: 'Otro' });

    expect(notFoundRes.status).toBe(404);
  });

  test('PATCH /productos/:id/disponibilidad toggles availability without deleting (200)', async () => {
    productoRepo.updateDisponibilidad.mockResolvedValueOnce({
      id: prodId,
      categoriaId: catId,
      restauranteId: tenantId,
      nombre: 'Gringa de Pastor',
      precio: '55.00',
      disponible: false,
    });

    const app = createApp();
    const res = await request(app)
      .patch(`/productos/${prodId}/disponibilidad`)
      .set('Authorization', 'Bearer token')
      .send({ disponible: false });

    expect(res.status).toBe(200);
    expect(res.body.disponible).toBe(false);
    expect(productoRepo.remove).not.toHaveBeenCalled();
    expect(productoRepo.updateDisponibilidad).toHaveBeenCalledWith(prodId, tenantId, false);
  });

  test('DELETE /productos/:id deletes product (204) and returns 404 when missing', async () => {
    productoRepo.remove.mockResolvedValueOnce(true);

    const app = createApp();
    const okRes = await request(app)
      .delete(`/productos/${prodId}`)
      .set('Authorization', 'Bearer token');
    expect(okRes.status).toBe(204);

    productoRepo.remove.mockResolvedValueOnce(false);
    const missingRes = await request(app)
      .delete(`/productos/${prodId}`)
      .set('Authorization', 'Bearer token');
    expect(missingRes.status).toBe(404);
  });
});
