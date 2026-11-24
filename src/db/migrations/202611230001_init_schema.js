/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto');

  await knex.schema.createTable('restaurantes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nombre', 120).notNullable();
    table.string('slug', 140).notNullable().unique();
    table.string('tema_color', 20).notNullable().defaultTo('#E63946');
    table.text('logo_url').nullable();
    table.string('telefono', 30).nullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.index(['slug']);
  });

  await knex.schema.createTable('usuarios', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('cognito_sub', 128).notNullable().unique();
    table.string('email', 255).notNullable();
    table.string('rol', 30).notNullable().defaultTo('ADMIN');
    table
      .uuid('restaurante_id')
      .nullable()
      .references('id')
      .inTable('restaurantes')
      .onDelete('SET NULL');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.index(['cognito_sub']);
    table.index(['restaurante_id']);
  });

  await knex.schema.createTable('categorias', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('restaurante_id')
      .notNullable()
      .references('id')
      .inTable('restaurantes')
      .onDelete('CASCADE');
    table.string('nombre', 100).notNullable();
    table.integer('orden').notNullable().defaultTo(0);
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.index(['restaurante_id']);
  });

  await knex.schema.createTable('productos', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('categoria_id')
      .notNullable()
      .references('id')
      .inTable('categorias')
      .onDelete('CASCADE');
    table
      .uuid('restaurante_id')
      .notNullable()
      .references('id')
      .inTable('restaurantes')
      .onDelete('CASCADE');
    table.string('nombre', 150).notNullable();
    table.text('descripcion').nullable();
    table.decimal('precio', 10, 2).notNullable();
    table.boolean('disponible').notNullable().defaultTo(true);
    table.text('imagen_url').nullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.check('precio >= 0');
    table.index(['restaurante_id']);
    table.index(['categoria_id']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('productos');
  await knex.schema.dropTableIfExists('categorias');
  await knex.schema.dropTableIfExists('usuarios');
  await knex.schema.dropTableIfExists('restaurantes');
};
