const knexfile = require('../../knexfile');
const initMigration = require('../../src/db/migrations/202611230001_init_schema');
const plantillaMigration = require('../../src/db/migrations/202611260001_add_plantilla_to_restaurantes');
const demoUsersMigration = require('../../src/db/migrations/202611260002_seed_demo_admin_users');
const seedTacosPepe = require('../../src/db/seeds/01_tacos_pepe');

function createMockTableBuilder() {
  const columns = [];
  const indexes = [];
  const checks = [];

  const chainable = () => {
    const col = {
      notNullable: jest.fn(() => col),
      nullable: jest.fn(() => col),
      primary: jest.fn(() => col),
      unique: jest.fn(() => col),
      defaultTo: jest.fn(() => col),
      references: jest.fn(() => col),
      inTable: jest.fn(() => col),
      onDelete: jest.fn(() => col),
    };
    return col;
  };

  return {
    columns,
    indexes,
    checks,
    uuid: jest.fn((name) => {
      columns.push({ type: 'uuid', name });
      return chainable();
    }),
    string: jest.fn((name, len) => {
      columns.push({ type: 'string', name, len });
      return chainable();
    }),
    text: jest.fn((name) => {
      columns.push({ type: 'text', name });
      return chainable();
    }),
    integer: jest.fn((name) => {
      columns.push({ type: 'integer', name });
      return chainable();
    }),
    decimal: jest.fn((name, precision, scale) => {
      columns.push({ type: 'decimal', name, precision, scale });
      return chainable();
    }),
    boolean: jest.fn((name) => {
      columns.push({ type: 'boolean', name });
      return chainable();
    }),
    timestamp: jest.fn((name, opts) => {
      columns.push({ type: 'timestamp', name, opts });
      return chainable();
    }),
    index: jest.fn((cols) => {
      indexes.push(cols);
    }),
    check: jest.fn((expr) => {
      checks.push(expr);
    }),
  };
}

describe('Database Schema, Knex Config & Seed (T03)', () => {
  test('knexfile exports development, test, and production configs with pg client', () => {
    expect(knexfile).toHaveProperty('development');
    expect(knexfile).toHaveProperty('test');
    expect(knexfile).toHaveProperty('production');

    for (const env of ['development', 'test', 'production']) {
      expect(knexfile[env].client).toBe('pg');
      expect(knexfile[env].migrations.directory).toContain('migrations');
      expect(knexfile[env].seeds.directory).toContain('seeds');
    }
  });

  test('migration up creates restaurantes, usuarios, categorias, productos tables and down drops them', async () => {
    expect(typeof initMigration.up).toBe('function');
    expect(typeof initMigration.down).toBe('function');

    const createdTables = {};
    const droppedTables = [];

    const mockKnex = {
      raw: jest.fn((sql) => sql),
      fn: { now: jest.fn(() => 'NOW()') },
      schema: {
        createTable: jest.fn(async (tableName, cb) => {
          const builder = createMockTableBuilder();
          cb(builder);
          createdTables[tableName] = builder;
        }),
        dropTableIfExists: jest.fn(async (tableName) => {
          droppedTables.push(tableName);
        }),
      },
    };

    await initMigration.up(mockKnex);

    expect(Object.keys(createdTables)).toEqual([
      'restaurantes',
      'usuarios',
      'categorias',
      'productos',
    ]);

    expect(createdTables.restaurantes.columns.map((c) => c.name)).toEqual(
      expect.arrayContaining([
        'id',
        'nombre',
        'slug',
        'tema_color',
        'logo_url',
        'telefono',
        'created_at',
        'updated_at',
      ])
    );
    expect(createdTables.restaurantes.indexes).toContainEqual(['slug']);

    expect(createdTables.usuarios.columns.map((c) => c.name)).toEqual(
      expect.arrayContaining([
        'id',
        'cognito_sub',
        'email',
        'rol',
        'restaurante_id',
        'created_at',
        'updated_at',
      ])
    );
    expect(createdTables.usuarios.indexes).toContainEqual(['cognito_sub']);
    expect(createdTables.usuarios.indexes).toContainEqual(['restaurante_id']);

    expect(createdTables.categorias.columns.map((c) => c.name)).toEqual(
      expect.arrayContaining(['id', 'restaurante_id', 'nombre', 'orden', 'created_at', 'updated_at'])
    );
    expect(createdTables.categorias.indexes).toContainEqual(['restaurante_id']);

    expect(createdTables.productos.columns.map((c) => c.name)).toEqual(
      expect.arrayContaining([
        'id',
        'categoria_id',
        'restaurante_id',
        'nombre',
        'descripcion',
        'precio',
        'disponible',
        'imagen_url',
        'created_at',
        'updated_at',
      ])
    );
    expect(createdTables.productos.indexes).toContainEqual(['restaurante_id']);
    expect(createdTables.productos.indexes).toContainEqual(['categoria_id']);
    expect(createdTables.productos.checks).toContain('precio >= 0');

    await initMigration.down(mockKnex);
    expect(droppedTables).toEqual([
      'productos',
      'categorias',
      'usuarios',
      'restaurantes',
    ]);
  });

  test('seed 01_tacos_pepe inserts Tacos Pepe, 2 categories, and 5 products idempotently', async () => {
    expect(typeof seedTacosPepe.seed).toBe('function');

    const inserted = {
      restaurantes: [],
      categorias: [],
      productos: [],
    };

    const createMockKnex = (existingRestaurant) => {
      return jest.fn((table) => ({
        where: jest.fn(() => ({
          first: jest.fn(async () => (table === 'restaurantes' ? existingRestaurant : null)),
        })),
        insert: jest.fn((rows) => {
          const arr = Array.isArray(rows) ? rows : [rows];
          const withIds = arr.map((r, idx) => ({
            id: `${table}-id-${idx + 1}`,
            ...r,
          }));
          inserted[table].push(...withIds);
          return {
            returning: jest.fn(async () => withIds),
          };
        }),
      }));
    };

    // First run: restaurant does not exist
    const mockKnexFresh = createMockKnex(null);
    await seedTacosPepe.seed(mockKnexFresh);

    expect(inserted.restaurantes).toHaveLength(1);
    expect(inserted.restaurantes[0]).toMatchObject({
      nombre: 'Tacos Pepe',
      slug: 'tacos-pepe',
      tema_color: '#D62828',
      telefono: '3312345678',
      logo_url: null,
    });

    expect(inserted.categorias).toHaveLength(2);
    expect(inserted.categorias.map((c) => ({ nombre: c.nombre, orden: c.orden }))).toEqual([
      { nombre: 'Tacos', orden: 1 },
      { nombre: 'Bebidas', orden: 2 },
    ]);

    expect(inserted.productos).toHaveLength(5);
    expect(inserted.productos.map((p) => p.nombre)).toEqual([
      'Taco al Pastor',
      'Taco de Asada',
      'Gringa de Pastor',
      'Agua de Horchata',
      'Refresco',
    ]);
    const gringa = inserted.productos.find((p) => p.nombre === 'Gringa de Pastor');
    expect(gringa.disponible).toBe(false);
    expect(gringa.precio).toBe('55.00');

    // Second run: restaurant already exists -> idempotent, no new inserts
    const mockKnexExisting = createMockKnex(inserted.restaurantes[0]);
    await seedTacosPepe.seed(mockKnexExisting);
    expect(inserted.restaurantes).toHaveLength(1);
    expect(inserted.categorias).toHaveLength(2);
    expect(inserted.productos).toHaveLength(5);
  });

  test('migration 202611260001_add_plantilla_to_restaurantes adds and drops plantilla column', async () => {
    const addedColumns = [];
    const droppedColumns = [];
    const updates = [];

    const mockKnex = jest.fn((table) => ({
      whereIn: jest.fn((col, vals) => ({
        update: jest.fn(async (data) => {
          updates.push({ table, col, vals, data });
        }),
      })),
      where: jest.fn((criteria) => ({
        update: jest.fn(async (data) => {
          updates.push({ table, criteria, data });
        }),
      })),
    }));
    mockKnex.schema = {
      alterTable: jest.fn(async (_table, cb) => {
        const builder = createMockTableBuilder();
        builder.dropColumn = jest.fn((name) => droppedColumns.push(name));
        cb(builder);
        addedColumns.push(...builder.columns);
      }),
    };

    await plantillaMigration.up(mockKnex);
    expect(addedColumns.map((c) => c.name)).toContain('plantilla');
    expect(updates).toHaveLength(2);

    await plantillaMigration.down(mockKnex);
    expect(droppedColumns).toContain('plantilla');
  });

  test('migration 202611260002_seed_demo_admin_users links demo admin emails to demo restaurants', async () => {
    const insertedUsers = [];
    const deletedSubs = [];

    const mockKnex = jest.fn((table) => ({
      where: jest.fn((criteria) => ({
        first: jest.fn(async () => {
          if (table === 'restaurantes') {
            return { id: `rest-${criteria.slug}`, slug: criteria.slug };
          }
          return null;
        }),
      })),
      insert: jest.fn(async (row) => {
        insertedUsers.push(row);
      }),
      whereIn: jest.fn((_col, vals) => ({
        del: jest.fn(async () => {
          deletedSubs.push(...vals);
        }),
      })),
    }));

    await demoUsersMigration.up(mockKnex);
    expect(insertedUsers).toHaveLength(3);
    expect(insertedUsers.map((u) => u.email)).toEqual([
      'bella.napoli@antojolink.com',
      'casa.maiz@antojolink.com',
      'dulce.manana@antojolink.com',
    ]);
    expect(insertedUsers.every((u) => u.cognito_sub.startsWith('pending:'))).toBe(true);

    await demoUsersMigration.down(mockKnex);
    expect(deletedSubs).toHaveLength(3);
  });
});
