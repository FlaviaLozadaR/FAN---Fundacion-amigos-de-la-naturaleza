/* ============================================================
   PLATAFORMA FAN — Panel Administrador (back office)
   ============================================================ */

const ESTADO_PRODUCTOR = window.ESTADO_PRODUCTOR || {
  PENDIENTE:  { label:'Pendiente de aprobación', bg:'#FCEFE1', color:'#9A4D14', dot:'#F4A261', icon:'clock' },
  APROBADO:   { label:'Aprobado',                bg:'#E3F1EA', color:'#1B5036', dot:'#2D6A4F', icon:'checkCircle' },
  RECHAZADO:  { label:'Rechazado',               bg:'#FCEEF0', color:'#B23A48', dot:'#B23A48', icon:'x' },
  SUSPENDIDO: { label:'Suspendido',              bg:'#F1F2F1', color:'#52564F', dot:'#9CA3AF', icon:'info' },
};

/* ── Mini sparkline SVG ── */
function Sparkline({ data, color = '#2D6A4F', height = 28 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * height}`).join(' ');
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={height - ((data[data.length - 1] - min) / range) * height} r="2.5" fill={color} />
    </svg>
  );
}

/* ── KPI Card mejorada ── */
function KPICard({ icon, label, value, delta, accent = '#2D6A4F', sparkData, sub }) {
  const pos = delta >= 0;
  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accent + '18', color: accent }}>
          <Icon name={icon} size={17} />
        </span>
        {delta != null && (
          <span className="text-[11px] font-semibold flex items-center gap-0.5 px-2 py-0.5 rounded-full" style={{ background: pos ? '#E3F1EA' : '#FCEEF0', color: pos ? '#1B5036' : '#B23A48' }}>
            {pos ? '↑' : '↓'} {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2 mt-1">
        <div>
          <div className="text-[26px] font-semibold text-[#1f2a21] leading-none tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
          <div className="text-[12px] text-[#8a948a] mt-1.5">{label}</div>
          {sub && <div className="text-[11px] text-[#b0b8b0] mt-0.5">{sub}</div>}
        </div>
        {sparkData && <Sparkline data={sparkData} color={accent} />}
      </div>
    </Card>
  );
}

/* ── Alerta item ── */
function AlertItem({ icon, title, desc, priority, date, action, onAction, color }) {
  const priorityColors = { alta: '#B23A48', media: '#9A4D14', baja: '#1B5036' };
  const priorityBg    = { alta: '#FCEEF0', media: '#FCEFE1', baja: '#E3F1EA' };
  const c = priorityColors[priority] || '#9aa79d';
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-[#F0F2EE] hover:border-[#d8ddd6] transition bg-white">
      <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: (color || c) + '18', color: color || c }}>
        <Icon name={icon} size={16} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13.5px] font-semibold text-[#1f2a21]">{title}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md" style={{ background: priorityBg[priority], color: c }}>{priority}</span>
        </div>
        <div className="text-[12px] text-[#8a948a] mt-0.5">{desc}</div>
        {date && <div className="text-[11px] text-[#b0b8b0] mt-0.5">{date}</div>}
      </div>
      {action && (
        <button onClick={onAction} className="shrink-0 text-[12px] font-semibold text-[#2D6A4F] hover:underline whitespace-nowrap mt-0.5">{action} →</button>
      )}
    </div>
  );
}

/* ── Timeline item ── */
function TimelineItem({ icon, title, sub, time, color = '#2D6A4F', last }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: color + '18', color }}><Icon name={icon} size={14} /></span>
        {!last && <div className="w-px flex-1 mt-1.5 mb-1" style={{ background: '#EEF1EC' }}></div>}
      </div>
      <div className="pb-4 min-w-0">
        <div className="text-[13.5px] font-semibold text-[#1f2a21]">{title}</div>
        <div className="text-[12px] text-[#8a948a]">{sub}</div>
        <div className="text-[11px] text-[#b0b8b0] mt-0.5">{time}</div>
      </div>
    </div>
  );
}

/* ── Mini bar inline ── */
function MiniBar({ value, max, color }) {
  return (
    <div className="flex-1 h-1.5 bg-[#EEF1EC] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: (value / max * 100) + '%', background: color }} />
    </div>
  );
}

/* ── Dona SVG simple ── */
function DonutChart({ segments, size = 90 }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const r = 32, cx = 45, cy = 45, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 90 90">
      {segments.map((s, i) => {
        const dash = (s.value / total) * circ;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '45px 45px' }}
          />
        );
        offset += dash;
        return el;
      })}
      <circle cx={cx} cy={cy} r="22" fill="white" />
    </svg>
  );
}

/* ── Gráfica de área SVG ── */
function AreaChart({ data, labels, color = '#2D6A4F', height = 120 }) {
  const max = Math.max(...data) * 1.1;
  const w = 100;
  const h = height;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`);
  const pathD = `M ${pts.join(' L ')} L ${w},${h} L 0,${h} Z`;
  const linD  = `M ${pts.join(' L ')}`;
  const cur   = data.length - 1;
  return (
    <div className="relative" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0"    />
          </linearGradient>
        </defs>
        <path d={pathD} fill="url(#ag)" />
        <path d={linD}  fill="none" stroke={color} strokeWidth="0.8" />
        <circle cx={(cur / (data.length - 1)) * w} cy={h - (data[cur] / max) * h} r="1.5" fill={color} />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-0.5">
        {labels.map((l, i) => i % 3 === 0 && (
          <span key={i} className="text-[9px] text-[#b0b8b0]">{l}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Calendario de temporadas ── */
function TemporadasCalendar() {
  const months   = FAN.MONTHS_SHORT;
  const cur      = FAN.CURRENT_MONTH;
  const products = FAN.PRODUCTS.slice(0, 10);
  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: 560 }}>
        <div className="grid mb-2" style={{ gridTemplateColumns: '130px repeat(12, 1fr)' }}>
          <div />
          {months.map((m, i) => (
            <div key={i} className={cn('text-center text-[10px] font-semibold py-1 rounded', i === cur ? 'text-[#2D6A4F] bg-[#E3F1EA]' : 'text-[#9aa79d]')}>{m}</div>
          ))}
        </div>
        {products.map(p => (
          <div key={p.id} className="grid items-center mb-1" style={{ gridTemplateColumns: '130px repeat(12, 1fr)' }}>
            <div className="text-[11.5px] font-medium text-[#48524a] truncate pr-2">{p.nombre}</div>
            {months.map((_, i) => {
              const on    = p.m.includes(i);
              const isCur = i === cur && on;
              return (
                <div key={i} className="flex justify-center px-px">
                  <div className="w-full h-4 rounded-sm" style={{ background: isCur ? p.color : on ? p.color + '55' : '#F4F7F4' }} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   AdminDashboard — versión mejorada
   (reemplaza al AdminDashboard anterior)
   ============================================================ */
function AdminDashboard({ onTab }) {
  const m    = FAN.METRICAS;
  const toast = useToast();
  const [actTab, setActTab] = useState('hoy');

  const enTemporada  = FAN.PRODUCTS.filter(p => FAN.estadoTemporada(p) === 'temporada' || FAN.estadoTemporada(p) === 'terminando').length;
  const proximamente = FAN.PRODUCTS.filter(p => FAN.estadoTemporada(p) === 'proximamente').length;
  const terminando   = FAN.PRODUCTS.filter(p => FAN.estadoTemporada(p) === 'terminando').length;
  const aprobados    = FAN.PRODUCTORES.filter(p => p.estado === 'APROBADO').length;

  const alertas = [
    { icon:'clock',    title:`${m.pendientes} productores pendientes`,  desc:'Esperan aprobación del equipo FAN',             priority:'alta',  date:'Hace 2 días',  action:'Revisar',   onAction:()=>onTab('aprobaciones') },
    { icon:'calendar', title:`${terminando} productos terminando`,       desc:'Su temporada finaliza en los próximos 30 días', priority:'media', date:'Este mes',      action:'Ver',       onAction:()=>onTab('temporadas') },
    { icon:'bell',     title:'Alerta de temporada pendiente',            desc:'Almendra chiquitana inicia temporada en julio', priority:'baja',  date:'En 45 días',   action:'Preparar',  onAction:()=>onTab('alertas') },
    { icon:'info',     title:'2 productores sin datos completos',        desc:'Flor del Bosque y Tradición Totaí',             priority:'media', date:'Sin fecha',     action:'Completar', onAction:()=>onTab('aprobaciones') },
  ];

  const actividades = {
    hoy:[
      { icon:'bell',        title:'Alerta de asaí enviada',     sub:'312 suscriptores notificados',              time:'Hace 2 horas', color:'#2D6A4F' },
      { icon:'users',       title:'Nuevo productor registrado', sub:'Flor del Bosque — San Miguel de Velasco',  time:'Hace 5 horas', color:'#F4A261' },
      { icon:'eye',         title:'148 visitas al catálogo',    sub:'Asaí fue el producto más consultado',      time:'Hoy',          color:'#219EBC' },
    ],
    semana:[
      { icon:'checkCircle', title:'Productor aprobado',         sub:'Recolectores de Asaí Pando',               time:'Hace 2 días',  color:'#2D6A4F' },
      { icon:'package',     title:'Producto actualizado',       sub:'Motacú — temporada ampliada',              time:'Hace 3 días',  color:'#6B4226' },
      { icon:'bell',        title:'86 nuevos suscriptores',     sub:'Esta semana, récord mensual',              time:'Esta semana',  color:'#2D6A4F' },
      { icon:'users',       title:'Nuevo productor registrado', sub:'Sabores de Chiquitos — San José',          time:'Hace 4 días',  color:'#F4A261' },
    ],
    mes:[
      { icon:'trending',    title:'+14% visitas vs. mes anterior', sub:'4.210 visitas en mayo',                time:'Mayo 2026',    color:'#2D6A4F' },
      { icon:'bell',        title:'86 suscriptores nuevos',        sub:'Total: 1.247 suscriptores activos',    time:'Mayo 2026',    color:'#219EBC' },
      { icon:'phone',       title:'134 contactos generados',       sub:'Almendra y Asaí lideraron consultas',  time:'Mayo 2026',    color:'#F4A261' },
    ]
  };

  const prods = FAN.PRODUCTS;
  const viewsSim   = [1840,1620,1480,1320,1280,1150,980,920,810,780,720,680,650,610,580,540,500];
  const topProductos = prods.slice(0,5).map((p,i) => ({ ...p, vistas:viewsSim[i], consultas:[96,54,131,28,18][i]||8 }));

  const catCounts = {};
  prods.forEach(p => { catCounts[p.categoria] = (catCounts[p.categoria]||0)+1; });
  const catColors = { 'Frutos secos':'#9C6B3F','Frutos de palmera':'#2D6A4F','Frutos del bosque':'#B23A48','Aromáticas y especias':'#92400E','Flores y hierbas':'#4A2D52','Tubérculos':'#C77F2A','Mieles':'#D9A520' };
  const donutSegs = Object.entries(catCounts).map(([k,v]) => ({ label:k, value:v, color:catColors[k]||'#9aa79d' }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <SectionTitle overline="Panel FAN · Mayo 2026" title="Centro de comando" desc="Vista completa de la plataforma: productos, productores, suscriptores y actividad." />
        <div className="flex gap-2 flex-wrap shrink-0">
          <Button size="sm" onClick={()=>toast('Nuevo producto',{desc:'(Formulario de alta — demo)'})}><Icon name="plus" size={15}/>Producto</Button>
          <Button size="sm" variant="secondary" onClick={()=>onTab('aprobaciones')}><Icon name="users" size={15}/>Aprobar</Button>
          <Button size="sm" variant="secondary" onClick={()=>onTab('alertas')}><Icon name="send" size={15}/>Alerta</Button>
        </div>
      </div>

      {/* ── SECCIÓN 1: 8 KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard icon="package"     label="Total productos"         value={m.productosCatalogo} delta={0}  accent="#2D6A4F" sparkData={[14,14,15,15,16,16,17,17]} sub="En catálogo" />
        <KPICard icon="leaf"        label="En temporada"            value={enTemporada}         accent="#2D6A4F" sparkData={[5,6,7,8,9,8,7,enTemporada]} sub={`${proximamente} próximamente`} />
        <KPICard icon="calendar"    label="Terminando pronto"       value={terminando}          accent="#F4A261" sub="Fin de temporada" />
        <KPICard icon="checkCircle" label="Productores activos"     value={`${aprobados}/${m.productores}`} accent="#6B4226" delta={7} sub={`${m.pendientes} pendientes`} />
        <KPICard icon="bell"        label="Suscriptores"            value={m.suscriptores.toLocaleString()} delta={7} accent="#219EBC" sparkData={FAN.SERIE_VISITAS.map((_,i)=>900+i*30)} />
        <KPICard icon="phone"       label="Contactos generados"     value={m.contactosMes}      delta={21} accent="#F4A261" sub="Este mes" sparkData={[80,95,102,118,125,128,130,134]} />
        <KPICard icon="eye"         label="Visitas este mes"        value={m.visitasMes.toLocaleString()} delta={14} accent="#2D6A4F" sparkData={FAN.SERIE_VISITAS.slice(-8)} />
        <KPICard icon="trending"    label="Conexión oferta-demanda" value="82%"                 accent="#2D6A4F" sub="Consultas que llegan a contacto" />
      </div>

      {/* ── SECCIÓN 2: Alertas + Actividad reciente ── */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-lg bg-[#FCEEF0] text-[#B23A48] flex items-center justify-center"><Icon name="bell" size={15}/></span>
            <h4 className="text-[15px] font-semibold text-[#1f2a21]" style={{fontFamily:'var(--font-display)'}}>Centro de alertas</h4>
            <Badge style={{background:'#FCEEF0',color:'#B23A48'}} className="ml-auto">{alertas.filter(a=>a.priority==='alta').length} urgentes</Badge>
          </div>
          <div className="space-y-2">
            {alertas.map((a,i)=><AlertItem key={i} {...a} onAction={a.onAction}/>)}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[15px] font-semibold text-[#1f2a21]" style={{fontFamily:'var(--font-display)'}}>Actividad reciente</h4>
            <div className="flex gap-1">
              {[['hoy','Hoy'],['semana','Semana'],['mes','Mes']].map(([v,l])=>(
                <button key={v} onClick={()=>setActTab(v)}
                  className={cn('text-[11.5px] px-2.5 py-1 rounded-lg font-medium transition', actTab===v?'bg-[#2D6A4F] text-white':'text-[#8a948a] hover:bg-[#F4F7F4]')}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            {actividades[actTab].map((a,i,arr)=>(
              <TimelineItem key={i} {...a} last={i===arr.length-1}/>
            ))}
          </div>
        </Card>
      </div>

      {/* ── SECCIÓN 3: Productos más consultados + Productores destacados ── */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-5">
        <Card className="p-5">
          <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-4" style={{fontFamily:'var(--font-display)'}}>Productos más consultados</h4>
          <div className="space-y-3">
            {topProductos.map((p,i)=>(
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-[#9aa79d] w-4 text-right">{i+1}</span>
                <ProductGlyph product={p} size={34} rounded="rounded-lg"/>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1f2a21] truncate">{p.nombre}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MiniBar value={p.vistas} max={topProductos[0].vistas} color={p.color}/>
                    <span className="text-[11px] text-[#8a948a] shrink-0 tabular-nums">{p.vistas} vistas</span>
                  </div>
                </div>
                <Badge style={{background:'#EDF2ED',color:'#1B5036'}} className="shrink-0">{p.consultas} cont.</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-4" style={{fontFamily:'var(--font-display)'}}>Productores destacados</h4>
          <div className="space-y-3">
            {FAN.PRODUCTORES.filter(p=>p.estado==='APROBADO').map(pr=>(
              <div key={pr.id} className="flex items-center gap-3">
                <Avatar initials={pr.iniciales} color="#2D6A4F" size={38}/>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1f2a21] flex items-center gap-1 truncate">
                    {pr.nombre}{pr.verificado&&<Icon name="badge" size={12} className="text-[#2D6A4F]"/>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MiniBar value={pr.metricas.contactos} max={131} color="#2D6A4F"/>
                    <span className="text-[11px] text-[#8a948a] shrink-0">{pr.metricas.contactos} cont.</span>
                  </div>
                </div>
                <Badge style={{background:'#EDF2ED',color:'#1B5036'}} className="shrink-0">{pr.productos.length} prod.</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── SECCIÓN 4: Visitas + Categorías ── */}
      <div className="grid lg:grid-cols-[1.8fr_1fr] gap-5">
        <Card className="p-5">
          <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-1" style={{fontFamily:'var(--font-display)'}}>Visitas mensuales</h4>
          <p className="text-[12px] text-[#9aa79d] mb-4">Ene — Dic 2025 · 4.210 este mes</p>
          <AreaChart data={FAN.SERIE_VISITAS} labels={FAN.MONTHS_SHORT} height={130}/>
        </Card>

        <Card className="p-5">
          <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-4" style={{fontFamily:'var(--font-display)'}}>Productos por categoría</h4>
          <div className="flex items-center gap-4">
            <DonutChart segments={donutSegs} size={100}/>
            <div className="space-y-1.5 flex-1 min-w-0">
              {donutSegs.map(s=>(
                <div key={s.label} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{background:s.color}}></span>
                  <span className="text-[11px] text-[#6b756c] truncate flex-1">{s.label}</span>
                  <span className="text-[11px] font-semibold text-[#1f2a21]">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── SECCIÓN 5: Calendario de temporadas ── */}
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <h4 className="text-[15px] font-semibold text-[#1f2a21]" style={{fontFamily:'var(--font-display)'}}>Calendario de temporadas</h4>
          <Badge className="bg-[#E3F1EA] text-[#1B5036]"><span className="w-2 h-2 rounded-sm" style={{background:'#2D6A4F55'}}></span>Color sólido = mes actual</Badge>
          <Button variant="secondary" size="sm" className="ml-auto" onClick={()=>onTab('temporadas')}><Icon name="edit" size={14}/>Editar</Button>
        </div>
        <TemporadasCalendar/>
      </Card>

      {/* ── SECCIÓN 6: Acciones rápidas ── */}
      <Card className="p-5">
        <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-4" style={{fontFamily:'var(--font-display)'}}>Acciones rápidas</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            ['plus',     'Crear producto',        '#2D6A4F', ()=>toast('Nuevo producto',{desc:'Demo'})],
            ['users',    'Aprobar productor',      '#F4A261', ()=>onTab('aprobaciones')],
            ['book',     'Crear receta',           '#6B4226', ()=>onTab('recetario')],
            ['calendar', 'Editar temporadas',      '#2D6A4F', ()=>onTab('temporadas')],
            ['send',     'Enviar alerta',          '#219EBC', ()=>onTab('alertas')],
            ['bell',     'Gestionar suscriptores', '#2D6A4F', ()=>onTab('suscriptores')],
          ].map(([icon,label,color,action])=>(
            <button key={label} onClick={action}
              className="flex flex-col items-center gap-2 p-3.5 rounded-xl border border-[#EEF1EC] hover:border-[#cfdbd1] hover:bg-[#FAFBF9] transition text-center">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{background:color}}>
                <Icon name={icon} size={18}/>
              </span>
              <span className="text-[11.5px] font-medium text-[#48524a] leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- Aprobaciones ---------- */
function AdminAprobaciones({ onApproveProducer }){
  const toast = useToast();
  const [productores, setProductores] = useState(FAN.PRODUCTORES.map(p=>({...p})));
  const [revisar, setRevisar] = useState(null);
  const pendientes = productores.filter(p=>p.estado==='PENDIENTE');
  const decidir = (id, estado) => {
    setProductores(ps=>ps.map(p=>p.id===id?{...p, estado}:p));
    setRevisar(null);
    if(onApproveProducer) onApproveProducer(id, estado);
    toast(estado==='APROBADO'?'Productor aprobado':'Productor rechazado', { type: estado==='APROBADO'?'success':'error', desc:'Se notificó al productor con el resultado.' });
  };
  return (
    <div className="space-y-6">
      <SectionTitle overline="Gestión de productores" title="Pendientes de aprobación" desc="Revisa el perfil y los productos antes de aprobar. El productor recibirá una notificación con el resultado." />
      {pendientes.length===0 ? (
        <Card className="p-12 text-center text-[#8a948a]"><Icon name="checkCircle" size={30} className="mx-auto mb-3 text-[#74C69D]" />No hay productores pendientes. ¡Todo al día!</Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {pendientes.map(pr=>(
            <Card key={pr.id} className="p-5">
              <div className="flex items-start gap-3.5">
                <Avatar initials={pr.iniciales} color="#F4A261" size={48} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#1f2a21] text-[16px]" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{pr.nombre}</div>
                  <div className="text-[12.5px] text-[#8a948a] flex items-center gap-1"><Icon name="mapPin" size={13} />{pr.ubicacion}</div>
                </div>
                <Badge style={{ background:'#FCEFE1', color:'#9A4D14' }}><span className="w-1.5 h-1.5 rounded-full bg-[#F4A261]"></span>Pendiente</Badge>
              </div>
              <p className="text-[13.5px] text-[#48524a] mt-3 leading-relaxed line-clamp-2">{pr.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {pr.productos.map(FAN.getProduct).filter(Boolean).map(p=> <Badge key={p.id} className="bg-[#EDF2ED] text-[#3a4a3f]">{p.nombre}</Badge>)}
              </div>
              <div className="flex gap-2.5 mt-4 pt-4 border-t border-[#F0F2EE]">
                <Button variant="secondary" size="sm" className="flex-1" onClick={()=>setRevisar(pr)}><Icon name="eye" size={15} />Revisar</Button>
                <Button variant="danger" size="sm" onClick={()=>decidir(pr.id,'RECHAZADO')}><Icon name="x" size={15} />Rechazar</Button>
                <Button size="sm" onClick={()=>decidir(pr.id,'APROBADO')}><Icon name="check" size={15} />Aprobar</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-[16px] font-semibold text-[#1f2a21] tracking-tight mb-3 mt-2" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>Todos los productores</h3>
        <Card className="divide-y divide-[#F0F2EE] overflow-hidden">
          {productores.map(pr=>{
            const e = ESTADO_PRODUCTOR[pr.estado];
            return (
              <div key={pr.id} className="flex items-center gap-3.5 p-3.5">
                <Avatar initials={pr.iniciales} color={e.dot} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#1f2a21] text-[14.5px] flex items-center gap-1.5">{pr.nombre}{pr.verificado && <Icon name="badge" size={14} className="text-[#2D6A4F]" />}</div>
                  <div className="text-[12px] text-[#8a948a] truncate">{pr.ubicacion} · {pr.productos.length} productos</div>
                </div>
                <Badge style={{ background:e.bg, color:e.color }}><span className="w-1.5 h-1.5 rounded-full" style={{ background:e.dot }}></span>{e.label}</Badge>
                {pr.estado==='APROBADO' && <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={()=>{ setProductores(ps=>ps.map(x=>x.id===pr.id?{...x,estado:'SUSPENDIDO'}:x)); if(onApproveProducer) onApproveProducer(pr.id,'SUSPENDIDO'); toast('Productor suspendido'); }}>Suspender</Button>}
                {pr.estado==='SUSPENDIDO' && <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={()=>{ setProductores(ps=>ps.map(x=>x.id===pr.id?{...x,estado:'APROBADO'}:x)); if(onApproveProducer) onApproveProducer(pr.id,'APROBADO'); toast('Productor reactivado'); }}>Reactivar</Button>}
              </div>
            );
          })}
        </Card>
      </div>

      {revisar && (
        <Modal open onClose={()=>setRevisar(null)} size="md">
          <div className="p-6">
            <div className="flex items-center gap-3.5 mb-4">
              <Avatar initials={revisar.iniciales} color="#F4A261" size={52} />
              <div><div className="text-[19px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{revisar.nombre}</div><div className="text-[13px] text-[#8a948a]">{revisar.tipo} · {revisar.ubicacion}</div></div>
            </div>
            <p className="text-[14px] text-[#48524a] leading-relaxed">{revisar.desc}</p>
            <div className="mt-4 space-y-2">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d]">Contacto</div>
              <div className="flex flex-wrap gap-3 text-[13px] text-[#48524a]">
                <span className="flex items-center gap-1.5"><Icon name="phone" size={14} className="text-[#2D6A4F]" />{revisar.contacto.tel}</span>
                <span className="flex items-center gap-1.5"><Icon name="mail" size={14} className="text-[#2D6A4F]" />{revisar.contacto.correo}</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d] mb-2">Productos a publicar</div>
              <div className="space-y-2">
                {revisar.productos.map(FAN.getProduct).filter(Boolean).map(p=>(
                  <div key={p.id} className="flex items-center gap-3 border border-[#E8EBE6] rounded-lg p-2.5">
                    <ProductGlyph product={p} size={38} rounded="rounded-lg" />
                    <div className="flex-1 min-w-0"><div className="text-[13.5px] font-semibold text-[#1f2a21]">{p.nombre}</div><div className="text-[12px] text-[#8a948a] line-clamp-1">{p.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="danger" className="flex-1" onClick={()=>decidir(revisar.id,'RECHAZADO')}><Icon name="x" size={16} />Rechazar</Button>
              <Button className="flex-1" onClick={()=>decidir(revisar.id,'APROBADO')}><Icon name="check" size={16} />Aprobar productor</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

window.AdminCore = { AdminDashboard, AdminAprobaciones, BarChart:null, Sparkline, KPICard, AlertItem, TimelineItem, MiniBar, DonutChart, AreaChart, TemporadasCalendar };
Object.assign(window, { AdminDashboard, AdminAprobaciones, Sparkline, KPICard, AlertItem, TimelineItem, MiniBar, DonutChart, AreaChart, TemporadasCalendar });