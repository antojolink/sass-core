const { z } = require('zod');

const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_TIPOS = ['producto', 'logo'];

const presignSchema = z.object({
  tipo: z.enum(ALLOWED_TIPOS),
  contentType: z.enum(ALLOWED_CONTENT_TYPES),
});

module.exports = {
  ALLOWED_CONTENT_TYPES,
  ALLOWED_TIPOS,
  presignSchema,
};
