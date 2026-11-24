const { z } = require('zod');
const { uuidSchema } = require('./common');
const { parseAndFormatPrice } = require('../utils/price');

const priceSchema = z
  .any()
  .transform((val, ctx) => {
    const formatted = parseAndFormatPrice(val);
    if (formatted === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'precio must be a finite number >= 0',
      });
      return z.NEVER;
    }
    return formatted;
  });

const listProductosQuerySchema = z.object({
  categoriaId: uuidSchema.optional(),
});

const createProductoSchema = z.object({
  categoriaId: uuidSchema,
  nombre: z.string().trim().min(1, 'nombre is required').max(150),
  descripcion: z.string().nullable().optional().default(null),
  precio: priceSchema,
  disponible: z.boolean().optional().default(true),
  imagenUrl: z.string().url().nullable().optional().default(null),
});

const updateProductoSchema = z.object({
  categoriaId: uuidSchema.optional(),
  nombre: z.string().trim().min(1).max(150).optional(),
  descripcion: z.string().nullable().optional(),
  precio: priceSchema.optional(),
  disponible: z.boolean().optional(),
  imagenUrl: z.string().url().nullable().optional(),
});

const disponibilidadSchema = z.object({
  disponible: z.boolean(),
});

module.exports = {
  priceSchema,
  listProductosQuerySchema,
  createProductoSchema,
  updateProductoSchema,
  disponibilidadSchema,
};
