/* ============================================================
   PLATAFORMA FAN — Admin: catálogo, temporadas, suscriptores,
   alertas + shell del panel admin
   ============================================================ */

/* ---------- Gestión de productos del catálogo ---------- */
function AdminProductos(){
  const toast = useToast();
  const [q, setQ] = useState('');
  const items = FAN.PRODUCTS.filter(p=> !q || p.nombre.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-5">
      <SectionTitle overline="Catálogo general" title="Gestión de productos"
        action={<Button onClick={()=>toast('Nuevo producto', { desc:'(Formulario de alta — demo)' })}><Icon name="plus" size={16} />Agregar producto</Button>} />
      <div className="lg:w-80"><Input icon="search" placeholder="Buscar producto…" value={q} onChange={e=>setQ(e.target.value)} /></div>
      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_140px_120px_90px] gap-3 px-4 py-3 bg-[#FBFCFA] border-b border-[#EDF0EB] text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d]">
          <span>Producto</span><span>Categoría</span><span>Estado hoy</span><span className="text-right">Acción</span>
        </div>
        <div className="divide-y divide-[#F0F2EE]">
          {items.map(p=>{
            const est = FAN.estadoTemporada(p);
            return (
              <div key={p.id} className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_140px_120px_90px] gap-3 items-center px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <ProductGlyph product={p} size={40} rounded="rounded-lg" />
                  <div className="min-w-0"><div className="text-[14px] font-semibold text-[#1f2a21] truncate">{p.nombre}</div><div className="text-[12px] italic text-[#9aa79d] truncate">{p.cientifico}</div></div>
                </div>
                <span className="hidden md:block text-[13px] text-[#6b756c]">{p.categoria}</span>
                <span className="hidden md:block"><StatusBadge estado={est} size="sm" /></span>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={()=>toast('Editar '+p.nombre, {desc:'(demo)'})}><Icon name="edit" size={16} /></Button>
                  <Button variant="ghost" size="icon"><Icon name="trash" size={16} /></Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ---------- Gestión de temporadas (editar el calendario) ---------- */
function AdminTemporadas(){
  const toast = useToast();
  const [data, setData] = useState(()=> Object.fromEntries(FAN.PRODUCTS.map(p=>[p.id, [...p.m]])));
  const toggle = (id, mes) => setData(d=>{ const arr = d[id].includes(mes)? d[id].filter(x=>x!==mes):[...d[id], mes]; return {...d, [id]:arr}; });
  return (
    <div className="space-y-5">
      <SectionTitle overline="Calendario" title="Gestión de temporadas"
        desc="Actualiza los meses de disponibilidad de cada producto. Los cambios se reflejan al instante en el dashboard público."
        action={<Button onClick={()=>toast('Calendario actualizado', { desc:'Los suscriptores serán notificados de los cambios.' })}><Icon name="check" size={16} />Guardar calendario</Button>} />
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minWidth:760 }}>
            <div className="grid sticky top-0 bg-[#FBFCFA] border-b border-[#EDF0EB] z-10" style={{ gridTemplateColumns:'190px repeat(12,1fr)' }}>
              <div className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d]">Producto</div>
              {FAN.MONTHS_SHORT.map((m,i)=><div key={i} className={cn('py-3 text-center text-[12px] font-semibold', i===FAN.CURRENT_MONTH?'text-[#2D6A4F]':'text-[#9aa79d]')}>{m}</div>)}
            </div>
            {FAN.PRODUCTS.map(p=>(
              <div key={p.id} className="grid items-center border-b border-[#F2F4F0] last:border-0 hover:bg-[#FAFBF9]" style={{ gridTemplateColumns:'190px repeat(12,1fr)' }}>
                <div className="px-4 py-2 flex items-center gap-2.5 min-w-0">
                  <ProductGlyph product={p} size={30} rounded="rounded-md" />
                  <span className="text-[13px] font-semibold text-[#1f2a21] truncate">{p.nombre}</span>
                </div>
                {FAN.MONTHS_SHORT.map((_,i)=>{
                  const on = data[p.id].includes(i);
                  return (
                    <div key={i} className="flex justify-center py-2">
                      <button onClick={()=>toggle(p.id,i)} className={cn('w-7 h-7 rounded-md transition flex items-center justify-center', on?'':'hover:bg-[#EDF0EB]')} style={ on?{ background:p.color }:{ border:'1.5px dashed #d8ddd6' }}>
                        {on && <Icon name="check" size={13} className="text-white" stroke={3} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>
      <p className="text-[12.5px] text-[#9aa79d] flex items-center gap-1.5"><Icon name="info" size={14} />Toca una celda para marcar o desmarcar el mes de disponibilidad. FAN gestiona el calendario general; los productores no pueden modificarlo.</p>
    </div>
  );
}

/* ---------- Gestión de suscriptores ---------- */
function AdminSuscriptores(){
  const subs = FAN.SUSCRIPTORES;
  return (
    <div className="space-y-5">
      <SectionTitle overline="Audiencia" title="Suscriptores" desc={`${FAN.METRICAS.suscriptores.toLocaleString()} personas reciben alertas de temporada.`} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat icon="bell" label="Total suscriptores" value={FAN.METRICAS.suscriptores.toLocaleString()} />
        <Stat icon="trending" label="Nuevos este mes" value={'+'+FAN.METRICAS.suscriptoresNuevos} accent="#74C69D" />
        <Stat icon="whatsapp" label="Vía WhatsApp" value="58%" accent="#2D6A4F" />
        <Stat icon="mail" label="Vía correo" value="42%" accent="#F4A261" />
      </div>
      <Card className="overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1.4fr_1fr_1.4fr_80px] gap-3 px-4 py-3 bg-[#FBFCFA] border-b border-[#EDF0EB] text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d]">
          <span>Suscriptor</span><span>Canal</span><span>Intereses</span><span>Estado</span>
        </div>
        <div className="divide-y divide-[#F0F2EE]">
          {subs.map(s=>(
            <div key={s.id} className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1.4fr_80px] gap-2 sm:gap-3 sm:items-center px-4 py-3">
              <div><div className="text-[14px] font-semibold text-[#1f2a21]">{s.nombre}</div><div className="text-[12px] text-[#9aa79d]">{s.valor}</div></div>
              <span className="text-[13px] text-[#6b756c] flex items-center gap-1.5"><Icon name={s.canal==='WhatsApp'?'whatsapp':'mail'} size={14} className="text-[#2D6A4F]" />{s.canal}</span>
              <div className="flex flex-wrap gap-1.5">{s.intereses.map(FAN.getProduct).filter(Boolean).slice(0,3).map(p=><Badge key={p.id} className="bg-[#EDF2ED] text-[#3a4a3f]">{p.nombre}</Badge>)}</div>
              <Badge style={{ background:s.activo?'#E3F1EA':'#F1F2F1', color:s.activo?'#1B5036':'#52564F' }} className="w-fit"><span className="w-1.5 h-1.5 rounded-full" style={{ background:s.activo?'#2D6A4F':'#9CA3AF' }}></span>{s.activo?'Activo':'Baja'}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- Enviar alertas manuales ---------- */
function AdminAlertas(){
  const toast = useToast();
  const [prod, setProd] = useState('');
  const [tipo, setTipo] = useState('inicio');
  const [msg, setMsg] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const tipos = [['inicio','Inicia temporada','#2D6A4F'],['fin','Termina pronto','#F4A261'],['productor','Nuevo productor','#2D6A4F']];
  const seleccionado = FAN.getProduct(prod);
  const alcance = seleccionado ? FAN.SUSCRIPTORES.filter(s=>s.intereses.includes(prod)).length : 0;
  const plantilla = () => {
    if(!seleccionado) return;
    const t = tipo==='inicio'?`🌿 ¡${seleccionado.nombre} ya está en temporada! Es el momento óptimo para incorporarlo a tu menú. Encuentra productores en la plataforma FAN.`
      : tipo==='fin'?`⏳ La temporada de ${seleccionado.nombre} está por terminar. Aprovecha las últimas semanas de cosecha.`
      : `📣 Nuevo productor disponible de ${seleccionado.nombre}. Conócelo y contáctalo en la plataforma FAN.`;
    setMsg(t);
  };
  return (
    <div className="space-y-4 sm:space-y-5 max-w-3xl w-full">
      <SectionTitle overline="Comunicación" title="Enviar alerta a suscriptores" desc="Notifica manualmente a quienes se interesan por un producto cuando inicia o termina su temporada." />
      <Card className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="relative">
          <label className="text-[13px] font-semibold text-[#2a352c] mb-2 block">Producto</label>
          <button
            type="button"
            onClick={()=>setPickerOpen(o=>!o)}
            className="w-full h-11 sm:h-10 rounded-lg border border-[#D9E0DA] bg-white px-3 text-[15px] sm:text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] flex items-center justify-between gap-3 text-left"
          >
            <span className={cn('min-w-0 truncate', !seleccionado && 'text-[#8a948a]')}>
              {seleccionado ? seleccionado.nombre : 'Selecciona un producto…'}
            </span>
            <Icon name="chevronDown" size={16} className={cn('shrink-0 text-[#8a948a] transition', pickerOpen && 'rotate-180')} />
          </button>
          {pickerOpen && (
            <>
              <button type="button" className="fixed inset-0 z-20" aria-label="Cerrar selector de producto" onClick={()=>setPickerOpen(false)} />
              <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-xl border border-[#E2E7DE] bg-white shadow-2xl overflow-hidden">
                <div className="max-h-56 overflow-y-auto py-1">
                  <button
                    type="button"
                    onClick={()=>{ setProd(''); setPickerOpen(false); }}
                    className={cn('w-full px-3 py-2.5 text-left text-[14px] transition', !prod ? 'bg-[#2D6A4F] text-white' : 'hover:bg-[#F4F7F4] text-[#2a352c]')}
                  >
                    Selecciona un producto…
                  </button>
                  {FAN.PRODUCTS.map(p=>{
                    const active = prod===p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={()=>{ setProd(p.id); setPickerOpen(false); }}
                        className={cn('w-full px-3 py-2.5 text-left text-[14px] transition', active ? 'bg-[#EAF4EE] text-[#1B5036] font-medium' : 'hover:bg-[#F4F7F4] text-[#2a352c]')}
                      >
                        {p.nombre}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
        <div>
          <label className="text-[13px] font-semibold text-[#2a352c] mb-2 block">Tipo de alerta</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {tipos.map(([v,l,c])=>(
              <button key={v} onClick={()=>setTipo(v)} className={cn('w-full border rounded-xl px-3 py-3 text-[13px] font-medium transition flex items-center gap-2 justify-start sm:justify-center', tipo===v?'border-transparent text-white':'bg-white border-[#E2E7DE] text-[#5e6b60] hover:border-[#cfdbd1]')} style={tipo===v?{ background:c }:{}}>
                <span className="w-2 h-2 rounded-full" style={{ background: tipo===v?'#fff':c }}></span>{l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2"><label className="text-[13px] font-semibold text-[#2a352c]">Mensaje</label><button onClick={plantilla} disabled={!seleccionado} className="text-[12px] text-[#2D6A4F] font-medium flex items-center gap-1 disabled:opacity-40"><Icon name="sparkles" size={13} />Usar plantilla</button></div>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4} placeholder="Escribe el mensaje de la alerta…" className="w-full rounded-lg border border-[#D9E0DA] p-3 text-[15px] sm:text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 resize-none" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#F4F7F4] rounded-xl px-4 py-3">
          <div className="text-[13px] text-[#48524a] flex items-center gap-2"><Icon name="users" size={16} className="text-[#2D6A4F]" />Alcance estimado: <span className="font-semibold text-[#1f2a21]">{alcance} suscriptor{alcance!==1?'es':''}</span></div>
        </div>
        <Button size="lg" className="w-full" disabled={!seleccionado||!msg} onClick={()=>{ toast('Alerta enviada', { desc:`Notificados ${alcance} suscriptores de ${seleccionado.nombre}.` }); setMsg(''); setProd(''); }}><Icon name="send" size={16} />Enviar alerta ahora</Button>
      </Card>
    </div>
  );
}

/* ---------- Router de secciones admin (nav la maneja el sidebar global) ---------- */
function ScreenAdmin({ view='resumen', setView, onApproveProducer }){
  return (
    <div id="admin">
      {view==='resumen' && <AdminDashboard onTab={setView} />}
      {view==='aprobaciones' && <AdminAprobaciones onApproveProducer={onApproveProducer} />}
      {view==='productos' && <AdminProductos />}
      {view==='temporadas' && <AdminTemporadas />}
      {view==='suscriptores' && <AdminSuscriptores />}
      {view==='alertas' && <AdminAlertas />}
      {view==='perfil' && <ProfileAdmin />}
    </div>
  );
}

window.AdminScreens = { ScreenAdmin };
Object.assign(window, { ScreenAdmin });
