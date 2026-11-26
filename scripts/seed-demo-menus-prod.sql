-- =============================================================================
-- AntojoLink — Production Demo Menus Seed (Idempotent)
-- =============================================================================
-- Inserts 3 sample client restaurants for presentation demos:
--   1. Trattoria Bella Napoli     (slug: trattoria-bella-napoli)
--   2. La Casa del Maíz           (slug: la-casa-del-maiz)
--   3. Dulce Mañana Waffle House  (slug: dulce-manana-waffle-house)
--
-- Safe to run multiple times: each block checks if the slug already exists.
-- Usage:
--   psql "$DATABASE_URL" -f scripts/seed-demo-menus-prod.sql
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Comida Italiana: Trattoria Bella Napoli
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_rest_id UUID;
  v_cat_entradas UUID;
  v_cat_pizzas UUID;
  v_cat_pastas UUID;
  v_cat_postres UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM restaurantes WHERE slug = 'trattoria-bella-napoli') THEN
    INSERT INTO restaurantes (nombre, slug, tema_color, telefono, logo_url)
    VALUES ('Trattoria Bella Napoli', 'trattoria-bella-napoli', '#9B2226', '3314567890', NULL)
    RETURNING id INTO v_rest_id;

    INSERT INTO categorias (restaurante_id, nombre, orden)
    VALUES (v_rest_id, 'Entradas', 1) RETURNING id INTO v_cat_entradas;

    INSERT INTO categorias (restaurante_id, nombre, orden)
    VALUES (v_rest_id, 'Pizzas a la Leña', 2) RETURNING id INTO v_cat_pizzas;

    INSERT INTO categorias (restaurante_id, nombre, orden)
    VALUES (v_rest_id, 'Pastas Artesanales', 3) RETURNING id INTO v_cat_pastas;

    INSERT INTO categorias (restaurante_id, nombre, orden)
    VALUES (v_rest_id, 'Postres y Bebidas', 4) RETURNING id INTO v_cat_postres;

    INSERT INTO productos (restaurante_id, categoria_id, nombre, descripcion, precio, disponible, imagen_url)
    VALUES
      (v_rest_id, v_cat_entradas, 'Bruschetta al Pomodoro', 'Pan rústico tostado al horno con jitomate cherry marinado, albahaca fresca, ajo rostizado y aceite de oliva extra virgen.', 115.00, true, NULL),
      (v_rest_id, v_cat_entradas, 'Carpaccio di Manzo', 'Finas láminas de res curada con arúgula fresca, lascas de Parmigiano Reggiano y aderezo de limón y alcaparras.', 185.00, true, NULL),
      (v_rest_id, v_cat_entradas, 'Provolone al Horno', 'Queso provolone ahumado fundido a la leña con orégano siciliano y pan focaccia artesanal.', 160.00, true, NULL),

      (v_rest_id, v_cat_pizzas, 'Pizza Margherita', 'Salsa de tomate San Marzano, mozzarella fior di latte, albahaca fresca y un toque de aceite de oliva.', 195.00, true, NULL),
      (v_rest_id, v_cat_pizzas, 'Pizza Diavola', 'Salsa pomodoro, mozzarella fresca, salami picante italiano y miel de chile calabrés.', 235.00, true, NULL),
      (v_rest_id, v_cat_pizzas, 'Pizza Quattro Formaggi', 'Mezcla artesanal de mozzarella, gorgonzola, fontina y parmesano añejado 24 meses.', 245.00, true, NULL),
      (v_rest_id, v_cat_pizzas, 'Pizza Prosciutto e Rucola', 'Base pomodoro y mozzarella cubierta con prosciutto di Parma, arúgula baby y lascas de parmesano.', 265.00, false, NULL),

      (v_rest_id, v_cat_pastas, 'Spaghetti alla Carbonara', 'Receta tradicional romana con guanciale crujiente, yema de huevo, queso pecorino romano y pimienta negra recién molida.', 215.00, true, NULL),
      (v_rest_id, v_cat_pastas, 'Fettuccine Alfredo con Pollo', 'Pasta fresca hecha en casa bañada en cremosa salsa de mantequilla y parmesano con pechuga a la parrilla.', 225.00, true, NULL),
      (v_rest_id, v_cat_pastas, 'Lasagna alla Bolognese', 'Capas de pasta fresca, ragú de res cocido lentamente por 6 horas, salsa bechamel y queso gratinado.', 240.00, true, NULL),

      (v_rest_id, v_cat_postres, 'Tiramisú Clásico', 'Bizcochos soletilla empapados en espresso italiano con crema suave de mascarpone y cacao amargo.', 125.00, true, NULL),
      (v_rest_id, v_cat_postres, 'Panna Cotta de Frutos Rojos', 'Crema italiana avainillada con coulis artesanal de frambuesa y zarzamora.', 110.00, true, NULL),
      (v_rest_id, v_cat_postres, 'Limonada Italiana de Albahaca', 'Refrescante limonada mineral con jarabe de albahaca fresca y limón amarillo (450ml).', 65.00, true, NULL),
      (v_rest_id, v_cat_postres, 'Espresso Doble', 'Extracción intensa de grano italiano 100% arábica tostado medio.', 55.00, true, NULL);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 2. Comida Mexicana: La Casa del Maíz
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_rest_id UUID;
  v_cat_antojitos UUID;
  v_cat_platos UUID;
  v_cat_bebidas UUID;
  v_cat_postres UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM restaurantes WHERE slug = 'la-casa-del-maiz') THEN
    INSERT INTO restaurantes (nombre, slug, tema_color, telefono, logo_url)
    VALUES ('La Casa del Maíz', 'la-casa-del-maiz', '#1B5E20', '3319876543', NULL)
    RETURNING id INTO v_rest_id;

    INSERT INTO categorias (restaurante_id, nombre, orden)
    VALUES (v_rest_id, 'Antojitos', 1) RETURNING id INTO v_cat_antojitos;

    INSERT INTO categorias (restaurante_id, nombre, orden)
    VALUES (v_rest_id, 'Tacos y Platos Fuertes', 2) RETURNING id INTO v_cat_platos;

    INSERT INTO categorias (restaurante_id, nombre, orden)
    VALUES (v_rest_id, 'Aguas Frescas y Bebidas', 3) RETURNING id INTO v_cat_bebidas;

    INSERT INTO categorias (restaurante_id, nombre, orden)
    VALUES (v_rest_id, 'Postres Tradicionales', 4) RETURNING id INTO v_cat_postres;

    INSERT INTO productos (restaurante_id, categoria_id, nombre, descripcion, precio, disponible, imagen_url)
    VALUES
      (v_rest_id, v_cat_antojitos, 'Guacamole de Molcajete', 'Aguacate Hass machacado al momento con jitomate, cebolla morada, cilantro, serrano y totopos de maíz nixtamalizado.', 135.00, true, NULL),
      (v_rest_id, v_cat_antojitos, 'Queso Fundido con Chorizo', 'Queso Oaxaca derretido al comal con chorizo artesanal de Toluca y tortillas de harina recién hechas.', 145.00, true, NULL),
      (v_rest_id, v_cat_antojitos, 'Sopes de Chicharrón Prensado', 'Orden de 3 sopes hechos a mano con frijoles refritos, chicharrón prensado en salsa roja, crema y queso fresco.', 120.00, true, NULL),

      (v_rest_id, v_cat_platos, 'Orden de Tacos al Pastor (4 pzas)', 'Carne de cerdo marinada en achiote al trompo con piña asada, cilantro, cebolla y salsa de chile de árbol.', 115.00, true, NULL),
      (v_rest_id, v_cat_platos, 'Tacos de Rib Eye (3 pzas)', 'Cortes de rib eye a la parrilla sobre tortilla de maíz azul con guacamole cremoso y cebollitas cambray.', 195.00, true, NULL),
      (v_rest_id, v_cat_platos, 'Enchiladas Suizas', 'Cuatro tortillas rellenas de pollo deshebrado bañadas en salsa cremosa de tomatillo y gratinadas con queso manchego.', 165.00, true, NULL),
      (v_rest_id, v_cat_platos, 'Mole Poblano con Pollo', 'Pieza de pollo bañada en mole artesanal de 24 ingredientes, ajonjolí tostado, arroz rojo y tortillas a mano.', 185.00, true, NULL),
      (v_rest_id, v_cat_platos, 'Chiles en Nogada', 'Chile poblano relleno de picadillo tradicional de frutas y nuez, bañado en nogada cremosa y granada fresca (de temporada).', 245.00, false, NULL),

      (v_rest_id, v_cat_bebidas, 'Agua de Horchata con Canela', 'Preparada con arroz remojado, leche condensada, vainilla de Papantla y canela (500ml).', 48.00, true, NULL),
      (v_rest_id, v_cat_bebidas, 'Agua de Jamaica con Guayaba', 'Infusión natural de flor de jamaica mezclada con pulpa fresca de guayaba (500ml).', 48.00, true, NULL),
      (v_rest_id, v_cat_bebidas, 'Café de Olla', 'Café veracruzano infusionado con piloncillo y raja de canela servido en taza de barro.', 52.00, true, NULL),

      (v_rest_id, v_cat_postres, 'Churros Rellenos de Cajeta', 'Orden de 4 churros crujientes espolvoreados con azúcar y canela, rellenos de cajeta artesanal de Celaya.', 95.00, true, NULL),
      (v_rest_id, v_cat_postres, 'Flan Napolitano Casero', 'Cremoso flan horneado con caramelo dorado y un toque de vainilla natural.', 85.00, true, NULL);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 3. Desayunos (Waffles y Hot Cakes): Dulce Mañana Waffle House
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_rest_id UUID;
  v_cat_waffles UUID;
  v_cat_hotcakes UUID;
  v_cat_extras UUID;
  v_cat_bebidas UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM restaurantes WHERE slug = 'dulce-manana-waffle-house') THEN
    INSERT INTO restaurantes (nombre, slug, tema_color, telefono, logo_url)
    VALUES ('Dulce Mañana Waffle House', 'dulce-manana-waffle-house', '#D97706', '3316543210', NULL)
    RETURNING id INTO v_rest_id;

    INSERT INTO categorias (restaurante_id, nombre, orden)
    VALUES (v_rest_id, 'Waffles Belgas', 1) RETURNING id INTO v_cat_waffles;

    INSERT INTO categorias (restaurante_id, nombre, orden)
    VALUES (v_rest_id, 'Hot Cakes Esponjosos', 2) RETURNING id INTO v_cat_hotcakes;

    INSERT INTO categorias (restaurante_id, nombre, orden)
    VALUES (v_rest_id, 'Extras y Toppings', 3) RETURNING id INTO v_cat_extras;

    INSERT INTO categorias (restaurante_id, nombre, orden)
    VALUES (v_rest_id, 'Café y Malteadas', 4) RETURNING id INTO v_cat_bebidas;

    INSERT INTO productos (restaurante_id, categoria_id, nombre, descripcion, precio, disponible, imagen_url)
    VALUES
      (v_rest_id, v_cat_waffles, 'Waffle Clásico con Frutos Rojos', 'Waffle belga crujiente por fuera y esponjoso por dentro con fresas, moras, azúcar glass, crema batida y miel maple.', 135.00, true, NULL),
      (v_rest_id, v_cat_waffles, 'Waffle Nutella y Plátano', 'Cubierto con generosa crema de avellanas Nutella, rodajas de plátano fresco, nuez caramelizada y helado de vainilla.', 155.00, true, NULL),
      (v_rest_id, v_cat_waffles, 'Waffle Chicken & Waffles', 'Nuestro clásico salado-dulce: waffle belga coronado con tiras de pollo crujiente, tocino ahumado y miel maple picante.', 175.00, true, NULL),
      (v_rest_id, v_cat_waffles, 'Waffle Lotus Biscoff', 'Bañado en crema tibia de galleta caramelizada Biscoff, galleta triturada y crema chantilly.', 165.00, false, NULL),

      (v_rest_id, v_cat_hotcakes, 'Torre Clásica de Hot Cakes (3 pzas)', 'Tres hot cakes ultra esponjosos con mantequilla batida de la casa y miel maple 100% pura.', 115.00, true, NULL),
      (v_rest_id, v_cat_hotcakes, 'Hot Cakes de Red Velvet', 'Masa sabor cacao aterciopelado con frosting ligero de queso crema y chispas de chocolate blanco.', 145.00, true, NULL),
      (v_rest_id, v_cat_hotcakes, 'Hot Cakes de Avena y Plátano', 'Opción saludable preparada con harina de avena integral, plátano machacado, canela, miel de abeja y almendra fileteada.', 135.00, true, NULL),
      (v_rest_id, v_cat_hotcakes, 'Hot Cakes con Tocino y Huevo', 'Dos hot cakes esponjosos acompañados de dos huevos al gusto y tiras de tocino crujiente.', 155.00, true, NULL),

      (v_rest_id, v_cat_extras, 'Orden de Tocino Crujiente', 'Cuatro tiras de tocino ahumado dorado al punto perfecto.', 55.00, true, NULL),
      (v_rest_id, v_cat_extras, 'Bola de Helado de Vainilla', 'Helado artesanal de vainilla de Madagascar ideal para acompañar cualquier waffle o hot cake.', 38.00, true, NULL),
      (v_rest_id, v_cat_extras, 'Fruta de Temporada', 'Mix fresco de fresa, plátano, zarzamora y blueberry.', 45.00, true, NULL),

      (v_rest_id, v_cat_bebidas, 'Latte Vainilla Helado', 'Doble shot de espresso con leche cremosa y jarabe artesanal de vainilla servido en las rocas.', 72.00, true, NULL),
      (v_rest_id, v_cat_bebidas, 'Capuchino Clásico', 'Espresso balanceado con leche vaporizada y espuma sedosa espolvoreada con canela.', 65.00, true, NULL),
      (v_rest_id, v_cat_bebidas, 'Malteada de Fresa Natural', 'Preparada con helado de vainilla, fresas frescas y crema batida (450ml).', 88.00, true, NULL),
      (v_rest_id, v_cat_bebidas, 'Jugo de Naranja Recién Exprimido', '100% natural exprimido al momento (400ml).', 55.00, true, NULL);
  END IF;
END $$;

COMMIT;
