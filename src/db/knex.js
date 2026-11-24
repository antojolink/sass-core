const knex = require('knex');
const knexfile = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';
const config = knexfile[env] || knexfile.development;

const db = knex(config);

module.exports = db;
