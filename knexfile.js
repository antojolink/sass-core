require('dotenv').config();
const path = require('path');

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: path.join(__dirname, 'src/db/migrations'),
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: path.join(__dirname, 'src/db/seeds'),
  },
};

module.exports = {
  development: {
    ...baseConfig,
    connection:
      process.env.DATABASE_URL ||
      'postgres://antojolink:antojolink@localhost:5432/antojolink',
  },
  test: {
    ...baseConfig,
    connection:
      process.env.DATABASE_URL ||
      'postgres://antojolink:antojolink@localhost:5432/antojolink_test',
  },
  production: {
    ...baseConfig,
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
  },
};
