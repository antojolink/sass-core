/**
 * Idempotent seed for "Tacos Pepe" demo restaurant.
 * @param {import('knex').Knex} knex
 */
exports.seed = async function seed(knex) {
  const existing = await knex('restaurantes').where({ slug: 'tacos-pepe' }).first();
  if (existing) {
    return;
  }

  const [restaurante] = await knex('restaurantes')
    .insert({
      nombre: 'Tacos Pepe',
      slug: 'tacos-pepe',
      tema_color: '#D62828',
      plantilla: 'maiz',
      telefono: '3312345678',
      logo_url: null,
    })
    .returning('*');

  const categorias = await knex('categorias')
    .insert([
      {
        restaurante_id: restaurante.id,
        nombre: 'Tacos',
        orden: 1,
      },
      {
        restaurante_id: restaurante.id,
        nombre: 'Bebidas',
        orden: 2,
      },
    ])
    .returning('*');

  const tacosCat = categorias.find((c) => c.nombre === 'Tacos');
  const bebidasCat = categorias.find((c) => c.nombre === 'Bebidas');

  await knex('productos')
    .insert([
      {
        restaurante_id: restaurante.id,
        categoria_id: tacosCat.id,
        nombre: 'Taco al Pastor',
        descripcion: 'Taco tradicional de cerdo adobado al trompo con piña, cilantro y cebolla.',
        precio: '25.00',
        disponible: true,
        imagen_url: null,
      },
      {
        restaurante_id: restaurante.id,
        categoria_id: tacosCat.id,
        nombre: 'Taco de Asada',
        descripcion: 'Carne asada al carbón en tortilla de maíz recién hecha.',
        precio: '28.50',
        disponible: true,
        imagen_url: null,
      },
      {
        restaurante_id: restaurante.id,
        categoria_id: tacosCat.id,
        nombre: 'Gringa de Pastor',
        descripcion: 'Tortilla de harina grande con queso fundido y carne al pastor.',
        precio: '55.00',
        disponible: false,
        imagen_url: null,
      },
      {
        restaurante_id: restaurante.id,
        categoria_id: bebidasCat.id,
        nombre: 'Agua de Horchata',
        descripcion: 'Agua fresca tradicional de arroz con canela (500ml).',
        precio: '30.00',
        disponible: true,
        imagen_url: null,
      },
      {
        restaurante_id: restaurante.id,
        categoria_id: bebidasCat.id,
        nombre: 'Refresco',
        descripcion: 'Refresco de sabor bien frío (355ml).',
        precio: '25.00',
        disponible: true,
        imagen_url: null,
      },
    ])
    .returning('*');
};
