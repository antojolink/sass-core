const pkg = require('../../package.json');

function getHealth(req, res) {
  return res.status(200).json({
    status: 'ok',
    version: pkg.version,
  });
}

module.exports = {
  getHealth,
};
