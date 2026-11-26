const { seed, DEMO_RESTAURANTES } = require('../seeds/02_demo_restaurantes');

/**
 * Idempotent data migration to populate 3 sample client restaurants
 * (Italian, Mexican, and Breakfast) in all environments including production.
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await seed(knex);
};

/**
 * Removes the 3 sample client restaurants (cascades to categorias and productos).
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  const slugs = DEMO_RESTAURANTES.map((r) => r.slug);
  await knex('restaurantes').whereIn('slug', slugs).del();
};
