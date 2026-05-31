/* ============================================================
   PLATAFORMA FAN — Admin 
   Pantallas: Dashboard, Ver Producto, Gestión de Recetas, Ver Receta
   ============================================================ */


/* Mini sparkline SVG */
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

/* KPI Card mejorada */
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

/* Alerta item */
function AlertItem({ icon, title, desc, priority, date, action, onAction, color }) {
  const priorityColors = { alta: '#B23A48', media: '#9A4D14', baja: '#1B5036' };
  const priorityBg = { alta: '#FCEEF0', media: '#FCEFE1', baja: '#E3F1EA' };
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

/* Timeline item */
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

/* Mini bar inline */
function MiniBar({ value, max, color }) {
  return (
    <div className="flex-1 h-1.5 bg-[#EEF1EC] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: (value / max * 100) + '%', background: color }} />
    </div>
  );
}

/* Calendar temporadas widget */
function TemporadasCalendar() {
  const months = FAN.MONTHS_SHORT;
  const cur = FAN.CURRENT_MONTH;
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
              const on = p.m.includes(i);
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

/* Gráfica de área SVG simple */
function AreaChart({ data, labels, color = '#2D6A4F', height = 120 }) {
  const max = Math.max(...data) * 1.1;
  const w = 100;
  const h = height;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`);
  const pathD = `M ${pts.join(' L ')} L ${w},${h} L 0,${h} Z`;
  const linD = `M ${pts.join(' L ')}`;
  const cur = data.length - 1;
  return (
    <div className="relative" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={pathD} fill="url(#ag)" />
        <path d={linD} fill="none" stroke={color} strokeWidth="0.8" />
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

/* Dona SVG simple */
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

/* ============================================================
   COMPONENTE PRINCIPAL: AdminDashboardV2
   ============================================================ */
function AdminDashboardV2({ onTab, onOpenProduct }) {
  const m = FAN.METRICAS;
  const [actTab, setActTab] = useState('hoy');
  const toast = useToast();

  // KPIs de temporada
  const enTemporada = FAN.PRODUCTS.filter(p => FAN.estadoTemporada(p) === 'temporada' || FAN.estadoTemporada(p) === 'terminando').length;
  const proximamente = FAN.PRODUCTS.filter(p => FAN.estadoTemporada(p) === 'proximamente').length;
  const terminando = FAN.PRODUCTS.filter(p => FAN.estadoTemporada(p) === 'terminando').length;
  const aprobados = FAN.PRODUCTORES.filter(p => p.estado === 'APROBADO').length;

  const alertas = [
    { icon: 'clock', title: `${m.pendientes} productores pendientes`, desc: 'Esperan aprobación del equipo FAN', priority: 'alta', date: 'Hace 2 días', action: 'Revisar', onAction: () => onTab('aprobaciones') },
    { icon: 'calendar', title: `${terminando} productos terminando`, desc: 'Su temporada finaliza en los próximos 30 días', priority: 'media', date: 'Este mes', action: 'Ver', onAction: () => onTab('temporadas') },
    { icon: 'bell', title: 'Alerta de temporada pendiente', desc: 'Almendra chiquitana inicia temporada en julio', priority: 'baja', date: 'En 45 días', action: 'Preparar', onAction: () => onTab('alertas') },
    { icon: 'info', title: '2 productores sin datos de contacto completos', desc: 'Flor del Bosque y Tradición Totaí', priority: 'media', date: 'Sin fecha', action: 'Completar', onAction: () => onTab('aprobaciones') },
  ];

  const actividades = {
    hoy: [
      { icon: 'bell', title: 'Alerta de asaí enviada', sub: '312 suscriptores notificados', time: 'Hace 2 horas', color: '#2D6A4F' },
      { icon: 'users', title: 'Nuevo productor registrado', sub: 'Flor del Bosque — San Miguel de Velasco', time: 'Hace 5 horas', color: '#F4A261' },
      { icon: 'eye', title: '148 visitas al catálogo', sub: 'Asaí fue el producto más consultado', time: 'Hoy', color: '#219EBC' },
    ],
    semana: [
      { icon: 'checkCircle', title: 'Productor aprobado', sub: 'Recolectores de Asaí Pando', time: 'Hace 2 días', color: '#2D6A4F' },
      { icon: 'package', title: 'Producto actualizado', sub: 'Motacú — temporada ampliada', time: 'Hace 3 días', color: '#6B4226' },
      { icon: 'bell', title: '86 nuevos suscriptores', sub: 'Esta semana, récord mensual', time: 'Esta semana', color: '#2D6A4F' },
      { icon: 'users', title: 'Nuevo productor registrado', sub: 'Sabores de Chiquitos — San José', time: 'Hace 4 días', color: '#F4A261' },
    ],
    mes: [
      { icon: 'trending', title: '+14% visitas vs. mes anterior', sub: '4.210 visitas en mayo', time: 'Mayo 2026', color: '#2D6A4F' },
      { icon: 'bell', title: '86 suscriptores nuevos', sub: 'Total: 1.247 suscriptores activos', time: 'Mayo 2026', color: '#219EBC' },
      { icon: 'phone', title: '134 contactos generados', sub: 'Almendra y Asaí lideraron consultas', time: 'Mayo 2026', color: '#F4A261' },
    ]
  };

  const prods = FAN.PRODUCTS;
  const viewsSim = [1840, 1620, 1480, 1320, 1280, 1150, 980, 920, 810, 780, 720, 680, 650, 610, 580, 540, 500];
  const topProductos = prods.slice(0, 5).map((p, i) => ({ ...p, vistas: viewsSim[i], consultas: [96, 54, 131, 28, 18][i] || 8 }));

  const catCounts = {};
  prods.forEach(p => { catCounts[p.categoria] = (catCounts[p.categoria] || 0) + 1; });
  const catColors = { 'Frutos secos': '#9C6B3F', 'Frutos de palmera': '#2D6A4F', 'Frutos del bosque': '#B23A48', 'Aromáticas y especias': '#92400E', 'Flores y hierbas': '#4A2D52', 'Tubérculos': '#C77F2A', 'Mieles': '#D9A520' };
  const donutSegs = Object.entries(catCounts).map(([k, v]) => ({ label: k, value: v, color: catColors[k] || '#9aa79d' }));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <SectionTitle overline="Panel FAN · Mayo 2026" title="Centro de comando" desc="Vista completa de la plataforma: productos, productores, suscriptores y actividad." />
        <div className="flex gap-2 flex-wrap shrink-0">
          <Button size="sm" onClick={() => toast('Nuevo producto', { desc: '(Formulario de alta — demo)' })}><Icon name="plus" size={15} />Producto</Button>
          <Button size="sm" variant="secondary" onClick={() => onTab('aprobaciones')}><Icon name="users" size={15} />Aprobar</Button>
          <Button size="sm" variant="secondary" onClick={() => onTab('alertas')}><Icon name="send" size={15} />Alerta</Button>
        </div>
      </div>

      {/* ── SECCIÓN 1: KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard icon="package" label="Total productos" value={m.productosCatalogo} delta={0} accent="#2D6A4F" sparkData={[14, 14, 15, 15, 16, 16, 17, 17]} sub="En catálogo" />
        <KPICard icon="leaf" label="En temporada" value={enTemporada} accent="#2D6A4F" sparkData={[5, 6, 7, 8, 9, 8, 7, enTemporada]} sub={`${proximamente} próximamente`} />
        <KPICard icon="calendar" label="Terminando pronto" value={terminando} accent="#F4A261" sub="Fin de temporada" />
        <KPICard icon="checkCircle" label="Productores activos" value={`${aprobados}/${m.productores}`} accent="#6B4226" delta={7} sub={`${m.pendientes} pendientes`} />
        <KPICard icon="bell" label="Suscriptores" value={m.suscriptores.toLocaleString()} delta={7} accent="#219EBC" sparkData={FAN.SERIE_VISITAS.map((v, i) => 900 + i * 30)} />
        <KPICard icon="phone" label="Contactos generados" value={m.contactosMes} delta={21} accent="#F4A261" sub="Este mes" sparkData={[80, 95, 102, 118, 125, 128, 130, 134]} />
        <KPICard icon="eye" label="Visitas este mes" value={m.visitasMes.toLocaleString()} delta={14} accent="#2D6A4F" sparkData={FAN.SERIE_VISITAS.slice(-8)} />
        <KPICard icon="trending" label="Conexión oferta-demanda" value="82%" accent="#2D6A4F" sub="Consultas que llegan a contacto" />
      </div>

      {/* ── SECCIÓN 2: Alertas + Actividad ── */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-lg bg-[#FCEEF0] text-[#B23A48] flex items-center justify-center"><Icon name="bell" size={15} /></span>
            <h4 className="text-[15px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)' }}>Centro de alertas</h4>
            <Badge style={{ background: '#FCEEF0', color: '#B23A48' }} className="ml-auto">{alertas.filter(a => a.priority === 'alta').length} urgentes</Badge>
          </div>
          <div className="space-y-2">
            {alertas.map((a, i) => <AlertItem key={i} {...a} onAction={a.onAction} />)}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[15px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)' }}>Actividad reciente</h4>
            <div className="flex gap-1">
              {[['hoy', 'Hoy'], ['semana', 'Semana'], ['mes', 'Mes']].map(([v, l]) => (
                <button key={v} onClick={() => setActTab(v)}
                  className={cn('text-[11.5px] px-2.5 py-1 rounded-lg font-medium transition', actTab === v ? 'bg-[#2D6A4F] text-white' : 'text-[#8a948a] hover:bg-[#F4F7F4]')}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            {actividades[actTab].map((a, i, arr) => (
              <TimelineItem key={i} {...a} last={i === arr.length - 1} />
            ))}
          </div>
        </Card>
      </div>

      {/* ── SECCIÓN 3: Productos + Productores ── */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-5">
        <Card className="p-5">
          <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Productos más consultados</h4>
          <div className="space-y-3">
            {topProductos.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-[#9aa79d] w-4 text-right">{i + 1}</span>
                <ProductGlyph product={p} size={34} rounded="rounded-lg" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1f2a21] truncate">{p.nombre}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MiniBar value={p.vistas} max={topProductos[0].vistas} color={p.color} />
                    <span className="text-[11px] text-[#8a948a] shrink-0 tabular-nums">{p.vistas} vistas</span>
                  </div>
                </div>
                <Badge style={{ background: '#EDF2ED', color: '#1B5036' }} className="shrink-0">{p.consultas} cont.</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Productores destacados</h4>
          <div className="space-y-3">
            {FAN.PRODUCTORES.filter(p => p.estado === 'APROBADO').map(pr => (
              <div key={pr.id} className="flex items-center gap-3">
                <Avatar initials={pr.iniciales} color={FAN.ORIGENES ? '#2D6A4F' : '#2D6A4F'} size={38} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1f2a21] flex items-center gap-1 truncate">
                    {pr.nombre}{pr.verificado && <Icon name="badge" size={12} className="text-[#2D6A4F]" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MiniBar value={pr.metricas.contactos} max={131} color="#2D6A4F" />
                    <span className="text-[11px] text-[#8a948a] shrink-0">{pr.metricas.contactos} cont.</span>
                  </div>
                </div>
                <Badge style={{ background: '#EDF2ED', color: '#1B5036' }} className="shrink-0">{pr.productos.length} prod.</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── SECCIÓN 4: Analítica + Temporadas ── */}
      <div className="grid lg:grid-cols-[1.8fr_1fr] gap-5">
        <Card className="p-5">
          <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Visitas mensuales</h4>
          <p className="text-[12px] text-[#9aa79d] mb-4">Ene — Dic 2025 · 4.210 este mes</p>
          <AreaChart data={FAN.SERIE_VISITAS} labels={FAN.MONTHS_SHORT} height={130} />
        </Card>

        <Card className="p-5">
          <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Productos por categoría</h4>
          <div className="flex items-center gap-4">
            <DonutChart segments={donutSegs} size={100} />
            <div className="space-y-1.5 flex-1 min-w-0">
              {donutSegs.map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }}></span>
                  <span className="text-[11px] text-[#6b756c] truncate flex-1">{s.label}</span>
                  <span className="text-[11px] font-semibold text-[#1f2a21]">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── SECCIÓN 5: Calendario de Temporadas ── */}
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <h4 className="text-[15px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)' }}>Calendario de temporadas</h4>
          <Badge className="bg-[#E3F1EA] text-[#1B5036]"><span className="w-2 h-2 rounded-sm" style={{ background: '#2D6A4F55' }}></span>Color sólido = mes actual</Badge>
          <Button variant="secondary" size="sm" className="ml-auto" onClick={() => onTab('temporadas')}><Icon name="edit" size={14} />Editar</Button>
        </div>
        <TemporadasCalendar />
      </Card>

      {/* ── SECCIÓN 6: Acciones Rápidas ── */}
      <Card className="p-5">
        <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Acciones rápidas</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            ['plus', 'Crear producto', '#2D6A4F', () => toast('Nuevo producto', { desc: 'Demo' })],
            ['users', 'Aprobar productor', '#F4A261', () => onTab('aprobaciones')],
            ['book', 'Crear receta', '#6B4226', () => onTab('recetas')],
            ['calendar', 'Editar temporadas', '#2D6A4F', () => onTab('temporadas')],
            ['send', 'Enviar alerta', '#219EBC', () => onTab('alertas')],
            ['bell', 'Gestionar suscriptores', '#2D6A4F', () => onTab('suscriptores')],
          ].map(([icon, label, color, action]) => (
            <button key={label} onClick={action}
              className="flex flex-col items-center gap-2 p-3.5 rounded-xl border border-[#EEF1EC] hover:border-[#cfdbd1] hover:bg-[#FAFBF9] transition text-center">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: color }}>
                <Icon name={icon} size={18} />
              </span>
              <span className="text-[11.5px] font-medium text-[#48524a] leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   PANTALLA 5.1 — VER PRODUCTO (Admin)
   ============================================================ */
function AdminVerProducto({ product, onClose, onEdit }) {
  const [tab, setTab] = useState('info');
  const toast = useToast();
  if (!product) return null;

  const est = FAN.estadoTemporada(product);
  const estado = FAN.ESTADOS[est];
  const productores = FAN.PRODUCTORES.filter(p => p.estado === 'APROBADO' && p.productos.includes(product.id));

  // Datos simulados de estadísticas
  const stats = { vistas: 1840, consultas: 96, suscriptores: 312, recetas: 4 };

  return (
    <div className="space-y-5">
      {/* Encabezado hero */}
      <div className="rounded-2xl overflow-hidden border border-[#E8EBE6]" style={{ background: product.color + '12' }}>
        <div className="p-6 flex items-start gap-5 flex-wrap sm:flex-nowrap">
          <ProductGlyph product={product} size={90} rounded="rounded-2xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge style={{ background: estado.bg, color: estado.text }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: estado.dot }}></span>{estado.label}</Badge>
              <Badge className="bg-white/60 text-[#6b756c]">{product.categoria}</Badge>
            </div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>{product.nombre}</h1>
            <div className="text-[14px] italic text-[#8a948a] mt-0.5">{product.cientifico}</div>
            <p className="text-[14px] text-[#48524a] mt-3 leading-relaxed max-w-xl">{product.desc}</p>
          </div>
          <div className="flex gap-2 flex-wrap shrink-0">
            <Button size="sm" onClick={() => { onEdit && onEdit(product); toast('Modo edición', { desc: 'Demo' }); }}><Icon name="edit" size={15} />Editar</Button>
            <Button size="sm" variant="danger" onClick={() => toast('Desactivar', { desc: 'Demo', type: 'error' })}><Icon name="x" size={15} />Desactivar</Button>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-4 border-t border-[#E8EBE6] bg-white/50">
          {[['eye', stats.vistas.toLocaleString(), 'Visualizaciones'], ['phone', stats.consultas, 'Consultas'], ['bell', stats.suscriptores, 'Interesados'], ['book', stats.recetas, 'Recetas']].map(([ic, v, l]) => (
            <div key={l} className="p-4 text-center border-r border-[#E8EBE6] last:border-0">
              <div className="text-[22px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>{v}</div>
              <div className="text-[11.5px] text-[#8a948a] flex items-center justify-center gap-1 mt-0.5"><Icon name={ic} size={12} />{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <SegTabs
          tabs={[{ value: 'info', label: 'Información', icon: 'package' }, { value: 'temporada', label: 'Temporada', icon: 'calendar' }, { value: 'productores', label: 'Productores', icon: 'users' }, { value: 'recetas', label: 'Recetas', icon: 'book' }]}
          value={tab} onChange={setTab} />
      </div>

      {/* Info */}
      {tab === 'info' && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-5">
          <Card className="p-6 space-y-5">
            <div>
              <div className="text-[11px] uppercase tracking-wide font-semibold text-[#9aa79d] mb-2">Descripción completa</div>
              <p className="text-[14px] text-[#48524a] leading-relaxed">{product.desc} Producto de origen silvestre, recolectado artesanalmente por comunidades del bosque chiquitano bajo prácticas sostenibles de manejo forestal.</p>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide font-semibold text-[#9aa79d] mb-2">Usos gastronómicos</div>
              <div className="flex flex-wrap gap-2">
                {product.usos.map(u => <Badge key={u} className="bg-[#EDF2ED] text-[#2D6A4F]"><Icon name="leaf" size={11} />{u}</Badge>)}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide font-semibold text-[#9aa79d] mb-2">Presentaciones disponibles</div>
              <div className="flex flex-wrap gap-2">
                {(product.presentaciones || []).map(p => <Badge key={p} className="bg-[#F4F7F4] text-[#48524a]">{p}</Badge>)}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide font-semibold text-[#9aa79d] mb-2">Fuente científica</div>
              <p className="text-[12.5px] text-[#8a948a] italic leading-relaxed">{product.fuente}</p>
            </div>
          </Card>

          {/* Características */}
          <div className="space-y-3">
            <Card className="p-5">
              <div className="text-[11px] uppercase tracking-wide font-semibold text-[#9aa79d] mb-3">Características</div>
              <div className="space-y-3">
                {[['Tipo', product.tipo], ['Categoría', product.categoria], ['Origen', product.origen === 'chiquitania' ? 'Bosque Chiquitano' : 'Amazonía Norte'], ['Regiones', (product.regiones || []).join(', ')]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 text-[13px]">
                    <span className="text-[#9aa79d]">{k}</span>
                    <span className="font-medium text-[#1f2a21] text-right">{v}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <div className="text-[11px] uppercase tracking-wide font-semibold text-[#9aa79d] mb-3">Cosecha</div>
              <p className="text-[13px] text-[#48524a] leading-relaxed">{product.cosecha}</p>
            </Card>
          </div>
        </div>
      )}

      {/* Temporada */}
      {tab === 'temporada' && (
        <Card className="p-6">
          <h3 className="text-[16px] font-semibold text-[#1f2a21] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Calendario de disponibilidad</h3>
          <div className="grid grid-cols-12 gap-2 mb-4">
            {FAN.MONTHS_SHORT.map((m, i) => {
              const on = product.m.includes(i);
              const cur = i === FAN.CURRENT_MONTH;
              let bg = on ? product.color : '#F4F7F4';
              let border = cur ? `2px solid ${product.color}` : 'none';
              return (
                <div key={i} className="text-center">
                  <div className="h-10 rounded-lg flex items-center justify-center text-[11px] font-semibold transition"
                    style={{ background: bg, color: on ? 'white' : '#9aa79d', border }}>
                    {on ? <Icon name="check" size={13} stroke={2.5} /> : '–'}
                  </div>
                  <div className="text-[10px] text-[#9aa79d] mt-1">{m}</div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[#6b756c] flex-wrap mt-2">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded" style={{ background: product.color }}></span>En temporada</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#F4F7F4] border border-[#E2E7DE]"></span>Fuera de temporada</span>
            <span className="flex items-center gap-2 ml-auto">
              <Badge style={{ background: FAN.ESTADOS[est].bg, color: FAN.ESTADOS[est].text }}>Estado actual: {FAN.ESTADOS[est].label}</Badge>
            </span>
          </div>
        </Card>
      )}

      {/* Productores */}
      {tab === 'productores' && (
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0F2EE] flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)' }}>Productores asociados</h3>
            <Badge className="bg-[#E3F1EA] text-[#1B5036]">{productores.length} activos</Badge>
          </div>
          {productores.length === 0 ? (
            <div className="p-10 text-center text-[#9aa79d] text-[13px]">No hay productores aprobados para este producto.</div>
          ) : (
            <div className="divide-y divide-[#F0F2EE]">
              {productores.map(pr => (
                <div key={pr.id} className="flex items-center gap-4 p-4">
                  <Avatar initials={pr.iniciales} color="#2D6A4F" size={42} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#1f2a21] flex items-center gap-1.5">
                      {pr.nombre}{pr.verificado && <Icon name="badge" size={14} className="text-[#2D6A4F]" />}
                    </div>
                    <div className="text-[12px] text-[#8a948a] flex items-center gap-1"><Icon name="mapPin" size={12} />{pr.ubicacion}</div>
                  </div>
                  <Badge className="bg-[#E3F1EA] text-[#1B5036]">{pr.tipo}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toast('Ver productor', { desc: pr.nombre })}><Icon name="eye" size={15} />Ver</Button>
                    <Button variant="ghost" size="sm" onClick={() => toast('Contactar', { desc: pr.contacto.tel })}><Icon name="phone" size={15} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Recetas */}
      {tab === 'recetas' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECETAS_DEMO.filter(r => r.productoId === product.id || r.productosRel.includes(product.id)).slice(0, 6).map(r => (
            <RecetaCard key={r.id} receta={r} onVer={() => toast('Ver receta: ' + r.nombre)} />
          ))}
          {RECETAS_DEMO.filter(r => r.productoId === product.id || r.productosRel.includes(product.id)).length === 0 && (
            <div className="col-span-full p-10 text-center text-[#9aa79d]">No hay recetas asociadas a este producto.</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DATOS DE RECETAS (demo)
   ============================================================ */
const RECETAS_DEMO = [
  {
    id: 'r1', nombre: 'Tarta de almendra chiquitana con chocolate', estado: 'PUBLICADO',
    productoId: 'almendra-chiquitana', productosRel: ['miel'],
    categoria: 'Repostería', dificultad: 'Media', tiempo: 45, porciones: 8,
    descripcion: 'Tarta elegante de almendra silvestre con cobertura de chocolate amargo y miel del monte.',
    historia: 'Inspirada en las tartas europeas de frutos secos, esta receta reimagina la almendra chiquitana como protagonista de la alta repostería boliviana.',
    ingredientes: [
      { nombre: 'Almendra chiquitana molida', cantidad: 200, unidad: 'g' },
      { nombre: 'Chocolate amargo 70%', cantidad: 150, unidad: 'g' },
      { nombre: 'Miel del monte', cantidad: 80, unidad: 'ml' },
      { nombre: 'Huevos', cantidad: 3, unidad: '' },
      { nombre: 'Mantequilla', cantidad: 100, unidad: 'g' },
    ],
    pasos: ['Moler la almendra hasta obtener harina fina.', 'Derretir el chocolate con la mantequilla a baño María.', 'Mezclar todos los ingredientes y verter en molde.', 'Hornear a 170°C por 35 minutos.', 'Glasear con miel tibia antes de servir.'],
    vistas: 1284, compartidos: 87, favoritos: 156,
    fechaPublicacion: '2026-03-15', etiquetas: ['gourmet', 'sin gluten', 'bosque chiquitano'],
    imagen: null
  },
  {
    id: 'r2', nombre: 'Bowl energético de asaí amazónico', estado: 'PUBLICADO',
    productoId: 'asai', productosRel: ['castana', 'miel'],
    categoria: 'Desayunos', dificultad: 'Fácil', tiempo: 10, porciones: 2,
    descripcion: 'Bowl cremoso de pulpa de asaí con castaña tostada, miel y frutas tropicales. Energía pura del bosque amazónico.',
    historia: 'Adaptación del açaí bowl brasileño con ingredientes 100% bolivianos de la amazonía norte.',
    ingredientes: [
      { nombre: 'Pulpa de asaí congelada', cantidad: 300, unidad: 'g' },
      { nombre: 'Castaña amazónica', cantidad: 50, unidad: 'g' },
      { nombre: 'Miel del monte', cantidad: 30, unidad: 'ml' },
      { nombre: 'Banana', cantidad: 1, unidad: '' },
    ],
    pasos: ['Procesar la pulpa con un poco de agua hasta obtener consistencia cremosa.', 'Verter en bowl frío.', 'Decorar con castaña, banana y miel.'],
    vistas: 2156, compartidos: 143, favoritos: 289,
    fechaPublicacion: '2026-02-01', etiquetas: ['saludable', 'vegano', 'amazonía'],
    imagen: null
  },
  {
    id: 'r3', nombre: 'Aceite de motacú con hierbas aromáticas', estado: 'BORRADOR',
    productoId: 'motacu', productosRel: ['paja-cedron', 'albahaca-silvestre'],
    categoria: 'Condimentos', dificultad: 'Fácil', tiempo: 20, porciones: 500,
    descripcion: 'Aceite infusionado de motacú con hierbas del bosque chiquitano. Condimento gourmet de origen local.',
    historia: 'El aceite de motacú ha sido utilizado por siglos en la gastronomía chiquitana. Esta versión aromatizada lo lleva a la alta cocina.',
    ingredientes: [
      { nombre: 'Aceite de motacú', cantidad: 500, unidad: 'ml' },
      { nombre: 'Paja cedrón', cantidad: 10, unidad: 'g' },
      { nombre: 'Albahaca silvestre', cantidad: 5, unidad: 'g' },
    ],
    pasos: ['Calentar el aceite a 60°C.', 'Agregar las hierbas y macerar 20 minutos.', 'Filtrar y envasar en frasco esterilizado.'],
    vistas: 420, compartidos: 18, favoritos: 45,
    fechaPublicacion: null, etiquetas: ['condimento', 'infusión', 'artesanal'],
    imagen: null
  },
  {
    id: 'r4', nombre: 'Helado de asaí con castaña caramelizada', estado: 'PUBLICADO',
    productoId: 'asai', productosRel: ['castana'],
    categoria: 'Postres', dificultad: 'Media', tiempo: 180, porciones: 6,
    descripcion: 'Helado artesanal de asaí amazónico coronado con castaña caramelizada y flor de sal.',
    historia: 'Este postre nació de la colaboración entre FAN y una heladería gourmet de Santa Cruz.',
    ingredientes: [
      { nombre: 'Pulpa de asaí', cantidad: 400, unidad: 'g' },
      { nombre: 'Crema de leche', cantidad: 200, unidad: 'ml' },
      { nombre: 'Castaña amazónica', cantidad: 80, unidad: 'g' },
      { nombre: 'Azúcar', cantidad: 120, unidad: 'g' },
    ],
    pasos: ['Mezclar el asaí con la crema.', 'Mantequear en máquina de helados.', 'Caramelizar la castaña con azúcar.', 'Servir con castaña y flor de sal.'],
    vistas: 892, compartidos: 62, favoritos: 134,
    fechaPublicacion: '2026-04-10', etiquetas: ['postre', 'gourmet', 'temporada'],
    imagen: null
  },
];

const ESTADO_RECETA = {
  PUBLICADO: { label: 'Publicada', bg: '#E3F1EA', color: '#1B5036', dot: '#2D6A4F' },
  BORRADOR: { label: 'Borrador', bg: '#F1F2F1', color: '#52564F', dot: '#9CA3AF' },
  REVISION: { label: 'En revisión', bg: '#FCEFE1', color: '#9A4D14', dot: '#F4A261' },
};

/* Tarjeta de receta */
function RecetaCard({ receta, onVer, onEditar, compact }) {
  const est = ESTADO_RECETA[receta.estado];
  const prod = FAN.getProduct(receta.productoId);
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onVer}>
      {/* Imagen placeholder */}
      <div className="h-36 flex items-center justify-center" style={{ background: prod ? prod.color + '20' : '#F4F7F4' }}>
        {prod ? <ProductGlyph product={prod} size={64} rounded="rounded-xl" /> : <Icon name="book" size={32} className="text-[#9aa79d]" />}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="text-[14px] font-semibold text-[#1f2a21] leading-snug flex-1" style={{ fontFamily: 'var(--font-display)' }}>{receta.nombre}</h4>
          <Badge style={{ background: est.bg, color: est.color }} className="shrink-0 text-[10px]"><span className="w-1.5 h-1.5 rounded-full" style={{ background: est.dot }}></span>{est.label}</Badge>
        </div>
        <div className="text-[12px] text-[#8a948a] mb-2 line-clamp-2">{receta.descripcion}</div>
        {!compact && (
          <div className="flex items-center gap-3 text-[11px] text-[#9aa79d] flex-wrap">
            <span className="flex items-center gap-1"><Icon name="clock" size={11} />{receta.tiempo} min</span>
            <span className="flex items-center gap-1"><Icon name="users" size={11} />{receta.porciones} por.</span>
            <span className="flex items-center gap-1"><Icon name="eye" size={11} />{receta.vistas.toLocaleString()}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ============================================================
   PANTALLA 8 — GESTIÓN DE RECETAS
   ============================================================ */
function AdminRecetas({ onVerReceta, onEditarReceta }) {
  const toast = useToast();
  const [filtro, setFiltro] = useState('todas');
  const [q, setQ] = useState('');
  const [recetas, setRecetas] = useState(RECETAS_DEMO);
  const [crearOpen, setCrearOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const filtradas = recetas.filter(r => {
    if (q && !r.nombre.toLowerCase().includes(q.toLowerCase())) return false;
    if (filtro === 'publicadas') return r.estado === 'PUBLICADO';
    if (filtro === 'borradores') return r.estado === 'BORRADOR';
    if (filtro === 'recientes') return true;
    return true;
  }).sort((a, b) => {
    if (filtro === 'mas-vistas') return b.vistas - a.vistas;
    return 0;
  });

  const toggleEstado = (id) => {
    setRecetas(rs => rs.map(r => r.id === id ? { ...r, estado: r.estado === 'PUBLICADO' ? 'BORRADOR' : 'PUBLICADO' } : r));
    toast('Estado actualizado');
  };
  const eliminar = (id) => {
    setRecetas(rs => rs.filter(r => r.id !== id));
    toast('Receta eliminada', { type: 'error' });
  };

  return (
    <div className="space-y-5">
      <SectionTitle overline="Recetario" title="Gestión de recetas"
        desc="Administra el recetario gastronómico de productos del bosque chiquitano."
        action={<Button onClick={() => setCrearOpen(true)}><Icon name="plus" size={16} />Nueva receta</Button>} />

      {/* KPIs rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat icon="book" label="Total recetas" value={recetas.length} />
        <Stat icon="eye" label="Publicadas" value={recetas.filter(r => r.estado === 'PUBLICADO').length} accent="#2D6A4F" />
        <Stat icon="edit" label="Borradores" value={recetas.filter(r => r.estado === 'BORRADOR').length} accent="#9aa79d" />
        <Stat icon="trending" label="Total vistas" value={recetas.reduce((s, r) => s + r.vistas, 0).toLocaleString()} accent="#F4A261" />
      </div>

      {/* Filtros + búsqueda */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="w-64"><Input icon="search" placeholder="Buscar receta…" value={q} onChange={e => setQ(e.target.value)} /></div>
        <div className="flex gap-1 flex-wrap">
          {[['todas', 'Todas'], ['publicadas', 'Publicadas'], ['borradores', 'Borradores'], ['mas-vistas', 'Más vistas'], ['recientes', 'Recientes']].map(([v, l]) => (
            <button key={v} onClick={() => setFiltro(v)}
              className={cn('h-8 px-3 rounded-lg text-[13px] font-medium border transition', filtro === v ? 'bg-[#2D6A4F] text-white border-transparent' : 'bg-white text-[#5e6b60] border-[#E2E7DE] hover:border-[#bcc9bf]')}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[60px_1fr_140px_120px_90px_100px_80px] gap-3 px-5 py-3 bg-[#FBFCFA] border-b border-[#EDF0EB] text-[11.5px] font-semibold uppercase tracking-wide text-[#9aa79d]">
          <span></span><span>Receta</span><span>Producto</span><span>Categoría</span><span>Estado</span><span>Vistas</span><span className="text-right">Acciones</span>
        </div>
        <div className="divide-y divide-[#F0F2EE]">
          {filtradas.map(r => {
            const prod = FAN.getProduct(r.productoId);
            const est = ESTADO_RECETA[r.estado];
            return (
              <div key={r.id} className="grid grid-cols-1 md:grid-cols-[60px_1fr_140px_120px_90px_100px_80px] gap-3 items-center px-5 py-3.5">
                {/* img */}
                <div className="hidden md:flex w-11 h-11 rounded-xl overflow-hidden items-center justify-center" style={{ background: prod ? prod.color + '20' : '#F4F7F4' }}>
                  {prod ? <ProductGlyph product={prod} size={34} rounded="rounded-lg" /> : <Icon name="book" size={20} className="text-[#9aa79d]" />}
                </div>
                {/* nombre */}
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-[#1f2a21] leading-snug">{r.nombre}</div>
                  <div className="text-[11.5px] text-[#9aa79d] flex flex-wrap gap-1.5 mt-0.5">
                    <span className="flex items-center gap-1"><Icon name="clock" size={11} />{r.tiempo} min</span>
                    <span className="flex items-center gap-1"><Icon name="star" size={11} />{r.dificultad}</span>
                  </div>
                </div>
                <span className="hidden md:block text-[13px] text-[#6b756c] truncate">{prod?.nombre || '—'}</span>
                <span className="hidden md:block text-[13px] text-[#6b756c]">{r.categoria}</span>
                <span className="hidden md:block">
                  <Badge style={{ background: est.bg, color: est.color }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: est.dot }}></span>{est.label}</Badge>
                </span>
                <span className="hidden md:flex items-center gap-1 text-[13px] text-[#6b756c]"><Icon name="eye" size={13} />{r.vistas.toLocaleString()}</span>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onVerReceta && onVerReceta(r)}><Icon name="eye" size={16} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setEditando(r)}><Icon name="edit" size={16} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleEstado(r.id)}><Icon name={r.estado === 'PUBLICADO' ? 'x' : 'check'} size={16} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => eliminar(r.id)}><Icon name="trash" size={16} /></Button>
                </div>
              </div>
            );
          })}
          {filtradas.length === 0 && (
            <div className="p-10 text-center text-[#9aa79d]">No se encontraron recetas.</div>
          )}
        </div>
      </Card>

      {/* Modal crear/editar */}
      {(crearOpen || editando) && (
        <FormReceta
          receta={editando}
          onClose={() => { setCrearOpen(false); setEditando(null); }}
          onGuardar={(nueva) => {
            if (editando) {
              setRecetas(rs => rs.map(r => r.id === nueva.id ? nueva : r));
              toast('Receta actualizada');
            } else {
              setRecetas(rs => [{ ...nueva, id: 'r' + Date.now(), vistas: 0, compartidos: 0, favoritos: 0, estado: 'BORRADOR' }, ...rs]);
              toast('Receta creada', { desc: 'Guardada como borrador.' });
            }
            setCrearOpen(false); setEditando(null);
          }}
        />
      )}
    </div>
  );
}

/* Formulario crear/editar receta */
function FormReceta({ receta, onClose, onGuardar }) {
  const toast = useToast();
  const isEdit = !!receta;
  const [form, setForm] = useState({
    nombre: receta?.nombre || '',
    descripcion: receta?.descripcion || '',
    historia: receta?.historia || '',
    tiempo: receta?.tiempo || 30,
    porciones: receta?.porciones || 4,
    dificultad: receta?.dificultad || 'Fácil',
    categoria: receta?.categoria || 'Postres',
    productoId: receta?.productoId || '',
    ingredientes: receta?.ingredientes || [{ nombre: '', cantidad: '', unidad: 'g' }],
    pasos: receta?.pasos || [''],
    estado: receta?.estado || 'BORRADOR',
    etiquetas: receta?.etiquetas?.join(', ') || '',
  });
  const addIngrediente = () => setForm(f => ({ ...f, ingredientes: [...f.ingredientes, { nombre: '', cantidad: '', unidad: 'g' }] }));
  const setIngrediente = (i, key, val) => setForm(f => { const arr = [...f.ingredientes]; arr[i] = { ...arr[i], [key]: val }; return { ...f, ingredientes: arr }; });
  const removeIngrediente = (i) => setForm(f => ({ ...f, ingredientes: f.ingredientes.filter((_, j) => j !== i) }));
  const addPaso = () => setForm(f => ({ ...f, pasos: [...f.pasos, ''] }));
  const setPaso = (i, val) => setForm(f => { const arr = [...f.pasos]; arr[i] = val; return { ...f, pasos: arr }; });
  const removePaso = (i) => setForm(f => ({ ...f, pasos: f.pasos.filter((_, j) => j !== i) }));

  return (
    <Modal open onClose={onClose} size="lg">
      <div className="px-6 pt-6 pb-4 border-b border-[#F0F2EE] flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#E3F1EA] flex items-center justify-center text-[#2D6A4F]"><Icon name="book" size={19} /></span>
        <div>
          <h2 className="text-[20px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>{isEdit ? 'Editar receta' : 'Nueva receta'}</h2>
          <p className="text-[12px] text-[#9aa79d]">Completa la información para publicar en el recetario FAN</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-[#F1F2F1] flex items-center justify-center ml-auto"><Icon name="x" size={18} className="text-[#5e6b60]" /></button>
      </div>

      <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[65vh]">
        {/* Info general */}
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d] mb-3">Información general</div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Nombre de la receta</label>
              <Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Tarta de almendra chiquitana" />
            </div>
            <div>
              <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Tiempo de preparación (min)</label>
              <Input value={form.tiempo} onChange={e => setForm(f => ({ ...f, tiempo: e.target.value }))} type="number" />
            </div>
            <div>
              <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Porciones</label>
              <Input value={form.porciones} onChange={e => setForm(f => ({ ...f, porciones: e.target.value }))} type="number" />
            </div>
            <div>
              <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Dificultad</label>
              <select value={form.dificultad} onChange={e => setForm(f => ({ ...f, dificultad: e.target.value }))}
                className="w-full h-10 rounded-lg border border-[#D9E0DA] px-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F]">
                {['Fácil', 'Media', 'Avanzada'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Categoría</label>
              <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                className="w-full h-10 rounded-lg border border-[#D9E0DA] px-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F]">
                {['Postres', 'Repostería', 'Desayunos', 'Entradas', 'Platos principales', 'Condimentos', 'Bebidas'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Producto principal</label>
              <select value={form.productoId} onChange={e => setForm(f => ({ ...f, productoId: e.target.value }))}
                className="w-full h-10 rounded-lg border border-[#D9E0DA] px-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F]">
                <option value="">Selecciona un producto…</option>
                {FAN.PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Descripción corta</label>
              <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} rows={2}
                className="w-full rounded-lg border border-[#D9E0DA] p-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Historia de la receta</label>
              <textarea value={form.historia} onChange={e => setForm(f => ({ ...f, historia: e.target.value }))} rows={2}
                placeholder="Origen, inspiración, contexto cultural…"
                className="w-full rounded-lg border border-[#D9E0DA] p-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] resize-none" />
            </div>
          </div>
        </div>

        {/* Ingredientes */}
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d] mb-3">Ingredientes</div>
          <div className="space-y-2">
            {form.ingredientes.map((ing, i) => (
              <div key={i} className="flex gap-2 items-center">
                <div className="flex-1"><Input placeholder="Ingrediente" value={ing.nombre} onChange={e => setIngrediente(i, 'nombre', e.target.value)} /></div>
                <div className="w-20"><Input placeholder="Cant." value={ing.cantidad} onChange={e => setIngrediente(i, 'cantidad', e.target.value)} /></div>
                <select value={ing.unidad} onChange={e => setIngrediente(i, 'unidad', e.target.value)}
                  className="h-10 w-16 rounded-lg border border-[#D9E0DA] px-2 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F]">
                  {['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'taza', 'u'].map(u => <option key={u}>{u}</option>)}
                </select>
                <Button variant="ghost" size="icon" onClick={() => removeIngrediente(i)}><Icon name="trash" size={15} /></Button>
              </div>
            ))}
          </div>
          <button onClick={addIngrediente} className="mt-2 text-[12.5px] text-[#2D6A4F] font-medium flex items-center gap-1 hover:underline">
            <Icon name="plus" size={14} />Agregar ingrediente
          </button>
        </div>

        {/* Pasos */}
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d] mb-3">Preparación paso a paso</div>
          <div className="space-y-2">
            {form.pasos.map((paso, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-1.5">{i + 1}</span>
                <textarea value={paso} onChange={e => setPaso(i, e.target.value)} rows={2}
                  className="flex-1 rounded-lg border border-[#D9E0DA] p-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] resize-none" />
                <Button variant="ghost" size="icon" className="mt-0.5" onClick={() => removePaso(i)}><Icon name="trash" size={15} /></Button>
              </div>
            ))}
          </div>
          <button onClick={addPaso} className="mt-2 text-[12.5px] text-[#2D6A4F] font-medium flex items-center gap-1 hover:underline">
            <Icon name="plus" size={14} />Agregar paso
          </button>
        </div>

        {/* Publicación */}
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d] mb-3">Publicación</div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Estado</label>
              <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
                className="w-full h-10 rounded-lg border border-[#D9E0DA] px-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F]">
                {Object.entries(ESTADO_RECETA).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Etiquetas</label>
              <Input value={form.etiquetas} onChange={e => setForm(f => ({ ...f, etiquetas: e.target.value }))} placeholder="gourmet, vegano, temporada" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-3 border-t border-[#F0F2EE] pt-4">
        <Button variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
        <Button className="flex-1" onClick={() => {
          if (!form.nombre.trim()) { toast('El nombre es requerido', { type: 'error' }); return; }
          onGuardar({ ...receta, ...form, etiquetas: form.etiquetas.split(',').map(s => s.trim()).filter(Boolean) });
        }}><Icon name="check" size={16} />{isEdit ? 'Guardar cambios' : 'Crear receta'}</Button>
      </div>
    </Modal>
  );
}

/* ============================================================
   PANTALLA 8.1 — VER RECETA (Admin)
   ============================================================ */
function AdminVerReceta({ receta, onClose, onEditar }) {
  const toast = useToast();
  const [tab, setTab] = useState('preparacion');
  if (!receta) return null;
  const prod = FAN.getProduct(receta.productoId);
  const est = ESTADO_RECETA[receta.estado];
  const prodsRel = (receta.productosRel || []).map(FAN.getProduct).filter(Boolean);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden border border-[#E8EBE6]" style={{ background: prod ? prod.color + '14' : '#F4F7F4' }}>
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-5 flex-wrap sm:flex-nowrap">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shrink-0" style={{ background: prod ? prod.color + '30' : '#EEF1EC' }}>
              {prod ? <ProductGlyph product={prod} size={56} rounded="rounded-xl" /> : <Icon name="book" size={40} className="text-[#9aa79d]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge style={{ background: est.bg, color: est.color }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: est.dot }}></span>{est.label}</Badge>
                <Badge className="bg-white/60 text-[#6b756c]">{receta.categoria}</Badge>
                {prod && <Badge style={{ background: prod.color + '20', color: prod.color }}>{prod.nombre}</Badge>}
              </div>
              <h1 className="text-[24px] sm:text-[30px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>{receta.nombre}</h1>
              <p className="text-[14px] text-[#6b756c] mt-2 max-w-xl leading-relaxed">{receta.descripcion}</p>
              {/* Meta */}
              <div className="flex items-center gap-4 mt-3 flex-wrap text-[13px] text-[#8a948a]">
                <span className="flex items-center gap-1.5"><Icon name="clock" size={14} className="text-[#2D6A4F]" />{receta.tiempo} min</span>
                <span className="flex items-center gap-1.5"><Icon name="users" size={14} className="text-[#2D6A4F]" />{receta.porciones} porciones</span>
                <span className="flex items-center gap-1.5"><Icon name="star" size={14} className="text-[#F4A261]" />{receta.dificultad}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" onClick={() => onEditar && onEditar(receta)}><Icon name="edit" size={15} />Editar</Button>
              <Button size="sm" variant="secondary" onClick={() => toast(receta.estado === 'PUBLICADO' ? 'Despublicada' : 'Publicada')}>
                <Icon name={receta.estado === 'PUBLICADO' ? 'x' : 'check'} size={15} />
                {receta.estado === 'PUBLICADO' ? 'Despublicar' : 'Publicar'}
              </Button>
              <Button size="sm" variant="danger" onClick={() => { toast('Receta eliminada', { type: 'error' }); onClose && onClose(); }}><Icon name="trash" size={15} /></Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 border-t border-[#E8EBE6] bg-white/50">
          {[['eye', receta.vistas.toLocaleString(), 'Visualizaciones'], ['send', receta.compartidos, 'Compartidos'], ['heart', receta.favoritos, 'Favoritos'], ['package', (receta.productosRel?.length || 0) + 1, 'Productos']].map(([ic, v, l]) => (
            <div key={l} className="p-3 text-center border-r border-[#E8EBE6] last:border-0">
              <div className="text-[20px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>{v}</div>
              <div className="text-[11px] text-[#8a948a] flex items-center justify-center gap-1 mt-0.5"><Icon name={ic} size={11} />{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <SegTabs tabs={[{ value: 'preparacion', label: 'Preparación', icon: 'list' }, { value: 'productos', label: 'Productos', icon: 'leaf' }, { value: 'similares', label: 'Similares', icon: 'book' }]} value={tab} onChange={setTab} />

      {tab === 'preparacion' && (
        <div className="grid lg:grid-cols-[1fr_300px] gap-5">
          <div className="space-y-5">
            {/* Historia */}
            {receta.historia && (
              <Card className="p-5 border-l-4 border-[#2D6A4F]">
                <div className="text-[11px] uppercase tracking-wide font-semibold text-[#9aa79d] mb-2">Historia de la receta</div>
                <p className="text-[14px] text-[#48524a] leading-relaxed italic">{receta.historia}</p>
              </Card>
            )}
            {/* Pasos */}
            <Card className="p-5">
              <h3 className="text-[16px] font-semibold text-[#1f2a21] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Preparación</h3>
              <div className="space-y-4">
                {(receta.pasos || []).map((paso, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#2D6A4F] text-white text-[13px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <p className="text-[14px] text-[#48524a] leading-relaxed pt-1">{paso}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Ingredientes */}
          <Card className="p-5 h-fit">
            <h3 className="text-[15px] font-semibold text-[#1f2a21] mb-3" style={{ fontFamily: 'var(--font-display)' }}>Ingredientes</h3>
            <div className="space-y-2">
              {(receta.ingredientes || []).map((ing, i) => (
                <div key={i} className="flex items-center justify-between gap-2 py-2 border-b border-[#F0F2EE] last:border-0">
                  <span className="text-[13.5px] text-[#48524a]">{ing.nombre}</span>
                  <span className="text-[13px] font-semibold text-[#1f2a21] shrink-0">{ing.cantidad} {ing.unidad}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#F0F2EE]">
              <div className="flex flex-wrap gap-1.5">
                {(receta.etiquetas || []).map(t => <Badge key={t} className="bg-[#EDF2ED] text-[#2D6A4F]">#{t}</Badge>)}
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'productos' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[prod, ...prodsRel].filter(Boolean).map(p => (
            <Card key={p.id} className="p-4 flex items-center gap-4">
              <ProductGlyph product={p} size={48} rounded="rounded-xl" />
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[#1f2a21]">{p.nombre}</div>
                <div className="text-[12px] italic text-[#9aa79d]">{p.cientifico}</div>
                <StatusBadge estado={FAN.estadoTemporada(p)} size="sm" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'similares' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECETAS_DEMO.filter(r => r.id !== receta.id && (r.categoria === receta.categoria || r.productoId === receta.productoId)).slice(0, 3).map(r => (
            <RecetaCard key={r.id} receta={r} onVer={() => toast('Ver receta: ' + r.nombre)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SCREEN ADMIN V2 — Router ampliado
   ============================================================ */
function ScreenAdminV2({ view = 'resumen', setView, onApproveProducer }) {
  const [productoVer, setProductoVer] = useState(null);
  const [recetaVer, setRecetaVer] = useState(null);
  const [editandoReceta, setEditandoReceta] = useState(null);

  // Navegar a ver producto
  const handleVerProducto = (p) => { setProductoVer(p); setView('ver-producto'); };
  const handleVerReceta = (r) => { setRecetaVer(r); setView('ver-receta'); };

  return (
    <div id="admin-v2">
      {/* Breadcrumb para sub-vistas */}
      {(view === 'ver-producto' || view === 'ver-receta') && (
        <button onClick={() => { setView(view === 'ver-producto' ? 'productos' : 'recetas'); setProductoVer(null); setRecetaVer(null); }}
          className="flex items-center gap-1.5 text-[13px] text-[#2D6A4F] font-medium mb-5 hover:underline">
          <Icon name="chevronLeft" size={16} />Volver
        </button>
      )}

      {view === 'resumen' && <AdminDashboardV2 onTab={setView} onOpenProduct={handleVerProducto} />}
      {view === 'aprobaciones' && <AdminAprobaciones onApproveProducer={onApproveProducer} />}
      {view === 'productos' && (
        <div className="space-y-5">
          <AdminProductos />
          {/* grid de cards clickeable */}
          <h3 className="text-[16px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)' }}>Vista rápida del catálogo</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {FAN.PRODUCTS.map(p => (
              <div key={p.id} onClick={() => handleVerProducto(p)} className="cursor-pointer">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <ProductGlyph product={p} size={40} rounded="rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-[#1f2a21] truncate">{p.nombre}</div>
                      <StatusBadge estado={FAN.estadoTemporada(p)} size="sm" />
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
      {view === 'ver-producto' && productoVer && <AdminVerProducto product={productoVer} onClose={() => { setView('productos'); setProductoVer(null); }} onEdit={() => {}} />}
      {view === 'temporadas' && <AdminTemporadas />}
      {view === 'suscriptores' && <AdminSuscriptores />}
      {view === 'alertas' && <AdminAlertas />}
      {view === 'recetas' && <AdminRecetas onVerReceta={handleVerReceta} onEditarReceta={r => { setEditandoReceta(r); }} />}
      {view === 'ver-receta' && recetaVer && <AdminVerReceta receta={recetaVer} onClose={() => { setView('recetas'); setRecetaVer(null); }} onEditar={r => { setRecetaVer(null); setEditandoReceta(r); setView('recetas'); }} />}
      {view === 'perfil' && <ProfileAdmin />}
    </div>
  );
}

window.AdminV2 = { ScreenAdminV2, AdminDashboardV2, AdminVerProducto, AdminRecetas, AdminVerReceta, RecetaCard, RECETAS_DEMO, ESTADO_RECETA };
Object.assign(window, { ScreenAdminV2, AdminDashboardV2, AdminVerProducto, AdminRecetas, AdminVerReceta, RecetaCard, RECETAS_DEMO, ESTADO_RECETA });
