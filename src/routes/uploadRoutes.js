const express = require('express');
const { requireAuth } = require('../middlewares/requireAuth');
const { requireTenant } = require('../middlewares/requireTenant');
const { validate } = require('../middlewares/validate');
const { presignSchema } = require('../validators/uploadValidator');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

router.post(
  '/presign',
  requireAuth,
  requireTenant,
  validate({ body: presignSchema }),
  uploadController.presignUpload
);

module.exports = router;
