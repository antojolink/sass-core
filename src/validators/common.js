const { z } = require('zod');

const uuidSchema = z.string().uuid('Must be a valid UUID');

const uuidParamSchema = z.object({
  id: uuidSchema,
});

module.exports = {
  uuidSchema,
  uuidParamSchema,
};
