const uploadService = require('../services/uploadService');

async function presignUpload(req, res, next) {
  try {
    const result = await uploadService.createPresignedUpload(req.tenantId, req.body);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  presignUpload,
};
