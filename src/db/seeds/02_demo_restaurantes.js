/**
 * Idempotent production-ready seed for 3 demo client restaurants:
 *  1. Trattoria Bella Napoli (Italian)
 *  2. La Casa del Maíz (Mexican)
 *  3. Dulce Mañana Waffle House (Breakfast - Waffles & Hot Cakes)
 *
 * Run only these demo restaurants in production:
 *   NODE_ENV=production npm run seed:demos
 */

const DEMO_RESTAURANTES = [
  {
    nombre: 'Trattoria Bella Napoli',
    slug: 'trattoria-bella-napoli',
    tema_color: '#9B2226',
    plantilla: 'trattoria',
    telefono: '3314567890',
    logo_url: null,
    categorias: [
      {
        nombre: 'Entradas',
        orden: 1,
        productos: [
          {
            nombre: 'Bruschetta al Pomodoro',
            descripcion:
              'Pan rústico tostado al horno con jitomate cherry marinado, albahaca fresca, ajo rostizado y aceite de oliva extra virgen.',
            precio: '115.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Carpaccio di Manzo',
            descripcion:
              'Finas láminas de res curada con arúgula fresca, lascas de Parmigiano Reggiano y aderezo de limón y alcaparras.',
            precio: '185.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Provolone al Horno',
            descripcion:
              'Queso provolone ahumado fundido a la leña con orégano siciliano y pan focaccia artesanal.',
            precio: '160.00',
            disponible: true,
            imagen_url: null,
          },
        ],
      },
      {
        nombre: 'Pizzas a la Leña',
        orden: 2,
        productos: [
          {
            nombre: 'Pizza Margherita',
            descripcion:
              'Salsa de tomate San Marzano, mozzarella fior di latte, albahaca fresca y un toque de aceite de oliva.',
            precio: '195.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Pizza Diavola',
            descripcion:
              'Salsa pomodoro, mozzarella fresca, salami picante italiano y miel de chile calabrés.',
            precio: '235.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Pizza Quattro Formaggi',
            descripcion:
              'Mezcla artesanal de mozzarella, gorgonzola, fontina y parmesano añejado 24 meses.',
            precio: '245.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Pizza Prosciutto e Rucola',
            descripcion:
              'Base pomodoro y mozzarella cubierta con prosciutto di Parma, arúgula baby y lascas de parmesano.',
            precio: '265.00',
            disponible: false,
            imagen_url: null,
          },
        ],
      },
      {
        nombre: 'Pastas Artesanales',
        orden: 3,
        productos: [
          {
            nombre: 'Spaghetti alla Carbonara',
            descripcion:
              'Receta tradicional romana con guanciale crujiente, yema de huevo, queso pecorino romano y pimienta negra recién molida.',
            precio: '215.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Fettuccine Alfredo con Pollo',
            descripcion:
              'Pasta fresca hecha en casa bañada en cremosa salsa de mantequilla y parmesano con pechuga a la parrilla.',
            precio: '225.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Lasagna alla Bolognese',
            descripcion:
              'Capas de pasta fresca, ragú de res cocido lentamente por 6 horas, salsa bechamel y queso gratinado.',
            precio: '240.00',
            disponible: true,
            imagen_url: null,
          },
        ],
      },
      {
        nombre: 'Postres y Bebidas',
        orden: 4,
        productos: [
          {
            nombre: 'Tiramisú Clásico',
            descripcion:
              'Bizcochos soletilla empapados en espresso italiano con crema suave de mascarpone y cacao amargo.',
            precio: '125.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Panna Cotta de Frutos Rojos',
            descripcion:
              'Crema italiana avainillada con coulis artesanal de frambuesa y zarzamora.',
            precio: '110.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Limonada Italiana de Albahaca',
            descripcion:
              'Refrescante limonada mineral con jarabe de albahaca fresca y limón amarillo (450ml).',
            precio: '65.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Espresso Doble',
            descripcion:
              'Extracción intensa de grano italiano 100% arábica tostado medio.',
            precio: '55.00',
            disponible: true,
            imagen_url: null,
          },
        ],
      },
    ],
  },
  {
    nombre: 'La Casa del Maíz',
    slug: 'la-casa-del-maiz',
    tema_color: '#1B5E20',
    plantilla: 'maiz',
    telefono: '3319876543',
    logo_url: null,
    categorias: [
      {
        nombre: 'Antojitos',
        orden: 1,
        productos: [
          {
            nombre: 'Guacamole de Molcajete',
            descripcion:
              'Aguacate Hass machacado al momento con jitomate, cebolla morada, cilantro, serrano y totopos de maíz nixtamalizado.',
            precio: '135.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Queso Fundido con Chorizo',
            descripcion:
              'Queso Oaxaca derretido al comal con chorizo artesanal de Toluca y tortillas de harina recién hechas.',
            precio: '145.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Sopes de Chicharrón Prensado',
            descripcion:
              'Orden de 3 sopes hechos a mano con frijoles refritos, chicharrón prensado en salsa roja, crema y queso fresco.',
            precio: '120.00',
            disponible: true,
            imagen_url: null,
          },
        ],
      },
      {
        nombre: 'Tacos y Platos Fuertes',
        orden: 2,
        productos: [
          {
            nombre: 'Orden de Tacos al Pastor (4 pzas)',
            descripcion:
              'Carne de cerdo marinada en achiote al trompo con piña asada, cilantro, cebolla y salsa de chile de árbol.',
            precio: '115.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Tacos de Rib Eye (3 pzas)',
            descripcion:
              'Cortes de rib eye a la parrilla sobre tortilla de maíz azul con guacamole cremoso y cebollitas cambray.',
            precio: '195.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Enchiladas Suizas',
            descripcion:
              'Cuatro tortillas rellenas de pollo deshebrado bañadas en salsa cremosa de tomatillo y gratinadas con queso manchego.',
            precio: '165.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Mole Poblano con Pollo',
            descripcion:
              'Pieza de pollo bañada en mole artesanal de 24 ingredientes, ajonjolí tostado, arroz rojo y tortillas a mano.',
            precio: '185.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Chiles en Nogada',
            descripcion:
              'Chile poblano relleno de picadillo tradicional de frutas y nuez, bañado en nogada cremosa y granada fresca (de temporada).',
            precio: '245.00',
            disponible: false,
            imagen_url: null,
          },
        ],
      },
      {
        nombre: 'Aguas Frescas y Bebidas',
        orden: 3,
        productos: [
          {
            nombre: 'Agua de Horchata con Canela',
            descripcion:
              'Preparada con arroz remojado, leche condensada, vainilla de Papantla y canela (500ml).',
            precio: '48.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Agua de Jamaica con Guayaba',
            descripcion:
              'Infusión natural de flor de jamaica mezclada con pulpa fresca de guayaba (500ml).',
            precio: '48.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Café de Olla',
            descripcion:
              'Café veracruzano infusionado con piloncillo y raja de canela servido en taza de barro.',
            precio: '52.00',
            disponible: true,
            imagen_url: null,
          },
        ],
      },
      {
        nombre: 'Postres Tradicionales',
        orden: 4,
        productos: [
          {
            nombre: 'Churros Rellenos de Cajeta',
            descripcion:
              'Orden de 4 churros crujientes espolvoreados con azúcar y canela, rellenos de cajeta artesanal de Celaya.',
            precio: '95.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Flan Napolitano Casero',
            descripcion:
              'Cremoso flan horneado con caramelo dorado y un toque de vainilla natural.',
            precio: '85.00',
            disponible: true,
            imagen_url: null,
          },
        ],
      },
    ],
  },
  {
    nombre: 'Dulce Mañana Waffle House',
    slug: 'dulce-manana-waffle-house',
    tema_color: '#D97706',
    plantilla: 'waffle',
    telefono: '3316543210',
    logo_url: null,
    categorias: [
      {
        nombre: 'Waffles Belgas',
        orden: 1,
        productos: [
          {
            nombre: 'Waffle Clásico con Frutos Rojos',
            descripcion:
              'Waffle belga crujiente por fuera y esponjoso por dentro con fresas, moras, azúcar glass, crema batida y miel maple.',
            precio: '135.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Waffle Nutella y Plátano',
            descripcion:
              'Cubierto con generosa crema de avellanas Nutella, rodajas de plátano fresco, nuez caramelizada y helado de vainilla.',
            precio: '155.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Waffle Chicken & Waffles',
            descripcion:
              'Nuestro clásico salado-dulce: waffle belga coronado con tiras de pollo crujiente, tocino ahumado y miel maple picante.',
            precio: '175.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Waffle Lotus Biscoff',
            descripcion:
              'Bañado en crema tibia de galleta caramelizada Biscoff, galleta triturada y crema chantilly.',
            precio: '165.00',
            disponible: false,
            imagen_url: null,
          },
        ],
      },
      {
        nombre: 'Hot Cakes Esponjosos',
        orden: 2,
        productos: [
          {
            nombre: 'Torre Clásica de Hot Cakes (3 pzas)',
            descripcion:
              'Tres hot cakes ultra esponjosos con mantequilla batida de la casa y miel maple 100% pura.',
            precio: '115.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Hot Cakes de Red Velvet',
            descripcion:
              'Masa sabor cacao aterciopelado con frosting ligero de queso crema y chispas de chocolate blanco.',
            precio: '145.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Hot Cakes de Avena y Plátano',
            descripcion:
              'Opción saludable preparada con harina de avena integral, plátano machacado, canela, miel de abeja y almendra fileteada.',
            precio: '135.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Hot Cakes con Tocino y Huevo',
            descripcion:
              'Dos hot cakes esponjosos acompañados de dos huevos al gusto y tiras de tocino crujiente.',
            precio: '155.00',
            disponible: true,
            imagen_url: null,
          },
        ],
      },
      {
        nombre: 'Extras y Toppings',
        orden: 3,
        productos: [
          {
            nombre: 'Orden de Tocino Crujiente',
            descripcion:
              'Cuatro tiras de tocino ahumado dorado al punto perfecto.',
            precio: '55.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Bola de Helado de Vainilla',
            descripcion:
              'Helado artesanal de vainilla de Madagascar ideal para acompañar cualquier waffle o hot cake.',
            precio: '38.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Fruta de Temporada',
            descripcion:
              'Mix fresco de fresa, plátano, zarzamora y blueberry.',
            precio: '45.00',
            disponible: true,
            imagen_url: null,
          },
        ],
      },
      {
        nombre: 'Café y Malteadas',
        orden: 4,
        productos: [
          {
            nombre: 'Latte Vainilla Helado',
            descripcion:
              'Doble shot de espresso con leche cremosa y jarabe artesanal de vainilla servido en las rocas.',
            precio: '72.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Capuchino Clásico',
            descripcion:
              'Espresso balanceado con leche vaporizada y espuma sedosa espolvoreada con canela.',
            precio: '65.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Malteada de Fresa Natural',
            descripcion:
              'Preparada con helado de vainilla, fresas frescas y crema batida (450ml).',
            precio: '88.00',
            disponible: true,
            imagen_url: null,
          },
          {
            nombre: 'Jugo de Naranja Recién Exprimido',
            descripcion:
              '100% natural exprimido al momento (400ml).',
            precio: '55.00',
            disponible: true,
            imagen_url: null,
          },
        ],
      },
    ],
  },
];

/**
 * Inserts a single demo restaurant with its categories and products inside a transaction
 * if its slug does not already exist.
 *
 * @param {import('knex').Knex} knex
 * @param {typeof DEMO_RESTAURANTES[number]} restData
 */
async function seedRestaurante(knex, restData) {
  const existing = await knex('restaurantes').where({ slug: restData.slug }).first();
  if (existing) {
    return;
  }

  await knex.transaction(async (trx) => {
    const [restaurante] = await trx('restaurantes')
      .insert({
        nombre: restData.nombre,
        slug: restData.slug,
        tema_color: restData.tema_color,
        plantilla: restData.plantilla || 'trattoria',
        telefono: restData.telefono,
        logo_url: restData.logo_url,
      })
      .returning('*');

    const categoriasRows = restData.categorias.map((cat) => ({
      restaurante_id: restaurante.id,
      nombre: cat.nombre,
      orden: cat.orden,
    }));

    const insertedCategorias = await trx('categorias')
      .insert(categoriasRows)
      .returning('*');

    const categoriaIdByName = new Map(
      insertedCategorias.map((cat) => [cat.nombre, cat.id])
    );

    const productosRows = [];
    for (const cat of restData.categorias) {
      const categoriaId = categoriaIdByName.get(cat.nombre);
      for (const prod of cat.productos) {
        productosRows.push({
          restaurante_id: restaurante.id,
          categoria_id: categoriaId,
          nombre: prod.nombre,
          descripcion: prod.descripcion,
          precio: prod.precio,
          disponible: prod.disponible,
          imagen_url: prod.imagen_url,
        });
      }
    }

    if (productosRows.length > 0) {
      await trx('productos').insert(productosRows).returning('*');
    }
  });
}

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function seed(knex) {
  for (const restData of DEMO_RESTAURANTES) {
    await seedRestaurante(knex, restData);
  }
};

exports.DEMO_RESTAURANTES = DEMO_RESTAURANTES;
