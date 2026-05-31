/* ============================================================
   PLATAFORMA FAN — Panel del Productor (router por sidebar)
   ============================================================ */

// Datos con fallback — vienen de producer.jsx que carga antes
const ESTADO_PRODUCTOR   = window.ESTADO_PRODUCTOR || {
  PENDIENTE:  { label:'Pendiente de aprobación', bg:'#FCEFE1', color:'#9A4D14', dot:'#F4A261' },
  APROBADO:   { label:'Aprobado',                bg:'#E3F1EA', color:'#1B5036', dot:'#2D6A4F' },
  RECHAZADO:  { label:'Rechazado',               bg:'#FCEEF0', color:'#B23A48', dot:'#B23A48' },
  SUSPENDIDO: { label:'Suspendido',              bg:'#F1F2F1', color:'#52564F', dot:'#9CA3AF' },
};
const ESTADO_PROD = window.ESTADO_PROD || {
  PUBLICADO: { label:'Publicado',   bg:'#E3F1EA', color:'#1B5036', dot:'#2D6A4F' },
  BORRADOR:  { label:'Borrador',    bg:'#F1F2F1', color:'#52564F', dot:'#9CA3AF' },
  REVISION:  { label:'En revisión', bg:'#FCEFE1', color:'#9A4D14', dot:'#F4A261' },
  PAUSADO:   { label:'Pausado',     bg:'#E3F1EA', color:'#1B5036', dot:'#2D6A4F' },
};

/* ---------- Mini gráfica de barras (local — no depende de admin.jsx) ---------- */
function MiniBarChart({ data, labels, color='#6B4226', height=140 }){
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((v,i)=>(
        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
          <div className="w-full rounded-t-md transition-all relative"
            style={{ height:(v/max*(height-26))+'px',
              background: i===data.length-1
                ? `linear-gradient(180deg,${color} 0%,${color}bb 100%)`
                : `linear-gradient(180deg,${color}88 0%,${color}44 100%)` }}>
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#48524a] opacity-0 group-hover:opacity-100 transition tabular-nums">{v}</span>
          </div>
          <span className="text-[10px] text-[#9aa79d]">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Modal de edición de producto ---------- */
function EditarProducto({ producto, onClose, onGuardar }){
  // Resueltos al momento de render (todos los scripts ya cargaron)
  const Field = window.Field;
  const [form, setForm] = useState({
    nombre: producto.nombre,
    desc: producto.desc,
    presentaciones: (producto.presentaciones||[]).join(', '),
  });
  const ep = ESTADO_PROD[producto.estadoPub];
  return (
    <Modal open onClose={onClose} size="md">
      <div className="px-6 pt-6 pb-5 border-b border-[#F0F2EE] flex items-center gap-3">
        <ProductGlyph product={producto} size={44} rounded="rounded-xl" />
        <div className="flex-1">
          <h2 className="text-[19px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>Editar producto</h2>
          <Badge style={{ background:ep.bg, color:ep.color }}><span className="w-1.5 h-1.5 rounded-full" style={{ background:ep.dot }}></span>{ep.label}</Badge>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-[#F1F2F1] flex items-center justify-center text-[#5e6b60]"><Icon name="x" size={18} /></button>
      </div>
      <div className="px-6 py-5 space-y-4">
        <Field label="Nombre del producto" full>
          <Input value={form.nombre} onChange={e=>setForm(f=>({...f, nombre:e.target.value}))} />
        </Field>
        <Field label="Descripción" full>
          <textarea value={form.desc} onChange={e=>setForm(f=>({...f, desc:e.target.value}))} rows={3}
            className="w-full rounded-lg border border-[#D9E0DA] p-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 resize-none" />
        </Field>
        <Field label="Presentaciones disponibles" full>
          <Input value={form.presentaciones} onChange={e=>setForm(f=>({...f, presentaciones:e.target.value}))} placeholder="Ej: Aceite 500 ml, Pulpa 1 kg" />
          <p className="text-[11.5px] text-[#9aa79d] mt-1.5">Separa las presentaciones con coma.</p>
        </Field>
      </div>
      <div className="px-6 pb-6 flex gap-3 border-t border-[#F0F2EE] pt-4">
        <Button variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
        <Button className="flex-1" onClick={()=>onGuardar({
          ...producto, ...form,
          presentaciones: form.presentaciones.split(',').map(s=>s.trim()).filter(Boolean)
        })}><Icon name="check" size={16} />Guardar cambios</Button>
      </div>
    </Modal>
  );
}

function ScreenProductor({ view='productos', subir, setSubir, estado, setEstado }){
  // Resueltos al momento de render — todos los scripts ya cargaron para entonces
  const EstadoCuentaBanner = window.EstadoCuentaBanner;
  const SubirProductoIA    = window.SubirProductoIA;
  const ProfileHeader      = window.ProfileHeader;
  const Field              = window.Field;
  const Pill               = window.Pill;

  const toast = useToast();
  const yo = FAN.getProductor('sabores-chiquitos');

  const baseProds = yo.productos.map(FAN.getProduct).filter(Boolean).map(p=>({ ...p, estadoPub: estado==='APROBADO'?'PUBLICADO':'BORRADOR' }));
  const [misProductos, setMisProductos] = useState(baseProds);
  const [editando, setEditando] = useState(null);
  const [zoomProd, setZoomProd] = useState(null);
  const [layoutProd, setLayoutProd] = useState('grilla');

  const yoPerfil = { nombre:yo.nombre, tipo:yo.tipo, ubicacion:yo.ubicacion, desc:yo.desc, tel:yo.contacto.tel, whatsapp:'+'+yo.contacto.whatsapp, correo:yo.contacto.correo };
  const [perfil, setPerfil] = useState(yoPerfil);
  const [perfilSaved, setPerfilSaved] = useState(yoPerfil);

  useEffect(()=>{ setMisProductos(ms=> ms.map(p=>({ ...p, estadoPub: estado==='APROBADO' && p.estadoPub==='BORRADOR' ? 'PUBLICADO' : p.estadoPub }))); }, [estado]);
  const aprobar = () => { setEstado('APROBADO'); toast('¡Felicidades! FAN aprobó tu cuenta', { desc:'Tus productos ya son visibles en el catálogo.' }); };

  return (
    <div id="productor" className="max-w-5xl mx-auto">

      {/* Header del perfil (solo en productos y métricas) */}
      {view!=='perfil' && (
        <div className="flex items-center gap-4 mb-6">
          <Avatar initials={yo.iniciales} color="#6B4226" size={52} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.2 }}>{perfilSaved.nombre}</h1>
              <Badge style={{ background:ESTADO_PRODUCTOR[estado].bg, color:ESTADO_PRODUCTOR[estado].color }}>
                <span className="w-2 h-2 rounded-full" style={{ background:ESTADO_PRODUCTOR[estado].dot }}></span>
                {ESTADO_PRODUCTOR[estado].label}
              </Badge>
            </div>
            <div className="text-[13.5px] text-[#8a948a] flex items-center gap-1.5 mt-0.5">
              <Icon name="mapPin" size={14} />{perfilSaved.ubicacion}
            </div>
          </div>
          {/* Botón "Subir producto" solo en vista de productos */}
          {view==='productos' && (
            <Button onClick={()=>setSubir(true)} className="hidden sm:inline-flex shrink-0">
              <Icon name="sparkles" size={16} />Subir producto
            </Button>
          )}
        </div>
      )}

      {view!=='perfil' && <EstadoCuentaBanner estado={estado} onAprobar={aprobar} />}

      {/* Vista: Mis productos */}
      {view==='productos' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[18px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)' }}>Mis productos</h2>
            <div className="flex items-center gap-2">
              {/* Toggle lista / grilla */}
              <div className="flex items-center bg-[#F1F2F1] rounded-lg p-0.5 gap-0.5">
                <button
                  onClick={()=>setLayoutProd('lista')}
                  title="Vista lista"
                  className={`w-8 h-8 rounded-md flex items-center justify-center transition ${layoutProd==='lista' ? 'bg-white shadow-sm text-[#2D6A4F]' : 'text-[#9aa79d] hover:text-[#52564F]'}`}>
                  <Icon name="list" size={16} />
                </button>
                <button
                  onClick={()=>setLayoutProd('grilla')}
                  title="Vista grilla"
                  className={`w-8 h-8 rounded-md flex items-center justify-center transition ${layoutProd==='grilla' ? 'bg-white shadow-sm text-[#2D6A4F]' : 'text-[#9aa79d] hover:text-[#52564F]'}`}>
                  <Icon name="grid" size={16} />
                </button>
              </div>
              <Button onClick={()=>setSubir(true)} size="sm" className="sm:hidden">
                <Icon name="sparkles" size={15} />Subir
              </Button>
            </div>
          </div>

          {/* Layout: lista */}
          {layoutProd==='lista' && misProductos.map(p=>{
            const ep = ESTADO_PROD[p.estadoPub];
            return (
              <Card key={p.id} className="flex items-stretch overflow-hidden hover:border-[#cfdbd1] transition p-0">
                {/* Imagen ocupa todo el alto del card */}
                <div className="relative w-24 sm:w-28 shrink-0 rounded-l-xl overflow-hidden" style={{ background:`linear-gradient(135deg, ${p.color}26, ${p.color}14)` }}>
                  <ProductGlyph product={p} full />
                </div>
                {/* Contenido */}
                <div className="flex flex-1 min-w-0 items-center gap-4 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-semibold text-[#1f2a21] text-[15px]" style={{ fontFamily:'var(--font-display)' }}>{p.nombre}</span>
                      <Badge style={{ background:ep.bg, color:ep.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background:ep.dot }}></span>{ep.label}
                      </Badge>
                    </div>
                    <div className="text-[12.5px] text-[#8a948a] line-clamp-1">{p.desc}</div>
                    {p.presentaciones?.length>0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {p.presentaciones.slice(0,3).map(pr=>(
                          <span key={pr} className="text-[10.5px] text-[#6b756c] bg-[#F4F7F4] rounded-full px-2 py-0.5">{pr}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={()=>setEditando(p)} title="Editar">
                      <Icon name="edit" size={17} />
                    </Button>
                    <Button variant="ghost" size="icon" title="Vista pública">
                      <Icon name="eye" size={17} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Layout: grilla */}
          {layoutProd==='grilla' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {misProductos.map(p=>{
                const ep = ESTADO_PROD[p.estadoPub];
                return (
                  <Card key={p.id} className="flex flex-col overflow-hidden hover:border-[#cfdbd1] transition p-0">
                    {/* Imagen — igual que catálogo público */}
                    <div className="relative h-36 sm:h-44 overflow-hidden" style={{ background:`linear-gradient(135deg, ${p.color}26, ${p.color}14)` }}>
                      <ProductGlyph product={p} full />
                      <div className="absolute inset-0 pointer-events-none" style={{ background:'linear-gradient(180deg,rgba(255,255,255,0.06) 0%,rgba(255,255,255,0) 22%,rgba(0,0,0,0.06) 100%)' }}></div>
                      <div className="absolute top-2.5 left-2.5">
                        <Badge style={{ background:ep.bg, color:ep.color }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background:ep.dot }}></span>{ep.label}
                        </Badge>
                      </div>
                    </div>
                    {/* Contenido */}
                    <div className="flex flex-col flex-1 p-3.5 gap-1.5">
                      <span className="font-semibold text-[#1f2a21] text-[15px] leading-snug" style={{ fontFamily:'var(--font-display)' }}>{p.nombre}</span>
                      <div className="text-[12px] text-[#8a948a] line-clamp-2 leading-relaxed flex-1">{p.desc}</div>
                      {p.presentaciones?.length>0 && (
                        <div className="flex flex-wrap gap-1">
                          {p.presentaciones.slice(0,2).map(pr=>(
                            <span key={pr} className="text-[10px] text-[#6b756c] bg-[#F4F7F4] rounded-full px-2 py-0.5">{pr}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1 pt-2 border-t border-[#F0F2EE]">
                        <Button variant="ghost" size="sm" className="flex-1 justify-center text-[12px]" onClick={()=>setEditando(p)}>
                          <Icon name="edit" size={14} />Editar
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 justify-center text-[12px]">
                          <Icon name="eye" size={14} />Ver
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <button onClick={()=>setSubir(true)}
            className="w-full border-2 border-dashed border-[#dbe3dc] rounded-2xl py-7 text-[#2D6A4F] font-medium hover:border-[#2D6A4F]/60 hover:bg-[#F7FAF7] transition flex flex-col items-center justify-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1f4d39] flex items-center justify-center text-white">
              <Icon name="sparkles" size={18} />
            </span>
            <span className="text-[14px]">Subir nuevo producto con asistente IA</span>
            <span className="text-[12px] text-[#9aa79d] font-normal">Seleccioná el producto y la IA te ayuda a redactar la ficha</span>
          </button>
        </div>
      )}

      {/* Vista: Perfil */}
      {view==='perfil' && (
        <div className="space-y-6">
          <ProfileHeader initials={yo.iniciales} color="#6B4226" nombre={perfilSaved.nombre} sub={perfilSaved.tipo}
            badge={<Badge style={{ background:'rgba(255,255,255,0.15)' }} className="text-white mb-2"><span className="w-2 h-2 rounded-full" style={{ background:ESTADO_PRODUCTOR[estado].dot }}></span>{ESTADO_PRODUCTOR[estado].label}</Badge>}
            meta={<>
              <Pill icon="mapPin">{perfilSaved.ubicacion}</Pill>
              <Pill icon="package">{misProductos.length} producto{misProductos.length!==1?'s':''}</Pill>
              <Pill icon="calendar">Desde {yo.desde}</Pill>
            </>} />
          <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
            <Card className="p-6 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[17px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)' }}>Datos de la organización</h2>
                <Button variant="secondary" size="sm"><Icon name="image" size={15} />Foto</Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
                <Field label="Nombre de la organización" full>
                  <Input value={perfil.nombre} onChange={e=>setPerfil(p=>({...p,nombre:e.target.value}))} />
                </Field>
                <Field label="Tipo">
                  <Input value={perfil.tipo} onChange={e=>setPerfil(p=>({...p,tipo:e.target.value}))} />
                </Field>
                <Field label="Ubicación">
                  <Input icon="mapPin" value={perfil.ubicacion} onChange={e=>setPerfil(p=>({...p,ubicacion:e.target.value}))} />
                </Field>
                <Field label="Descripción de la organización" full>
                  <textarea value={perfil.desc} onChange={e=>setPerfil(p=>({...p,desc:e.target.value}))} rows={3}
                    className="w-full rounded-lg border border-[#D9E0DA] p-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 resize-none" />
                </Field>
                <Field label="Teléfono">
                  <Input icon="phone" value={perfil.tel} onChange={e=>setPerfil(p=>({...p,tel:e.target.value}))} />
                </Field>
                <Field label="WhatsApp">
                  <Input icon="whatsapp" value={perfil.whatsapp} onChange={e=>setPerfil(p=>({...p,whatsapp:e.target.value}))} />
                </Field>
                <Field label="Correo electrónico" full>
                  <Input icon="mail" value={perfil.correo} onChange={e=>setPerfil(p=>({...p,correo:e.target.value}))} />
                </Field>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#F0F2EE]">
                <Button variant="secondary" onClick={()=>setPerfil({...perfilSaved})}>Cancelar</Button>
                <Button onClick={()=>{ setPerfilSaved({...perfil}); toast('Perfil guardado',{desc:'Los cambios son visibles en tu vista pública.'}); }}>
                  <Icon name="check" size={16} />Guardar cambios
                </Button>
              </div>
            </Card>
            <Card className="p-6 h-fit space-y-4">
              <div>
                <h3 className="text-[16px] font-semibold text-[#1f2a21] mb-1" style={{ fontFamily:'var(--font-display)' }}>Vista pública</h3>
                <p className="text-[12.5px] text-[#8a948a]">Así aparecés en el catálogo FAN.</p>
              </div>
              <div className="flex items-center gap-3 border border-[#E8EBE6] rounded-xl p-3">
                <Avatar initials={yo.iniciales} color="#6B4226" size={42} />
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-[#1f2a21] flex items-center gap-1.5">
                    {perfilSaved.nombre}{yo.verificado&&<Icon name="badge" size={14} className="text-[#2D6A4F]" />}
                  </div>
                  <div className="text-[12px] text-[#8a948a] truncate">{perfilSaved.ubicacion}</div>
                </div>
              </div>
              <div className="space-y-2">
                {['phone','whatsapp','mail'].map((ic,i)=>{
                  const vals = [perfilSaved.tel, perfilSaved.whatsapp, perfilSaved.correo];
                  return vals[i] ? (
                    <div key={ic} className="flex items-center gap-2 text-[12.5px] text-[#6b756c]">
                      <Icon name={ic} size={14} className="text-[#2D6A4F] shrink-0" />
                      <span className="truncate">{vals[i]}</span>
                    </div>
                  ) : null;
                })}
              </div>
              {estado!=='APROBADO'&&(
                <div className="text-[12px] text-[#9A4D14] bg-[#FCEFE1] rounded-lg p-3 flex gap-2">
                  <Icon name="info" size={14} className="shrink-0 mt-0.5" />
                  Tu perfil será visible públicamente cuando FAN apruebe tu cuenta.
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Vista: Métricas */}
      {view==='metricas' && (
        <div className="space-y-6">
          <SectionTitle overline="Estadísticas" title="Métricas" desc="El rendimiento de tu perfil y productos en la plataforma FAN." />
          {estado!=='APROBADO' ? (
            <Card className="p-12 text-center text-[#8a948a] space-y-3">
              <Icon name="chart" size={32} className="mx-auto opacity-40" />
              <p className="text-[15px] font-medium">Métricas no disponibles aún</p>
              <p className="text-[13px] max-w-sm mx-auto">Estarán disponibles cuando tu cuenta sea aprobada y publiques al menos un producto.</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Stat icon="eye" label="Visitas al perfil" value="312" delta={12} />
                <Stat icon="phone" label="Contactos recibidos" value="28" delta={6} accent="#2D6A4F" />
                <Stat icon="package" label="Productos activos" value={misProductos.length} accent="#F4A261" />
                <Stat icon="trending" label="Tasa de contacto" value="8.9%" accent="#6B4226" />
              </div>
              <Card className="p-6">
                <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-5" style={{ fontFamily:'var(--font-display)' }}>Contactos por producto este mes</h4>
                <div className="space-y-4">
                  {misProductos.map((p,i)=>{
                    const val = [18,10,6,8,4][i] ?? 3;
                    const pct = Math.round(val/18*100);
                    return (
                      <div key={p.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13.5px] font-medium text-[#1f2a21]">{p.nombre}</span>
                          <span className="text-[13px] font-semibold text-[#1f2a21] tabular-nums">{val} contactos</span>
                        </div>
                        <div className="h-2.5 bg-[#EEF1EC] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width:pct+'%', background:`linear-gradient(90deg,${p.color}cc,${p.color})` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
              <Card className="p-6">
                <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-4" style={{ fontFamily:'var(--font-display)' }}>Visitas al perfil — últimos 6 meses</h4>
                <MiniBarChart data={[38,52,61,44,70,82]} labels={FAN.MONTHS_SHORT.slice(FAN.CURRENT_MONTH-5,FAN.CURRENT_MONTH+1)} color="#6B4226" />
              </Card>
            </>
          )}
        </div>
      )}

      {subir && <SubirProductoIA onClose={()=>setSubir(false)} onPublicar={r=>{
        if(r.prod && !misProductos.find(p=>p.id===r.prod.id)){
          setMisProductos(ms=>[{ ...r.prod, estadoPub: estado==='APROBADO'?'REVISION':'BORRADOR' }, ...ms]);
        }
      }} />}

      {editando && <EditarProducto producto={editando} onClose={()=>setEditando(null)} onGuardar={actualizado=>{
        setMisProductos(ms=>ms.map(p=>p.id===actualizado.id?actualizado:p));
        setEditando(null);
        toast('Producto actualizado',{desc:'Los cambios fueron guardados correctamente.'});
      }} />}
      {zoomProd && (
        <Modal open onClose={()=>setZoomProd(null)} fullWidth skipSidebar className="p-0">
          <div style={{ position:'relative', width:'100%', height:'100vh' }}>
            <ProductGlyph product={zoomProd} full />
          </div>
        </Modal>
      )}
    </div>
  );
}

window.ProducerScreens = { ScreenProductor };
Object.assign(window, { ScreenProductor });
