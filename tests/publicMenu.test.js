const request = require('supertest');

jest.mock('../src/repositories/restauranteRepo', () => ({
  findBySlug: jest.fn(),
}));

jest.mock('../src/repositories/categoriaRepo', () => ({
  findAllByTenant: jest.fn(),
}));

jest.mock('../src/repositories/productoRepo', () => ({
  findAllByTenant: jest.fn(),
}));

const restauranteRepo = require('../src/repositories/restauranteRepo');
const categoriaRepo = require('../src/repositories/categoriaRepo');
const productoRepo = require('../src/repositories/productoRepo');
const { createApp } = require('../src/app');

describe('Public Menu Endpoint (#3)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /public/restaurantes/:slug/menu returns 200 with restaurant, ordered categories and nested products', async () => {
    const restId = '22222222-2222-4222-8222-222222222222';
    const cat1Id = '33333333-3333-4333-8333-333333333331';
    const cat2Id = '33333333-3333-4333-8333-333333333332';

    restauranteRepo.findBySlug.mockResolvedValueOnce({
      id: restId,
      nombre: 'Tacos Pepe',
      slug: 'tacos-pepe',
      temaColor: '#D62828',
      logoUrl: null,
      telefono: '3312345678',
    });
    categoriaRepo.findAllByTenant.mockResolvedValueOnce([
      { id: cat1Id, restauranteId: restId, nombre: 'Tacos', orden: 1 },
      { id: cat2Id, restauranteId: restId, nombre: 'Bebidas', orden: 2 },
    ]);
    productoRepo.findAllByTenant.mockResolvedValueOnce([
      { id: 'p1', categoriaId: cat1Id, restauranteId: restId, nombre: 'Taco al Pastor', precio: '25.00', disponible: true },
      { id: 'p2', categoriaId: cat2Id, restauranteId: restId, nombre: 'Refresco', precio: '25.00', disponible: true },
    ]);

    const app = createApp();
    const res = await request(app).get('/public/restaurantes/tacos-pepe/menu');

    expect(res.status).toBe(200);
    expect(res.body.restaurante.slug).toBe('tacos-pepe');
    expect(res.body.categorias).toHaveLength(2);
    expect(res.body.categorias[0].nombre).toBe('Tacos');
    expect(res.body.categorias[0].productos).toHaveLength(1);
    expect(res.body.categorias[1].productos[0].nombre).toBe('Refresco');
  });

  test('GET /public/restaurantes/:slug/menu returns 404 when slug does not exist', async () => {
    restauranteRepo.findBySlug.mockResolvedValueOnce(null);

    const app = createApp();
    const res = await request(app).get('/public/restaurantes/no-existe/menu');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
