const { tenantRequiredError } = require('../utils/errors');

function requireTenant(req, res, next) {
  if (!req.tenantId) {
    return next(tenantRequiredError('User must create a restaurant before accessing this resource'));
  }
  return next();
}

module.exports = {
  requireTenant,
};
