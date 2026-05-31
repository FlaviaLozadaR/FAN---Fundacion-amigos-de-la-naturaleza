/* ============================================================
   PLATAFORMA FAN — Shell con sidebar izquierdo (web + móvil)
   ============================================================ */

const ROLES = {
  visitante: { label:'Visitante', desc:'Chef o curioso — sin registro', icon:'user', color:'#2D6A4F' },
  suscriptor:{ label:'Suscriptor', desc:'Recibe alertas y recomendaciones', icon:'bell', color:'#2D6A4F' },
  productor: { label:'Productor', desc:'Comunidad o asociación del bosque', icon:'sprout', color:'#6B4226' },
  admin:     { label:'Admin FAN', desc:'Equipo FAN — acceso total', icon:'shield', color:'#1B5036' }
};

const NAV = {
  visitante: [['dashboard','Inicio','home'],['catalogo','Catálogo','grid'],['recetario','Recetario','book'],['mapa','Procedencia','map'],['fani','FANI','sparkles']],
  suscriptor:[['dashboard','Inicio','home'],['catalogo','Catálogo','grid'],['recetario','Recetario','book'],['mapa','Procedencia','map'],['fani','FANI','sparkles'],['mi-suscripcion','Mi suscripción','heart']],
  productor: [['productos','Mis productos','package'],['metricas','Métricas','chart']],
  admin:     [['resumen','Resumen','home'],['aprobaciones','Productores','users'],['productos','Catálogo','package'],['temporadas','Temporadas','calendar'],['suscriptores','Suscriptores','bell'],['alertas','Enviar alertas','send']]
};
const DEFAULT_VIEW = { visitante:'dashboard', suscriptor:'dashboard', productor:'productos', admin:'resumen' };

function personaDe(role){
  if(role==='suscriptor'){ const m=FAN.ME_SUSCRIPTOR; return { nombre:m.nombre, sub:m.rol, iniciales:m.iniciales, color:'#2D6A4F' }; }
  if(role==='productor'){ const p=FAN.getProductor('sabores-chiquitos'); return { nombre:p.nombre, sub:p.tipo, iniciales:p.iniciales, color:'#6B4226' }; }
  if(role==='admin'){ const a=FAN.ME_ADMIN; return { nombre:a.nombre, sub:a.cargo, iniciales:a.iniciales, color:'#1B5036' }; }
  return { nombre:'Invitado', sub:'Sin registro', iniciales:'?', color:'#9CA3AF' };
}

function LogoFAN({ light=false }){
  // Render only the logo image, filling the header area (no visible text)
  return (
    <div className="flex-1 h-full flex items-center justify-center">
      <img src="/Logo.png" alt="Fundación Amigos de la Naturaleza" style={{ width: 'auto', maxWidth: '85%', maxHeight: 56, objectFit: 'contain', objectPosition: 'center' }} />
    </div>
  );
}

/* ---------- Menú de cambio de rol (demo) ---------- */
function RoleMenu({ role, setRole }){
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="w-full flex items-center gap-2 h-10 px-3 rounded-xl border border-[#E2E7DE] bg-white hover:border-[#bcc9bf] transition">
        <Icon name="eye" size={15} className="text-[#9aa79d]" />
        <span className="text-[13px] font-medium text-[#5e6b60]">Cambiar vista</span>
        <Icon name="chevronDown" size={15} className={cn('text-[#9aa79d] ml-auto transition', open&&'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={()=>setOpen(false)}></div>
          <div className="absolute bottom-12 left-0 right-0 bg-white rounded-2xl border border-[#E8EBE6] shadow-xl z-50 p-2 animate-[sheetUp_.16s_ease]">
            <div className="px-2.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-[#9aa79d]">Demostración de roles</div>
            {Object.entries(ROLES).map(([k,v])=>(
              <button key={k} onClick={()=>{ setRole(k); setOpen(false); }} className={cn('w-full flex items-center gap-2.5 p-2 rounded-xl transition text-left', role===k?'bg-[#EDF2ED]':'hover:bg-[#F4F7F4]')}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background:v.color }}><Icon name={v.icon} size={15} /></span>
                <div className="flex-1 min-w-0"><div className="text-[13.5px] font-semibold text-[#1f2a21]">{v.label}</div><div className="text-[11px] text-[#8a948a] leading-tight truncate">{v.desc}</div></div>
                {role===k && <Icon name="check" size={15} className="text-[#2D6A4F]" stroke={2.5} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Sidebar ---------- */
function Sidebar({ role, setRole, view, setView, open, setOpen }){
  const nav = NAV[role];
  const persona = personaDe(role);
  const go = v => { setView(v); setOpen(false); };
  return (
    <>
      {/* backdrop móvil */}
      {open && <div className="fixed inset-0 bg-[#1a241c]/40 z-40 lg:hidden" onClick={()=>setOpen(false)}></div>}
      <aside className={cn(
        'fixed lg:sticky top-0 left-0 z-50 h-screen w-[270px] bg-[#FCFDFB] border-r border-[#E8EBE6] flex flex-col transition-transform duration-300 shrink-0',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#EDF0EB] shrink-0">
          <LogoFAN />
          <button onClick={()=>setOpen(false)} className="lg:hidden w-8 h-8 rounded-lg hover:bg-[#EDF2ED] flex items-center justify-center text-[#5e6b60]"><Icon name="x" size={18} /></button>
        </div>

        {/* contexto de rol */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{ background: ROLES[role].color+'14' }}>
            <span className="w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0" style={{ background:ROLES[role].color }}><Icon name={ROLES[role].icon} size={13} /></span>
            <span className="text-[12.5px] font-semibold" style={{ color:ROLES[role].color }}>Vista: {ROLES[role].label}</span>
          </div>
        </div>

        {/* navegación */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          {nav.map(([v,l,ic])=>{
            const active = view===v;
            const badge = role==='admin' && v==='aprobaciones' && FAN.METRICAS.pendientes>0 ? FAN.METRICAS.pendientes : null;
            const isFani = v==='fani';
            const faniLocked = isFani && role==='visitante';
            return (
              <button key={v} onClick={()=>go(v)} className={cn('w-full flex items-center gap-3 px-3 h-11 rounded-xl text-[14.5px] font-medium transition', active?'bg-[#2D6A4F] text-white shadow-sm':'text-[#5e6b60] hover:bg-[#EDF2ED] hover:text-[#2D6A4F]')}>
                <Icon name={ic} size={18} />{l}
                {badge && <span className={cn('ml-auto text-[11px] font-bold px-1.5 rounded-full', active?'bg-white/20':'bg-[#F4A261] text-white')}>{badge}</span>}
                {isFani && !active && !badge && (
                  <span className={cn('ml-auto text-[9.5px] font-bold px-1.5 py-0.5 rounded-full',
                    faniLocked
                      ? 'bg-[#EDF2ED] text-[#9aa79d]'
                      : 'text-white')}
                    style={!faniLocked ? { background:'linear-gradient(135deg,#2D6A4F,#0E7490)' } : {}}>
                    {faniLocked ? 'sub.' : 'IA'}
                  </span>
                )}
                {isFani && active && (
                  <span className="ml-auto text-[9.5px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">IA</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* tarjeta de usuario + cambio de rol */}
        <div className="px-3 pb-4 pt-2 border-t border-[#EDF0EB] space-y-2.5 shrink-0">
          {role==='visitante' && (
            <button onClick={()=>go('suscripcion')} className={cn('w-full flex items-center justify-center gap-2 h-11 rounded-xl text-[14px] font-semibold transition', view==='suscripcion'?'bg-[#235741] text-white':'bg-[#2D6A4F] text-white hover:bg-[#235741] shadow-sm')}>
              <Icon name="bell" size={17} />Suscribirme a alertas
            </button>
          )}
          <button onClick={()=>go('perfil')} className={cn('w-full flex items-center gap-3 p-2.5 rounded-xl transition text-left', view==='perfil'?'bg-[#EDF2ED]':'hover:bg-[#F4F7F4]')}>
            <Avatar initials={persona.iniciales} color={persona.color} size={40} />
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold text-[#1f2a21] truncate">{persona.nombre}</div>
              <div className="text-[11.5px] text-[#8a948a] truncate">{persona.sub}</div>
            </div>
            <Icon name="chevronRight" size={16} className="text-[#c2cbc3]" />
          </button>
          <RoleMenu role={role} setRole={setRole} />
        </div>
      </aside>
    </>
  );
}

function App({ tweaks }){
  const [role, setRole] = useState('visitante');
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [productor, setProductor] = useState(null);
  const [subirProd, setSubirProd] = useState(false);
  const [producerEstado, setProducerEstado] = useState('PENDIENTE');

  const handleApproveProducer = (id, nuevoEstado) => {
    if(id === 'sabores-chiquitos') setProducerEstado(nuevoEstado);
  };

  // changeView updates both state and the URL hash so each section has a route
  const changeView = (v) => { setView(v); try { if(window.location.hash !== '#'+v) window.location.hash = v; } catch(e){} };

  // initialize view from hash or role default
  useEffect(()=>{
    const h = (window.location.hash||'').replace('#','');
    if(h) setView(h);
    else changeView(DEFAULT_VIEW[role]);
    setProduct(null); setProductor(null); setSidebarOpen(false);
  }, [role]);

  // listen to manual hash changes (back/forward or direct links)
  useEffect(()=>{
    const onHash = ()=>{ const h=(window.location.hash||'').replace('#',''); if(h) setView(h); };
    window.addEventListener('hashchange', onHash);
    return ()=> window.removeEventListener('hashchange', onHash);
  }, []);

  const isSub = role==='suscriptor';
  const openProduct = p => setProduct(p);
  const openProductor = p => { setProduct(null); setTimeout(()=>setProductor(p), 60); };

  // título de la sección (para barra superior móvil)
  const navItem = (NAV[role]||[]).find(n=>n[0]===view);
  const titulos = { perfil:'Mi perfil', suscripcion:'Suscripción' };
  const titulo = navItem ? navItem[1] : (titulos[view] || '');

  return (
    <div className="min-h-screen lg:flex" style={{ background:'#F7F8F4' }}>
      <Sidebar role={role} setRole={setRole} view={view} setView={changeView} open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* barra superior móvil */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#FCFDFB]/90 backdrop-blur border-b border-[#E8EBE6] h-14 flex items-center gap-3 px-4">
          <button onClick={()=>setSidebarOpen(true)} className="w-9 h-9 rounded-lg hover:bg-[#EDF2ED] flex items-center justify-center text-[#3a4a3f]"><Icon name="menu" size={20} /></button>
          <span className="font-semibold text-[#1f2a21] text-[16px]" style={{ fontFamily:'var(--font-display)' }}>{titulo}</span>
          {role==='visitante' && <Button size="sm" className="ml-auto" onClick={()=>changeView('suscripcion')}><Icon name="bell" size={15} />Suscribirme</Button>}
          {role!=='visitante' && <span className="ml-auto"><Avatar initials={personaDe(role).iniciales} color={personaDe(role).color} size={32} /></span>}
        </header>

        <main className={view==='fani' ? 'flex-1 w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-9' : view==='dashboard' ? 'flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-9' : 'flex-1 w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9'}>
            {role==='visitante' && view==='dashboard' && <ScreenDashboard onOpen={openProduct} onNav={changeView} variant={tweaks.dashVariant} />}
            {role==='visitante' && view==='catalogo' && <ScreenCatalogo onOpen={openProduct} onNav={changeView} />}
            {role==='visitante' && view==='recetario' && <ScreenRecetario />}
            {role==='visitante' && view==='mapa' && <ScreenMapa onOpen={openProduct} onOpenProductor={setProductor} />}
            {role==='visitante' && view==='fani' && <ScreenFANI role={role} onNav={changeView} />}
            {role==='visitante' && view==='suscripcion' && <ScreenSuscripcion />}
            {role==='visitante' && view==='perfil' && <ProfileVisitante onNav={changeView} onRole={setRole} />}

            {isSub && view==='dashboard' && <ScreenDashboard onOpen={openProduct} onNav={changeView} variant={tweaks.dashVariant} subscriber />}
            {isSub && view==='catalogo' && <ScreenCatalogo onOpen={openProduct} onNav={changeView} />}
            {isSub && view==='recetario' && <ScreenRecetario />}
            {isSub && view==='mapa' && <ScreenMapa onOpen={openProduct} onOpenProductor={setProductor} />}
            {isSub && view==='fani' && <ScreenFANI role={role} onNav={changeView} />}
            {isSub && view==='mi-suscripcion' && <ScreenSuscriptor />}
            {isSub && view==='perfil' && <ProfileSuscriptor onNav={changeView} onOpen={openProduct} />}

            {role==='productor' && <ScreenProductor view={view} subir={subirProd} setSubir={setSubirProd} estado={producerEstado} setEstado={setProducerEstado} />}
            {role==='admin' && <ScreenAdmin view={view} setView={changeView} onApproveProducer={handleApproveProducer} />}
        </main>

        <footer className="border-t border-[#E8EBE6] bg-[#FCFDFB] hidden lg:block">
          <div className="max-w-[1180px] mx-auto px-8 py-5 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-[12.5px] text-[#9aa79d] max-w-md">Fundación Amigos de la Naturaleza · Conectando la oferta del bosque chiquitano con la demanda gastronómica de Bolivia.</span>
            <span className="text-[12px] text-[#aab1a6]">Informa · orienta · conecta. No es un marketplace.</span>
          </div>
        </footer>
      </div>

      <ProductDetail product={product} onClose={()=>setProduct(null)} onOpenProductor={openProductor} onNav={changeView} />
      <ProductorDetail productor={productor} onClose={()=>setProductor(null)} onOpen={openProduct} />
    </div>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dashVariant": "secciones",
  "font": "Spectral"
}/*EDITMODE-END*/;

function Root(){
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(()=>{ document.documentElement.style.setProperty('--font-display', `"${tweaks.font}", Georgia, serif`); }, [tweaks.font]);
  return (
    <ToastProvider>
      <App tweaks={tweaks} />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Pantalla de inicio (visitante / suscriptor)">
          <TweakRadio label="Disposición del dashboard" value={tweaks.dashVariant}
            options={[{value:'secciones',label:'Secciones'},{value:'compacta',label:'Compacta'},{value:'timeline',label:'Calendario'}]}
            onChange={v=>setTweak('dashVariant', v)} />
        </TweakSection>
        <TweakSection label="Tipografía de títulos">
          <TweakSelect label="Fuente display" value={tweaks.font}
            options={[{value:'Spectral',label:'Spectral (serif)'},{value:'Fraunces',label:'Fraunces (serif)'},{value:'Hanken Grotesk',label:'Hanken (sans)'}]}
            onChange={v=>setTweak('font', v)} />
        </TweakSection>
      </TweaksPanel>
    </ToastProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
