const { z } = require('zod');

const hexColorSchema = z
  .string()
  .trim()
  .min(4)
  .max(20)
  .regex(/^#[0-9A-Fa-f]{3,8}$/, 'Must be a valid hex color');

const PLANTILLAS = ['trattoria', 'maiz', 'waffle', 'nocturno'];
const plantillaSchema = z.enum(PLANTILLAS);

const createRestauranteSchema = z.object({
  nombre: z.string().trim().min(1, 'nombre is required').max(120),
  temaColor: hexColorSchema.optional(),
  plantilla: plantillaSchema.optional(),
  logoUrl: z.string().url().nullable().optional(),
  telefono: z.string().trim().max(30).nullable().optional(),
});

const updateRestauranteSchema = z.object({
  nombre: z.string().trim().min(1).max(120).optional(),
  temaColor: hexColorSchema.optional(),
  plantilla: plantillaSchema.optional(),
  logoUrl: z.string().url().nullable().optional(),
  telefono: z.string().trim().max(30).nullable().optional(),
});

module.exports = {
  PLANTILLAS,
  createRestauranteSchema,
  updateRestauranteSchema,
};
