const pg = require('pg');
const knex = require('knex');
const knexfile = require('../../knexfile');
const { capturePostgres } = require('../config/xray');

capturePostgres(pg);

const env = process.env.NODE_ENV || 'development';
const config = knexfile[env] || knexfile.development;

const db = knex(config);

module.exports = db;
