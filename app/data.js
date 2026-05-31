/* ============================================================
   PLATAFORMA FAN — Datos del Bosque Chiquitano
   Datos reales extraídos del Calendario FAN (Calendario.xlsx)
   ============================================================ */

window.FAN = window.FAN || {};

// Mes actual del prototipo (0 = Enero ... 11 = Diciembre). Mayo 2026.
FAN.CURRENT_MONTH = 4;

FAN.MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
FAN.MONTHS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

// m = índice de meses en temporada (0-11)
// Datos de cosecha textuales = columna "Cosecha/Observaciones" del calendario.
FAN.PRODUCTS = [
  {
    id: 'almendra-chiquitana', nombre: 'Almendra chiquitana', cientifico: 'Dipteryx alata',
    tipo: 'Fruto seco / oleaginosa', categoria: 'Frutos secos',
    m: [6,7,8],
    cosecha: 'Fruto, julio a noviembre. Meses más productivos: agosto, septiembre y octubre.',
    origen: 'chiquitania', regiones: ['San Ignacio de Velasco', 'Concepción'],
    desc: 'Semilla oleaginosa silvestre del corazón del bosque chiquitano, recolectada artesanalmente por comunidades. Sabor intenso a nuez tostada.',
    usos: ['Repostería gourmet', 'Aceites naturales', 'Snacks tostados', 'Harinas y panificación'],
    presentaciones: ['Quintal (46 kg)', 'Bolsa 1 kg', 'Aceite 250 ml'],
    fuente: 'FAN. 2021. Guía de buenas prácticas para la cosecha y transformación de almendra chiquitana. Editorial FAN. Santa Cruz, Bolivia.',
    color: '#9C6B3F'
  },
  {
    id: 'asai', nombre: 'Asaí', cientifico: 'Euterpe precatoria',
    tipo: 'Palmera / fruto', categoria: 'Frutos de palmera',
    m: [0,1,2,3,4,5,6,7,8,9],
    cosecha: 'Frutos maduros en zonas inundables: fines de enero a marzo. En bosques de altura: mayo a octubre.',
    origen: 'amazonia', regiones: ['Pando', 'Riberalta'],
    desc: 'Fruto morado de palmera amazónica, pulpa energética rica en antioxidantes. Recolectado en bosques inundables del norte.',
    usos: ['Bowls y batidos', 'Helados artesanales', 'Postres', 'Bebidas funcionales'],
    presentaciones: ['Pulpa congelada 1 kg', 'Polvo liofilizado 250 g'],
    fuente: 'PICFA. 2021. Guía de buenas prácticas para la cosecha de frutos de asaí. FEDAFAP/SEDEPRO/ACEAA, Pando, Bolivia.',
    color: '#4A2D52'
  },
  {
    id: 'motacu', nombre: 'Motacú', cientifico: 'Attalea phalerata',
    tipo: 'Palmera / fruto', categoria: 'Frutos de palmera',
    m: [0,1,2,3,4,5,6,7,8,9,10,11],
    cosecha: 'Disponible casi todo el año. Frutos maduros de forma escalonada.',
    origen: 'chiquitania', regiones: ['San José de Chiquitos', 'Roboré'],
    desc: 'Fruto de palmera de pulpa anaranjada y semilla aceitosa. Versátil y disponible durante todo el año.',
    usos: ['Aceite comestible', 'Pulpa para refrescos', 'Cosmética natural'],
    presentaciones: ['Aceite 500 ml', 'Pulpa 1 kg'],
    fuente: 'Coimbra Molina, D. 2014. Guía de Frutos Silvestres Comestibles de la Chiquitania. Editorial FCBC.',
    color: '#C77F2A'
  },
  {
    id: 'totai', nombre: 'Totaí', cientifico: 'Acrocomia totai',
    tipo: 'Palmera / fruto', categoria: 'Frutos de palmera',
    m: [0,4,5,6,7,8,9,10,11],
    cosecha: 'Fruto, octubre y noviembre (pico). Disponibilidad amplia el resto del año.',
    origen: 'chiquitania', regiones: ['La Guardia', 'San Miguel de Velasco'],
    desc: 'Palmera de fruto amarillo con alto potencial oleífero. Pulpa dulce y semilla rica en aceite.',
    usos: ['Aceite gourmet', 'Snacks', 'Repostería', 'Refrescos'],
    presentaciones: ['Aceite 250 ml', 'Fruto fresco por kg'],
    fuente: 'Vicente, M. 2024. Potencial oleífero de las semillas de totaí. Revista Científica UAGRM, 1(1): 59–72.',
    color: '#D9A520'
  },
  {
    id: 'pesoe', nombre: 'Pesoé', cientifico: 'Pterodon emarginatus',
    tipo: 'Fruto del bosque', categoria: 'Frutos del bosque',
    m: [5,6,7,8,9],
    cosecha: 'Semilla, junio a febrero. Disponibilidad concentrada en temporada seca.',
    origen: 'chiquitania', regiones: ['San Rafael', 'San Ignacio de Velasco'],
    desc: 'Semilla aromática del bosque chiquitano, valorada por sus propiedades y su perfil resinoso característico.',
    usos: ['Infusiones', 'Aromatizantes', 'Productos medicinales'],
    presentaciones: ['Bolsa 500 g', 'Aceite esencial 30 ml'],
    fuente: 'FAN. 2021. Guía de buenas prácticas para la cosecha y transformación de pesoé. Editorial FAN.',
    color: '#7B6230'
  },
  {
    id: 'castana', nombre: 'Castaña', cientifico: 'Bertholletia excelsa',
    tipo: 'Fruto seco', categoria: 'Frutos secos',
    m: [0,1,11],
    cosecha: 'Fruto, noviembre (la mayoría) y enero. Los zafreros retornan entre enero y mayo.',
    origen: 'amazonia', regiones: ['Pando', 'Riberalta'],
    desc: 'La nuez amazónica por excelencia. Recolectada del suelo del bosque tras la caída de los cocos durante la zafra.',
    usos: ['Snacks', 'Repostería fina', 'Aceite', 'Harinas'],
    presentaciones: ['Bolsa 1 kg', 'Aceite 250 ml'],
    fuente: 'Manual técnico de buenas prácticas de recolección y transformación de frutos amazónicos.',
    color: '#8C5A33'
  },
  {
    id: 'majo', nombre: 'Majo', cientifico: 'Oenocarpus bataua',
    tipo: 'Palmera / fruto', categoria: 'Frutos de palmera',
    m: [0,1,2,8,9,10,11],
    cosecha: 'Fruto, mayo a diciembre según región. Florece y fructifica de forma escalonada.',
    origen: 'amazonia', regiones: ['Pando', 'Guarayos'],
    desc: 'Fruto morado de palmera, fuente de un aceite fino comparable al de oliva. Pulpa cremosa y nutritiva.',
    usos: ['Aceite gourmet', 'Bebidas', 'Helados'],
    presentaciones: ['Aceite 250 ml', 'Pulpa congelada 1 kg'],
    fuente: 'Birk, G. 1995. Plantas útiles en bosques y pampas chiquitanas. APCOB.',
    color: '#3E2A4D'
  },
  {
    id: 'piton', nombre: 'Pitón', cientifico: 'Talisia esculenta',
    tipo: 'Fruto del bosque', categoria: 'Frutos del bosque',
    m: [0,1,2,3,4,11],
    cosecha: 'Fruto, diciembre y enero (pico). Disponible hasta mayo.',
    origen: 'chiquitania', regiones: ['Concepción', 'San Javier'],
    desc: 'Fruto silvestre de cáscara rojiza y pulpa blanca jugosa, de sabor dulce y ligeramente ácido.',
    usos: ['Consumo fresco', 'Jugos', 'Mermeladas'],
    presentaciones: ['Fruto fresco por kg'],
    fuente: 'Coimbra Molina, D. 2014. Guía de Frutos Silvestres Comestibles de la Chiquitania. Editorial FCBC.',
    color: '#B23A48'
  },
  {
    id: 'sujo', nombre: 'Sujo', cientifico: 'Sterculia apetala',
    tipo: 'Fruto del bosque', categoria: 'Frutos del bosque',
    m: [6,7,8,9],
    cosecha: 'Fruto, julio a octubre.',
    origen: 'chiquitania', regiones: ['San José de Chiquitos'],
    desc: 'Semilla del bosque seco chiquitano, tostada recuerda al maní o cacao. Subutilizada con gran potencial.',
    usos: ['Tostado tipo snack', 'Sustituto de cacao', 'Repostería'],
    presentaciones: ['Bolsa 500 g'],
    fuente: 'Araujo Murakami A. et al. 2019. Plantas del Jardín Botánico Municipal de Santa Cruz: Frutales.',
    color: '#6E4B2A'
  },
  {
    id: 'canelon', nombre: 'Canelón', cientifico: 'Aniba canelilla',
    tipo: 'Corteza aromática', categoria: 'Aromáticas y especias',
    m: [0,1,8,9,10,11],
    cosecha: 'Septiembre a noviembre y diciembre a febrero.',
    origen: 'chiquitania', regiones: ['San Ignacio de Velasco'],
    desc: 'Corteza aromática de intenso perfume a canela y clavo. Especia nativa de gran valor en alta cocina.',
    usos: ['Especia para postres', 'Infusiones', 'Aromatizante de salsas'],
    presentaciones: ['Corteza molida 100 g', 'Astillas 250 g'],
    fuente: 'Huanca, M. 2014. Riqueza y valor de uso de las plantas útiles. UAGRM.',
    color: '#92400E'
  },
  {
    id: 'flor-colonia', nombre: 'Flor de colonia', cientifico: 'Alpinia zerumbet',
    tipo: 'Flor comestible', categoria: 'Flores y hierbas',
    m: [0,1,2,3,8,9,10,11],
    cosecha: 'Florece casi todo el año excepto julio y diciembre. Más flores en noviembre.',
    origen: 'chiquitania', regiones: ['San Miguel de Velasco'],
    desc: 'Flor aromática de pétalos blancos y rojos, usada en infusiones y como elemento decorativo comestible.',
    usos: ['Infusiones relajantes', 'Decoración de platos', 'Aromaterapia'],
    presentaciones: ['Flor fresca', 'Flor deshidratada 100 g'],
    fuente: 'Portal, R. et al. 2013. Avaliação fenológica de Alpinia zerumbet.',
    color: '#C2528B'
  },
  {
    id: 'albahaca-silvestre', nombre: 'Albahaca silvestre', cientifico: 'Ocimum basilicum',
    tipo: 'Hierba aromática', categoria: 'Flores y hierbas',
    m: [0,1,9,10,11],
    cosecha: 'Diciembre, enero y febrero (más productivo).',
    origen: 'chiquitania', regiones: ['Concepción'],
    desc: 'Albahaca de aroma intenso que crece silvestre. Hoja fresca y fragante para cocina fresca.',
    usos: ['Pestos', 'Ensaladas', 'Infusiones', 'Aromatizante'],
    presentaciones: ['Atado fresco', 'Hoja seca 50 g'],
    fuente: 'Calendario FAN — observación de campo.',
    color: '#3F7D3A'
  },
  {
    id: 'paja-cedron', nombre: 'Paja cedrón', cientifico: 'Cymbopogon citratus',
    tipo: 'Hierba aromática', categoria: 'Flores y hierbas',
    m: [0,1,2,3,4,5,6,7,8,9,10,11],
    cosecha: 'Disponible todo el año.',
    origen: 'chiquitania', regiones: ['San Javier', 'Concepción'],
    desc: 'Hierba limón de aroma cítrico fresco. Base de infusiones y un clásico de la cocina aromática.',
    usos: ['Infusiones', 'Aromatizante de caldos', 'Bebidas frías'],
    presentaciones: ['Atado fresco', 'Hoja seca 100 g'],
    fuente: 'Calendario FAN — observación de campo.',
    color: '#5E8C3A'
  },
  {
    id: 'limon-cambita', nombre: 'Limón cambita', cientifico: 'Citrus aurantiifolia',
    tipo: 'Cítrico', categoria: 'Frutas',
    m: [0,1,10,11],
    cosecha: 'Noviembre a febrero.',
    origen: 'chiquitania', regiones: ['San José de Chiquitos'],
    desc: 'Lima pequeña y aromática, muy ácida y perfumada. Imprescindible en la coctelería y cocina regional.',
    usos: ['Coctelería', 'Ceviches', 'Aderezos', 'Postres'],
    presentaciones: ['Por kg', 'Jugo natural 500 ml'],
    fuente: 'Calendario FAN — observación de campo.',
    color: '#9DAA2E'
  },
  {
    id: 'motojobo', nombre: 'Motojobo', cientifico: 'Lycianthes asarifolia',
    tipo: 'Fruto del bosque', categoria: 'Frutos del bosque',
    m: [1,2,10,11],
    cosecha: 'Febrero a marzo y noviembre a diciembre.',
    origen: 'chiquitania', regiones: ['San Rafael'],
    desc: 'Pequeño fruto silvestre de sabor agridulce, recolectado en el sotobosque chiquitano.',
    usos: ['Consumo fresco', 'Mermeladas', 'Jugos'],
    presentaciones: ['Fruto fresco por kg'],
    fuente: 'Calendario FAN — observación de campo.',
    color: '#C2410C'
  },
  {
    id: 'miel', nombre: 'Miel de abeja', cientifico: 'Apis mellifera',
    tipo: 'Producto apícola', categoria: 'Otros productos',
    m: [1,2,9,10],
    cosecha: 'Cosecha en febrero-marzo y octubre-noviembre, según floración.',
    origen: 'chiquitania', regiones: ['Concepción', 'San Javier'],
    desc: 'Miel multifloral del bosque chiquitano, recolectada de apiarios comunitarios. Perfil floral único por temporada.',
    usos: ['Endulzante natural', 'Repostería', 'Maridajes', 'Salsas'],
    presentaciones: ['Frasco 500 g', 'Frasco 1 kg'],
    fuente: 'Calendario FAN — observación de campo.',
    color: '#D98324'
  },
  {
    id: 'yuca', nombre: 'Yuca', cientifico: 'Manihot esculenta',
    tipo: 'Tubérculo', categoria: 'Otros productos',
    m: [0,1,2,3,4,5,6,7,8,9,10,11],
    cosecha: 'Todo el año. Se siembra en diciembre; ~6 meses para aprovechar (junio-julio).',
    origen: 'chiquitania', regiones: ['San Ignacio de Velasco', 'Concepción'],
    desc: 'Tubérculo básico de la dieta regional, cultivado por comunidades. Versátil y disponible todo el año.',
    usos: ['Acompañamientos', 'Harinas', 'Panificación', 'Snacks'],
    presentaciones: ['Por kg', 'Harina 1 kg'],
    fuente: 'Calendario FAN — observación de campo.',
    color: '#A8763E'
  }
];

// Orígenes geográficos. x,y para el SVG legacy; lat,lng para el mapa real.
FAN.ORIGENES = {
  chiquitania: { nombre: 'Bosque Chiquitano', depto: 'Santa Cruz', color: '#2D6A4F' },
  amazonia:    { nombre: 'Amazonía Norte', depto: 'Pando / Beni', color: '#1B5E5A' }
};

FAN.LUGARES = [
  { id:'san-ignacio', nombre:'San Ignacio de Velasco', region:'chiquitania', x:78, y:46, lat:-16.363, lng:-60.963 },
  { id:'concepcion',  nombre:'Concepción',             region:'chiquitania', x:71, y:50, lat:-16.150, lng:-62.029 },
  { id:'san-javier',  nombre:'San Javier',             region:'chiquitania', x:67, y:53, lat:-16.271, lng:-62.514 },
  { id:'san-miguel',  nombre:'San Miguel de Velasco',  region:'chiquitania', x:80, y:50, lat:-16.723, lng:-60.955 },
  { id:'san-rafael',  nombre:'San Rafael',             region:'chiquitania', x:82, y:54, lat:-16.778, lng:-60.677 },
  { id:'san-jose',    nombre:'San José de Chiquitos',  region:'chiquitania', x:74, y:60, lat:-17.848, lng:-60.755 },
  { id:'robore',      nombre:'Roboré',                 region:'chiquitania', x:82, y:63, lat:-18.330, lng:-59.759 },
  { id:'la-guardia',  nombre:'La Guardia',             region:'chiquitania', x:60, y:60, lat:-17.887, lng:-63.272 },
  { id:'cobija',      nombre:'Cobija',                 region:'amazonia',    x:24, y:14, lat:-11.027, lng:-68.774 },
  { id:'riberalta',   nombre:'Riberalta',              region:'amazonia',    x:34, y:20, lat:-11.003, lng:-65.992 },
  { id:'guarayos',    nombre:'Ascensión de Guarayos',  region:'amazonia',    x:60, y:46, lat:-15.728, lng:-63.186 }
];

// Productores (asociaciones / comunidades del bosque). Estados: PENDIENTE, APROBADO, RECHAZADO, SUSPENDIDO
FAN.PRODUCTORES = [
  {
    id:'apropama', nombre:'APROPAMA', tipo:'Asociación de productores',
    ubicacion:'San Ignacio de Velasco, Santa Cruz', region:'chiquitania',
    estado:'APROBADO', desde:'2024', verificado:true,
    desc:'Asociación de Productores del Pueblo Ayoreo dedicada a la recolección sostenible de almendra chiquitana y frutos del bosque.',
    productos:['almendra-chiquitana','totai','sujo'],
    contacto:{ tel:'+591 700 12345', whatsapp:'59170012345', correo:'apropama@bosque.bo' },
    metricas:{ visitas:1284, contactos:96, productos:3 },
    iniciales:'AP'
  },
  {
    id:'comunidad-monte-verde', nombre:'Comunidad Monte Verde', tipo:'Comunidad indígena',
    ubicacion:'Concepción, Santa Cruz', region:'chiquitania',
    estado:'APROBADO', desde:'2024', verificado:true,
    desc:'Comunidad chiquitana con manejo tradicional de yuca, miel multifloral y plantas aromáticas del bosque.',
    productos:['yuca','miel','paja-cedron','albahaca-silvestre'],
    contacto:{ tel:'+591 712 33456', whatsapp:'59171233456', correo:'monteverde@bosque.bo' },
    metricas:{ visitas:842, contactos:54, productos:4 },
    iniciales:'MV'
  },
  {
    id:'asai-pando', nombre:'Recolectores de Asaí Pando', tipo:'Asociación de productores',
    ubicacion:'Cobija, Pando', region:'amazonia',
    estado:'APROBADO', desde:'2025', verificado:true,
    desc:'Grupo de recolectores amazónicos especializados en asaí, majo y castaña con prácticas de cosecha certificadas.',
    productos:['asai','majo','castana'],
    contacto:{ tel:'+591 733 88122', whatsapp:'59173388122', correo:'asaipando@bosque.bo' },
    metricas:{ visitas:1576, contactos:131, productos:3 },
    iniciales:'AS'
  },
  {
    id:'sabores-chiquitos', nombre:'Sabores de Chiquitos', tipo:'Emprendimiento comunitario',
    ubicacion:'San José de Chiquitos, Santa Cruz', region:'chiquitania',
    estado:'PENDIENTE', desde:'2026', verificado:false,
    desc:'Emprendimiento familiar que transforma motacú y limón cambita en aceites y jugos artesanales.',
    productos:['motacu','limon-cambita'],
    contacto:{ tel:'+591 745 67890', whatsapp:'59174567890', correo:'sabores@chiquitos.bo' },
    metricas:{ visitas:0, contactos:0, productos:2 },
    iniciales:'SC'
  },
  {
    id:'flor-bosque', nombre:'Flor del Bosque', tipo:'Asociación de mujeres',
    ubicacion:'San Miguel de Velasco, Santa Cruz', region:'chiquitania',
    estado:'PENDIENTE', desde:'2026', verificado:false,
    desc:'Asociación de mujeres recolectoras de flor de colonia, canelón y pesoé para infusiones y aromáticas.',
    productos:['flor-colonia','canelon','pesoe'],
    contacto:{ tel:'+591 756 11223', whatsapp:'59175611223', correo:'flordelbosque@bosque.bo' },
    metricas:{ visitas:0, contactos:0, productos:3 },
    iniciales:'FB'
  },
  {
    id:'tradicion-totai', nombre:'Tradición Totaí', tipo:'Productor individual',
    ubicacion:'La Guardia, Santa Cruz', region:'chiquitania',
    estado:'SUSPENDIDO', desde:'2024', verificado:false,
    desc:'Productor de aceite de totaí. Suspendido temporalmente por actualización de datos de contacto.',
    productos:['totai'],
    contacto:{ tel:'+591 767 44556', whatsapp:'59176744556', correo:'totai@bosque.bo' },
    metricas:{ visitas:312, contactos:18, productos:1 },
    iniciales:'TT'
  }
];

// ===== Lógica de estado de temporada =====
// Devuelve: 'temporada' | 'terminando' | 'proximamente' | 'fuera'
FAN.estadoTemporada = function(product, month){
  if(month == null) month = FAN.CURRENT_MONTH;
  const m = product.m;
  const next = (month + 1) % 12;
  const prev = (month + 11) % 12;
  const inNow = m.includes(month);
  const inNext = m.includes(next);
  const inPrev = m.includes(prev);
  if(inNow && inNext) return 'temporada';
  if(inNow && !inNext) return 'terminando';
  if(!inNow && inNext) return 'proximamente';
  // único mes aislado rodeado de vacío => tratar como temporada corta
  if(inNow && !inPrev && !inNext) return 'terminando';
  return 'fuera';
};

FAN.ESTADOS = {
  temporada:    { label:'En temporada',     short:'En temporada',  color:'#2D6A4F', bg:'#E3F1EA', text:'#1B5036', dot:'#2D6A4F', ring:'#74C69D' },
  terminando:   { label:'Terminando pronto', short:'Terminando',   color:'#E07B2E', bg:'#FCEFE1', text:'#9A4D14', dot:'#F4A261', ring:'#F4A261' },
  proximamente: { label:'Próximamente',      short:'Próximamente', color:'#2D6A4F', bg:'#E3F1EA', text:'#1B5036', dot:'#2D6A4F', ring:'#74C69D' },
  fuera:        { label:'Fuera de temporada',short:'Fuera',        color:'#6B7280', bg:'#F1F2F1', text:'#52564F', dot:'#9CA3AF', ring:'#D1D5DB' }
};

// Métricas globales (Admin)
FAN.METRICAS = {
  visitas: 18432,
  visitasMes: 4210,
  suscriptores: 1247,
  suscriptoresNuevos: 86,
  contactos: 612,
  contactosMes: 134,
  productores: 6,
  productoresActivos: 3,
  productosCatalogo: 17,
  pendientes: 2
};

// Serie de visitas por mes (para gráficas)
FAN.SERIE_VISITAS = [1820,2010,2240,2680,3150,2980,3320,3610,3980,4120,4210,3870];

// Suscriptores de ejemplo
FAN.SUSCRIPTORES = [
  { id:1, nombre:'Marcela Áñez', canal:'WhatsApp', valor:'+591 700 55512', intereses:['almendra-chiquitana','asai'], desde:'2025', activo:true },
  { id:2, nombre:'Restaurante Jardín de Asaí', canal:'Correo', valor:'chef@jardinasai.bo', intereses:['asai','majo','totai'], desde:'2025', activo:true },
  { id:3, nombre:'Escuela de Gastronomía SCZ', canal:'Correo', valor:'info@gastroscz.bo', intereses:['castana','canelon','miel'], desde:'2026', activo:true },
  { id:4, nombre:'Carlos Mendía', canal:'WhatsApp', valor:'+591 712 99001', intereses:['piton','motojobo'], desde:'2026', activo:true },
  { id:5, nombre:'Bistró Chiquitano', canal:'Correo', valor:'reservas@bistrochiquitano.bo', intereses:['motacu','yuca','limon-cambita'], desde:'2025', activo:false }
];

// Persona de suscriptor "logueado" (para perfil y personalización)
FAN.ME_SUSCRIPTOR = {
  nombre:'Marcela Áñez', iniciales:'MA', canal:'WhatsApp', valor:'+591 700 55512',
  rol:'Chef / Restaurante', empresa:'Restaurante Jardín de Asaí',
  intereses:['almendra-chiquitana','asai','totai','castana'], desde:'enero 2025',
  alertasRecibidas:42, contactosHechos:7
};
// Persona admin "logueado"
FAN.ME_ADMIN = { nombre:'Daniela Roca', iniciales:'DR', cargo:'Coordinadora de Programa', area:'Bioeconomía · FAN', desde:'2023', correo:'daniela.roca@fan.org.bo' };

FAN.getProduct = function(id){ return FAN.PRODUCTS.find(p=>p.id===id); };
FAN.getProductor = function(id){ return FAN.PRODUCTORES.find(p=>p.id===id); };
FAN.productoresDe = function(productId){ return FAN.PRODUCTORES.filter(pr=>pr.estado==='APROBADO' && pr.productos.includes(productId)); };
