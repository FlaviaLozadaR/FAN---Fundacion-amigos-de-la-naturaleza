/* ============================================================
   PLATAFORMA FAN — Landing Page
   Problemática, misión, productos destacados, y acceso demo
   ============================================================ */

/* ——— Datos fijos de la landing ——— */
const STATS = [
  { value:'800.000', unit:'ha', label:'de bosque monitoreado', icon:'globe' },
  { value:'20+', unit:'', label:'comunidades productoras', icon:'users' },
  { value:'13+', unit:'', label:'productos del bosque catalogados', icon:'package' },
  { value:'16+', unit:'', label:'recetas gourmet desarrolladas', icon:'book' },
];

const DEMO_USERS = [
  { role:'visitante',  label:'Explorar sin registro', desc:'Chef, investigador o curioso · Sin cuenta requerida', icon:'user',    color:'#2D6A4F', bg:'#EDF7F2' },
  { role:'suscriptor', label:'Ana María Peña',         desc:'Chef ejecutiva · Suscriptora FAN',                   icon:'chefHat', color:'#0E7490', bg:'#E0F5FA' },
  { role:'productor',  label:'Sabores Chiquitos',      desc:'Asociación productora del bosque chiquitano',         icon:'sprout',  color:'#6B4226', bg:'#F5EEE8' },
  { role:'admin',      label:'Valeria Suárez',         desc:'Equipo FAN · Administradora de plataforma',           icon:'shield',  color:'#1B5036', bg:'#E6F0EB' },
];

const FEATURED_PRODUCTS = ['almendra-chiquitana','asai','castana','miel'];

const COMO_FUNCIONA = [
  {
    icon:'user', color:'#2D6A4F', title:'Visitante / Chef',
    steps:['Explora el catálogo completo de productos del bosque','Conoce la procedencia y temporadas de cosecha','Descubre recetas gourmet con ingredientes silvestres','Conecta con productores certificados por FAN']
  },
  {
    icon:'bell', color:'#0E7490', title:'Suscriptor',
    steps:['Recibe alertas de disponibilidad de temporada','Accede a recomendaciones personalizadas por FANNY IA','Consulta el calendario de cosecha en tiempo real','Contacta directamente a productores de tu preferencia']
  },
  {
    icon:'sprout', color:'#6B4226', title:'Productor',
    steps:['Registra y gestiona tu catálogo de productos','Comunica disponibilidad y temporadas de cosecha','Conecta con chefs y compradores interesados','Sube certificaciones y fotografías de tus productos']
  },
];

/* ——— Componente Navbar ——— */
function LandingNav({ onLoginClick, scrolled }){
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    ['#problema','Problemática','info'],
    ['#solucion','Solución','checkCircle'],
    ['#productos','Productos','leaf'],
    ['#impacto','Impacto','trending'],
    ['#como-funciona','¿Cómo funciona?','users'],
  ];
  return (
    <>
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E8EBE6]' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#inicio" className="flex items-center shrink-0">
            <img src="/LOGO/Logo-FANI.png" alt="FAN" className="h-9 sm:h-11 w-auto object-contain" style={{ filter: scrolled ? 'none' : 'brightness(0) invert(1)' }} onError={e=>{ e.target.style.display='none'; }} />
          </a>

          {/* Nav links — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href}
                className={cn('px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors hover:bg-white/10',
                  scrolled ? 'text-[#3a4a3f] hover:bg-[#EDF2ED]' : 'text-white/90 hover:text-white')}>
                {label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button onClick={onLoginClick}
              className={cn('hidden sm:flex items-center gap-2 h-10 px-5 rounded-xl text-[13.5px] font-semibold transition-all',
                scrolled
                  ? 'bg-[#2D6A4F] text-white hover:bg-[#235741] shadow-sm'
                  : 'bg-white text-[#2D6A4F] hover:bg-white/90 shadow-md')}>
              <Icon name="user" size={15} />
              Iniciar sesión
            </button>
            {/* Hamburger móvil */}
            <button onClick={() => setMenuOpen(o => !o)}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition"
              style={scrolled
                ? { color:'#2D6A4F', background:'#EDF2ED' }
                : { color:'white', background:'rgba(0,0,0,0.35)', backdropFilter:'blur(4px)', border:'1px solid rgba(255,255,255,0.15)' }}>
              <Icon name={menuOpen ? 'x' : 'menu'} size={20} />
            </button>
          </div>
        </div>
      </div>

    </header>

      {/* Menú móvil — drawer lateral derecho, fuera del header */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}></div>

          {/* Panel — ocupa la mitad derecha */}
          <div className="relative w-1/2 min-w-[220px] max-w-xs h-full flex flex-col shadow-2xl animate-[sheetUp_.2s_ease]"
            style={{ background:'#0D1F12' }}>

            {/* Header del panel */}
            <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-white/8">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon name="leaf" size={12} style={{ color:'#74C69D' }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color:'#74C69D' }}>FAN</span>
                </div>
                <div className="text-white/40 text-[11px]">Menú</div>
              </div>
              <button onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.5)' }}>
                <Icon name="x" size={16} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navLinks.map(([href, label, icon]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
                  style={{ color:'rgba(255,255,255,0.75)' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ background:'rgba(116,198,157,0.12)' }}>
                    <Icon name={icon} size={14} style={{ color:'#74C69D' }} />
                  </div>
                  <span className="text-[13.5px] font-medium text-white leading-tight">{label}</span>
                </a>
              ))}
            </nav>

            {/* CTAs al fondo */}
            <div className="px-3 pb-6 pt-3 space-y-2 border-t border-white/8">
              <button onClick={() => { setMenuOpen(false); onLoginClick(); }}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-[13px]"
                style={{ background:'#74C69D', color:'#0D3320' }}>
                <Icon name="eye" size={15} />
                Ver demo
              </button>
              <button onClick={() => { setMenuOpen(false); onLoginClick(); }}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl font-medium text-[12.5px]"
                style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)' }}>
                <Icon name="user" size={14} />
                Iniciar sesión
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

/* ——— Hero ——— */
function LandingHero({ onLoginClick, onDemoClick }){
  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background:'linear-gradient(135deg, #0D3320 0%, #1B5036 40%, #2D6A4F 70%, #3D8B6A 100%)' }}>

      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background:'radial-gradient(circle, #74C69D 0%, transparent 70%)' }}></div>
        <div className="absolute -bottom-60 -left-40 w-[700px] h-[700px] rounded-full opacity-8"
          style={{ background:'radial-gradient(circle, #74C69D 0%, transparent 70%)' }}></div>
        {/* Patrón de hojas SVG decorativo */}
        <svg className="absolute top-0 right-0 opacity-5 w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
          <path d="M600 100 C700 50 750 150 700 200 C650 250 550 200 600 100Z" fill="white"/>
          <path d="M200 300 C300 250 350 350 300 400 C250 450 150 400 200 300Z" fill="white"/>
          <path d="M500 500 C600 450 650 550 600 600 C550 650 450 600 500 500Z" fill="white"/>
          <path d="M100 600 C200 550 250 650 200 700 C150 750 50 700 100 600Z" fill="white"/>
          <path d="M700 400 C800 350 850 450 800 500 C750 550 650 500 700 400Z" fill="white"/>
        </svg>
      </div>

      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <img src="/bosque-homepage.jpg" alt="Bosque Chiquitano" className="w-full h-full object-cover object-center"
          onError={e=>e.target.style.display='none'} />
        {/* Overlay más oscuro en mobile para legibilidad */}
        <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, rgba(10,35,18,0.55) 0%, rgba(10,35,18,0.65) 50%, rgba(10,35,18,0.80) 100%)' }}></div>
        <div className="absolute inset-0 hidden sm:block" style={{ background:'linear-gradient(to right, rgba(10,35,18,0.70) 0%, rgba(10,35,18,0.40) 55%, rgba(10,35,18,0.15) 100%)' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-24">
        <div className="max-w-2xl">

          {/* Badge — más corto en mobile */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-6 text-[10px] sm:text-xs font-semibold uppercase tracking-wider"
            style={{ background:'rgba(116,198,157,0.18)', border:'1px solid rgba(116,198,157,0.35)', color:'#74C69D' }}>
            <Icon name="leaf" size={11} />
            <span className="hidden sm:inline">Fundación Amigos de la Naturaleza · Bolivia</span>
            <span className="sm:hidden">FAN · Bolivia</span>
          </div>

          {/* Headline */}
          <h1 className="text-white leading-[1.1] mb-5"
            style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem, 8vw, 4rem)', fontWeight:600 }}>
            Del bosque chiquitano{' '}
            <span style={{ color:'#74C69D' }}>a la mesa boliviana</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-white/70 mb-8 leading-relaxed text-[14px] sm:text-[16px] max-w-xl">
            Bolivia pierde miles de hectáreas de bosque cada año. Las comunidades que lo habitan
            producen ingredientes extraordinarios que nadie conoce.
            FAN conecta el bosque con la cocina boliviana —{' '}
            <strong className="text-white/90">sin intermediarios, sin especulación.</strong>
          </p>

          {/* CTAs — siempre en fila */}
          <div className="flex flex-row gap-3">
            <button onClick={onDemoClick}
              className="flex items-center justify-center gap-2 h-12 px-5 sm:px-7 rounded-xl font-semibold text-[13.5px] sm:text-[14.5px] transition-all hover:opacity-90 active:scale-[0.98] shadow-lg"
              style={{ background:'#74C69D', color:'#0D3320' }}>
              <Icon name="eye" size={16} />
              Ver la plataforma
            </button>
            <button onClick={onLoginClick}
              className="flex items-center justify-center gap-2 h-12 px-5 sm:px-7 rounded-xl font-semibold text-[13.5px] sm:text-[14.5px] transition-all hover:bg-white/15 active:scale-[0.98]"
              style={{ background:'rgba(255,255,255,0.1)', color:'white', border:'1.5px solid rgba(255,255,255,0.25)' }}>
              <Icon name="user" size={16} />
              Iniciar sesión
            </button>
          </div>

          {/* Trust badges — apilados en mobile */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 mt-9 pt-7 border-t border-white/10">
            {[
              { icon:'shield', text:'Datos verificados por FAN' },
              { icon:'leaf',   text:'100% productos silvestres' },
              { icon:'users',  text:'Comunidades certificadas' },
            ].map(({icon, text}) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon name={icon} size={13} style={{ color:'#74C69D' }} />
                <span className="text-white/55 text-[12px]">{text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/40 text-xs">Descubrir</span>
        <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/50"></div>
        </div>
      </div>
    </section>
  );
}

/* ——— Sección Problema ——— */
function LandingProblema(){
  const DOLOR = [
    { num:'01', title:'Deforestación acelerada', desc:'Miles de hectáreas de bosque nativo desaparecen cada año por avance agrícola y ganadero.' },
    { num:'02', title:'Invisibilidad económica', desc:'Los productores del bosque no tienen canales para llegar a compradores con poder adquisitivo.' },
    { num:'03', title:'Pérdida de saberes', desc:'El conocimiento ancestral sobre cosecha y uso de productos silvestres se pierde sin documentación.' },
  ];
  return (
    <section id="problema" className="py-16 sm:py-20 lg:py-28" style={{ background:'#F7F8F4' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full" style={{ background:'#B23A48' }}></div>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color:'#B23A48' }}>La problemática</span>
          </div>
          <h2 className="text-[#1f2a21] font-semibold leading-tight max-w-xl"
            style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.55rem, 4vw, 2.2rem)' }}>
            Bolivia pierde su bosque mientras sus tesoros quedan invisibles
          </h2>
        </div>

        {/* Cuerpo — dos columnas en desktop */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">

          {/* Columna izquierda — texto + cards dolor */}
          <div>
            <p className="text-[#4a5e4f] text-[14.5px] sm:text-[15px] leading-relaxed mb-4">
              El bosque chiquitano es uno de los ecosistemas más biodiversos del mundo y el hogar
              de comunidades que han convivido con él durante siglos. Cada árbol talado es también
              el fin de una fuente de sustento y cultura.
            </p>
            <p className="text-[#4a5e4f] text-[14.5px] sm:text-[15px] leading-relaxed mb-8">
              Mientras tanto, la gastronomía boliviana crece buscando identidad e ingredientes únicos.
              Pero el bosque y la cocina nunca se encontraron —{' '}
              <strong className="text-[#2D6A4F]">no había quién los presentara.</strong>
            </p>

            {/* Cards de dolor */}
            <div className="space-y-3">
              {DOLOR.map(({ num, title, desc }) => (
                <div key={num} className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-white border border-[#EDE8E6] shadow-sm">
                  <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[12px]"
                    style={{ background:'#FBE9EB', color:'#B23A48' }}>{num}</div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[#1f2a21] text-[14px] mb-0.5">{title}</div>
                    <div className="text-[#6b756c] text-[13px] leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha — datos visuales */}
          <div className="space-y-4">
            {/* Card principal: deforestación */}
            <div className="rounded-2xl overflow-hidden" style={{ background:'linear-gradient(135deg, #1B5036, #2D6A4F)' }}>
              <div className="p-6 sm:p-7">
                <div className="text-white/50 text-[12px] font-medium mb-3 uppercase tracking-wide">Bolivia · superficie deforestada estimada</div>
                <div className="text-white font-bold leading-none mb-1"
                  style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.2rem, 7vw, 3rem)' }}>~280.000</div>
                <div className="text-[#74C69D] text-[15px] font-medium mb-5">hectáreas / año</div>
                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/10">
                  {[
                    { v:'34%',  l:'de la deforestación global de bosques secos tropicales' },
                    { v:'5.º',  l:'lugar mundial en deforestación total por área' },
                  ].map(({v,l}) => (
                    <div key={v}>
                      <div className="text-white font-bold text-[1.6rem] leading-none" style={{ fontFamily:'var(--font-display)' }}>{v}</div>
                      <div className="text-white/45 text-[11.5px] mt-1.5 leading-snug">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dos stats pequeñas */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { n:'70%',  label:'familias rurales que dependen del bosque para su sustento', bg:'#EDF7F2', nc:'#2D6A4F', tc:'#1B5036' },
                { n:'200+', label:'especies útiles del bosque chiquitano sin comercializar',   bg:'#F5EEE8', nc:'#6B4226', tc:'#5a3010' },
              ].map(({ n, label, bg, nc, tc }) => (
                <div key={n} className="p-4 sm:p-5 rounded-xl border border-[#E8EBE6]" style={{ background: bg }}>
                  <div className="font-bold leading-none mb-2" style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', color: nc }}>{n}</div>
                  <div className="text-[11.5px] leading-snug" style={{ color: tc, opacity:0.75 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ——— Sección Solución ——— */
function LandingSolucion(){
  const pilares = [
    { icon:'globe',     title:'Trazabilidad del origen',    desc:'Comunidad de origen, método de cosecha, temporada y certificación FAN en cada producto.',                        color:'#2D6A4F' },
    { icon:'bell',      title:'Alertas de disponibilidad',  desc:'Notificaciones cuando los productos de temporada están listos para contactar directamente a productores.',         color:'#0E7490' },
    { icon:'sparkles',  title:'FANNY — Asistente IA',       desc:'IA especializada en cocina boliviana que orienta a chefs sobre usos, combinaciones y temporadas del bosque.',     color:'#7C3AED' },
    { icon:'book',      title:'Recetario gourmet',           desc:'Recetas de chefs bolivianos que integran productos silvestres del bosque en preparaciones contemporáneas.',       color:'#B45309' },
    { icon:'mapPin',    title:'Mapa de procedencia',         desc:'Visualiza en el mapa de Bolivia el origen exacto de cada producto y las comunidades que lo producen.',            color:'#BE185D' },
    { icon:'users',     title:'Red de productores',          desc:'Conexión directa entre compradores y asociaciones del bosque — sin intermediarios, sin especulación de precio.', color:'#6B4226' },
  ];

  return (
    <section id="solucion" className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="mb-8 sm:mb-10 pb-8 border-b border-[#EEF0EC]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-[#2D6A4F]"></div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2D6A4F]">Nuestra propuesta</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-10">
            <h2 className="text-[#1f2a21] font-semibold leading-tight shrink-0"
              style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.5rem, 4vw, 2.1rem)' }}>
              Una plataforma que informa,{' '}orienta y conecta
            </h2>
            <p className="text-[#8a948a] text-[13px] leading-relaxed sm:max-w-xs">
              FAN no es un marketplace. Conecta a quienes producen el bosque con quienes lo necesitan en la cocina.
            </p>
          </div>
        </div>

        {/* Grid — 1 col mobile, 2 col sm, 3 col lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pilares.map(({ icon, title, desc, color }) => (
            <div key={title}
              className="group flex items-start gap-3.5 p-4 rounded-xl border border-[#EEF0EC] bg-white hover:border-[#C8D5CA] hover:shadow-sm transition-all">
              <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                style={{ background: color+'14' }}>
                <Icon name={icon} size={15} style={{ color }} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[#1f2a21] text-[13.5px] mb-0.5 leading-snug">{title}</div>
                <p className="text-[#9aa79d] text-[12px] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nota al pie */}
        <div className="mt-6 flex items-start gap-2.5 px-1">
          <Icon name="info" size={13} style={{ color:'#c2cbc3', flexShrink:0, marginTop:1 }} />
          <p className="text-[11.5px] text-[#b0bab1]">
            FAN no gestiona ventas ni pagos. Solo informa, orienta y genera el contacto entre partes.
          </p>
        </div>

      </div>
    </section>
  );
}

/* ——— Sección Productos Destacados ——— */
function LandingProductos({ onEnter }){
  const featured = (FAN.PRODUCTS || []).filter(p => FEATURED_PRODUCTS.includes(p.id));

  const ORIGEN_LABELS = { chiquitania:'Bosque Chiquitano', amazonia:'Amazonía Boliviana' };

  return (
    <section id="productos" className="py-24 lg:py-32" style={{ background:'#F7F8F4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5"
              style={{ background:'#EDF7F2', color:'#2D6A4F', border:'1px solid #c3e6d5' }}>
              <Icon name="leaf" size={13} />
              Del bosque chiquitano
            </div>
            <h2 className="text-[#1f2a21]" style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight:600, lineHeight:1.2 }}>
              Ingredientes que el bosque<br />produce para tu cocina
            </h2>
          </div>
          <button onClick={() => onEnter('visitante')}
            className="shrink-0 flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold text-[#2D6A4F] border border-[#2D6A4F] hover:bg-[#EDF2ED] transition">
            Ver catálogo completo
            <Icon name="arrowRight" size={15} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {featured.map(p => {
            const inSeason = (p.m || []).includes(FAN.CURRENT_MONTH);
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-[#E8EBE6] overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 group cursor-pointer"
                onClick={() => onEnter('visitante')}>
                {/* Imagen */}
                <div className="h-44 relative overflow-hidden group"
                  style={{ background:`linear-gradient(135deg, ${p.color}22, ${p.color}44)` }}>
                  <ProductGlyph product={p} full />
                  {/* Badge temporada */}
                  <div className={cn(
                    'absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10.5px] font-semibold z-10',
                    inSeason ? 'bg-[#2D6A4F] text-white' : 'bg-white/90 text-[#6b756c]'
                  )}>
                    {inSeason ? '● En temporada' : '○ Fuera de temporada'}
                  </div>
                </div>
                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-[#1f2a21] text-[15px] leading-tight">{p.nombre}</h3>
                  </div>
                  <div className="text-[11.5px] text-[#9aa79d] italic mb-3">{p.cientifico}</div>
                  <p className="text-[#6b756c] text-[12.5px] leading-relaxed line-clamp-2 mb-4">{p.desc}</p>
                  <div className="flex items-center gap-1.5">
                    <Icon name="mapPin" size={11} style={{ color:'#9aa79d' }} />
                    <span className="text-[11px] text-[#9aa79d]">{ORIGEN_LABELS[p.origen] || p.origen}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ——— Sección Impacto ——— */
function LandingImpacto(){
  return (
    <section id="impacto" className="py-14 lg:py-18" style={{ background:'#0F2318' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado compacto */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 rounded-full" style={{ background:'#74C69D' }}></div>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color:'#74C69D' }}>Impacto FAN</span>
            </div>
            <h2 className="text-white text-[1.5rem] font-semibold" style={{ fontFamily:'var(--font-display)' }}>
              Conservación con propósito económico
            </h2>
          </div>
          <p className="text-white/40 text-[13px] max-w-xs leading-relaxed">
            Cuando el bosque tiene valor para quienes lo habitan, tiene futuro.
          </p>
        </div>

        {/* Stats en fila horizontal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.07)' }}>
          {STATS.map(({ value, unit, label, icon }, i) => (
            <div key={label} className="flex flex-col gap-1 px-6 py-6 relative"
              style={{ background:'#0F2318' }}>
              {i < STATS.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-4 bottom-4 w-px" style={{ background:'rgba(255,255,255,0.08)' }}></div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <Icon name={icon} size={14} style={{ color:'#74C69D' }} />
                <span className="text-[11px] text-white/35 uppercase tracking-wider font-medium">{label}</span>
              </div>
              <div className="font-bold leading-none" style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:'white' }}>
                {value}
                {unit && <span className="text-[1rem] font-semibold ml-0.5" style={{ color:'#74C69D' }}>{unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Cita minimalista */}
        <div className="mt-8 flex items-start gap-4 px-2">
          <Icon name="leaf" size={16} style={{ color:'#74C69D', marginTop:3, flexShrink:0 }} />
          <p className="text-white/35 text-[13px] italic leading-relaxed" style={{ fontFamily:'var(--font-display)' }}>
            "El bosque chiquitano alberga una diversidad de productos con enorme potencial gastronómico
            que permanece invisible para la mayoría de los bolivianos." —{' '}
            <span className="not-italic text-white/50 font-medium">Fundación Amigos de la Naturaleza</span>
          </p>
        </div>

      </div>
    </section>
  );
}

/* ——— Sección Cómo Funciona ——— */
function LandingComoFunciona(){
  const [active, setActive] = useState(0);
  const item = COMO_FUNCIONA[active];
  return (
    <section id="como-funciona" className="py-16 sm:py-20 lg:py-28" style={{ background:'#F7F8F4' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-[#2D6A4F]"></div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2D6A4F]">Para cada perfil</span>
          </div>
          <h2 className="text-[#1f2a21] font-semibold" style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.5rem, 4vw, 1.9rem)' }}>
            ¿Cómo funciona según tu perfil?
          </h2>
        </div>

        {/* Selector de roles — chips scrollables en mobile */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
          {COMO_FUNCIONA.map(({ title, color, icon }, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-left transition-all shrink-0',
                active === i ? 'text-white shadow-sm' : 'bg-white border border-[#E8EBE6] text-[#5e6b60]'
              )}
              style={active === i ? { background: color } : {}}>
              <div className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center"
                style={{ background: active === i ? 'rgba(255,255,255,0.2)' : color+'18' }}>
                <Icon name={icon} size={13} style={{ color: active === i ? 'white' : color }} />
              </div>
              <span className="text-[13px] font-semibold whitespace-nowrap">{title}</span>
            </button>
          ))}
        </div>

        {/* Card de contenido */}
        <div className="bg-white rounded-2xl border border-[#E8EBE6] overflow-hidden">
          {/* Header */}
          <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-[#F0F2EE] flex items-center gap-3"
            style={{ background: item.color+'0C' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: item.color }}>
              <Icon name={item.icon} size={16} style={{ color:'white' }} />
            </div>
            <div>
              <div className="font-bold text-[#1f2a21] text-[15px]" style={{ fontFamily:'var(--font-display)' }}>{item.title}</div>
              <div className="text-[11px] text-[#9aa79d]">{item.steps.length} funcionalidades clave</div>
            </div>
          </div>

          {/* Steps */}
          <div className="divide-y divide-[#F4F6F3]">
            {item.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 px-5 sm:px-7 py-4">
                <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: item.color }}>
                  {i + 1}
                </div>
                <p className="text-[#3a4a3f] text-[13.5px] sm:text-[14px] leading-relaxed flex-1">{step}</p>
                <Icon name="check" size={14} style={{ color: item.color, opacity:0.45, flexShrink:0 }} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ——— Modal Login / Demo ——— */
function LoginModal({ onClose, onEnter }){
  const [tab, setTab] = useState('demo'); // 'login' | 'register' | 'demo'
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [nombre, setNombre] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoEnter = (role) => {
    setLoading(true);
    setTimeout(() => { onEnter(role); }, 600);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if(!email || !pass){ setError('Completa todos los campos.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError('La autenticación real no está disponible aún. Usa los perfiles de demo para explorar la plataforma.');
    }, 1200);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if(!nombre || !email || !pass){ setError('Completa todos los campos.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError('El registro real no está disponible aún. Usa los perfiles de demo para explorar la plataforma.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0D1F12]/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Panel */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-[sheetUp_.2s_ease]">
        {/* Header */}
        <div className="px-8 pt-8 pb-6" style={{ background:'linear-gradient(135deg, #1B5036, #2D6A4F)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon name="leaf" size={17} style={{ color:'#74C69D' }} />
              </div>
              <div>
                <div className="text-white font-bold text-[15px]">Plataforma FAN</div>
                <div className="text-white/60 text-[11.5px]">Fundación Amigos de la Naturaleza</div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition">
              <Icon name="x" size={16} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background:'rgba(0,0,0,0.2)' }}>
            {[['demo','Explorar demo'],['login','Iniciar sesión'],['register','Registrarse']].map(([t,l])=>(
              <button key={t} onClick={()=>{ setTab(t); setError(''); }}
                className={cn('flex-1 py-2 rounded-lg text-[12.5px] font-semibold transition-all',
                  tab===t ? 'bg-white text-[#1B5036] shadow-sm' : 'text-white/70 hover:text-white')}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-7">

          {/* Tab: Demo */}
          {tab === 'demo' && (
            <div>
              <p className="text-[#6b756c] text-[13px] leading-relaxed mb-5 text-center">
                Explora la plataforma con diferentes perfiles sin necesidad de registrarte.
              </p>
              <div className="space-y-3">
                {DEMO_USERS.map(({ role, label, desc, icon, color, bg }) => (
                  <button key={role} onClick={() => handleDemoEnter(role)} disabled={loading}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#E8EBE6] hover:border-[#bcc9bf] hover:shadow-md transition-all text-left group disabled:opacity-60">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{ background: bg }}>
                      <Icon name={icon} size={20} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#1f2a21] text-[14px] leading-tight">{label}</div>
                      <div className="text-[#9aa79d] text-[12px] leading-tight mt-0.5 truncate">{desc}</div>
                    </div>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5"
                      style={{ background: color+'18' }}>
                      {loading ? (
                        <Icon name="loader" size={13} style={{ color, animation:'spin 1s linear infinite' }} />
                      ) : (
                        <Icon name="arrowRight" size={13} style={{ color }} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Login */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#3a4a3f] mb-1.5">Correo electrónico</label>
                <div className="relative">
                  <Icon name="mail" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa79d]" />
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E7DE] bg-white text-[14px] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition placeholder:text-[#c2cbc3]" />
                </div>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#3a4a3f] mb-1.5">Contraseña</label>
                <div className="relative">
                  <Icon name="lock" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa79d]" />
                  <input type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-[#E2E7DE] bg-white text-[14px] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition placeholder:text-[#c2cbc3]" />
                  <button type="button" onClick={()=>setShowPass(s=>!s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9aa79d] hover:text-[#5e6b60] transition">
                    <Icon name="eye" size={15} />
                  </button>
                </div>
              </div>
              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl text-[12.5px] leading-relaxed" style={{ background:'#FFF3CD', color:'#856404', border:'1px solid #ffd97d' }}>
                  <Icon name="info" size={14} style={{ flexShrink:0, marginTop:1 }} />
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl font-semibold text-[14.5px] text-white transition disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ background:'#2D6A4F' }}>
                {loading ? <><Icon name="loader" size={15} style={{ animation:'spin 1s linear infinite' }} />Ingresando...</> : 'Iniciar sesión'}
              </button>
              <button type="button" onClick={()=>setTab('demo')}
                className="w-full text-center text-[12.5px] text-[#2D6A4F] font-medium hover:underline mt-1">
                ¿Sin cuenta? Explorar demo →
              </button>
            </form>
          )}

          {/* Tab: Register */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#3a4a3f] mb-1.5">Nombre completo</label>
                <div className="relative">
                  <Icon name="user" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa79d]" />
                  <input type="text" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Tu nombre"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E7DE] bg-white text-[14px] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition placeholder:text-[#c2cbc3]" />
                </div>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#3a4a3f] mb-1.5">Correo electrónico</label>
                <div className="relative">
                  <Icon name="mail" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa79d]" />
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E7DE] bg-white text-[14px] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition placeholder:text-[#c2cbc3]" />
                </div>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#3a4a3f] mb-1.5">Contraseña</label>
                <div className="relative">
                  <Icon name="lock" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa79d]" />
                  <input type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="Mínimo 8 caracteres"
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-[#E2E7DE] bg-white text-[14px] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition placeholder:text-[#c2cbc3]" />
                  <button type="button" onClick={()=>setShowPass(s=>!s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9aa79d] hover:text-[#5e6b60] transition">
                    <Icon name="eye" size={15} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#3a4a3f] mb-1.5">¿Cuál es tu perfil?</label>
                <div className="grid grid-cols-3 gap-2">
                  {[['Visitante','user'],['Suscriptor','bell'],['Productor','sprout']].map(([l,ic])=>(
                    <button key={l} type="button"
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-[#E2E7DE] hover:border-[#2D6A4F] hover:bg-[#EDF7F2] transition text-[11.5px] font-medium text-[#5e6b60]">
                      <Icon name={ic} size={16} style={{ color:'#2D6A4F' }} />
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl text-[12.5px] leading-relaxed" style={{ background:'#FFF3CD', color:'#856404', border:'1px solid #ffd97d' }}>
                  <Icon name="info" size={14} style={{ flexShrink:0, marginTop:1 }} />
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl font-semibold text-[14.5px] text-white transition disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ background:'#2D6A4F' }}>
                {loading ? <><Icon name="loader" size={15} style={{ animation:'spin 1s linear infinite' }} />Registrando...</> : 'Crear cuenta'}
              </button>
              <button type="button" onClick={()=>setTab('demo')}
                className="w-full text-center text-[12.5px] text-[#2D6A4F] font-medium hover:underline mt-1">
                ¿Prefieres explorar primero? Ver demo →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ——— CTA Banner final ——— */
function LandingCTA({ onLoginClick, onEnter }){
  return (
    <section className="py-20 lg:py-24" style={{ background:'#F7F8F4' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden flex flex-col lg:flex-row items-stretch" style={{ background:'#0F2318' }}>

          {/* Franja de imagen lateral */}
          <div className="hidden lg:block w-80 shrink-0 relative">
            <img src="/bosque-homepage.jpg" alt="Bosque" className="absolute inset-0 w-full h-full object-cover"
              onError={e=>e.target.style.display='none'} />
            <div className="absolute inset-0" style={{ background:'linear-gradient(to right, transparent 60%, #0F2318 100%)' }}></div>
          </div>

          {/* Contenido */}
          <div className="flex-1 px-8 lg:px-12 py-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-4 rounded-full" style={{ background:'#74C69D' }}></div>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color:'#74C69D' }}>Empieza ahora</span>
            </div>

            <h2 className="text-white font-semibold mb-3 leading-tight"
              style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.6rem, 3vw, 2.2rem)' }}>
              Descubre lo que el bosque<br className="hidden sm:block" /> tiene para ofrecer
            </h2>
            <p className="text-white/45 text-[14px] leading-relaxed mb-8 max-w-md">
              Explora el catálogo completo, conoce a los productores y encuentra
              el ingrediente silvestre que tu cocina está buscando.
            </p>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => onEnter('visitante')}
                className="flex items-center gap-2 h-11 px-6 rounded-xl font-semibold text-[13.5px] transition-all hover:opacity-90 active:scale-[.98]"
                style={{ background:'#74C69D', color:'#0D3320' }}>
                <Icon name="eye" size={16} />
                Explorar el catálogo
              </button>
              <button onClick={onLoginClick}
                className="flex items-center gap-2 h-11 px-6 rounded-xl font-semibold text-[13.5px] text-white/80 hover:text-white transition-all"
                style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)' }}>
                <Icon name="user" size={16} />
                Crear cuenta
              </button>
            </div>
          </div>

          {/* Línea decorativa verde */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background:'linear-gradient(to right, transparent, #74C69D44, transparent)' }}></div>
        </div>
      </div>
    </section>
  );
}

/* ——— Footer ——— */
function LandingFooter({ onLoginClick }){
  return (
    <footer style={{ background:'#0D1F12' }} className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] flex items-center justify-center">
                <Icon name="leaf" size={18} style={{ color:'#74C69D' }} />
              </div>
              <div>
                <div className="text-white font-bold text-sm">Plataforma FAN</div>
                <div className="text-white/40 text-[11px]">Fundación Amigos de la Naturaleza</div>
              </div>
            </div>
            <p className="text-white/40 text-[13px] leading-relaxed max-w-xs">
              Conectando la oferta del bosque chiquitano con la demanda gastronómica de Bolivia.
              Informa · orienta · conecta.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[['mail','contacto@fan.org.bo'],['phone','+591 3 333 3333']].map(([ic,txt])=>(
                <div key={txt} className="flex items-center gap-1.5 text-white/35 text-[12px]">
                  <Icon name={ic} size={12} />
                  {txt}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-4">Plataforma</div>
            <div className="space-y-2.5">
              {['Inicio','Problemática','Solución','Productos','Impacto','¿Cómo funciona?'].map(l=>(
                <div key={l}><a href="#" className="text-white/40 text-[13px] hover:text-white/70 transition">{l}</a></div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-4">Acceso</div>
            <div className="space-y-2.5">
              {['Iniciar sesión','Registrarse','Explorar demo'].map(l=>(
                <div key={l}><button onClick={onLoginClick} className="text-white/40 text-[13px] hover:text-white/70 transition">{l}</button></div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-white/25 text-[12px]">© 2026 Fundación Amigos de la Naturaleza · Bolivia</div>
          <div className="text-white/25 text-[12px]">No es un marketplace · Informa · orienta · conecta</div>
        </div>
      </div>
    </footer>
  );
}

/* ——— Componente principal LandingPage ——— */
function LandingPage({ onEnter }){
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleEnter = (role) => {
    setShowLogin(false);
    setTimeout(() => onEnter(role), 100);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily:'"Hanken Grotesk", system-ui, sans-serif' }}>
      <LandingNav onLoginClick={() => setShowLogin(true)} scrolled={scrolled} />
      <LandingHero onLoginClick={() => setShowLogin(true)} onDemoClick={() => setShowLogin(true)} />
      <LandingProblema />
      <LandingSolucion />
      <LandingProductos onEnter={handleEnter} />
      <LandingImpacto />
      <LandingComoFunciona />
      <LandingCTA onLoginClick={() => setShowLogin(true)} onEnter={handleEnter} />
      <LandingFooter onLoginClick={() => setShowLogin(true)} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onEnter={handleEnter} />}
    </div>
  );
}
