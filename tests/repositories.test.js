jest.mock('../src/db/knex', () => {
  const mockFn = jest.fn();
  mockFn.fn = { now: jest.fn(() => 'NOW()') };
  return mockFn;
});

const db = require('../src/db/knex');
const usuarioRepo = require('../src/repositories/usuarioRepo');
const restauranteRepo = require('../src/repositories/restauranteRepo');
const categoriaRepo = require('../src/repositories/categoriaRepo');
const productoRepo = require('../src/repositories/productoRepo');
const { generateSlug } = require('../src/utils/slug');
const { parseAndFormatPrice } = require('../src/utils/price');

function makeQueryMock(result) {
  const q = {
    where: jest.fn(() => q),
    andWhere: jest.fn(() => q),
    orderBy: jest.fn(async () => result),
    first: jest.fn(async () => result),
    insert: jest.fn(() => q),
    update: jest.fn(() => q),
    returning: jest.fn(async () => (Array.isArray(result) ? result : [result])),
    del: jest.fn(async () => result),
  };
  return q;
}

describe('Repositories & Utils Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('slug & price utilities handle edge cases', () => {
    expect(generateSlug('')).toBe('');
    expect(generateSlug(null)).toBe('');
    expect(generateSlug('  Café & Té Ñoño!! ')).toBe('cafe-te-nono');

    expect(parseAndFormatPrice(null)).toBeNull();
    expect(parseAndFormatPrice(undefined)).toBeNull();
    expect(parseAndFormatPrice(true)).toBeNull();
    expect(parseAndFormatPrice('   ')).toBeNull();
    expect(parseAndFormatPrice({})).toBeNull();
    expect(parseAndFormatPrice(Infinity)).toBeNull();
    expect(parseAndFormatPrice(-0.01)).toBeNull();
    expect(parseAndFormatPrice(0)).toBe('0.00');
    expect(parseAndFormatPrice('12.5')).toBe('12.50');
  });

  test('usuarioRepo maps rows and executes queries', async () => {
    expect(usuarioRepo.mapUsuario(null)).toBeNull();

    const row = {
      id: 'u1',
      cognito_sub: 'sub-1',
      email: 'a@b.com',
      rol: 'ADMIN',
      restaurante_id: null,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    };

    db.mockReturnValueOnce(makeQueryMock(row));
    expect(await usuarioRepo.findByCognitoSub('sub-1')).toMatchObject({
      id: 'u1',
      cognitoSub: 'sub-1',
      restauranteId: null,
    });

    db.mockReturnValueOnce(makeQueryMock([row]));
    expect(await usuarioRepo.create({ cognitoSub: 'sub-1', email: 'a@b.com' })).toMatchObject({
      cognitoSub: 'sub-1',
    });

    db.mockReturnValueOnce(makeQueryMock([{ ...row, restaurante_id: 'r1' }]));
    expect(await usuarioRepo.updateRestauranteId('u1', 'r1')).toMatchObject({
      restauranteId: 'r1',
    });
  });

  test('restauranteRepo maps rows and executes queries', async () => {
    expect(restauranteRepo.mapRestaurante(null)).toBeNull();

    const row = {
      id: 'r1',
      nombre: 'Tacos Pepe',
      slug: 'tacos-pepe',
      tema_color: '#D62828',
      logo_url: null,
      telefono: '3312345678',
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    };

    db.mockReturnValueOnce(makeQueryMock(row));
    expect(await restauranteRepo.findById('r1')).toMatchObject({ slug: 'tacos-pepe' });

    db.mockReturnValueOnce(makeQueryMock(row));
    expect(await restauranteRepo.findBySlug('tacos-pepe')).toMatchObject({ id: 'r1' });

    db.mockReturnValueOnce(makeQueryMock([row]));
    expect(
      await restauranteRepo.create({
        nombre: 'Tacos Pepe',
        slug: 'tacos-pepe',
        temaColor: '#D62828',
      })
    ).toMatchObject({ temaColor: '#D62828' });

    db.mockReturnValueOnce(makeQueryMock([row]));
    expect(
      await restauranteRepo.update('r1', {
        nombre: 'New',
        temaColor: '#000000',
        logoUrl: 'https://x.com/a.png',
        telefono: '123',
      })
    ).toMatchObject({ id: 'r1' });
  });

  test('categoriaRepo maps rows and executes CRUD queries', async () => {
    expect(categoriaRepo.mapCategoria(null)).toBeNull();

    const row = {
      id: 'c1',
      restaurante_id: 'r1',
      nombre: 'Tacos',
      orden: 1,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    };

    db.mockReturnValueOnce(makeQueryMock([row]));
    expect(await categoriaRepo.findAllByTenant('r1')).toHaveLength(1);

    db.mockReturnValueOnce(makeQueryMock(row));
    expect(await categoriaRepo.findByIdAndTenant('c1', 'r1')).toMatchObject({ id: 'c1' });

    db.mockReturnValueOnce(makeQueryMock([row]));
    expect(await categoriaRepo.create('r1', { nombre: 'Tacos' })).toMatchObject({ nombre: 'Tacos' });

    db.mockReturnValueOnce(makeQueryMock([row]));
    expect(await categoriaRepo.update('c1', 'r1', { nombre: 'Tacos 2', orden: 2 })).toMatchObject({
      id: 'c1',
    });

    db.mockReturnValueOnce(makeQueryMock(1));
    expect(await categoriaRepo.remove('c1', 'r1')).toBe(true);
  });

  test('productoRepo maps rows with 2-decimal precio and executes CRUD queries', async () => {
    expect(productoRepo.mapProducto(null)).toBeNull();

    const row = {
      id: 'p1',
      categoria_id: 'c1',
      restaurante_id: 'r1',
      nombre: 'Taco al Pastor',
      descripcion: null,
      precio: '25.5',
      disponible: true,
      imagen_url: null,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    };

    db.mockReturnValueOnce(makeQueryMock([row]));
    const list = await productoRepo.findAllByTenant('r1', { categoriaId: 'c1' });
    expect(list[0].precio).toBe('25.50');

    db.mockReturnValueOnce(makeQueryMock(row));
    expect(await productoRepo.findByIdAndTenant('p1', 'r1')).toMatchObject({ precio: '25.50' });

    db.mockReturnValueOnce(makeQueryMock([row]));
    expect(
      await productoRepo.create('r1', {
        categoriaId: 'c1',
        nombre: 'Taco al Pastor',
        precio: '25.50',
      })
    ).toMatchObject({ id: 'p1' });

    db.mockReturnValueOnce(makeQueryMock([row]));
    expect(
      await productoRepo.update('p1', 'r1', {
        categoriaId: 'c1',
        nombre: 'Updated',
        descripcion: 'Desc',
        precio: '30.00',
        disponible: false,
        imagenUrl: 'https://x.com/i.png',
      })
    ).toMatchObject({ id: 'p1' });

    db.mockReturnValueOnce(makeQueryMock([{ ...row, disponible: false }]));
    expect(await productoRepo.updateDisponibilidad('p1', 'r1', false)).toMatchObject({
      disponible: false,
    });

    db.mockReturnValueOnce(makeQueryMock(1));
    expect(await productoRepo.remove('p1', 'r1')).toBe(true);
  });
});
