/* ============================================================
   PLATAFORMA FAN — Panel del Productor (router por sidebar)
   ============================================================ */

/* ---------- Modal de edición de producto ---------- */
function EditarProducto({ producto, onClose, onGuardar }){
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
  const toast = useToast();
  const yo = FAN.getProductor('sabores-chiquitos');

  const baseProds = yo.productos.map(FAN.getProduct).filter(Boolean).map(p=>({ ...p, estadoPub: estado==='APROBADO'?'PUBLICADO':'BORRADOR' }));
  const [misProductos, setMisProductos] = useState(baseProds);
  const [editando, setEditando] = useState(null);

  const yoPerfil = { nombre:yo.nombre, tipo:yo.tipo, ubicacion:yo.ubicacion, desc:yo.desc, tel:yo.contacto.tel, whatsapp:'+'+yo.contacto.whatsapp, correo:yo.contacto.correo };
  const [perfil, setPerfil] = useState(yoPerfil);
  const [perfilSaved, setPerfilSaved] = useState(yoPerfil);

  useEffect(()=>{ setMisProductos(ms=> ms.map(p=>({ ...p, estadoPub: estado==='APROBADO' && p.estadoPub==='BORRADOR' ? 'PUBLICADO' : p.estadoPub }))); }, [estado]);
  const aprobar = () => { setEstado('APROBADO'); toast('¡Felicidades! FAN aprobó tu cuenta', { desc:'Tus productos ya son visibles en el catálogo.' }); };

  return (
    <div id="productor" className="max-w-5xl mx-auto">
      {view!=='perfil' && (
        <div className="flex items-center gap-4 mb-6">
          <Avatar initials={yo.iniciales} color="#2D6A4F" size={52} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.2 }}>{perfilSaved.nombre}</h1>
              <Badge style={{ background:ESTADO_PRODUCTOR[estado].bg, color:ESTADO_PRODUCTOR[estado].color }}><span className="w-2 h-2 rounded-full" style={{ background:ESTADO_PRODUCTOR[estado].dot }}></span>{ESTADO_PRODUCTOR[estado].label}</Badge>
            </div>
            <div className="text-[13.5px] text-[#8a948a] flex items-center gap-1.5 mt-0.5"><Icon name="mapPin" size={14} />{perfilSaved.ubicacion}</div>
          </div>
          <Button onClick={()=>setSubir(true)} className="hidden sm:inline-flex shrink-0"><Icon name="sparkles" size={16} />Subir producto</Button>
        </div>
      )}

      {view!=='perfil' && <EstadoCuentaBanner estado={estado} onAprobar={aprobar} />}

      {view==='productos' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)' }}>Mis productos</h2>
            <Button onClick={()=>setSubir(true)} size="sm" className="sm:hidden"><Icon name="plus" size={16} />Subir</Button>
          </div>
          {misProductos.map(p=>{
            const ep = ESTADO_PROD[p.estadoPub];
            return (
              <Card key={p.id} className="p-4 flex items-center gap-4">
                <ProductGlyph product={p} size={52} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)' }}>{p.nombre}</span>
                    <Badge style={{ background:ep.bg, color:ep.color }}><span className="w-1.5 h-1.5 rounded-full" style={{ background:ep.dot }}></span>{ep.label}</Badge>
                  </div>
                  <div className="text-[12.5px] text-[#8a948a] mt-1 line-clamp-1">{p.desc}</div>
                  
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={()=>setEditando(p)}><Icon name="edit" size={17} /></Button>
                  <Button variant="ghost" size="icon"><Icon name="eye" size={17} /></Button>
                </div>
              </Card>
            );
          })}
          <button onClick={()=>setSubir(true)} className="w-full border-2 border-dashed border-[#dbe3dc] rounded-2xl py-6 text-[#2D6A4F] font-medium hover:border-[#2D6A4F] hover:bg-[#F7FAF7] transition flex items-center justify-center gap-2">
            <Icon name="sparkles" size={18} />Subir nuevo producto con asistente IA
          </button>
        </div>
      )}

      {view==='perfil' && (
        <div className="space-y-6">
          <ProfileHeader initials={yo.iniciales} color="#6B4226" nombre={perfilSaved.nombre} sub={perfilSaved.tipo}
            badge={<Badge style={{ background:'rgba(255,255,255,0.15)' }} className="text-white mb-2"><span className="w-2 h-2 rounded-full" style={{ background:ESTADO_PRODUCTOR[estado].dot }}></span>{ESTADO_PRODUCTOR[estado].label}</Badge>}
            meta={<>
              <Pill icon="mapPin">{perfilSaved.ubicacion}</Pill>
              <Pill icon="package">{misProductos.length} productos</Pill>
              <Pill icon="calendar">Desde {yo.desde}</Pill>
            </>} />
          <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
            <Card className="p-6 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[17px] font-semibold text-[#1f2a21] whitespace-nowrap" style={{ fontFamily:'var(--font-display)' }}>Datos de la organización</h2>
                <Button variant="secondary" size="sm"><Icon name="image" size={15} />Foto</Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
                <Field label="Nombre de la organización" full>
                  <Input value={perfil.nombre} onChange={e=>setPerfil(p=>({...p, nombre:e.target.value}))} />
                </Field>
                <Field label="Tipo">
                  <Input value={perfil.tipo} onChange={e=>setPerfil(p=>({...p, tipo:e.target.value}))} />
                </Field>
                <Field label="Ubicación">
                  <Input icon="mapPin" value={perfil.ubicacion} onChange={e=>setPerfil(p=>({...p, ubicacion:e.target.value}))} />
                </Field>
                <Field label="Descripción" full>
                  <textarea value={perfil.desc} onChange={e=>setPerfil(p=>({...p, desc:e.target.value}))} rows={3}
                    className="w-full rounded-lg border border-[#D9E0DA] p-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 resize-none" />
                </Field>
                <Field label="Teléfono">
                  <Input icon="phone" value={perfil.tel} onChange={e=>setPerfil(p=>({...p, tel:e.target.value}))} />
                </Field>
                <Field label="WhatsApp">
                  <Input icon="whatsapp" value={perfil.whatsapp} onChange={e=>setPerfil(p=>({...p, whatsapp:e.target.value}))} />
                </Field>
                <Field label="Correo" full>
                  <Input icon="mail" value={perfil.correo} onChange={e=>setPerfil(p=>({...p, correo:e.target.value}))} />
                </Field>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#F0F2EE]">
                <Button variant="secondary" onClick={()=>setPerfil({...perfilSaved})}>Cancelar</Button>
                <Button onClick={()=>{ setPerfilSaved({...perfil}); toast('Perfil guardado', { desc:'Los cambios son visibles en tu vista pública.' }); }}><Icon name="check" size={16} />Guardar cambios</Button>
              </div>
            </Card>
            <Card className="p-6 h-fit">
              <h3 className="text-[16px] font-semibold text-[#1f2a21] mb-3" style={{ fontFamily:'var(--font-display)' }}>Cómo te ven los chefs</h3>
              <p className="text-[13px] text-[#6b756c] leading-relaxed mb-4">Así aparece tu organización en la ficha pública de tus productos.</p>
              <div className="flex items-center gap-3 border border-[#E8EBE6] rounded-xl p-3">
                <Avatar initials={yo.iniciales} color="#2D6A4F" size={42} />
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-[#1f2a21] flex items-center gap-1.5">{perfilSaved.nombre}{yo.verificado && <Icon name="badge" size={14} className="text-[#2D6A4F]" />}</div>
                  <div className="text-[12px] text-[#8a948a] truncate">{perfilSaved.ubicacion}</div>
                </div>
              </div>
              {estado!=='APROBADO' && <div className="mt-3 text-[12px] text-[#9A4D14] bg-[#FCEFE1] rounded-lg p-3 flex gap-2"><Icon name="info" size={14} className="shrink-0 mt-0.5" />Tu perfil será visible públicamente cuando FAN apruebe tu cuenta.</div>}
            </Card>
          </div>
        </div>
      )}

      {view==='metricas' && (
        <div className="space-y-5">
          <h2 className="text-[18px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)' }}>Métricas</h2>
          {estado!=='APROBADO' ? (
            <Card className="p-10 text-center text-[#8a948a]"><Icon name="chart" size={28} className="mx-auto mb-3 opacity-50" />Tus métricas estarán disponibles cuando tu cuenta sea aprobada y publiques productos.</Card>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <Stat icon="eye" label="Visitas a tu perfil" value="312" delta={12} />
                <Stat icon="phone" label="Veces contactado" value="28" delta={6} accent="#219EBC" />
                <Stat icon="package" label="Productos publicados" value={misProductos.length} accent="#F4A261" />
              </div>
              <Card className="p-6">
                <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-4" style={{ fontFamily:'var(--font-display)' }}>Contactos recibidos por producto</h4>
                <div className="space-y-3">
                  {misProductos.map((p,i)=>{
                    const val = [18,10][i] || 6;
                    return (
                      <div key={p.id} className="flex items-center gap-3">
                        <span className="text-[13px] text-[#48524a] w-32 truncate">{p.nombre}</span>
                        <div className="flex-1 h-2.5 bg-[#EEF1EC] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width:(val/18*100)+'%', background:p.color }}></div></div>
                        <span className="text-[13px] font-semibold text-[#1f2a21] tabular-nums w-8 text-right">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}
        </div>
      )}

      {subir && <SubirProductoIA onClose={()=>setSubir(false)} onPublicar={(r)=>{
        if(r.prod && !misProductos.find(p=>p.id===r.prod.id)){
          setMisProductos(ms=>[{ ...r.prod, estadoPub: estado==='APROBADO'?'REVISION':'BORRADOR' }, ...ms]);
        }
      }} />}

      {editando && <EditarProducto producto={editando} onClose={()=>setEditando(null)} onGuardar={(actualizado)=>{
        setMisProductos(ms=>ms.map(p=>p.id===actualizado.id ? actualizado : p));
        setEditando(null);
        toast('Producto actualizado', { desc:'Los cambios fueron guardados correctamente.' });
      }} />}
    </div>
  );
}

window.ProducerScreens = { ScreenProductor };
Object.assign(window, { ScreenProductor });
