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
      className="group text-left bg-white rounded-2xl border border-[#E8EBE6] overflow-hidden shadow-[0_12px_36px_rgba(45,60,45,0.14)] hover:shadow-[0_22px_66px_rgba(45,60,45,0.20)] hover:border-[#cfdbd1] transition-transform duration-300 hover:-translate-y-1 flex flex-col">
      <div className={"relative " + (compact? 'h-28':'h-44') + " flex items-center justify-center overflow-hidden"} style={{ background:`linear-gradient(135deg, ${product.color}26, ${product.color}14)` }}>
        <ProductGlyph product={product} size={compact?52:60} full />
        <div className="absolute top-2.5 left-2.5"><StatusBadge estado={est} size="sm" /></div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="font-semibold text-[#1f2a21] leading-snug" style={{ fontFamily:'var(--font-display)', fontSize: compact?15:16 }}>{product.nombre}</div>
        <div className="text-[12px] italic text-[#8a948a] mt-0.5">{product.cientifico}</div>
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
    <div className="relative overflow-hidden rounded-3xl border border-[#dde7df] text-white px-4 sm:px-10 py-10 sm:py-16 min-h-[360px] sm:min-h-[520px]">
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
    <div className="rounded-2xl border border-[#cfe3d6] bg-gradient-to-r from-[#E9F1EC] to-[#EAF4EE] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="w-11 h-11 rounded-xl bg-[#2D6A4F] flex items-center justify-center text-white shrink-0"><Icon name="badge" size={22} /></span>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-[#1B5036] flex items-center gap-2">Hola, {me.nombre.split(' ')[0]} <Badge className="bg-white/70 text-[#2D6A4F]">Suscriptor activo</Badge></div>
          <div className="text-[13px] text-[#4f6356] mt-0.5">Tienes {me.intereses.length} productos en seguimiento · {me.alertasRecibidas} alertas recibidas</div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="secondary" size="sm" onClick={()=>onNav('mi-suscripcion')}><Icon name="heart" size={15} />Mis intereses</Button>
        <Button size="sm" onClick={()=>onNav('perfil')}><Icon name="user" size={15} />Mi perfil</Button>
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
      {subscriber && <SubscriberBenefitsBar onNav={onNav} />}
      <DashHero />
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
                  <div className="text-[12px] text-[#8a948a] truncate">{p.tipo} · {p.cientifico}</div>
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
];

function RecipeDetail({ receta, onClose }){
  if(!receta) return null;
  return (
    <Modal open={!!receta} onClose={onClose} size="lg">
      <div className="relative px-6 sm:px-8 pt-6 pb-4">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-[#5e6b60] transition"><Icon name="x" size={18} /></button>
        <div className="flex items-start gap-4">
            <div className="w-28 h-20 rounded-lg overflow-hidden"><img src={receta.imagen || '/bosque-logo.jpeg'} className="w-full h-full object-cover" /></div>
          <div className="flex-1">
            <h2 className="text-[22px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)' }}>{receta.titulo}</h2>
            <div className="text-[13px] text-[#6b756c] mt-1">{receta.autores}</div>
          </div>
        </div>
      </div>
      <div className="px-6 sm:px-8 pb-6 space-y-4">
        <div>
          <h4 className="text-[13px] font-semibold text-[#2D6A4F] mb-2">Ingredientes</h4>
            <div className="grid sm:grid-cols-3 gap-3">
            {Object.entries(receta.ingredientes).map(([k,list])=> (
              <div key={k} className="bg-[#FBFCFA] border border-[#EEF1EC] rounded-xl p-3">
                <div className="text-[13px] font-semibold text-[#1f2a21] capitalize">{k}</div>
                <ul className="text-[13px] text-[#6b756c] mt-2 list-disc list-inside">
                  {list.map((it,idx)=> <li key={idx}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[13px] font-semibold text-[#2D6A4F] mb-2">Preparación</h4>
          <ol className="list-decimal list-inside space-y-2 text-[14px] text-[#48524a]">
            {receta.preparacion.map((paso,i)=> <li key={i}>{paso}</li>)}
          </ol>
        </div>

        {receta.notas && <div className="text-[13px] text-[#8a948a]">{receta.notas}</div>}
      </div>
    </Modal>
  );
}

function ScreenRecetario(){
  const [open, setOpen] = useState(null);
  return (
    <div id="recetario" className="space-y-6">
      <SectionTitle overline="Recetario" title="Recetario" desc="Seleccioná una receta para ver los detalles." />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {RECETAS.map(r=> (
          <button key={r.id} onClick={()=>setOpen(r)} className="text-left bg-white rounded-2xl border border-[#E8EBE6] overflow-hidden shadow-[0_6px_20px_rgba(45,60,45,0.06)] hover:shadow-[0_10px_30px_rgba(45,60,45,0.08)] transition">
            <div className="h-36 bg-[#F3F6F3] flex items-center justify-center overflow-hidden">
              <img src={r.imagen} alt={r.titulo} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="font-semibold text-[#1f2a21]">{r.titulo}</div>
              <div className="text-[12px] text-[#8a948a] mt-1">{r.autores}</div>
            </div>
          </button>
        ))}
      </div>

      <RecipeDetail receta={open} onClose={()=>setOpen(null)} />
    </div>
  );
}

window.PublicScreens = { ProductCard, ScreenDashboard, ScreenCatalogo, DashHero, ScreenRecetario };
Object.assign(window, { ProductCard, ScreenDashboard, ScreenCatalogo, ScreenRecetario });
