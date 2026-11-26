const DEMO_ADMIN_USERS = [
  {
    slug: 'trattoria-bella-napoli',
    email: 'bella.napoli@antojolink.com',
  },
  {
    slug: 'la-casa-del-maiz',
    email: 'casa.maiz@antojolink.com',
  },
  {
    slug: 'dulce-manana-waffle-house',
    email: 'dulce.manana@antojolink.com',
  },
];

/**
 * Links pre-assigned admin user records to the 3 demo restaurants.
 * When a user registers or signs in with one of these emails in Cognito,
 * requireAuth automatically binds their Cognito sub to this record.
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  for (const entry of DEMO_ADMIN_USERS) {
    const restaurante = await knex('restaurantes').where({ slug: entry.slug }).first();
    if (!restaurante) {
      continue;
    }
    const existing = await knex('usuarios').where({ email: entry.email }).first();
    if (existing) {
      if (!existing.restaurante_id) {
        await knex('usuarios')
          .where({ id: existing.id })
          .update({ restaurante_id: restaurante.id, updated_at: knex.fn.now() });
      }
      continue;
    }
    await knex('usuarios').insert({
      cognito_sub: `pending:${entry.email}`,
      email: entry.email,
      rol: 'ADMIN',
      restaurante_id: restaurante.id,
    });
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  const pendingSubs = DEMO_ADMIN_USERS.map((u) => `pending:${u.email}`);
  await knex('usuarios').whereIn('cognito_sub', pendingSubs).del();
};

exports.DEMO_ADMIN_USERS = DEMO_ADMIN_USERS;
