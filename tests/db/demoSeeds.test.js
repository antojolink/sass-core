const demoSeed = require('../../src/db/seeds/02_demo_restaurantes');
const demoMigration = require('../../src/db/migrations/202611260001_seed_demo_restaurantes');

describe('Production Demo Restaurants Seed (02_demo_restaurantes)', () => {
  function createMockKnex(initialRestaurantes = []) {
    const db = {
      restaurantes: [...initialRestaurantes],
      categorias: [],
      productos: [],
    };
    let seq = 1;

    const queryBuilder = (table) => ({
      where: jest.fn((criteria) => ({
        first: jest.fn(async () => {
          return (
            db[table].find((row) =>
              Object.entries(criteria).every(([k, v]) => row[k] === v)
            ) || null
          );
        }),
      })),
      insert: jest.fn((rows) => {
        const arr = Array.isArray(rows) ? rows : [rows];
        const withIds = arr.map((r) => ({
          id: `${table}-${seq++}`,
          ...r,
        }));
        db[table].push(...withIds);
        return {
          returning: jest.fn(async () => withIds),
        };
      }),
    });

    const mockKnex = jest.fn(queryBuilder);
    mockKnex.transaction = jest.fn(async (cb) => cb(mockKnex));

    return { mockKnex, db };
  }

  test('inserts Italian, Mexican, and Breakfast restaurants with categories and products idempotently', async () => {
    expect(typeof demoSeed.seed).toBe('function');
    expect(demoSeed.DEMO_RESTAURANTES).toHaveLength(3);

    const { mockKnex, db } = createMockKnex();

    // First run: inserts all 3 restaurants
    await demoSeed.seed(mockKnex);

    expect(db.restaurantes).toHaveLength(3);
    expect(db.restaurantes.map((r) => r.slug)).toEqual([
      'trattoria-bella-napoli',
      'la-casa-del-maiz',
      'dulce-manana-waffle-house',
    ]);

    // Every restaurant has a valid hex color and 4 categories
    for (const rest of db.restaurantes) {
      expect(rest.tema_color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      const cats = db.categorias.filter((c) => c.restaurante_id === rest.id);
      expect(cats).toHaveLength(4);
      expect(cats.map((c) => c.orden)).toEqual([1, 2, 3, 4]);

      const prods = db.productos.filter((p) => p.restaurante_id === rest.id);
      expect(prods.length).toBeGreaterThanOrEqual(10);

      for (const prod of prods) {
        expect(Number(prod.precio)).toBeGreaterThan(0);
        expect(prod.precio).toMatch(/^\d+\.\d{2}$/);
        expect(cats.some((c) => c.id === prod.categoria_id)).toBe(true);
      }

      // Each menu includes at least one out-of-stock item for demoing unavailable badges
      expect(prods.some((p) => p.disponible === false)).toBe(true);
      expect(prods.some((p) => p.disponible === true)).toBe(true);
    }

    expect(db.categorias).toHaveLength(12);
    expect(db.productos).toHaveLength(42);

    // Second run: completely idempotent, no duplicates inserted
    const prevCounts = {
      restaurantes: db.restaurantes.length,
      categorias: db.categorias.length,
      productos: db.productos.length,
    };

    await demoSeed.seed(mockKnex);

    expect(db.restaurantes).toHaveLength(prevCounts.restaurantes);
    expect(db.categorias).toHaveLength(prevCounts.categorias);
    expect(db.productos).toHaveLength(prevCounts.productos);
  });

  test('migration 202611260001_seed_demo_restaurantes up seeds and down removes demo slugs', async () => {
    const { mockKnex, db } = createMockKnex();
    const deletedSlugs = [];

    const migrationKnex = jest.fn((table) => ({
      ...mockKnex(table),
      whereIn: jest.fn((col, values) => ({
        del: jest.fn(async () => {
          if (table === 'restaurantes' && col === 'slug') {
            deletedSlugs.push(...values);
          }
          return values.length;
        }),
      })),
    }));
    migrationKnex.transaction = jest.fn(async (cb) => cb(migrationKnex));

    await demoMigration.up(migrationKnex);
    expect(db.restaurantes).toHaveLength(3);

    await demoMigration.down(migrationKnex);
    expect(deletedSlugs).toEqual([
      'trattoria-bella-napoli',
      'la-casa-del-maiz',
      'dulce-manana-waffle-house',
    ]);
  });
});
