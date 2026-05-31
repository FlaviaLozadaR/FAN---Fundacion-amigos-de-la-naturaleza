/* ============================================================
   PLATAFORMA FAN — Experiencia pública (Visitante)
   ============================================================ */

/* ---------- Tarjeta de producto ---------- */
function ProductCard({ product, onOpen, compact=false }){
  const est = FAN.estadoTemporada(product);
  const e = FAN.ESTADOS[est];
  const prods = FAN.productoresDe(product.id);
  return (
    <button onClick={()=>onOpen(product)}
      className="group relative text-left bg-white rounded-2xl border border-[#E8EBE6] overflow-hidden shadow-[0_14px_40px_rgba(45,60,45,0.13)] hover:shadow-[0_22px_66px_rgba(45,60,45,0.22)] hover:border-[#cfdbd1] transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className={"relative " + (compact? 'h-28':'h-44') + " flex items-center justify-center overflow-hidden"} style={{ background:`linear-gradient(135deg, ${product.color}26, ${product.color}14)` }}>
        <ProductGlyph product={product} size={compact?52:60} full />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 22%, rgba(0,0,0,0.06) 100%)' }}></div>
        <div className="absolute top-2.5 left-2.5"><StatusBadge estado={est} size="sm" /></div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="font-semibold text-[#1f2a21] leading-snug" style={{ fontFamily:'var(--font-display)', fontSize: compact?15:16 }}>{product.nombre}</div>
        {/* Scientific name omitted from main cards; shown only in detail view */}
        <div className="mt-3 pt-3 border-t border-[#F0F2EE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px] text-[#6b756c]">
          <span className="flex items-center gap-1 min-w-0 flex-1">
            <Icon name="mapPin" size={13} className="shrink-0" />
            <span className="min-w-0 truncate">{FAN.ORIGENES[product.origen].nombre.replace('Bosque ','')}</span>
          </span>
          {prods.length>0 && (
            <span className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-1 rounded-full bg-[#EAF4EE] px-2.5 py-1 text-[#2D6A4F] font-medium sm:whitespace-nowrap">
              {prods.length} {prods.length===1?'productor':'productores'}
              <Icon name="chevronRight" size={13} className="group-hover:translate-x-0.5 transition" />
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
  const term = FAN.PRODUCTS.filter(p=>FAN.estadoTemporada(p)==='terminando').length;
  const prox = FAN.PRODUCTS.filter(p=>FAN.estadoTemporada(p)==='proximamente').length;
  return (
    <div
      className="relative overflow-hidden text-white px-4 sm:px-10 py-10 sm:py-16 min-h-[420px] sm:min-h-[560px]"
    >
      {/* background image (reduced brightness) */}
      <img src="/bosque-logo.jpeg" alt="Bosque" className="absolute inset-0 w-full h-full object-cover object-center" style={{ filter: 'brightness(0.78) saturate(0.98)' }} />
      {/* slightly stronger color overlay for readability (subtle) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D6A4F]/65 to-[#1c4d39]/40"></div>
      <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/5"></div>
      <div className="absolute -right-4 bottom-0 w-48 h-48 rounded-full bg-[#74C69D]/10"></div>
      <div className="absolute left-6 right-6 bottom-6 sm:bottom-12 max-w-3xl mx-auto z-10 text-left sm:text-left sm:left-12 sm:right-auto">
        <h1 className="text-[clamp(18px,5.2vw,34px)] font-semibold tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.06 }}>
          Descubrí los sabores del bosque chiquitano
        </h1>
        <p className="text-[13px] sm:text-[15px] text-white/80 mt-2 leading-relaxed max-w-xl">
          Productos, temporadas y comunidades conectadas en un solo lugar. Una invitación a explorar un ecosistema vivo a través de su esencia.
        </p>
        <div className="mt-6 flex items-center justify-start gap-6 w-full">
          {[
            ['#74C69D', enTemp, 'en temporada', 'temp.'],
            ['#F4A261', term, 'terminando pronto', 'term.'],
            ['#7FD0E2', prox, 'próximamente', 'próx.']
          ].map(([c, n, l, mobileLabel])=> (
            <div key={l} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-[19px] sm:text-[30px] font-semibold leading-none shrink-0" style={{ fontFamily:'var(--font-display)', color:c }}>{n}</span>
              <span className="text-[10px] sm:text-[13px] text-white/75 leading-tight">
                <span className="sm:hidden">{mobileLabel}</span>
                <span className="hidden sm:inline">{l}</span>
              </span>
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
  const filtrando = estado!=='todos';

  const filtrados = FAN.PRODUCTS.filter(p=> FAN.estadoTemporada(p)===estado);

  const grupos = [
    ['temporada','En temporada ahora','Listos para tu menú este mes'],
    ['terminando','Aprovecha antes de que termine','Últimas semanas de cosecha'],
    ['proximamente','Próximamente','Planifica con anticipación'],
    ['fuera','Fuera de temporada','Vuelven más adelante en el año']
  ];

  return (
    <div className="space-y-7">
      {/* FILTRO POR TEMPORADA */}
      <div className="-mx-1 px-1 relative">
        <div className="overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar">
          <div className="flex items-center gap-2 flex-nowrap min-w-max pb-1">
        {[['todos','Todos'],['temporada','En temporada'],['terminando','Terminando'],['proximamente','Próximamente'],['fuera','Fuera de temporada']].map(([v,l])=>{
          const n = v==='todos' ? FAN.PRODUCTS.length : FAN.PRODUCTS.filter(p=>FAN.estadoTemporada(p)===v).length;
          return (
            <button key={v} onClick={()=>setEstado(v)} className={cn('h-9 px-3.5 rounded-full text-[13px] font-medium border transition flex items-center gap-2 whitespace-nowrap shrink-0', estado===v?'border-[#2D6A4F] bg-[#E9F1EC] text-[#1B5036]':'border-[#E8EBE6] text-[#6b756c] hover:border-[#cfdbd1] bg-white')}>
              {v!=='todos' && <span className="w-2 h-2 rounded-full" style={{ background:FAN.ESTADOS[v].dot }}></span>}{l}
              <span className={cn('text-[11px] font-semibold tabular-nums', estado===v?'text-[#2D6A4F]':'text-[#aab1a6]')}>{n}</span>
            </button>
          );
        })}
          </div>
        </div>
        {/* visual hint: gradient + chevron on the right (mobile only) */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 flex items-center justify-center sm:hidden">
          <div className="absolute right-0 top-0 h-full w-10 scroll-indicator-gradient" aria-hidden="true"></div>
        </div>
      </div>

      {/* RESULTADOS FILTRADOS o SECCIONES POR ESTADO */}
      {filtrando ? (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background:FAN.ESTADOS[estado].dot }}></span>
            <h3 className="text-[19px] font-semibold text-[#1f2a21] tracking-tight shrink-0" style={{ fontFamily:'var(--font-display)', lineHeight:1.2 }}>{FAN.ESTADOS[estado].label}</h3>
            <span className="ml-auto text-[13px] font-medium text-[#6b756c] tabular-nums shrink-0">{filtrados.length}</span>
          </div>
          {filtrados.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {filtrados.map(p=> <ProductCard key={p.id} product={p} onOpen={onOpen} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-[#9aa79d]">No hay productos en este estado ahora mismo.</div>
          )}
        </section>
      ) : (
        <div className="space-y-9">
          {grupos.map(([est,titulo,sub])=>{
            const items = FAN.PRODUCTS.filter(p=>FAN.estadoTemporada(p)===est);
            if(!items.length) return null;
            const e = FAN.ESTADOS[est];
            return (
              <section key={est}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background:e.dot }}></span>
                  <h3 className="text-[19px] font-semibold text-[#1f2a21] tracking-tight shrink-0" style={{ fontFamily:'var(--font-display)', lineHeight:1.2 }}>{titulo}</h3>
                  <span className="text-[13px] text-[#9aa79d] truncate hidden sm:block">· {sub}</span>
                  <span className="ml-auto text-[13px] font-medium text-[#6b756c] tabular-nums shrink-0">{items.length}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
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
    { value:'todos', label:'Todos' },
    { value:'temporada', label:'En temporada', icon:'leaf' },
    { value:'terminando', label:'Terminando' },
    { value:'proximamente', label:'Próximamente' }
  ];
  const items = FAN.PRODUCTS.filter(p=> filtro==='todos' || FAN.estadoTemporada(p)===filtro)
    .sort((a,b)=>{ const ord={temporada:0,terminando:1,proximamente:2,fuera:3}; return ord[FAN.estadoTemporada(a)]-ord[FAN.estadoTemporada(b)]; });
  return (
    <div>
      <div className="overflow-x-auto -mx-1 px-1 mb-5"><SegTabs tabs={tabs} value={filtro} onChange={setFiltro} /></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 mt-6">
        {items.map(p=> <ProductCard key={p.id} product={p} onOpen={onOpen} compact />)}
      </div>
    </div>
  );
}

/* ---------- Dashboard: variante C — línea de tiempo 12 meses ---------- */
function DashVariantTimeline({ onOpen }){
  const cur = FAN.CURRENT_MONTH;
  const ordered = [...FAN.PRODUCTS].sort((a,b)=>{ const ord={temporada:0,terminando:1,proximamente:2,fuera:3}; return ord[FAN.estadoTemporada(a)]-ord[FAN.estadoTemporada(b)]; });
  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <div style={{ minWidth: 720 }}>
          {/* encabezado meses */}
          <div className="grid sticky top-0 bg-[#FBFCFA] z-10 border-b border-[#EDF0EB]" style={{ gridTemplateColumns:'180px repeat(12, 1fr)' }}>
            <div className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d]">Producto</div>
            {FAN.MONTHS_SHORT.map((m,i)=>(
              <div key={i} className={cn('py-3 text-center text-[12px] font-semibold', i===cur?'text-[#2D6A4F]':'text-[#9aa79d]')}>
                {m}{i===cur && <div className="w-1 h-1 rounded-full bg-[#2D6A4F] mx-auto mt-1"></div>}
              </div>
            ))}
          </div>
          {ordered.map(p=>{
            const est = FAN.estadoTemporada(p);
            return (
              <button key={p.id} onClick={()=>onOpen(p)} className="grid w-full text-left items-center hover:bg-[#F7FAF7] transition border-b border-[#F2F4F0] last:border-0 group" style={{ gridTemplateColumns:'180px repeat(12, 1fr)' }}>
                <div className="px-4 py-2.5 flex items-center gap-2.5 min-w-0">
                  <ProductGlyph product={p} size={32} rounded="rounded-lg" />
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold text-[#1f2a21] truncate" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{p.nombre}</div>
                    <div className="text-[10.5px] text-[#9aa79d]"><StatusBadge estado={est} size="sm" /></div>
                  </div>
                </div>
                {FAN.MONTHS_SHORT.map((_,i)=>{
                  const on = p.m.includes(i);
                  const ei = FAN.estadoTemporada(p,i);
                  const col = on ? FAN.ESTADOS[ei==='fuera'?'temporada':ei].dot : null;
                  return (
                    <div key={i} className="px-1.5 py-2.5 flex justify-center">
                      <div className="w-full rounded-full" style={{ height:10, background: col||'#EEF1EC', outline: i===cur?'2px solid #2D6A4F40':'none', outlineOffset:1 }}></div>
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
    <div className="relative overflow-hidden border border-[#cfe3d6] bg-gradient-to-r from-[#E9F1EC] to-[#EAF4EE] px-4 sm:px-6 py-4 sm:py-5" style={{ clipPath:'polygon(0 0, calc(100% - 34px) 0, 100% 50%, calc(100% - 34px) 100%, 0 100%, 34px 50%)' }}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="w-11 h-11 rounded-none bg-[#2D6A4F] flex items-center justify-center text-white shrink-0" style={{ clipPath:'polygon(18% 0, 82% 0, 100% 18%, 100% 82%, 82% 100%, 18% 100%, 0 82%, 0 18%)' }}><Icon name="badge" size={22} /></span>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-[#1B5036] flex items-center gap-2">Hola, {me.nombre.split(' ')[0]} <Badge className="bg-white/70 text-[#2D6A4F] rounded-none">Suscriptor activo</Badge></div>
            <div className="text-[13px] text-[#4f6356] mt-0.5">Tienes {me.intereses.length} productos en seguimiento · {me.alertasRecibidas} alertas recibidas</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm" className="rounded-none" onClick={()=>onNav('mi-suscripcion')}><Icon name="heart" size={15} />Mis intereses</Button>
          <Button size="sm" className="rounded-none" onClick={()=>onNav('perfil')}><Icon name="user" size={15} />Mi perfil</Button>
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
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-7 h-7 rounded-lg bg-[#E9F1EC] flex items-center justify-center text-[#2D6A4F]"><Icon name="sparkles" size={16} /></span>
        <h3 className="text-[19px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.2 }}>Para ti</h3>
        <span className="text-[13px] text-[#9aa79d] hidden sm:block">· según tus productos en seguimiento</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(p=>{
          const est = FAN.estadoTemporada(p);
          return (
            <button key={p.id} onClick={()=>onOpen(p)} className="group text-left bg-white rounded-2xl border border-[#cfe3d6] overflow-hidden shadow-[0_12px_36px_rgba(45,60,45,0.14)] hover:shadow-[0_22px_66px_rgba(45,60,45,0.20)] transition-all hover:-translate-y-0.5 flex flex-col ring-1 ring-[#2D6A4F]/5">
              <div className="relative h-36 sm:h-44 overflow-hidden" style={{ background:`linear-gradient(135deg, ${p.color}26, ${p.color}14)` }}>
                <ProductGlyph product={p} full />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 22%, rgba(0,0,0,0.05) 100%)' }}></div>
                <div className="absolute top-2.5 left-2.5"><StatusBadge estado={est} size="sm" /></div>
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-[#2D6A4F]"><Icon name="heart" size={13} /></div>
              </div>
              <div className="p-3.5">
                <div className="font-semibold text-[#1f2a21] text-[15px]" style={{ fontFamily:'var(--font-display)' }}>{p.nombre}</div>
                <div className="text-[12px] text-[#6b756c] mt-1.5">{est==='temporada'?'Disponible ahora — te avisamos':est==='terminando'?'Última oportunidad esta temporada':est==='proximamente'?'Llega el próximo mes':'Te avisaremos cuando vuelva'}</div>
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
    <div id="dashboard" className="space-y-8">
      <div className="space-y-0 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 sm:-mt-9">
        <DashHero />
        {subscriber && <SubscriberBenefitsBar onNav={onNav} />}
      </div>
      {subscriber && <ParaTiSection onOpen={onOpen} />}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <SectionTitle title="Disponibilidad por producto" desc="17 productos del bosque chiquitano y la amazonía norte de Bolivia." />
        <Button variant="secondary" onClick={()=>onNav('catalogo')}>Ver catálogo completo<Icon name="arrowRight" size={16} /></Button>
      </div>
      {variant==='secciones' && <DashVariantSecciones onOpen={onOpen} />}
      {variant==='compacta' && <DashVariantCompacta onOpen={onOpen} />}
      {variant==='timeline' && <DashVariantTimeline onOpen={onOpen} />}
    </div>
  );
}

/* ---------- Catálogo con filtros ---------- */
function ScreenCatalogo({ onOpen }){
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Todas');
  const [estado, setEstado] = useState('todos');
  const [vista, setVista] = useState('grid');
  const cats = ['Todas', ...Array.from(new Set(FAN.PRODUCTS.map(p=>p.categoria)))];
  const items = FAN.PRODUCTS.filter(p=>{
    const mq = !q || (p.nombre+p.cientifico+p.desc).toLowerCase().includes(q.toLowerCase());
    const mc = cat==='Todas' || p.categoria===cat;
    const me = estado==='todos' || FAN.estadoTemporada(p)===estado;
    return mq && mc && me;
  });
  return (
    <div id="catalogo" className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <SectionTitle overline="Catálogo" title="Explora los productos del bosque" desc="Filtra por categoría, temporada o busca por nombre." />
        <div className="hidden lg:block w-96 lg:mt-12">
          <Input icon="search" placeholder="Buscar producto…" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
      </div>

      {/* mobile: search shown below title; desktop uses header search */}
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="w-full"><Input icon="search" placeholder="Buscar producto…" value={q} onChange={e=>setQ(e.target.value)} /></div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max">
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)} className={cn('h-9 px-3.5 rounded-lg text-[13px] font-medium border transition whitespace-nowrap', cat===c?'bg-[#2D6A4F] text-white border-[#2D6A4F]':'bg-white text-[#5e6b60] border-[#E2E7DE] hover:border-[#bcc9bf]')}>{c}</button>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex gap-1.5 bg-[#EDF2ED] p-1 rounded-lg shrink-0">
          <button onClick={()=>setVista('grid')} className={cn('w-8 h-8 rounded-md flex items-center justify-center', vista==='grid'?'bg-white shadow-sm text-[#2D6A4F]':'text-[#8a948a]')}><Icon name="grid" size={16} /></button>
          <button onClick={()=>setVista('list')} className={cn('w-8 h-8 rounded-md flex items-center justify-center', vista==='list'?'bg-white shadow-sm text-[#2D6A4F]':'text-[#8a948a]')}><Icon name="list" size={16} /></button>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {[['todos','Todos'],['temporada','En temporada'],['terminando','Terminando'],['proximamente','Próximamente'],['fuera','Fuera']].map(([v,l])=>(
          <button key={v} onClick={()=>setEstado(v)} className={cn('h-8 px-3 rounded-full text-[12.5px] font-medium border transition flex items-center gap-1.5 whitespace-nowrap shrink-0', estado===v?'border-[#2D6A4F] bg-[#E9F1EC] text-[#1B5036]':'border-[#E8EBE6] text-[#6b756c] hover:border-[#cfdbd1]')}>
            {v!=='todos' && <span className="w-2 h-2 rounded-full" style={{ background:FAN.ESTADOS[v].dot }}></span>}{l}
          </button>
        ))}
        <span className="text-[13px] text-[#9aa79d] ml-auto">{items.length} resultado{items.length!==1?'s':''}</span>
      </div>
      {items.length===0 ? (
        <div className="text-center py-16 text-[#9aa79d]"><Icon name="search" size={28} className="mx-auto mb-3 opacity-50" />No se encontraron productos.</div>
      ) : vista==='grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {items.map(p=> <ProductCard key={p.id} product={p} onOpen={onOpen} />)}
        </div>
      ) : (
        <Card className="divide-y divide-[#F0F2EE] overflow-hidden">
          {items.map(p=>{
            const est = FAN.estadoTemporada(p);
            return (
              <button key={p.id} onClick={()=>onOpen(p)} className="w-full flex items-center gap-4 p-3.5 hover:bg-[#F7FAF7] transition text-left">
                <ProductGlyph product={p} size={48} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{p.nombre}</div>
                  <div className="text-[12px] text-[#8a948a] truncate">{p.tipo}</div>
                </div>
                <StatusBadge estado={est} size="sm" />
                <Icon name="chevronRight" size={18} className="text-[#c2cbc3]" />
              </button>
            );
          })}
        </Card>
      )}
    </div>
  );
}

/* ---------- Recetario (placeholder) ---------- */
const RECETAS = [
  {
    id: 'ande-chiquitano',
    titulo: 'ANDE CHIQUITANO',
    autores: 'J. Zeballos, P. Aiarachi, M. Aguilar, Y. Dorado, E. Pérez y M. Fernández (Grupo 2, Instituto CEFIM)',
    imagen: '/recetario/ANDE%20CHIQUITANO.png',
    ingredientes: {
      filete: ['500 g de carne de llama','25 g de harina de yuca','30 g de almendra chiquitana','Vinagre','Aceite'],
      ensalada: ['200 g de papalisa','½ cebolla morada','Perejil, cilantro, hierbabuena','1 tomate perita','50 g de cañahua','Aceite, sal, pimienta','Jugo de 1 limón'],
      pasoca: ['60 g de harina de yuca','1 zanahoria mediana','1 diente de ajo','1 pimiento morrón','Aceite, sal, agua']
    },
    preparacion: [
      'Filetear la llama, condimentar y reservar.',
      'Moler la almendra chiquitana tostada con harina de yuca, vinagre, aceite y agua.',
      'En un sartén caliente sellar la llama y pincelar constantemente con la mezcla de almendra chiquitana.',
      'Cocer la papalisa en agua hirviendo, dejar enfriar y cortar en rodajas.',
      'Picar la cebolla en pluma, el tomate en cuadros y las hierbas frescas finamente.',
      'Cocer la cañahua en agua hirviendo.',
      'Mezclar todo, salpimentar y agregar el zumo de limón.',
      'Remojar la harina de yuca con agua y sal, dejar reposar durante 5 minutos.',
      'Picar todas las verduras en cuadritos.',
      'Sofreír las verduras y mezclar con la harina de yuca.'
    ],
    notas: 'Receta provista por el usuario.'
  }
  ,{
    id: 'albongas-yuca-asai',
    titulo: 'ALBÓNDIGAS DE YUCA CON SALSA DE ASAÍ',
    autores: 'N. Calustro, E. Moreito, R. Cueva, R. Tuco, P. Céspedes, N. Mendoza, E. Masoi, E. Durán, Y. Bernal y R. Choque (Grupo 1, Instituto Tatapy)',
    imagen: '/recetario/ALB%C3%93NDIGAS%20DE%20YUCA%20CON%20SALSA%20DE%20ASA%C3%8D.png',
    ingredientes: {
      albondigas: ['½ kg de carne molida','1 huevo','1 cebolla morada pequeña','2 dientes de ajo','½ kg de yuca','½ taza de pan rallado','Pimienta, comino y sal al gusto','Manteca animal o aceite vegetal de buena calidad'],
      salsa: ['½ taza de pulpa de asaí','1 taza de fondo de res (caldo donde se coció la carne)','Maicena diluida','Sal, pimienta y comino al gusto']
    },
    preparacion: [
      'En un bowl colocar la carne, la yuca, la cebolla y los ajos picados. Luego el huevo, el pan rallado y los condimentos. Mezclar para integrar.',
      'Con las manos formar bolitas y freír en abundante materia grasa caliente.',
      'En una cacerola, colocar la pulpa de asaí con el fondo o caldo de res a fuego medio.',
      'Salpimentar y espesar la salsa con maicena diluida. Decorar con sésamo.'
    ],
    notas: 'Imagen pendiente por parte del usuario.'
  }
  ,{
    id: 'apanado-cuy-tunta',
    titulo: 'APANADO DE CUY CON TUNTA REBOZADA',
    autores: 'M. Concha, C. Mendoza, M. Cayú, N. Mendoza, W. Conraddy, S. Loza y A. Hinojosa (Grupo 3, Instituto CEFIM)',
    imagen: '/recetario/APANADO%20DE%20CUY%20CON%20TUNTA%20REBOZADA.png',
    ingredientes: {
      cuy: ['1 cuy mediano','40 g de tunta muralla','30 g de almendra chiquitana pelada','Pimienta, comino, singani, limón, sal','Harina de yuca, aceite'],
      phuti: ['100 g de tunta muralla remojada','30 g de almendra chiquitana pelada'],
      tabule: ['100 g de quinua cocida','½ pimiento morrón','20 g de almendra chiquitana tostada','1 zanahoria mediana','1 cebolla morada mediana','1 manojo de cilantro, 5 hojas de apio','1 tomate mediano','Jugo de 1 limón','20 ml de singani','5 g de ajo en polvo','50 ml de aceite de oliva, sal y pimienta']
    },
    preparacion: [
      'Llevar el cuy a una cocción en olla a presión para ablandar un poco (15-20 minutos). Retirar del fuego.',
      'Adobar con sal, pimienta, limón, un chorro de singani y comino.',
      'Empanizar con harina de yuca para una fritura profunda. Reservar.',
      'Cocinar la tunta pellizcada en agua hirviendo y luego colocarla en un sartén con la almendra chiquitana procesada para rebozar, agregando un chorro de aceite.',
      'Cocinar la quinua al dente.',
      'Saltear la zanahoria, cebolla y morrón picados en cuadritos pequeños, agregar sal y pimienta.',
      'Mezclar en frío la quinua con el salteado e incorporar el cilantro, las hojas de apio finamente picadas y el tomate picado.',
      'Sazonar con jugo de limón, aceite de oliva, ajo en polvo, sal, pimienta y un toque de singani.',
      'Picar la almendra para decorar.',
      'Mezclar muy bien todo y servir.'
    ],
    notas: 'Imagen proporcionada por el usuario en public/recetario.'
  }
  ,{
    id: 'ceviche-tarwi-leche-almendra',
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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
  }
  ,{
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

function RecipeDetail({ receta, onClose }){
  if(!receta) return null;
  useEffect(()=>{
    if(!receta) return;
    const t = setTimeout(()=>{
      const el = document.querySelector('.recipe-modal');
      try{ if(el){ el.scrollTo?.(0,0); el.scrollTop = 0; } else { window.scrollTo?.(0,0); } }catch(e){}
    }, 60);
    return ()=>{ clearTimeout(t); };
  }, [receta]);
  const titulo = receta.titulo.charAt(0) + receta.titulo.slice(1).toLowerCase();
  const nPasos = receta.preparacion.length;
  const nIngCats = Object.keys(receta.ingredientes).length;
  const notaUtil = receta.notas && !receta.notas.startsWith('Imagen') && !receta.notas.startsWith('Receta provista');

  return (
    <Modal open={!!receta} onClose={onClose} size="lg" className="p-0 recipe-modal" skipSidebar={true} fullWidth={true}>
      {/* Hero — ocupa el 45% de la pantalla */}
      <div className="relative w-full overflow-hidden bg-[#1a2a1e]" style={{ height:'45vh', minHeight:280, maxHeight:520 }}>
        <img src={receta.imagen || '/bosque-logo.jpeg'} alt={receta.titulo}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter:'brightness(0.72) saturate(1.15) contrast(1.05)' }}
          onError={e=>{ e.target.src='/bosque-logo.jpeg'; }} />
        {/* overlay inferior */}
        <div className="absolute inset-0 pointer-events-none" style={{ background:'linear-gradient(180deg,rgba(0,0,0,0) 20%,rgba(0,0,0,0.3) 60%,rgba(0,0,0,0.65) 100%)' }} />
        {/* overlay lateral derecho para zonas claras */}
        <div className="absolute inset-0 pointer-events-none" style={{ background:'linear-gradient(to right,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0) 40%,rgba(0,0,0,0.32) 100%)' }} />
        {/* tinte verde oscuro suave sobre todo */}
        <div className="absolute inset-0 pointer-events-none" style={{ background:'rgba(18,40,24,0.22)' }} />
        <button onClick={onClose} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-[#5e6b60] shadow-sm transition">
          <Icon name="arrowLeft" size={18} />
        </button>
        {/* Título encima de la imagen */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-12 pt-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65 mb-1.5">Recetario FAN</div>
          <h2 className="text-[26px] sm:text-[34px] font-semibold text-white leading-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.1 }}>{titulo}</h2>
        </div>
      </div>

      {/* Tarjeta blanca superpuesta */}
      <div className="relative z-10 max-w-[880px] mx-auto -mt-6 px-4 sm:px-8 pb-10">
        <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ boxShadow:'0 8px 48px rgba(18,30,18,0.13)' }}>

          {/* Autores + stats */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-[#F0F2EE]">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#E9F1EC] flex items-center justify-center shrink-0">
                <Icon name="users" size={16} className="text-[#2D6A4F]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9aa79d] mb-0.5">Elaborada por</div>
                <div className="text-[13px] text-[#48524a] leading-snug">{receta.autores}</div>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              {[[nPasos,'pasos','clock'],[nIngCats,'secciones','leaf']].map(([n,u,ic])=>(
                <div key={u} className="flex items-center gap-2 bg-[#F7FAF7] border border-[#EEF1EC] rounded-xl px-3.5 py-2.5">
                  <Icon name={ic} size={14} className="text-[#2D6A4F]" />
                  <span className="text-[13px] font-semibold text-[#1f2a21]">{n}</span>
                  <span className="text-[11.5px] text-[#9aa79d]">{u}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredientes */}
          <div className="mb-7">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-3 flex items-center gap-1.5">
              <Icon name="leaf" size={13} />Ingredientes
            </h4>
            <div className={cn('grid gap-3', nIngCats===1?'grid-cols-1':nIngCats===2?'sm:grid-cols-2':'sm:grid-cols-3')}>
              {Object.entries(receta.ingredientes).map(([k,list])=>(
                <div key={k} className="bg-[#FBFCFA] border border-[#EEF1EC] rounded-xl p-4">
                  <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#2D6A4F] mb-2.5 capitalize">{k}</div>
                  <ul className="space-y-1.5">
                    {list.map((it,i)=>(
                      <li key={i} className="flex items-start gap-2 text-[13px] text-[#48524a] leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#74C69D] shrink-0 mt-1.5"></span>{it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Preparación */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-4 flex items-center gap-1.5">
              <Icon name="clock" size={13} />Preparación
            </h4>
            <ol className="space-y-3.5">
              {receta.preparacion.map((paso,i)=>(
                <li key={i} className="flex gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white text-[12px] font-semibold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                  <span className="text-[14px] text-[#48524a] leading-relaxed pt-0.5">{paso}</span>
                </li>
              ))}
            </ol>
          </div>

          {notaUtil && (
            <div className="mt-6 border-t border-[#F0F2EE] pt-4 flex items-start gap-1.5 text-[11.5px] text-[#aab1a6]">
              <Icon name="info" size={12} className="text-[#9aa79d] mt-0.5 shrink-0" /><span>{receta.notas}</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function ScreenRecetario(){
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState('');
  const recetasFiltradas = RECETAS.filter(r => {
    const texto = `${r.titulo} ${r.autores} ${Object.values(r.ingredientes).flat().join(' ')}`.toLowerCase();
    return texto.includes(query.trim().toLowerCase());
  });
  return (
    <div id="recetario" className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <SectionTitle overline="Recetario" title="Recetario" desc="Seleccioná una receta para ver los detalles." />
        <div className="w-full lg:w-[360px] shrink-0">
          <label className="sr-only">Buscar receta</label>
          <div className="relative">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa79d]" />
            <input
              value={query}
              onChange={e=>setQuery(e.target.value)}
              placeholder="Buscar receta, autor o ingrediente"
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-[#E2E7DE] bg-white text-[14px] text-[#1f2a21] placeholder:text-[#9aa79d] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/15 focus:border-[#2D6A4F]/40"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {recetasFiltradas.map(r=> (
          <button key={r.id} onClick={()=>setOpen(r)} className="text-left bg-white rounded-2xl border border-[#E8EBE6] overflow-hidden shadow-[0_6px_20px_rgba(45,60,45,0.06)] hover:shadow-[0_10px_30px_rgba(45,60,45,0.08)] transition">
            <div className="h-36 bg-[#F3F6F3] flex items-center justify-center overflow-hidden relative">
              <img src={r.imagen} alt={r.titulo} className="w-full h-full object-cover" style={{ filter: 'brightness(1.04) contrast(1.03) saturate(1.05)' }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 22%, rgba(0,0,0,0.04) 100%)' }}></div>
            </div>
            <div className="p-3">
              <div className="font-semibold text-[#1f2a21]">{r.titulo}</div>
              <div className="text-[12px] text-[#8a948a] mt-1">{r.autores}</div>
            </div>
          </button>
        ))}
      </div>

      {recetasFiltradas.length === 0 && (
        <div className="rounded-2xl border border-[#E8EBE6] bg-white p-6 text-center text-[#8a948a]">
          No encontré recetas con ese texto.
        </div>
      )}

      <RecipeDetail receta={open} onClose={()=>setOpen(null)} />
    </div>
  );
}

/* ============================================================
   FANI — Asistente culinario con IA (exclusivo suscriptores)
   ============================================================ */

const FANI_API_URL = 'http://localhost:3001/api/fani/consultar';

function FANIEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 h-full">
      <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-[#1B5036] to-[#74C69D] flex items-center justify-center mb-5 shadow-lg">
        <Icon name="bot" size={32} className="text-white" />
      </div>
      <h3 className="text-[18px] font-semibold text-[#1f2a21] mb-2" style={{ fontFamily: 'var(--font-display)' }}>FANI está lista para ayudarte</h3>
      <p className="text-[13.5px] text-[#8a948a] max-w-sm leading-relaxed">Seleccioná los productos del bosque que tenés disponibles y FANI te sugerirá recetas del recetario FAN que podés preparar hoy.</p>
      <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-[280px]">
        {[['leaf','17 productos','del bosque'],['book','20 recetas','del recetario'],['sparkles','IA Groq','tiempo real']].map(([icon,label,sub])=>(
          <div key={label} className="bg-white rounded-xl border border-[#E8EBE6] p-3 flex flex-col items-center gap-1.5">
            <span className="w-8 h-8 rounded-lg bg-[#E9F1EC] flex items-center justify-center text-[#2D6A4F]"><Icon name={icon} size={15} /></span>
            <span className="text-[11px] font-semibold text-[#1f2a21]">{label}</span>
            <span className="text-[10px] text-[#9aa79d]">{sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FANILoading() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 h-full">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B5036] to-[#74C69D] flex items-center justify-center shadow-lg">
          <Icon name="sparkles" size={26} className="text-white animate-pulse" />
        </div>
        <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-[#74C69D] border-2 border-white flex items-center justify-center">
          <Icon name="loader" size={12} className="text-white animate-spin" />
        </div>
      </div>
      <h3 className="text-[16px] font-semibold text-[#1f2a21] mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>Consultando el recetario...</h3>
      <p className="text-[13px] text-[#8a948a]">FANI está identificando las mejores recetas para tus ingredientes</p>
      <div className="mt-5 flex gap-1.5">
        {[0,1,2].map(i=>(
          <div key={i} className="w-2 h-2 rounded-full bg-[#2D6A4F]" style={{ animation:`ping 1.2s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

function FANIRecipeCard({ receta, onOpen, index }) {
  const titulo = receta.titulo.charAt(0) + receta.titulo.slice(1).toLowerCase();
  return (
    <button onClick={()=>onOpen(receta)}
      className="group w-full text-left bg-white rounded-2xl border border-[#E8EBE6] overflow-hidden shadow-[0_4px_16px_rgba(45,60,45,0.06)] hover:shadow-[0_8px_28px_rgba(45,60,45,0.12)] hover:border-[#cfdbd1] transition-all hover:-translate-y-0.5 flex">
      <div className="relative w-24 h-24 shrink-0 overflow-hidden bg-[#F3F6F3]">
        <img src={receta.imagen} alt={receta.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e=>{ e.target.src='/bosque-logo.jpeg'; }} />
        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-[#2D6A4F] flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">{index+1}</span>
        </div>
      </div>
      <div className="flex-1 p-3.5 min-w-0">
        <div className="text-[13px] font-semibold text-[#1f2a21] leading-snug mb-1" style={{ fontFamily:'var(--font-display)' }}>{titulo}</div>
        <div className="text-[11px] text-[#8a948a] line-clamp-2 leading-relaxed">{receta.autores}</div>
        <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[#2D6A4F]">
          <Icon name="book" size={11} />Ver receta
          <Icon name="chevronRight" size={11} className="group-hover:translate-x-0.5 transition" />
        </div>
      </div>
    </button>
  );
}

function FANIResult({ result, onOpenRecipe }) {
  return (
    <div className="space-y-5 animate-[fadeIn_.3s_ease]">
      <div className="bg-gradient-to-br from-[#EAF4EE] to-[#E8F6F0] border border-[#cfe3d6] rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1B5036] to-[#74C69D] flex items-center justify-center shrink-0">
            <Icon name="sparkles" size={14} className="text-white" />
          </div>
          <span className="text-[14px] font-semibold text-[#1B5036]">FANI</span>
          {result.demo && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F4A261]/20 text-[#b05a10] border border-[#F4A261]/30">Demo</span>}
        </div>
        <div className="text-[13.5px] text-[#3a4f41] leading-relaxed whitespace-pre-line">{result.explicacion}</div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11.5px] font-semibold text-[#9aa79d] uppercase tracking-wide">Consultado:</span>
        {result.ingredientesConsultados.map(ing=>(
          <span key={ing} className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-white border border-[#E8EBE6] text-[11px] font-medium text-[#5e6b60]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#74C69D]"></span>{ing}
          </span>
        ))}
      </div>

      {result.recetas && result.recetas.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-lg bg-[#E9F1EC] flex items-center justify-center text-[#2D6A4F]"><Icon name="book" size={13} /></span>
            <h4 className="text-[14px] font-semibold text-[#1f2a21]">{result.recetas.length === 1 ? 'Receta sugerida' : `${result.recetas.length} recetas sugeridas`}</h4>
          </div>
          <div className="space-y-3">
            {result.recetas.map((r,i)=><FANIRecipeCard key={r.id} receta={r} onOpen={onOpenRecipe} index={i} />)}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8EBE6] p-5 text-center">
          <Icon name="search" size={24} className="mx-auto mb-2 text-[#c2cbc3]" />
          <p className="text-[13px] text-[#8a948a]">No se encontraron recetas exactas. Probá agregar algún producto FAN del bosque.</p>
        </div>
      )}
    </div>
  );
}

function FANILocked({ onNav }) {
  const features = [
    ['bot','IA con Groq','Sugerencias personalizadas basadas en tus ingredientes disponibles'],
    ['book','Recetario completo','20 recetas del bosque chiquitano creadas con chefs e institutos de gastronomía'],
    ['sparkles','Productos FAN','Aprendé a usar almendra chiquitana, asaí, motacú, totaí y más en tu cocina'],
    ['heart','Para vos','Basado en los productos que seguís y tu perfil culinario'],
  ];
  const preview = [
    { q:'¿Qué puedo hacer con almendra chiquitana?', a:'Podés preparar un pesto de almendra chiquitana con hierbas del bosque…' },
    { q:'Dame una receta con asaí para un restaurante.', a:'Te sugiero un ceviche de palmito con reducción de asaí y leche de tigre…' },
  ];
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center py-6">
      <div className="max-w-5xl mx-auto w-full">

        {/* Encabezado superior */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] flex items-center justify-center text-white shrink-0">
            <Icon name="sparkles" size={18} />
          </div>
          <div>
            <div className="text-[20px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)' }}>FANI · Asistente culinario del bosque</div>
            <div className="text-[12.5px] text-[#8a948a]">Inteligencia artificial aplicada a los productos del bosque chiquitano</div>
          </div>
          <span className="ml-auto flex items-center gap-1.5 bg-[#EDF2ED] text-[#2D6A4F] px-3 py-1.5 rounded-full text-[11px] font-semibold shrink-0">
            <Icon name="lock" size={11} />Solo suscriptores
          </span>
        </div>

        {/* Layout principal 2 columnas */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-5 items-stretch">

          {/* Izquierda: hero verde con preview de chat */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B5036] via-[#2D6A4F] to-[#3a8c68] text-white flex flex-col" style={{ minHeight: 420 }}>
            {/* decoración */}
            <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-white/[0.04] pointer-events-none"></div>
            <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-[#74C69D]/10 pointer-events-none" style={{ transform:'translate(30%, 30%)' }}></div>
            <div className="absolute left-1/2 top-0 w-px h-full bg-white/5 pointer-events-none"></div>

            <div className="relative z-10 p-8 lg:p-10 flex-1 flex flex-col">
              <p className="text-[15px] lg:text-[16px] text-white/90 leading-relaxed mb-8 max-w-lg">
                Descubrí qué recetas podés preparar con los productos del bosque chiquitano. FANI usa IA para sugerirte recetas del recetario FAN personalizadas para vos.
              </p>

              {/* Preview simulado del chat */}
              <div className="flex-1 flex flex-col gap-3 mb-8">
                <div className="text-[10.5px] font-semibold uppercase tracking-widest text-white/40 mb-1">Vista previa</div>
                {preview.map((m, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="self-end bg-white/15 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
                      <p className="text-[12.5px] text-white/90 leading-snug">{m.q}</p>
                    </div>
                    <div className="self-start bg-white/10 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[90%] flex gap-2.5 items-start">
                      <Icon name="sparkles" size={13} className="text-[#74C69D] shrink-0 mt-0.5" />
                      <p className="text-[12px] text-white/75 leading-snug">{m.a}</p>
                    </div>
                  </div>
                ))}
                <div className="self-start flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#74C69D]/70 animate-bounce" style={{ animationDelay:'0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#74C69D]/70 animate-bounce" style={{ animationDelay:'150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#74C69D]/70 animate-bounce" style={{ animationDelay:'300ms' }}></span>
                  </span>
                  <span className="text-[11.5px] text-white/40">FANI está pensando…</span>
                </div>
              </div>

              {/* CTA */}
              <div>
                <button
                  onClick={()=>onNav('suscripcion')}
                  className="w-full h-12 rounded-xl bg-white text-[#1B5036] text-[14.5px] font-semibold flex items-center justify-center gap-2 hover:bg-[#f0faf5] transition shadow-lg"
                >
                  <Icon name="bell" size={17} />Suscribirme para acceder a FANI
                </button>
                <p className="text-center text-[11.5px] text-white/45 mt-2.5">Gratis · alertas de temporada + acceso completo a FANI</p>
              </div>
            </div>
          </div>

          {/* Derecha: qué incluye */}
          <div className="flex flex-col gap-4">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[#9aa79d]">Qué incluye</div>
            {features.map(([icon, title, desc]) => (
              <div key={title} className="bg-white rounded-2xl border border-[#E8EBE6] p-5 flex items-start gap-4 hover:border-[#c8d8cc] hover:shadow-sm transition">
                <span className="w-10 h-10 rounded-xl bg-[#E9F1EC] flex items-center justify-center text-[#2D6A4F] shrink-0">
                  <Icon name={icon} size={18} />
                </span>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-[#1f2a21] leading-snug">{title}</div>
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

function FANIChat() {
  const [selected, setSelected] = useState([]);
  const [extras, setExtras] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [openReceta, setOpenReceta] = useState(null);

  const toggle = id => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  const limpiar = () => { setSelected([]); setExtras(''); setResult(null); setError(''); };

  const consultar = async () => {
    const ingredientes = [
      ...selected.map(id=>FAN.getProduct(id)?.nombre).filter(Boolean),
      ...extras.split(',').map(s=>s.trim()).filter(Boolean),
    ];
    if (!ingredientes.length) return;
    setLoading(true); setResult(null); setError('');
    try {
      const res = await fetch(FANI_API_URL, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ingredientes }),
        signal: AbortSignal.timeout(28000),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch(err) {
      setError(err?.message || 'No se pudo consultar a FANI. Verificá el backend y la clave de Groq.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = (selected.length > 0 || extras.trim().length > 0) && !loading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B5036] via-[#2D6A4F] to-[#74C69D] p-6 sm:p-8 text-white">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute right-6 bottom-4 w-28 h-28 rounded-full bg-[#74C69D]/10 pointer-events-none"></div>
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Icon name="sparkles" size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[23px] font-semibold tracking-tight" style={{ fontFamily:'var(--font-display)' }}>FANI</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 uppercase tracking-widest">Beta</span>
              </div>
              <div className="text-[12px] text-white/70">Asistente culinario del bosque chiquitano</div>
            </div>
          </div>
          {(result || selected.length > 0 || extras.trim()) && (
            <button onClick={limpiar} className="flex items-center gap-1.5 text-[12px] text-white/70 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition">
              <Icon name="x" size={13} />Nueva consulta
            </button>
          )}
        </div>
        <p className="relative z-10 text-[13px] text-white/75 mt-3 max-w-xl leading-relaxed">
          Seleccioná los productos del bosque que tenés disponibles y consultame — te sugiero recetas del recetario FAN que podés preparar hoy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] gap-6 items-start">
        {/* Panel izquierdo: selector */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8EBE6] p-5 space-y-4">
            <div>
              <h3 className="text-[15px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)' }}>Productos del bosque</h3>
              <p className="text-[12px] text-[#8a948a] mt-0.5">Tocá los que tenés disponibles</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {FAN.PRODUCTS.map(p=>{
                const isOn = selected.includes(p.id);
                const est = FAN.estadoTemporada(p);
                return (
                  <button key={p.id} onClick={()=>toggle(p.id)}
                    className={cn('flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-medium border transition-all',
                      isOn ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white shadow-sm' : 'bg-white border-[#E2E7DE] text-[#5e6b60] hover:border-[#2D6A4F]/40 hover:bg-[#EDF2ED]')}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: isOn?'rgba(255,255,255,0.7)':FAN.ESTADOS[est].dot }}></span>
                    {p.nombre}
                    {isOn && <Icon name="check" size={11} className="opacity-80" stroke={2.5} />}
                  </button>
                );
              })}
            </div>
            {selected.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#2D6A4F] font-medium">{selected.length} seleccionado{selected.length!==1?'s':''}</span>
                <button onClick={()=>setSelected([])} className="text-[11.5px] text-[#9aa79d] hover:text-[#5e6b60] transition">Limpiar</button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[#E8EBE6] p-5 space-y-3">
            <div>
              <h3 className="text-[14px] font-semibold text-[#1f2a21]">Otros ingredientes</h3>
              <p className="text-[12px] text-[#8a948a] mt-0.5">Separalos con comas (opcional)</p>
            </div>
            <textarea value={extras} onChange={e=>setExtras(e.target.value)}
              placeholder="ej: huevo, cebolla, ajo, pollo, limón..."
              className="w-full h-24 px-3.5 py-2.5 rounded-xl border border-[#E2E7DE] text-[13.5px] text-[#1f2a21] placeholder:text-[#aab1a6] resize-none focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]/50 transition bg-[#FAFBF9]" />
          </div>

          <button onClick={consultar} disabled={!canSubmit}
            className={cn('w-full h-12 rounded-xl text-[14.5px] font-semibold flex items-center justify-center gap-2.5 transition-all',
              canSubmit
                ? 'bg-gradient-to-r from-[#2D6A4F] to-[#74C69D] text-white shadow-md hover:shadow-lg hover:from-[#235741] hover:to-[#2D6A4F] active:scale-[.99]'
                : 'bg-[#EDF2ED] text-[#9aa79d] cursor-not-allowed')}>
            {loading ? <><Icon name="loader" size={18} className="animate-spin" />Consultando a FANI...</>
                     : <><Icon name="sparkles" size={18} />Consultar a FANI</>}
          </button>
          {!canSubmit && !loading && (
            <p className="text-center text-[11.5px] text-[#aab1a6]">Seleccioná al menos un ingrediente para consultar</p>
          )}
        </div>

        {/* Panel derecho: resultados */}
        <div className="bg-white rounded-2xl border border-[#E8EBE6] min-h-[380px] overflow-hidden">
          {error && (
            <div className="p-5 bg-[#FCF1F1] border-b border-[#F2D1D1] text-[#9A4D14]">
              <div className="text-[14px] font-semibold">No se pudo consultar a FANI</div>
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

function ScreenFANI({ role, onNav }) {
  if (role !== 'suscriptor') return <FANILocked onNav={onNav} />;
  return <FANIChat />;
}

window.PublicScreens = { ProductCard, ScreenDashboard, ScreenCatalogo, DashHero, ScreenRecetario };
Object.assign(window, { ProductCard, ScreenDashboard, ScreenCatalogo, ScreenRecetario, ScreenFANI, RECETAS, RecipeDetail });
