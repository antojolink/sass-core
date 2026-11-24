const { z } = require('zod');

const createCategoriaSchema = z.object({
  nombre: z.string().trim().min(1, 'nombre is required').max(100),
  orden: z.number().int().min(0).optional().default(0),
});

const updateCategoriaSchema = z.object({
  nombre: z.string().trim().min(1).max(100).optional(),
  orden: z.number().int().min(0).optional(),
});

module.exports = {
  createCategoriaSchema,
  updateCategoriaSchema,
};
