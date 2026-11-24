const crypto = require('crypto');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { getEnv } = require('../config/env');
const { getS3Client } = require('../config/s3');
const restauranteRepo = require('../repositories/restauranteRepo');
const { notFoundError } = require('../utils/errors');

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

async function createPresignedUpload(tenantId, { contentType }) {
  const restaurante = await restauranteRepo.findById(tenantId);
  if (!restaurante) {
    throw notFoundError('Restaurant not found');
  }

  const env = getEnv();
  const ext = MIME_TO_EXT[contentType];
  const key = `uploads/${restaurante.slug}/${crypto.randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: env.imagesBucket,
    Key: key,
    ContentType: contentType,
  });

  const s3Client = getS3Client();
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  const baseUrl = env.imagesBaseUrl.replace(/\/$/, '');
  const publicUrl = `${baseUrl}/${key}`;

  return {
    uploadUrl,
    publicUrl,
  };
}

module.exports = {
  createPresignedUpload,
};
