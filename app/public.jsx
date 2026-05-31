/* ============================================================
   PLATAFORMA FAN — Experiencia pública (Visitante)
   ============================================================ */
/* ---------- Tarjeta de producto ---------- */
function ProductCard({ product, onOpen, compact=false }){
  const est = FAN.estadoTemporada(product);
  const e = FAN.ESTADOS[est];
  const prods = FAN.productoresDe(product.id);
  return (
    <button
      onClick={()=>onOpen(product)}
      className="group relative text-left bg-white rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5"
      style={{
        boxShadow: '0 2px 12px rgba(27,50,24,0.07), 0 1px 3px rgba(27,50,24,0.05)',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow='0 16px 40px rgba(27,50,24,0.14), 0 4px 10px rgba(27,50,24,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow='0 2px 12px rgba(27,50,24,0.07), 0 1px 3px rgba(27,50,24,0.05)'}
    >
      {/* Imagen / glifo */}
      <div
        className={"relative overflow-hidden flex items-center justify-center " + (compact ? 'h-28':'h-48')}
        style={{ background:`linear-gradient(145deg, ${product.color}22 0%, ${product.color}10 100%)` }}
      >
        <ProductGlyph product={product} size={compact?52:68} full />
        {/* Shine overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)' }} />
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <StatusBadge estado={est} size="sm" />
        </div>
        {/* Hover arrow */}
        <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 shadow-sm">
          <Icon name="arrowRight" size={13} className="text-[#1B5036]" />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div
          className="font-semibold text-[#1a2c1e] leading-snug"
          style={{ fontFamily:'var(--font-display)', fontSize: compact?14:15 }}
        >
          {product.nombre}
        </div>
        <div className="mt-auto pt-3 border-t border-[#F0F4EF] flex items-center justify-between gap-2 text-[11.5px] text-[#7a8f7d]">
          <span className="flex items-center gap-1.5 min-w-0">
            <Icon name="mapPin" size={12} className="shrink-0 text-[#a0b5a2]" />
            <span className="truncate">{FAN.ORIGENES[product.origen].nombre.replace('Bosque ','')}</span>
          </span>
          {prods.length>0 && (
            <span className="shrink-0 flex items-center gap-1 rounded-full bg-[#EBF5EF] px-2.5 py-1 text-[#2D6A4F] font-semibold">
              {prods.length} prod.
              <Icon name="chevronRight" size={11} className="group-hover:translate-x-0.5 transition" />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ---------- Hero del dashboard ---------- */
function DashHero(){
  const mes = FAN.MONTHS[FAN.CURRENT_MONTH];
  const enTemp = FAN.PRODUCTS.filter(p=>FAN.estadoTemporada(p)==='temporada').length;
  const term  = FAN.PRODUCTS.filter(p=>FAN.estadoTemporada(p)==='terminando').length;
  const prox  = FAN.PRODUCTS.filter(p=>FAN.estadoTemporada(p)==='proximamente').length;

  return (
    <div className="relative overflow-hidden text-white" style={{ minHeight: 480 }}>
      {/* Fondo foto */}
      <img
        src="/bosque-logo.jpeg" alt="Bosque chiquitano"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ filter:'brightness(0.72) saturate(1.05)' }}
      />
      {/* Gradiente de profundidad */}
      <div className="absolute inset-0" style={{ background:'linear-gradient(160deg, rgba(10,30,14,0.55) 0%, rgba(10,30,14,0.25) 45%, rgba(10,30,14,0.6) 100%)' }} />
      {/* Textura de grano sutil */}
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize:'180px' }} />

      {/* Destellos decorativos */}
      <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(116,198,157,0.12) 0%, transparent 65%)', transform:'translate(30%,-30%)' }} />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(116,198,157,0.09) 0%, transparent 70%)', transform:'translate(-40%,40%)' }} />

      {/* Contenido */}
      <div className="relative z-10 px-6 sm:px-12 py-16 sm:py-20 flex flex-col justify-end h-full" style={{ minHeight: 480 }}>
        {/* Pill de mes */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#74C69D] animate-pulse" />
          <span className="text-[12px] font-semibold tracking-wide text-white/85 uppercase">{mes} · Actualizado</span>
        </div>

        <h1
          className="font-bold text-white leading-[1.05] mb-4"
          style={{ fontFamily:'var(--font-display)', fontSize:'clamp(26px, 5.5vw, 52px)' }}
        >
          Descubrí los sabores<br className="hidden sm:block" /> del bosque chiquitano
        </h1>

        <p className="text-white/75 text-[14px] sm:text-[16px] max-w-xl leading-relaxed mb-10">
          Productos, temporadas y comunidades conectadas en un solo lugar.<br className="hidden sm:block" />
          Una invitación a explorar un ecosistema vivo.
        </p>

        {/* Stats chips */}
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          {[
            { color:'#74C69D', n: enTemp, label:'en temporada' },
            { color:'#F4A261', n: term,   label:'terminando' },
            { color:'#7FD0E2', n: prox,   label:'próximamente' },
          ].map(({ color, n, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 backdrop-blur-sm border border-white/15"
              style={{ background:'rgba(255,255,255,0.1)' }}
            >
              <span className="text-[22px] sm:text-[28px] font-bold leading-none" style={{ fontFamily:'var(--font-display)', color }}>{n}</span>
              <span className="text-[11px] sm:text-[12px] text-white/70 leading-tight max-w-[4rem]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Dashboard: variante A — filtro por temporada + secciones por estado ---------- */
function DashVariantSecciones({ onOpen }){
  const [estado, setEstado] = useState('todos');
  const filtrando = estado !== 'todos';
  const filtrados = FAN.PRODUCTS.filter(p => FAN.estadoTemporada(p) === estado);

  const grupos = [
    ['temporada',   'En temporada ahora',         'Listos para tu menú este mes'],
    ['terminando',  'Aprovechá antes de que termine', 'Últimas semanas de cosecha'],
    ['proximamente','Próximamente',                'Planificá con anticipación'],
    ['fuera',       'Fuera de temporada',          'Vuelven más adelante en el año'],
  ];

  return (
    <div className="space-y-8">
      {/* Filtros */}
      <div className="relative -mx-1 px-1">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 flex-nowrap min-w-max pb-1">
            {[['todos','Todos'],['temporada','En temporada'],['terminando','Terminando'],['proximamente','Próximamente'],['fuera','Fuera de temporada']].map(([v,l])=>{
              const n = v==='todos' ? FAN.PRODUCTS.length : FAN.PRODUCTS.filter(p=>FAN.estadoTemporada(p)===v).length;
              const active = estado===v;
              return (
                <button
                  key={v}
                  onClick={()=>setEstado(v)}
                  className="h-9 px-4 rounded-full text-[13px] font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap shrink-0 border"
                  style={active
                    ? { background:'#1a2c1e', color:'#fff', borderColor:'#1a2c1e', boxShadow:'0 4px 14px rgba(26,44,30,0.25)' }
                    : { background:'#fff', color:'#6b756c', borderColor:'#E4EAE5' }
                  }
                >
                  {v!=='todos' && <span className="w-2 h-2 rounded-full shrink-0" style={{ background:FAN.ESTADOS[v].dot }} />}
                  {l}
                  <span className="text-[11px] font-bold tabular-nums opacity-60">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 sm:hidden" style={{ background:'linear-gradient(to left, #F9FAF8, transparent)' }} />
      </div>

      {/* Resultados */}
      {filtrando ? (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background:FAN.ESTADOS[estado].dot }} />
            <h3 className="text-[20px] font-bold text-[#1a2c1e] tracking-tight" style={{ fontFamily:'var(--font-display)' }}>
              {FAN.ESTADOS[estado].label}
            </h3>
            <span className="ml-auto text-[13px] font-medium text-[#9aa79d] tabular-nums">{filtrados.length}</span>
          </div>
          {filtrados.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtrados.map(p=> <ProductCard key={p.id} product={p} onOpen={onOpen} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-[#9aa79d]">No hay productos en este estado ahora mismo.</div>
          )}
        </section>
      ) : (
        <div className="space-y-12">
          {grupos.map(([est, titulo, sub]) => {
            const items = FAN.PRODUCTS.filter(p=>FAN.estadoTemporada(p)===est);
            if(!items.length) return null;
            const e = FAN.ESTADOS[est];
            return (
              <section key={est}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background:e.dot }} />
                  <h3 className="text-[18px] font-bold text-[#1a2c1e] tracking-tight" style={{ fontFamily:'var(--font-display)' }}>{titulo}</h3>
                  <span className="text-[13px] text-[#a0b09e] hidden sm:block">· {sub}</span>
                  <span className="ml-auto text-[13px] font-medium text-[#9aa79d] tabular-nums">{items.length}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map(p=> <ProductCard key={p.id} product={p} onOpen={onOpen} />)}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Dashboard: variante B — cuadrícula compacta con filtro ---------- */
function DashVariantCompacta({ onOpen }){
  const [filtro, setFiltro] = useState('todos');
  const tabs = [
    { value:'todos',        label:'Todos' },
    { value:'temporada',    label:'En temporada', icon:'leaf' },
    { value:'terminando',   label:'Terminando' },
    { value:'proximamente', label:'Próximamente' }
  ];
  const items = FAN.PRODUCTS
    .filter(p=> filtro==='todos' || FAN.estadoTemporada(p)===filtro)
    .sort((a,b)=>{ const ord={temporada:0,terminando:1,proximamente:2,fuera:3}; return ord[FAN.estadoTemporada(a)]-ord[FAN.estadoTemporada(b)]; });
  return (
    <div>
      <div className="overflow-x-auto -mx-1 px-1 mb-6"><SegTabs tabs={tabs} value={filtro} onChange={setFiltro} /></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
        {items.map(p=> <ProductCard key={p.id} product={p} onOpen={onOpen} compact />)}
      </div>
    </div>
  );
}

/* ---------- Dashboard: variante C — línea de tiempo 12 meses ---------- */
function DashVariantTimeline({ onOpen }){
  const cur = FAN.CURRENT_MONTH;
  const ordered = [...FAN.PRODUCTS].sort((a,b)=>{
    const ord={temporada:0,terminando:1,proximamente:2,fuera:3};
    return ord[FAN.estadoTemporada(a)]-ord[FAN.estadoTemporada(b)];
  });
  return (
    <Card className="p-0 overflow-hidden rounded-3xl border border-[#E4EAE5]" style={{ boxShadow:'0 2px 12px rgba(27,50,24,0.06)' }}>
      <div className="overflow-x-auto">
        <div style={{ minWidth:720 }}>
          <div className="grid sticky top-0 bg-[#FAFBF8] z-10 border-b border-[#EDF0EB]" style={{ gridTemplateColumns:'180px repeat(12, 1fr)' }}>
            <div className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-[#9aa79d]">Producto</div>
            {FAN.MONTHS_SHORT.map((m,i)=>(
              <div key={i} className={cn('py-3.5 text-center text-[11.5px] font-semibold', i===cur?'text-[#1a2c1e]':'text-[#b0bab2]')}>
                {m}
                {i===cur && <div className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] mx-auto mt-1" />}
              </div>
            ))}
          </div>
          {ordered.map(p=>{
            const est = FAN.estadoTemporada(p);
            return (
              <button key={p.id} onClick={()=>onOpen(p)}
                className="grid w-full text-left items-center hover:bg-[#F5F8F5] transition border-b border-[#F0F4EF] last:border-0 group"
                style={{ gridTemplateColumns:'180px repeat(12, 1fr)' }}
              >
                <div className="px-4 py-3 flex items-center gap-2.5 min-w-0">
                  <ProductGlyph product={p} size={32} rounded="rounded-xl" />
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[#1a2c1e] truncate" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{p.nombre}</div>
                    <StatusBadge estado={est} size="sm" />
                  </div>
                </div>
                {FAN.MONTHS_SHORT.map((_,i)=>{
                  const on = p.m.includes(i);
                  const ei = FAN.estadoTemporada(p,i);
                  const col = on ? FAN.ESTADOS[ei==='fuera'?'temporada':ei].dot : null;
                  return (
                    <div key={i} className="px-1.5 py-3 flex justify-center">
                      <div className="w-full rounded-full" style={{ height:8, background:col||'#EEF1EC', outline:i===cur?'2px solid #2D6A4F35':'none', outlineOffset:2, borderRadius:6 }} />
                    </div>
                  );
                })}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

/* ---------- Barra de beneficios del suscriptor ---------- */
function SubscriberBenefitsBar({ onNav }){
  const me = FAN.ME_SUSCRIPTOR;
  return (
    <div className="mx-0 bg-gradient-to-r from-[#1a2c1e] to-[#2D6A4F] px-6 sm:px-10 py-4 sm:py-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <span className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white shrink-0">
            <Icon name="badge" size={20} />
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-bold text-white flex items-center gap-2.5">
              Hola, {me.nombre.split(' ')[0]}
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white/90">Suscriptor activo</span>
            </div>
            <div className="text-[12.5px] text-white/65 mt-0.5">{me.intereses.length} productos en seguimiento · {me.alertasRecibidas} alertas recibidas</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm" className="rounded-xl !bg-white/15 !text-white !border-white/20 hover:!bg-white/25" onClick={()=>onNav('mi-suscripcion')}>
            <Icon name="heart" size={14} />Mis intereses
          </Button>
          <Button size="sm" className="rounded-xl !bg-white !text-[#1a2c1e]" onClick={()=>onNav('perfil')}>
            <Icon name="user" size={14} />Mi perfil
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sección personalizada "Para ti" (suscriptor) ---------- */
function ParaTiSection({ onOpen }){
  const me = FAN.ME_SUSCRIPTOR;
  const items = me.intereses.map(FAN.getProduct).filter(Boolean);
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 rounded-2xl bg-[#E8F5EE] flex items-center justify-center text-[#2D6A4F]">
          <Icon name="sparkles" size={16} />
        </span>
        <h3 className="text-[20px] font-bold text-[#1a2c1e] tracking-tight" style={{ fontFamily:'var(--font-display)' }}>Para ti</h3>
        <span className="text-[13px] text-[#9aa79d] hidden sm:block">· según tus productos en seguimiento</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(p=>{
          const est = FAN.estadoTemporada(p);
          return (
            <button key={p.id} onClick={()=>onOpen(p)}
              className="group text-left bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
              style={{ boxShadow:'0 2px 12px rgba(27,50,24,0.07)', border:'1.5px solid #D8E8DC' }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow='0 14px 36px rgba(27,50,24,0.13)'}
              onMouseLeave={e=>e.currentTarget.style.boxShadow='0 2px 12px rgba(27,50,24,0.07)'}
            >
              <div className="relative h-40 overflow-hidden" style={{ background:`linear-gradient(145deg, ${p.color}22 0%, ${p.color}10 100%)` }}>
                <ProductGlyph product={p} full />
                <div className="absolute inset-0 pointer-events-none" style={{ background:'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 55%)' }} />
                <div className="absolute top-3 left-3"><StatusBadge estado={est} size="sm" /></div>
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/85 flex items-center justify-center text-[#2D6A4F] shadow-sm opacity-70 group-hover:opacity-100 transition">
                  <Icon name="heart" size={13} />
                </div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-[#1a2c1e] text-[14.5px]" style={{ fontFamily:'var(--font-display)' }}>{p.nombre}</div>
                <div className="text-[12px] text-[#7a8f7d] mt-1.5 leading-snug">
                  {est==='temporada'     ?'Disponible ahora':
                   est==='terminando'    ?'Última oportunidad':
                   est==='proximamente'  ?'Llega pronto':'Te avisamos cuando vuelva'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Pantalla Dashboard ---------- */
function ScreenDashboard({ onOpen, variant='secciones', onNav, subscriber=false }){
  return (
    <div id="dashboard" className="space-y-10">
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 sm:-mt-9">
        <DashHero />
        {subscriber && <SubscriberBenefitsBar onNav={onNav} />}
      </div>
      {subscriber && <ParaTiSection onOpen={onOpen} />}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <SectionTitle title="Disponibilidad por producto" desc="17 productos del bosque chiquitano y la amazonía norte de Bolivia." />
        <Button variant="secondary" onClick={()=>onNav('catalogo')} className="rounded-xl">
          Ver catálogo completo<Icon name="arrowRight" size={16} />
        </Button>
      </div>
      {variant==='secciones'   && <DashVariantSecciones onOpen={onOpen} />}
      {variant==='compacta'    && <DashVariantCompacta  onOpen={onOpen} />}
      {variant==='timeline'    && <DashVariantTimeline  onOpen={onOpen} />}
    </div>
  );
}

/* ---------- Catálogo con filtros ---------- */
function ScreenCatalogo({ onOpen }){
  const [q,      setQ]      = useState('');
  const [cat,    setCat]    = useState('Todas');
  const [estado, setEstado] = useState('todos');
  const [vista,  setVista]  = useState('grid');

  const cats  = ['Todas', ...Array.from(new Set(FAN.PRODUCTS.map(p=>p.categoria)))];
  const items = FAN.PRODUCTS.filter(p=>{
    const mq = !q || (p.nombre+p.cientifico+p.desc).toLowerCase().includes(q.toLowerCase());
    const mc = cat==='Todas' || p.categoria===cat;
    const me = estado==='todos' || FAN.estadoTemporada(p)===estado;
    return mq && mc && me;
  });

  return (
    <div id="catalogo" className="space-y-7">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-6">
        <SectionTitle overline="Catálogo" title="Explora los productos del bosque" desc="Filtrá por categoría, temporada o buscá por nombre." />
        <div className="hidden lg:block w-96 lg:mt-12">
          <Input icon="search" placeholder="Buscar producto…" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
      </div>

      {/* Búsqueda mobile */}
      <div className="lg:hidden">
        <Input icon="search" placeholder="Buscar producto…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      {/* Categorías + toggle vista */}
      <div className="flex items-center gap-3">
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max">
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)}
                className="h-9 px-4 rounded-xl text-[13px] font-semibold border transition-all whitespace-nowrap"
                style={ cat===c
                  ? { background:'#1a2c1e', color:'#fff', borderColor:'#1a2c1e', boxShadow:'0 4px 12px rgba(26,44,30,0.2)' }
                  : { background:'#fff', color:'#5e6b60', borderColor:'#E4EAE5' }
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex gap-1 bg-[#EEF2EE] p-1 rounded-xl shrink-0">
          <button onClick={()=>setVista('grid')} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition', vista==='grid'?'bg-white shadow-sm text-[#2D6A4F]':'text-[#8a948a]')}><Icon name="grid" size={15} /></button>
          <button onClick={()=>setVista('list')} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition', vista==='list'?'bg-white shadow-sm text-[#2D6A4F]':'text-[#8a948a]')}><Icon name="list" size={15} /></button>
        </div>
      </div>

      {/* Filtros de temporada */}
      <div className="flex items-center gap-2 flex-wrap">
        {[['todos','Todos'],['temporada','En temporada'],['terminando','Terminando'],['proximamente','Próximamente'],['fuera','Fuera']].map(([v,l])=>(
          <button key={v} onClick={()=>setEstado(v)}
            className="h-8 px-3.5 rounded-full text-[12.5px] font-medium border transition flex items-center gap-1.5 whitespace-nowrap"
            style={ estado===v
              ? { borderColor:'#2D6A4F', background:'#EAF5EF', color:'#1B5036', fontWeight:700 }
              : { borderColor:'#E4EAE5', color:'#6b756c', background:'#fff' }
            }
          >
            {v!=='todos' && <span className="w-2 h-2 rounded-full" style={{ background:FAN.ESTADOS[v].dot }} />}
            {l}
          </button>
        ))}
        <span className="text-[12.5px] text-[#9aa79d] ml-auto">{items.length} resultado{items.length!==1?'s':''}</span>
      </div>

      {/* Resultados */}
      {items.length===0 ? (
        <div className="text-center py-20 text-[#9aa79d]">
          <Icon name="search" size={30} className="mx-auto mb-3 opacity-40" />
          <p className="text-[14px]">No se encontraron productos con esos filtros.</p>
        </div>
      ) : vista==='grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(p=> <ProductCard key={p.id} product={p} onOpen={onOpen} />)}
        </div>
      ) : (
        <div className="rounded-3xl border border-[#E4EAE5] bg-white overflow-hidden" style={{ boxShadow:'0 2px 12px rgba(27,50,24,0.06)' }}>
          {items.map(p=>{
            const est = FAN.estadoTemporada(p);
            return (
              <button key={p.id} onClick={()=>onOpen(p)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#F5F8F5] transition text-left border-b border-[#F0F4EF] last:border-0 group"
              >
                <ProductGlyph product={p} size={48} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[#1a2c1e] text-[14px]" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{p.nombre}</div>
                  <div className="text-[12px] text-[#8a948a] truncate mt-0.5">{p.tipo}</div>
                </div>
                <StatusBadge estado={est} size="sm" />
                <Icon name="chevronRight" size={17} className="text-[#c2cbc3] group-hover:translate-x-0.5 transition" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Recetario (datos) ---------- */
const RECETAS = [
  {
    id: 'ande-chiquitano',
    titulo: 'ANDE CHIQUITANO',
    autores: 'J. Zeballos, P. Aiarachi, M. Aguilar, Y. Dorado, E. Pérez y M. Fernández (Grupo 2, Instituto CEFIM)',
    imagen: '/recetario/ANDE%20CHIQUITANO.png',
    ingredientes: {
      filete: ['500 g de carne de llama','25 g de harina de yuca','30 g de almendra chiquitana','Vinagre','Aceite'],
    },
    preparacion: ['Preparar el filete de llama con la harina de yuca y almendra chiquitana. Sazonar con vinagre y aceite al gusto.'],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'ceviche-tarwi-almendra',
    titulo: 'CEVICHE DE TARWI CON LECHE DE ALMENDRA CHIQUITANA',
    autores: 'E. Caupi, C. Condarco, M. Cepiz, N. Velasco, M. Taha (Grupo 1, Instituto CEFIM)',
    imagen: '/recetario/CEVICHE%20DE%20TARWI%20CON%20LECHE%20DE%20ALMENDRA%20CHIQUITANA.png',
    ingredientes: {
      leche: ['200 g de motacú','10 g de almendra chiquitana','200 ml de agua hervida'],
      tarwi: ['80 g de mote de tarwi','½ limón','1 rama de cilantro','Sal al gusto','K\'oa (para ahumar)'],
      decoracion: ['Chilto','Almendra chiquitana picada','Hojas de cilantro']
    },
    preparacion: [
      'Procesar el motacú y la almendra chiquitana con agua hervida. Filtrar y reservar para la leche.',
      'En una olla colocar k\'oa, quemar y colocar el tarwi, tapar la olla y ahumar unos minutos.',
      'Mezclar el tarwi ahumado con el jugo de limón, cilantro picado finamente, sal a gusto y la leche de motacú y almendra previamente reservada.',
      'Emplatar y decorar con hojas de cilantro, chilto y almendra chiquitana picada.'
    ],
    notas: 'Imagen provista en public/recetario.'
  },
  {
    id: 'choka-aji-almendra',
    titulo: "CH´OKA Y AJÍ DE ALMENDRA CHIQUITANA",
    autores: 'R. Muñecas, A. Cruz, M. Mendoza, D. Canedo, G. Chevez, C. Camacho (Grupo 4, Instituto CEFIM)',
    imagen: '/recetario/CH%C2%B4OKA%20Y%20AJ%C3%8D%20DE%20ALMENDRA%20CHIQUITANA.png',
    ingredientes: {
      choka: ['1 pierna de ch\'oka','Hierbas aromáticas (perejil, romero, cilantro)','20 g de maicena','1 huevo','30 g de harina de yuca','Abundante aceite para fritura'],
      salsa: ['80 g de almendra chiquitana','1 ají amarillo en vaina','½ cebolla morada','Sal y pimienta'],
      pastelChuño: ['60 g de chuño remojado','1 huevo','1 diente de ajo','Sal y pimienta']
    },
    preparacion: [
      'Para la ch\'oka: Sellar la ch\'oka en una cacerola; colocar en olla a presión con abundante agua y bouquet garni. Cocinar 30 minutos.',
      'Pasar por maicena, huevo y harina de yuca; freír en abundante aceite.',
      'Para la salsa de ají de almendra: Brasear o asar la vaina de ají; licuar con la cebolla, la almendra chiquitana, sal y pimienta.',
      'Pasar la mezcla a una cacerola y cocinar a fuego medio hasta obtener textura adecuada.',
      'Para el pastel de chuño: Licuar el chuño y el ajo con un poco de agua; filtrar y salpimentar.',
      'Integrar con el huevo batido; colocar en bandeja enmantequillada y hornear a 160ºC por 30–35 minutos.'
    ],
    notas: 'Imagen en public/recetario tal como indicó el usuario.'
  },
  {
    id: 'chancho-pasoca-mangaba',
    titulo: 'CHANCHO RELLENO DE PASOCA CON SALSA DE MANGABA Y CERVEZA',
    autores: 'M. Meneces, Y. Bernal, F. Montaño, A. Flores, C. Rojas, M. López y otros (Grupos 2 y 3, Instituto Tatapy)',
    imagen: '/recetario/CHANCHO%20RELLENO%20DE%20PASOCA%20CON%20SALSA%20DE%20MANGABA%20Y%20CERVEZA.png',
    ingredientes: {
      carne: ['1 lomo de cerdo','2 cdas de mostaza','1 cda de ajo en polvo','1 cda de pimienta negra molida','1 cdta de sal','Cordel para bridar'],
      relleno: ['1½ taza de harina de yuca','¼ taza de pasas','¼ taza de aceitunas verdes sin semilla','200 g de charque cocido y deshilachado','4 cdas de mantequilla'],
      salsa: ['1½ taza de pulpa de mangaba','1½ taza de cerveza oscura','6 cdas de azúcar','1 cebolla morada pequeña','2 dientes de ajo','5 g de jengibre fresco','4 cdas de salsa soya','Mantequilla al gusto','Maicena al gusto']
    },
    preparacion: [
      'Para el relleno: Hidratar las pasas por 30 minutos.',
      'En un sartén colocar la mantequilla a fuego medio; agregar el charque y la harina de yuca.',
      'Retirar del fuego y agregar las pasas y las aceitunas. Reservar.',
      'Para la carne: Cortar el lomo de cerdo en una sola lámina de 1–2 cm de grosor con mucho cuidado.',
      'Condimentar con sal, pimienta, ajo y comino por un lado; colocar el relleno sobre el lado condimentado.',
      'Envolver y bridar con cordel; untar la mostaza y hornear a 170ºC por ~35 minutos.',
      'Para la salsa: Picar la cebolla y el ajo; rehogar con mantequilla a fuego medio.',
      'Agregar jengibre rallado y azúcar; añadir la cerveza, la pulpa de mangaba y la salsa soya.',
      'Condimentar y espesar con maicena diluida si es necesario; servir sobre el rollo de cerdo en láminas.'
    ],
    notas: 'Imagen en public/recetario tal como indicó el usuario.'
  },
  {
    id: 'crema-chuno',
    titulo: 'CREMA DE CHUÑO',
    autores: 'R. Muñecas, A. Cruz, M. Mendoza, D. Canedo, G. Chevez y C. Camacho (Grupo 4, Instituto CEFIM)',
    imagen: '/recetario/CREMA%20DE%20CHU%C3%91O.png',
    ingredientes: {
      fondo: ['200 g de charque','1 zanahoria pequeña','1 cebolla morada pequeña','1 rama de apio','1 rama de perejil','1 rama de hierbabuena','1 rama de k´oa'],
      crema: ['250 g de chuño sancochado','30 g de crema de leche','10 g de mantequilla','Sal, pimienta y comino'],
      decoracion: ['Harina de yuca','Aceite de oliva aromatizado con k´oa','Charque desmenuzado y frito']
    },
    preparacion: [
      'En una cacerola, añadir los ingredientes del fondo con 500 ml de agua, llevar a fuego medio y dejar reducir para extraer sabores y aromas.',
      'Cocinar el chuño previamente remojado hasta que adquiera un color más oscuro. Licuar el chuño cocido con la mitad del fondo hasta obtener una mezcla suave y homogénea.',
      'Verter la mezcla licuada en una olla; agregar la crema de leche y la mantequilla, salpimentar. Dejar hervir a fuego medio por 15 minutos.',
      'Emplatar con harina de yuca, charque por encima y poner unas gotas de aceite de k´oa.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'crema-totai-cuy',
    titulo: 'CREMA DE TOTAÍ EN BASE DE CUY',
    autores: 'M. Concha, C. Mendoza, M. Cayú, N. Mendoza, W. Conraddy, S. Loza y A. Hinojosa (Grupo 3, Instituto CEFIM)',
    imagen: '/recetario/CREMA%20DE%20TOTA%C3%8D%20EN%20BASE%20DE%20CUY.png',
    ingredientes: {
      lista: ['300 ml de fondo de cuy','1 zanahoria','1 pimiento morrón pequeño','1 puño de habas peladas','200 g de harina de totaí','3 papas medianas','2 dientes de ajo','½ cebolla morada','1 tallo de apio','2 hojas de laurel','Orégano, sal, agua']
    },
    preparacion: [
      'Llevar todo a una cacerola para su cocción.',
      'Retirar del fuego y dejar enfriar.',
      'Filtrar y procesar lo sólido agregando lo necesario de jugo hasta lograr una consistencia cremosa.',
      'Llevar nuevamente a fuego bajo y remover constantemente por alrededor de 15 minutos.',
      'Servir caliente.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'ensalada-totai-manga-almendra',
    titulo: 'ENSALADA CHIQUITANA DE TOTAÍ, MANGA VERDE Y ALMENDRA CHIQUITANA',
    autores: 'J. Canedo y C. Camacho',
    imagen: '/recetario/ENSALADA CHIQUITANA DE TOTAÍ, MANGA VERDE Y ALMENDRA CHIQUITANA.png',
    ingredientes: {
      lista: ['2 mangas verdes (pintonas)','1 cebolla blanca grande','10 totaíses, pelados y despepados (sin semilla)','10 almendras chiquitanas remojadas y peladas','Zumo de 2 limones grandes','Aceite vegetal de buena calidad','Vinagre','Sal y pimienta']
    },
    preparacion: [
      'Pelar las mangas y cortarlas en julianas.',
      'Picar la cebolla en pluma y remojar en abundante agua.',
      'Picar los totaíses en julianas.',
      'Laminar las almendras y tostarlas.',
      'Preparar una vinagreta con zumo de limón, aceite, vinagre, sal y pimienta.',
      'En un bowl colocar los ingredientes y aliñarlos con la vinagreta.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'fricase-pollo-almendra',
    titulo: 'FRICASÉ DE POLLO Y ALMENDRA CHIQUITANA',
    autores: 'J. Zeballos, P. Aiarachi, M. Aguilar, Y. Dorado, E. Pérez y M. Fernández (Grupo 2, Instituto CEFIM)',
    imagen: '/recetario/FRICAS%C3%89%20DE%20POLLO%20Y%20ALMENDRA%20CHIQUITANA.png',
    ingredientes: {
      lista: ['2 presas de pollo (pierna y entrepierna)','1 zanahoria','3 dientes de ajo','Sal, pimienta, comino','2 ajíes amarillos en vaina','1 puñado de almendra chiquitana pelada','200 g de chuño remojado','300 g de mote','1 rama de hierbabuena']
    },
    preparacion: [
      'Sellar las presas de pollo.',
      'Sofreír el ajo picado y la zanahoria rallada; agregar el ají amarillo procesado y salpimentar.',
      'Aromatizar con la hierbabuena; agregar la almendra chiquitana procesada con agua y dejar cocinar durante 30 minutos.',
      'Acompañar con chuño cocido y mote.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'lomo-llama-asai-racacha-totai',
    titulo: 'LOMO DE LLAMA EN SALSA DE ASAÍ CON PURÉ DE RACACHA Y TOTAÍ',
    autores: 'M. Concha, C. Mendoza, M. Cayú, N. Mendoza, W. Conraddy, S. Loza, A. Hinojosa (Grupo 3, Instituto CEFIM)',
    imagen: '/recetario/LOMO%20DE%20LLAMA%20EN%20SALSA%20DE%20ASA%C3%8D%20CON%20PUR%C3%89%20DE%20RACACHA%20Y%20TOTA%C3%8D.png',
    ingredientes: {
      carne: ['200 g de lomo de llama','Sal, pimienta, comino, aceite'],
      pure: ['2 racachas cocidas','60 g de harina de totaí','5 g de urucú','Aceite'],
      salsa: ['100 g de pulpa de asaí','Fondo de llama','Sal, pimienta, comino']
    },
    preparacion: [
      'Para la carne: Condimentar el lomo de llama con sal, pimienta y comino; asar en sartén con un chorro de aceite.',
      'Para el puré de racacha y totaí: Teñir aceite con urucú a fuego bajo; pasar la racacha por un colador y mezclar con la harina de totaí, aceite de urucú y agua; remover hasta textura deseada; salpimentar.',
      'Para la salsa de asaí: Colocar la pulpa de asaí y agregar fondo de llama hasta alcanzar textura deseada; salpimentar y añadir una pizca de comino.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'pacumutu-llama-aji-almendra',
    titulo: 'PACUMUTU DE LLAMA Y AJÍ DE ALMENDRA CHIQUITANA',
    autores: 'R. Muñecas, A. Cruz, M. Mendoza, D. Canedo, G. Chevez y C. Camacho (Grupo 4, Instituto CEFIM)',
    imagen: '/recetario/PACUMUTU DE LLAMA Y AJÍ DE ALMENDRA CHIQUITANA.png',
    ingredientes: {
      pacumutu: ['200 g de filete de llama','½ pimiento morrón','½ cebolla morada','2 dientes de ajo','Sal, pimienta','Pinchos de madera'],
      ají: ['40 g de almendra chiquitana','1 ají amarillo en vaina','10 g de cebolla braseada','Pimienta y sal']
    },
    preparacion: [
      'Cortar el filete de llama en cubos de 3–4 cm; cortar la cebolla y el pimiento en cubos similares.',
      'En un recipiente combinar los insumos y adobar con ajo picado, sal y pimienta.',
      'Insertar en pinchos de madera (previamente remojados) intercalando los ingredientes.',
      'Asar los pacumutus en sartén o parrilla hasta punto deseado.',
      'Para el ají: procesar los ingredientes, filtrar y cocinar a fuego medio hasta obtener la textura deseada; servir los pacumutus bañados con la salsa.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'ravioles-paiche-pesto-almendra',
    titulo: 'RAVIOLES DE PAICHE CON SALSA PESTO DE ALMENDRA CHIQUITANA',
    autores: 'N. Calustro, E. Moreito, R. Cuevas, R. Tuco, P. Céspedes, N. Mendoza y otros (Grupo 1, Instituto Tatapy)',
    imagen: '/recetario/RAVIOLES DE PAICHE CON SALSA PESTO DE ALMENDRA CHIQUITANA.png',
    ingredientes: {
      pasta: ['200 g de harina dura de trigo','50 g de harina de almendra chiquitana','2 huevos enteros','2 cdas de aceite de oliva','Pizca de sal'],
      relleno: ['400 g de filete de paiche cocido con guarniciones aromáticas','6 tallos de perejil','5 tallos de cebolla de verdeo','8 cdas de nata fresca','Sal y pimienta'],
      pesto: ['1 taza de almendras chiquitanas crudas, remojadas y peladas','½ taza de aceite de oliva','4 manojos de hojas de albahaca','10 dientes de ajo pelados y remojados','1½ taza de queso parmesano rallado','Sal y pimienta']
    },
    preparacion: [
      'Para la pasta: Mezclar harina de trigo, harina de almendra, huevos, sal y aceite; integrar hasta formar masa y dejar reposar 1 hora cubierta.',
      'Para el relleno: Procesar el paiche cocido con perejil y nata; agregar la cebolla de verdeo picada; salpimentar y reservar.',
      'Para la salsa pesto: Tostar ligeramente las almendras en aceite; picar albahaca, ajo y almendra tostada; mezclar con aceite de oliva y luego integrar el queso parmesano; salpimentar.',
      'Estirar la masa y formar ravioles rellenando con la mezcla de paiche; cocinar en agua hirviendo hasta que floten (~20–30 seg).',
      'Saltear los ravioles brevemente en la salsa pesto caliente y servir con queso parmesano rallado y un chorro de aceite de oliva.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'sopa-almendra-llama',
    titulo: 'SOPA DE ALMENDRA CHIQUITANA Y LLAMA',
    autores: 'M. Concha, C. Mendoza, M. Cayú, N. Mendoza, W. Conraddy, S. Loza, A. Hinojosa (Grupo 3, Instituto CEFIM)',
    imagen: '/recetario/SOPA DE ALMENDRA CHIQUITANA Y LLAMA.png',
    ingredientes: {
      lista: ['3 papas','1 cebolla mediana','1 tallo de apio','2 zanahorias medianas','150 g de almendra chiquitana','200 g de carne de llama','Fondo de llama (caldo donde coció la llama)']
    },
    preparacion: [
      'En una cacerola con un chorrito de aceite, colocar la carne de llama troceada, la cebolla, el apio y una zanahoria picados para sellar.',
      'Poner todo en una olla a presión con abundante agua y cocinar 30 minutos.',
      'Filtrar el fondo y reservar.',
      'Procesar la almendra chiquitana.',
      'Picar la zanahoria restante y las papas en julianas e incorporar, junto con la almendra procesada, al fondo reservado.',
      'Cocinar hasta que las verduras estén tiernas y servir caliente.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'tartar-trucha-almendra',
    titulo: 'TARTAR DE TRUCHA Y ALMENDRA CHIQUITANA',
    autores: 'R. Muñecas, A. Cruz, M. Mendoza, D. Canedo, G. Chevez, C. Camacho (Grupo 4, Instituto CEFIM)',
    imagen: '/recetario/TARTAR DE TRUCHA Y ALMENDRA CHIQUITANA.png',
    ingredientes: {
      trucha: ['120 g de trucha limpia','½ limón','12 almendras chiquitanas','½ cda de aceite de oliva','Sal y pimienta','Hojas de k´oa'],
      emulsion: ['70 g de tarwi','3 cdas de aceite de oliva','Zumo de ½ limón','Pimienta y sal']
    },
    preparacion: [
      'Mezclar aceite de oliva, zumo de limón, hojas de k´oa, sal y pimienta; incorporar la trucha picada en cubos muy pequeños y refrigerar 1 hora cubierta.',
      'Pelar y picar las almendras en trozos pequeños para agregar al tartar minutos antes de servir.',
      'Para la emulsión: pelar el tarwi, procesar en licuadora e integrar poco a poco el aceite, el limón, sal y pimienta hasta emulsionar.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'tierra-viva-crema-almendra',
    titulo: 'TIERRA VIVA (CREMA DE ALMENDRA CHIQUITANA)',
    autores: 'J. Zeballos, P. Aiarachi, M. Aguilar, Y. Dorado, E. Pérez y M. Fernández (Grupo 2, Instituto CEFIM)',
    imagen: '/recetario/TIERRA VIVA (CREMA DE ALMENDRA CHIQUITANA).png',
    ingredientes: {
      lista: ['400 g de almendra chiquitana','1 cebolla morada','2 dientes de ajo','2 ramas de perejil','1 pimiento morrón','1 cdta de comino','1 cdta de pimienta','1 ají amarillo en vaina','1 zanahoria','100 ml de crema de leche','1 cda de mantequilla','2 litros de fondo de verduras','2 cdas de maicena','Aceite','1 papa mediana, llullucha, amaranto']
    },
    preparacion: [
      'Licuar la cebolla, el ajo, el pimiento morrón, la zanahoria y los condimentos; llevar a rehogar.',
      'Agregar 2 litros de fondo de verduras y hervir 20–25 minutos.',
      'Agregar la almendra procesada con agua, la crema de leche, la mantequilla y la maicena diluida; dejar hervir a fuego bajo hasta que espese.',
      'Añadir la crema de almendras; servir acompañado de papas fritas, llullucha cruda troceada y amaranto tostado.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'pescado-motacu',
    titulo: 'PESCADO CON SALSA DE SEMILLAS DE MOTACÚ',
    autores: 'J. Canedo y C. Camacho',
    imagen: '/recetario/PESCADO CON SALSA DE SEMILLAS DE MOTACÚ.png',
    ingredientes: {
      pescado: ['4 filetes de paiche (~200 g cada uno)','Zumo de 3 limones grandes','8 dientes de ajo','1 manojo de cilantro','Aceite vegetal de buena calidad'],
      verduras: ['1 cebolla morada','1 morrón rojo','1 morrón verde','2 cdas de pasta de tomate'],
      motacu: ['1 taza de semilla de motacú (remojada) + ¼ taza para decorar','Sal, pimienta y comino al gusto']
    },
    preparacion: [
      'Marinar los filetes de paiche con parte del zumo de limón, 4 dientes de ajo picados, sal, pimienta y comino por ~30 minutos.',
      'Licuar una taza de semillas de motacú remojadas; filtrar y reservar la leche.',
      'Rehogar la cebolla, la pasta de tomate y los morrones cortados en juliana; añadir el resto del ajo y sofreír un minuto más.',
      'Verter la leche de motacú y calentar; agregar los filetes y cocer ~5 minutos por lado.',
      'Incorporar el resto del zumo de limón, la semilla de motacú rallada y el cilantro picado; integrar y servir con arroz blanco y plátano verde frito.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'pollo-majo-almendra',
    titulo: 'POLLO CON SALSA DE MAJO Y ALMENDRA CHIQUITANA',
    autores: 'J. Canedo y C. Camacho',
    imagen: '/recetario/POLLO CON SALSA DE MAJO Y ALMENDRA CHIQUITANA.png',
    ingredientes: {
      pollo: ['1 pollo troceado','2 cebollas moradas grandes','6 dientes de ajo','30 almendras chiquitanas crudas, remojadas y peladas','1 taza de vino blanco','1 taza de leche de majo','Manteca o aceite','Sal, pimienta y comino al gusto']
    },
    preparacion: [
      'Trocear el pollo y condimentar con sal, pimienta y comino.',
      'Sellar la carne en una olla con aceite o manteca y reservar.',
      'Hacer un ahogado con las cebollas y los ajos picados en cubitos en la misma olla.',
      'Verter el vino y luego la leche de majo; tapar y bajar el fuego al mínimo.',
      'Laminar las almendras y tostarlas en sartén; incorporarlas a la preparación.',
      'Servir acompañado de arroz y yuca.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'pato-pipian-almendra',
    titulo: 'PATO CON SALSA PIPIÁN DE ALMENDRA CHIQUITANA',
    autores: 'J. Canedo y C. Camacho',
    imagen: '/recetario/PATO CON SALSA PIPIÁN DE ALMENDRA CHIQUITANA.png',
    ingredientes: {
      pato: ['1 pato troceado','Caldo para cocer el pato (manteca, 1 cebolla morada, 2 tallos de apio, 2 zanahorias, laurel y pimienta en grano)'],
      pipian: ['500 g de almendra chiquitana tostada','8 dientes de ajo','3 cebollas moradas','3 morrones rojos','5 ajíes dulces','Sal, pimienta molida, comino','Manteca de urucú'],
      acompanamiento: ['Arroz y yuca para acompañar']
    },
    preparacion: [
      'Hervir el pato en una olla con un poco de manteca y abundante agua. Una vez cocida la carne, retirar el pato, cernir y reservar el caldo.',
      'Picar las cebollas moradas, los dientes de ajo, los morrones y el ají dulce y hacer un ahogado con la manteca de urucú.',
      'Licuar los 500 g de almendra chiquitana con el caldo de pato y reservar.',
      'Cuando las verduras estén translúcidas, licuarlas con el caldo de pato y volver a colocar en la olla junto a la almendra procesada.',
      'Poner a fuego bajo y agregar las piezas de pato, sal, pimienta, comino y caldo necesario hasta integrar sabores.',
      'Servir con arroz blanco y yuca cocida o frita.'
    ],
    notas: 'Imagen en public/recetario.'
  },
  {
    id: 'paiche-frito-asaí',
    titulo: 'PAICHE FRITO EN SALSA AGRIDULCE DE ASAÍ',
    autores: 'Comunidad Porvenir (taller desarrollado en la comunidad Porvenir, Bajo Paraguá)',
    imagen: '/recetario/PAICHE FRITO EN SALSA AGRIDULCE DE ASAÍ.png',
    ingredientes: {
      paiche: ['1 kg de paiche','4 dientes de ajo','1 cda de orégano seco','2 cdas de vinagre de frutas','Sal, pimienta y comino al gusto','Harina y maicena para rebozar','Aceite para freír'],
      salsa: ['1 cebolla morada','4 dientes de ajo','300 g de papaya pintona','2 tazas de pulpa de asaí','2 cdas de vinagre de frutas','Sal, pimienta y comino al gusto']
    },
    preparacion: [
      'Trocear el paiche en cubos de ~2 cm y marinar con ajo picado, orégano, vinagre, pimienta, comino y sal (40 minutos o idealmente 12 horas).',
      'Mezclar harina con maicena, sal y pimienta; rebozar los trozos de paiche y freír en abundante aceite caliente.',
      'Para la salsa: picar cebolla y ajos; rehogar en aceite hasta translúcidos; agregar papaya rallada, pulpa de asaí, vinagre y condimentar; cocinar a fuego bajo hasta integrar.',
      'Servir la salsa sobre el pescado frito; acompañar con plátano y yuca frita si se desea.'
    ],
    notas: 'Imagen en public/recetario.'
  }
];

/* ---------- Detalle de receta ---------- */
function RecipeDetail({ receta, onClose }){
  if(!receta) return null;

  useEffect(()=>{
    if(!receta) return;
    const t = setTimeout(()=>{
      const el = document.querySelector('.recipe-modal');
      try{ if(el){ el.scrollTo?.(0,0); el.scrollTop=0; } else { window.scrollTo?.(0,0); } }catch(e){}
    }, 60);
    return ()=>{ clearTimeout(t); };
  }, [receta]);

  const titulo = receta.titulo.charAt(0) + receta.titulo.slice(1).toLowerCase();
  const nPasos = receta.preparacion.length;
  const nIngCats = Object.keys(receta.ingredientes).length;
  const notaUtil = receta.notas && !receta.notas.startsWith('Imagen') && !receta.notas.startsWith('Receta provista');

  return (
    <Modal open={!!receta} onClose={onClose} size="lg" className="p-0 recipe-modal" skipSidebar={true} fullWidth={true}>
      {/* Hero foto */}
      <div className="relative w-full overflow-hidden bg-[#0e1e10]" style={{ height:'45vh', minHeight:260, maxHeight:500 }}>
        <img
          src={receta.imagen || '/bosque-logo.jpeg'} alt={receta.titulo}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter:'brightness(0.68) saturate(1.1) contrast(1.04)' }}
          onError={e=>{ e.target.src='/bosque-logo.jpeg'; }}
        />
        {/* Gradientes */}
        <div className="absolute inset-0 pointer-events-none" style={{ background:'linear-gradient(180deg, rgba(0,0,0,0) 15%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.72) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background:'rgba(12,30,15,0.18)' }} />

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#3a4f41] shadow-md transition"
        >
          <Icon name="arrowLeft" size={17} />
        </button>

        {/* Título sobre imagen */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-10 pt-6">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/55 mb-2">Recetario FAN</div>
          <h2
            className="text-[24px] sm:text-[32px] font-bold text-white leading-tight"
            style={{ fontFamily:'var(--font-display)', lineHeight:1.08 }}
          >
            {titulo}
          </h2>
        </div>
      </div>

      {/* Tarjeta de contenido flotante */}
      <div className="relative z-10 max-w-[900px] mx-auto -mt-5 px-4 sm:px-8 pb-12">
        <div className="bg-white rounded-3xl p-6 sm:p-9" style={{ boxShadow:'0 8px 48px rgba(14,30,16,0.12)' }}>

          {/* Autores + stats */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-7 pb-7 border-b border-[#EEF2EE]">
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF5EF] flex items-center justify-center shrink-0">
                <Icon name="users" size={17} className="text-[#2D6A4F]" />
              </div>
              <div className="min-w-0">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa79d] mb-1">Elaborada por</div>
                <div className="text-[13px] text-[#48524a] leading-snug">{receta.autores}</div>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              {[[nPasos,'pasos','clock'],[nIngCats,'secciones','leaf']].map(([n,u,ic])=>(
                <div key={u} className="flex items-center gap-2 bg-[#F5FAF7] border border-[#E5EFE8] rounded-2xl px-4 py-3">
                  <Icon name={ic} size={14} className="text-[#2D6A4F]" />
                  <span className="text-[14px] font-bold text-[#1a2c1e]">{n}</span>
                  <span className="text-[11.5px] text-[#9aa79d]">{u}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredientes */}
          <div className="mb-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2D6A4F] mb-4 flex items-center gap-2">
              <Icon name="leaf" size={12} />Ingredientes
            </h4>
            <div className={cn('grid gap-3', nIngCats===1?'grid-cols-1':nIngCats===2?'sm:grid-cols-2':'sm:grid-cols-3')}>
              {Object.entries(receta.ingredientes).map(([k,list])=>(
                <div key={k} className="bg-[#F8FBF8] border border-[#EBF0EB] rounded-2xl p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#2D6A4F] mb-3 capitalize">{k==='lista'?'Lista de ingredientes':k}</div>
                  <ul className="space-y-2">
                    {list.map((it,i)=>(
                      <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#48524a] leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#74C69D] shrink-0 mt-1.5" />{it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Preparación */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2D6A4F] mb-5 flex items-center gap-2">
              <Icon name="clock" size={12} />Preparación
            </h4>
            <ol className="space-y-4">
              {receta.preparacion.map((paso,i)=>(
                <li key={i} className="flex gap-4">
                  <span
                    className="w-7 h-7 rounded-full text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background:'linear-gradient(135deg, #2D6A4F, #52a87a)' }}
                  >
                    {i+1}
                  </span>
                  <span className="text-[14px] text-[#48524a] leading-relaxed pt-0.5">{paso}</span>
                </li>
              ))}
            </ol>
          </div>

          {notaUtil && (
            <div className="mt-7 border-t border-[#EEF2EE] pt-4 flex items-start gap-2 text-[11.5px] text-[#aab1a6]">
              <Icon name="info" size={12} className="text-[#c2cbc3] mt-0.5 shrink-0" />
              <span>{receta.notas}</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Pantalla Recetario ---------- */
function ScreenRecetario(){
  const [recetas, setRecetas] = useState(RECETAS);
  const [open,    setOpen]    = useState(null);
  const [query,   setQuery]   = useState('');

  useEffect(()=>{
    fetch('http://localhost:3001/api/recetas?estado=publicada')
      .then(r=>r.ok?r.json():null)
      .then(data=>{ if(data?.recetas?.length>0) setRecetas(data.recetas); })
      .catch(()=>{});
  }, []);

  const recetasFiltradas = recetas.filter(r=>{
    const ingredientesTexto = r.ingredientes ? Object.values(r.ingredientes).flat().join(' ') : '';
    const texto = `${r.titulo} ${r.autores||''} ${ingredientesTexto}`.toLowerCase();
    return texto.includes(query.trim().toLowerCase());
  });

  return (
    <div id="recetario" className="space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <SectionTitle overline="Recetario" title="Recetario del bosque" desc="Recetas desarrolladas con chefs e institutos de gastronomía del chiquitano." />
        <div className="w-full lg:w-[380px] shrink-0">
          <label className="sr-only">Buscar receta</label>
          <div className="relative">
            <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa79d] pointer-events-none" />
            <input
              value={query}
              onChange={e=>setQuery(e.target.value)}
              placeholder="Buscar receta, autor o ingrediente…"
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-[#E4EAE5] bg-white text-[14px] text-[#1a2c1e] placeholder:text-[#b0bab2] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/15 focus:border-[#2D6A4F]/50 transition"
              style={{ boxShadow:'0 1px 4px rgba(27,50,24,0.05)' }}
            />
          </div>
        </div>
      </div>

      {/* Grid de recetas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {recetasFiltradas.map(r=>(
          <button
            key={r.id}
            onClick={()=>setOpen(r)}
            className="group text-left bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
            style={{ boxShadow:'0 2px 10px rgba(27,50,24,0.06)' }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow='0 12px 32px rgba(27,50,24,0.12)'}
            onMouseLeave={e=>e.currentTarget.style.boxShadow='0 2px 10px rgba(27,50,24,0.06)'}
          >
            <div className="h-40 bg-[#EEF2EE] overflow-hidden relative">
              <img
                src={r.imagen} alt={r.titulo}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ filter:'brightness(1.02) contrast(1.02) saturate(1.04)' }}
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background:'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 100%)' }} />
              {/* Hover overlay */}
              <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition">
                <Icon name="arrowRight" size={14} className="text-[#1a2c1e]" />
              </div>
            </div>
            <div className="p-4">
              <div className="font-bold text-[#1a2c1e] text-[13.5px] leading-snug line-clamp-2" style={{ fontFamily:'var(--font-display)' }}>
                {r.titulo.charAt(0)+r.titulo.slice(1).toLowerCase()}
              </div>
              <div className="text-[11.5px] text-[#8a948a] mt-1.5 line-clamp-1">{r.autores}</div>
            </div>
          </button>
        ))}
      </div>

      {recetasFiltradas.length===0 && (
        <div className="rounded-3xl border border-[#E4EAE5] bg-white p-8 text-center">
          <Icon name="search" size={26} className="mx-auto mb-3 text-[#c2cbc3]" />
          <p className="text-[14px] text-[#8a948a]">No encontré recetas con ese texto.</p>
        </div>
      )}

      <RecipeDetail receta={open} onClose={()=>setOpen(null)} />
    </div>
  );
}

/* ============================================================
   FANNY — Asistente culinario con IA (exclusivo suscriptores)
   ============================================================ */
const FANI_API_URL = 'http://localhost:3001/api/fani/consultar';

function FANIEmptyState(){
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 h-full">
      <div
        className="w-[76px] h-[76px] rounded-3xl flex items-center justify-center mb-5 shadow-lg"
        style={{ background:'linear-gradient(135deg, #1B5036 0%, #52a87a 100%)' }}
      >
        <Icon name="bot" size={34} className="text-white" />
      </div>
      <h3 className="text-[18px] font-bold text-[#1a2c1e] mb-2" style={{ fontFamily:'var(--font-display)' }}>
        FANNY está lista para ayudarte
      </h3>
      <p className="text-[13.5px] text-[#8a948a] max-w-sm leading-relaxed">
        Seleccioná los productos del bosque que tenés disponibles y FANNY te sugerirá recetas del recetario FAN.
      </p>
      <div className="mt-7 grid grid-cols-3 gap-3 w-full max-w-[300px]">
        {[['leaf','17 productos','del bosque'],['book','20 recetas','del recetario'],['sparkles','IA Groq','tiempo real']].map(([icon,label,sub])=>(
          <div key={label} className="bg-white rounded-2xl border border-[#E8EBE6] p-3.5 flex flex-col items-center gap-2" style={{ boxShadow:'0 2px 8px rgba(27,50,24,0.05)' }}>
            <span className="w-9 h-9 rounded-xl bg-[#EAF5EF] flex items-center justify-center text-[#2D6A4F]">
              <Icon name={icon} size={16} />
            </span>
            <span className="text-[11px] font-bold text-[#1a2c1e]">{label}</span>
            <span className="text-[10px] text-[#9aa79d]">{sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FANILoading(){
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 h-full">
      <div className="relative mb-6">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg"
          style={{ background:'linear-gradient(135deg, #1B5036, #52a87a)' }}
        >
          <Icon name="sparkles" size={28} className="text-white animate-pulse" />
        </div>
        <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-[#74C69D] border-2 border-white flex items-center justify-center">
          <Icon name="loader" size={12} className="text-white animate-spin" />
        </div>
      </div>
      <h3 className="text-[16px] font-bold text-[#1a2c1e] mb-1.5" style={{ fontFamily:'var(--font-display)' }}>Consultando el recetario…</h3>
      <p className="text-[13px] text-[#8a948a] max-w-xs">FANNY está identificando las mejores recetas para tus ingredientes</p>
      <div className="mt-6 flex gap-2">
        {[0,1,2].map(i=>(
          <div key={i} className="w-2 h-2 rounded-full bg-[#2D6A4F]" style={{ animation:`ping 1.2s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

function FANIRecipeCard({ receta, onOpen, index }){
  const titulo = receta.titulo.charAt(0) + receta.titulo.slice(1).toLowerCase();
  return (
    <button
      onClick={()=>onOpen(receta)}
      className="group w-full text-left bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 flex"
      style={{ boxShadow:'0 2px 10px rgba(27,50,24,0.06)', border:'1px solid #E8EBE6' }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow='0 8px 24px rgba(27,50,24,0.11)'}
      onMouseLeave={e=>e.currentTarget.style.boxShadow='0 2px 10px rgba(27,50,24,0.06)'}
    >
      <div className="relative w-24 h-24 shrink-0 overflow-hidden bg-[#EEF2EE]">
        <img
          src={receta.imagen} alt={receta.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e=>{ e.target.src='/bosque-logo.jpeg'; }}
        />
        <div
          className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background:'linear-gradient(135deg,#1B5036,#52a87a)' }}
        >
          <span className="text-[10px] font-bold text-white">{index+1}</span>
        </div>
      </div>
      <div className="flex-1 p-3.5 min-w-0">
        <div className="text-[13px] font-bold text-[#1a2c1e] leading-snug mb-1" style={{ fontFamily:'var(--font-display)' }}>{titulo}</div>
        <div className="text-[11px] text-[#8a948a] line-clamp-2 leading-relaxed">{receta.autores}</div>
        <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#2D6A4F]">
          <Icon name="book" size={11} />Ver receta
          <Icon name="chevronRight" size={11} className="group-hover:translate-x-0.5 transition" />
        </div>
      </div>
    </button>
  );
}

function FANIResult({ result, onOpenRecipe }){
  return (
    <div className="space-y-5" style={{ animation:'fadeIn .3s ease' }}>
      {/* Bubble de FANNY */}
      <div className="bg-gradient-to-br from-[#EAF5EF] to-[#E5F4EC] border border-[#C8E2D2] rounded-3xl p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background:'linear-gradient(135deg,#1B5036,#52a87a)' }}
          >
            <Icon name="sparkles" size={14} className="text-white" />
          </div>
          <span className="text-[14px] font-bold text-[#1B5036]">FANNY</span>
          {result.demo && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4A261]/20 text-[#b05a10] border border-[#F4A261]/30">Demo</span>
          )}
        </div>
        <div className="text-[13.5px] text-[#3a4f41] leading-relaxed whitespace-pre-line">{result.explicacion}</div>
      </div>

      {/* Ingredientes consultados */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-bold text-[#b0bab2] uppercase tracking-wider">Consultado:</span>
        {result.ingredientesConsultados.map(ing=>(
          <span key={ing} className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-white border border-[#E4EAE5] text-[11px] font-medium text-[#5e6b60]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#74C69D]" />{ing}
          </span>
        ))}
      </div>

      {/* Recetas */}
      {result.recetas && result.recetas.length > 0 ? (
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-7 h-7 rounded-xl bg-[#EAF5EF] flex items-center justify-center text-[#2D6A4F]">
              <Icon name="book" size={14} />
            </span>
            <h4 className="text-[14px] font-bold text-[#1a2c1e]">
              {result.recetas.length === 1 ? 'Receta sugerida' : `${result.recetas.length} recetas sugeridas`}
            </h4>
          </div>
          <div className="space-y-3">
            {result.recetas.map((r,i)=><FANIRecipeCard key={r.id} receta={r} onOpen={onOpenRecipe} index={i} />)}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E4EAE5] p-6 text-center">
          <Icon name="search" size={24} className="mx-auto mb-2 text-[#c2cbc3]" />
          <p className="text-[13px] text-[#8a948a]">No se encontraron recetas exactas. Probá agregar algún producto FAN del bosque.</p>
        </div>
      )}
    </div>
  );
}

function FANILocked({ onNav }){
  const features = [
    ['bot',      'IA culinaria',       'Sugerencias personalizadas basadas en tus ingredientes disponibles'],
    ['book',     'Recetario completo', '20 recetas del bosque chiquitano creadas con chefs e institutos de gastronomía'],
    ['sparkles', 'Productos FAN',      'Aprendé a usar almendra chiquitana, asaí, motacú, totaí y más en tu cocina'],
    ['heart',    'Personalizado',      'Basado en los productos que seguís y tu perfil culinario'],
  ];
  const preview = [
    { q:'¿Qué puedo hacer con almendra chiquitana?', a:'Podés preparar un pesto de almendra chiquitana con hierbas del bosque…' },
    { q:'Dame una receta con asaí para un restaurante.', a:'Te sugiero un ceviche de palmito con reducción de asaí y leche de tigre…' },
  ];

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center py-8">
      <div className="max-w-5xl mx-auto w-full">

        {/* Encabezado */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 overflow-hidden border border-[#E4EAE5]" style={{ boxShadow:'0 2px 8px rgba(27,50,24,0.07)' }}>
            <img src="/LOGO/LogoIA.png" alt="FANI IA" className="w-full h-full object-contain p-1.5" />
          </div>
          <div>
            <div className="text-[20px] font-bold text-[#1a2c1e]" style={{ fontFamily:'var(--font-display)' }}>FANNY · Asistente culinario del bosque</div>
            <div className="text-[12.5px] text-[#8a948a]">Inteligencia artificial aplicada a los productos del bosque chiquitano</div>
          </div>
          <span className="ml-auto flex items-center gap-1.5 bg-[#EEF2EE] text-[#2D6A4F] px-3.5 py-2 rounded-full text-[11px] font-bold shrink-0">
            <Icon name="lock" size={11} />Solo suscriptores
          </span>
        </div>

        {/* Layout 2 columnas */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-5 items-stretch">

          {/* Hero verde con preview */}
          <div
            className="relative overflow-hidden rounded-3xl text-white flex flex-col"
            style={{ minHeight:420, background:'linear-gradient(145deg, #122018 0%, #1B5036 40%, #2D6A4F 100%)' }}
          >
            {/* Decoración */}
            <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(116,198,157,0.1) 0%, transparent 70%)' }} />
            <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(116,198,157,0.08) 0%, transparent 70%)', transform:'translate(35%,35%)' }} />

            <div className="relative z-10 p-8 lg:p-10 flex-1 flex flex-col">
              <p className="text-[15px] lg:text-[16px] text-white/85 leading-relaxed mb-8 max-w-lg">
                Descubrí qué recetas podés preparar con los productos del bosque chiquitano. FANNY usa IA para sugerirte recetas del recetario FAN personalizadas para vos.
              </p>

              {/* Preview chat */}
              <div className="flex-1 flex flex-col gap-3 mb-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35 mb-1">Vista previa</div>
                {preview.map((m,i)=>(
                  <div key={i} className="flex flex-col gap-2">
                    <div className="self-end bg-white/15 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
                      <p className="text-[12.5px] text-white/90 leading-snug">{m.q}</p>
                    </div>
                    <div className="self-start bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[90%] flex gap-2.5 items-start" style={{ background:'rgba(255,255,255,0.07)' }}>
                      <Icon name="sparkles" size={13} className="text-[#74C69D] shrink-0 mt-0.5" />
                      <p className="text-[12px] text-white/70 leading-snug">{m.a}</p>
                    </div>
                  </div>
                ))}
                <div className="self-start flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10" style={{ background:'rgba(255,255,255,0.05)' }}>
                  <span className="flex gap-1">
                    {[0,150,300].map(delay=>(
                      <span key={delay} className="w-1.5 h-1.5 rounded-full bg-[#74C69D]/70 animate-bounce" style={{ animationDelay:`${delay}ms` }} />
                    ))}
                  </span>
                  <span className="text-[11.5px] text-white/35">FANNY está pensando…</span>
                </div>
              </div>

              {/* CTA */}
              <div>
                <button
                  onClick={()=>onNav('suscripcion')}
                  className="w-full h-13 py-3.5 rounded-2xl bg-white text-[#1a2c1e] text-[14.5px] font-bold flex items-center justify-center gap-2.5 hover:bg-[#f0faf5] transition"
                  style={{ boxShadow:'0 8px 24px rgba(0,0,0,0.2)' }}
                >
                  <Icon name="bell" size={17} />Suscribirme para acceder a FANNY
                </button>
                <p className="text-center text-[11.5px] text-white/35 mt-3">Gratis · alertas de temporada + acceso completo a FANNY</p>
              </div>
            </div>
          </div>

          {/* Columna derecha: features */}
          <div className="flex flex-col gap-3">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#9aa79d]">Qué incluye</div>
            {features.map(([icon,title,desc])=>(
              <div key={title}
                className="bg-white rounded-2xl border border-[#E4EAE5] p-5 flex items-start gap-4 hover:border-[#C8E2D2] transition"
                style={{ boxShadow:'0 1px 4px rgba(27,50,24,0.04)' }}
              >
                <span className="w-10 h-10 rounded-2xl bg-[#EAF5EF] flex items-center justify-center text-[#2D6A4F] shrink-0">
                  <Icon name={icon} size={18} />
                </span>
                <div className="min-w-0">
                  <div className="text-[14px] font-bold text-[#1a2c1e] leading-snug">{title}</div>
                  <div className="text-[12px] text-[#8a948a] mt-1 leading-snug">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FANIChat(){
  const [selected,    setSelected]    = useState([]);
  const [extras,      setExtras]      = useState('');
  const [loading,     setLoading]     = useState(false);
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState('');
  const [openReceta,  setOpenReceta]  = useState(null);

  const toggle  = id => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  const limpiar = () => { setSelected([]); setExtras(''); setResult(null); setError(''); };

  const consultar = async () => {
    const ingredientes = [
      ...selected.map(id=>FAN.getProduct(id)?.nombre).filter(Boolean),
      ...extras.split(',').map(s=>s.trim()).filter(Boolean),
    ];
    if(!ingredientes.length) return;
    setLoading(true); setResult(null); setError('');
    try {
      const res = await fetch(FANI_API_URL, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ingredientes }),
        signal: AbortSignal.timeout(28000),
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error);
      setResult(data);
    } catch(err) {
      setError(err?.message || 'No se pudo consultar a FANNY. Verificá el backend y la clave de Groq.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = (selected.length > 0 || extras.trim().length > 0) && !loading;

  return (
    <div className="space-y-6">
      {/* Cabecera FANNY */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white"
        style={{ background:'linear-gradient(145deg, #122018 0%, #1B5036 50%, #2D6A4F 100%)' }}
      >
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(116,198,157,0.12) 0%, transparent 70%)' }} />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Icon name="sparkles" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[22px] font-bold tracking-tight" style={{ fontFamily:'var(--font-display)' }}>FANNY</span>
                <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 uppercase tracking-widest">Beta</span>
              </div>
              <div className="text-[12px] text-white/65">Asistente culinario del bosque chiquitano</div>
            </div>
          </div>
          {(result || selected.length > 0 || extras.trim()) && (
            <button
              onClick={limpiar}
              className="flex items-center gap-1.5 text-[12px] text-white/65 hover:text-white px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              <Icon name="x" size={13} />Nueva consulta
            </button>
          )}
        </div>
        <p className="relative z-10 text-[13px] text-white/70 mt-3 max-w-xl leading-relaxed">
          Seleccioná los productos del bosque que tenés disponibles y consultame — te sugiero recetas del recetario FAN que podés preparar hoy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] gap-5 items-start">
        {/* Panel izquierdo: selector */}
        <div className="space-y-4">
          {/* Productos */}
          <div className="bg-white rounded-3xl border border-[#E4EAE5] p-5 space-y-4" style={{ boxShadow:'0 2px 10px rgba(27,50,24,0.05)' }}>
            <div>
              <h3 className="text-[15px] font-bold text-[#1a2c1e]" style={{ fontFamily:'var(--font-display)' }}>Productos del bosque</h3>
              <p className="text-[12px] text-[#9aa79d] mt-0.5">Tocá los que tenés disponibles</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {FAN.PRODUCTS.map(p=>{
                const isOn = selected.includes(p.id);
                const est  = FAN.estadoTemporada(p);
                return (
                  <button key={p.id} onClick={()=>toggle(p.id)}
                    className="flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[12px] font-semibold border transition-all"
                    style={ isOn
                      ? { background:'#1a2c1e', color:'#fff', borderColor:'#1a2c1e', boxShadow:'0 4px 10px rgba(26,44,30,0.2)' }
                      : { background:'#fff', color:'#5e6b60', borderColor:'#E4EAE5' }
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: isOn?'rgba(255,255,255,0.6)':FAN.ESTADOS[est].dot }} />
                    {p.nombre}
                    {isOn && <Icon name="check" size={11} className="opacity-75" stroke={2.5} />}
                  </button>
                );
              })}
            </div>
            {selected.length > 0 && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[12px] text-[#2D6A4F] font-semibold">{selected.length} seleccionado{selected.length!==1?'s':''}</span>
                <button onClick={()=>setSelected([])} className="text-[12px] text-[#9aa79d] hover:text-[#5e6b60] transition font-medium">Limpiar</button>
              </div>
            )}
          </div>

          {/* Otros ingredientes */}
          <div className="bg-white rounded-3xl border border-[#E4EAE5] p-5 space-y-3" style={{ boxShadow:'0 2px 10px rgba(27,50,24,0.05)' }}>
            <div>
              <h3 className="text-[14px] font-bold text-[#1a2c1e]">Otros ingredientes</h3>
              <p className="text-[12px] text-[#9aa79d] mt-0.5">Separalos con comas (opcional)</p>
            </div>
            <textarea
              value={extras}
              onChange={e=>setExtras(e.target.value)}
              placeholder="ej: huevo, cebolla, ajo, pollo, limón…"
              className="w-full h-24 px-4 py-3 rounded-2xl border border-[#E4EAE5] text-[13.5px] text-[#1a2c1e] placeholder:text-[#c0c8c1] resize-none focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/15 focus:border-[#2D6A4F]/50 transition"
              style={{ background:'#FAFCFA' }}
            />
          </div>

          {/* Botón consultar */}
          <button
            onClick={consultar}
            disabled={!canSubmit}
            className="w-full h-13 py-3.5 rounded-2xl text-[14.5px] font-bold flex items-center justify-center gap-2.5 transition-all"
            style={ canSubmit
              ? { background:'linear-gradient(135deg,#1a2c1e,#2D6A4F)', color:'#fff', boxShadow:'0 8px 24px rgba(26,44,30,0.3)' }
              : { background:'#EEF2EE', color:'#b0bab2', cursor:'not-allowed' }
            }
          >
            {loading
              ? <><Icon name="loader" size={18} className="animate-spin" />Consultando a FANNY…</>
              : <><Icon name="sparkles" size={18} />Consultar a FANNY</>
            }
          </button>
          {!canSubmit && !loading && (
            <p className="text-center text-[11.5px] text-[#b0bab2]">Seleccioná al menos un ingrediente para consultar</p>
          )}
        </div>

        {/* Panel derecho: resultados */}
        <div
          className="bg-white rounded-3xl border border-[#E4EAE5] min-h-[380px] overflow-hidden"
          style={{ boxShadow:'0 2px 10px rgba(27,50,24,0.05)' }}
        >
          {error && (
            <div className="p-5 bg-[#FEF3F2] border-b border-[#FECDCA] text-[#9A4D14] rounded-t-3xl">
              <div className="text-[14px] font-bold">No se pudo consultar a FANNY</div>
              <div className="text-[12.5px] mt-1 leading-relaxed">{error}</div>
            </div>
          )}
          {!result && !loading && !error && <FANIEmptyState />}
          {loading && <FANILoading />}
          {result && !loading && <div className="p-5"><FANIResult result={result} onOpenRecipe={setOpenReceta} /></div>}
        </div>
      </div>

      <RecipeDetail receta={openReceta} onClose={()=>setOpenReceta(null)} />
    </div>
  );
}

function ScreenFANI({ role, onNav }){
  if(role !== 'suscriptor') return <FANILocked onNav={onNav} />;
  return <FANIChat />;
}

window.PublicScreens = { ProductCard, ScreenDashboard, ScreenCatalogo, DashHero, ScreenRecetario };
Object.assign(window, { ProductCard, ScreenDashboard, ScreenCatalogo, ScreenRecetario, ScreenFANI, RECETAS, RecipeDetail });
