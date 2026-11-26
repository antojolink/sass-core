/**
 * Adds `plantilla` column to `restaurantes` and assigns appropriate
 * editorial templates to any already-seeded demo restaurants.
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('restaurantes', (table) => {
    table.string('plantilla', 30).notNullable().defaultTo('trattoria');
  });

  await knex('restaurantes')
    .whereIn('slug', ['la-casa-del-maiz', 'tacos-pepe'])
    .update({ plantilla: 'maiz' });

  await knex('restaurantes')
    .where({ slug: 'dulce-manana-waffle-house' })
    .update({ plantilla: 'waffle' });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('restaurantes', (table) => {
    table.dropColumn('plantilla');
  });
};
