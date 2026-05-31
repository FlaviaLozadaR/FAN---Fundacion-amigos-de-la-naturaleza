/* ============================================================
   PLATAFORMA FAN — Admin: catálogo, temporadas, suscriptores,
   alertas, recetario + shell del panel admin
   ============================================================ */

const API_URL = 'http://localhost:3001';

/* ---------- Datos demo — Recetario admin ---------- */
const CATEGORIAS_RECETA = ['Plato principal','Repostería','Desayunos','Postres','Condimentos','Ensaladas','Sopas','Bebidas','Snacks'];
const DIFICULTADES = ['Fácil','Media','Difícil'];


/* ---------- Modal detalle de receta (vista admin) ---------- */
function AdminRecipeDetail({ receta, onClose }){
  if(!receta) return null;
  const titulo = receta.titulo.charAt(0) + receta.titulo.slice(1).toLowerCase();
  const nPasos = (receta.preparacion||[]).length;
  const nIngCats = Object.keys(receta.ingredientes||{}).length;
  return (
    <Modal open={!!receta} onClose={onClose} size="lg" className="p-0" skipSidebar={true} fullWidth={true}>
      <div className="relative w-full overflow-hidden bg-[#1a2a1e]" style={{ height:'40vh', minHeight:220, maxHeight:420 }}>
        <img src={receta.imagen||'/bosque-logo.jpeg'} alt={receta.titulo}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter:'brightness(0.72) saturate(1.15) contrast(1.05)' }}
          onError={e=>{e.target.src='/bosque-logo.jpeg';}} />
        <div className="absolute inset-0 pointer-events-none" style={{ background:'linear-gradient(180deg,rgba(0,0,0,0) 20%,rgba(0,0,0,0.3) 60%,rgba(0,0,0,0.65) 100%)' }} />
        <button onClick={onClose} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-[#5e6b60] shadow-sm transition">
          <Icon name="arrowLeft" size={18} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-8 pt-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65 mb-1">Recetario FAN</div>
          <h2 className="text-[22px] sm:text-[28px] font-semibold text-white leading-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.1 }}>{titulo}</h2>
        </div>
      </div>
      <div className="relative max-w-[880px] mx-auto -mt-6 px-4 sm:px-8 pb-10">
        <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ boxShadow:'0 8px 48px rgba(18,30,18,0.13)' }}>
          <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-[#F0F2EE]">
            {[
              [receta.tiempo?(receta.tiempo+' min'):'—','clock'],
              [receta.dificultad||'—','star'],
              [receta.categoria||'—','book'],
              [nPasos+' pasos','list'],
            ].filter(([v])=>v!=='—'&&v!=='0 pasos').map(([v,ic])=>(
              <div key={v} className="flex items-center gap-2 bg-[#F7FAF7] border border-[#EEF1EC] rounded-xl px-3.5 py-2">
                <Icon name={ic} size={13} className="text-[#2D6A4F]" />
                <span className="text-[13px] font-semibold text-[#1f2a21]">{v}</span>
              </div>
            ))}
          </div>
          {nIngCats>0 ? (
            <div className="mb-7">
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-3 flex items-center gap-1.5"><Icon name="leaf" size={13} />Ingredientes</h4>
              <div className={cn('grid gap-3', nIngCats===1?'grid-cols-1':nIngCats===2?'sm:grid-cols-2':'sm:grid-cols-3')}>
                {Object.entries(receta.ingredientes||{}).map(([k,list])=>(
                  <div key={k} className="bg-[#FBFCFA] border border-[#EEF1EC] rounded-xl p-4">
                    <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#2D6A4F] mb-2.5 capitalize">{k}</div>
                    <ul className="space-y-1.5">
                      {list.map((it,i)=>(
                        <li key={i} className="flex items-start gap-2 text-[13px] text-[#48524a]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#74C69D] shrink-0 mt-1.5"></span>{it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-7 border border-dashed border-[#E8EBE6] rounded-xl p-6 text-center text-[#9aa79d] text-[13px]">Sin ingredientes — editá la receta para agregarlos.</div>
          )}
          {nPasos>0 ? (
            <div>
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-4 flex items-center gap-1.5"><Icon name="clock" size={13} />Preparación</h4>
              <ol className="space-y-3.5">
                {(receta.preparacion||[]).map((paso,i)=>(
                  <li key={i} className="flex gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white text-[12px] font-semibold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                    <span className="text-[14px] text-[#48524a] leading-relaxed pt-0.5">{paso}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="border border-dashed border-[#E8EBE6] rounded-xl p-6 text-center text-[#9aa79d] text-[13px]">Sin pasos — editá la receta para agregarlos.</div>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Modal crear / editar receta (3 pasos) ---------- */
function RecetaModal({ receta, onClose, onSave, guardando=false }){
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(()=> receta ? {
    titulo: receta.titulo||'', tiempo: receta.tiempo||30, porciones: receta.porciones||4,
    dificultad: receta.dificultad||'Fácil', categoria: receta.categoria||'Plato principal',
    productoPrincipal: receta.productoPrincipal||'', descripcion: receta.descripcion||'',
    imagen: receta.imagen||'',
  } : { titulo:'', tiempo:30, porciones:4, dificultad:'Fácil', categoria:'Plato principal',
       productoPrincipal:'', descripcion:'', imagen:'' });

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const [subiendoImg, setSubiendoImg] = useState(false);

  const subirImagen = async e => {
    const file = e.target.files?.[0];
    if(!file) return;
    setSubiendoImg(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/api/upload`, { method:'POST', body:fd });
      if(!res.ok) throw new Error();
      const data = await res.json();
      set('imagen', data.url);
      toast('Imagen subida', { type:'success' });
    } catch {
      toast('Error al subir imagen', { type:'error' });
    } finally {
      setSubiendoImg(false);
      e.target.value = '';
    }
  };

  const [secciones, setSecciones] = useState(()=>{
    if(receta?.ingredientes && Object.keys(receta.ingredientes).length>0){
      return Object.entries(receta.ingredientes).map(([nombre,items])=>({nombre, items:[...items,'']}));
    }
    return [{nombre:'ingredientes', items:['']}];
  });

  const [pasos, setPasos] = useState(()=>
    receta?.preparacion?.length>0 ? [...receta.preparacion,''] : ['']
  );

  const canNext1 = form.titulo.trim().length>0;

  const handleSave = () => {
    const ingredientes = {};
    secciones.filter(s=>s.nombre.trim()&&s.items.some(i=>i.trim()))
      .forEach(s=>{ ingredientes[s.nombre.trim()] = s.items.filter(i=>i.trim()); });
    onSave({
      ...receta, ...form,
      ingredientes,
      preparacion: pasos.filter(p=>p.trim()),
      estado: receta?.estado||'borrador',
      vistas: receta?.vistas||0,
      imagen: form.imagen || receta?.imagen || '/bosque-logo.jpeg',
    });
  };

  const stepLabels = ['Información','Ingredientes','Preparación'];
  const selectCls = 'w-full h-10 rounded-lg border border-[#D9E0DA] bg-white px-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15';
  const numCls = 'w-full h-10 rounded-lg border border-[#D9E0DA] bg-white px-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 transition';
  const inlineCls = 'flex-1 h-9 rounded-lg border border-[#D9E0DA] bg-white px-3 text-[13px] text-[#2a352c] placeholder:text-[#9aa79d] focus:outline-none focus:border-[#2D6A4F]';

  return (
    <Modal open onClose={onClose} size="md">
      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#E9F1EC] flex items-center justify-center shrink-0">
            <Icon name="book" size={18} className="text-[#2D6A4F]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)' }}>
              {receta?'Editar receta':'Nueva receta'}
            </h3>
            <p className="text-[13px] text-[#9aa79d] leading-snug">Completa la información para publicar en el recetario FAN</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#F4F7F4] flex items-center justify-center text-[#9aa79d] shrink-0">
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center mb-6">
          {stepLabels.map((label,i)=>{
            const s=i+1, done=step>s, active=step===s;
            return (
              <React.Fragment key={s}>
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0',
                    (done||active)?'bg-[#2D6A4F] text-white':'bg-[#EDF2ED] text-[#9aa79d]')}>
                    {done?<Icon name="check" size={12} stroke={2.5} />:s}
                  </div>
                  <span className={cn('text-[12px] font-medium hidden sm:block', active?'text-[#2D6A4F]':'text-[#9aa79d]')}>{label}</span>
                </div>
                {s<3&&<div className={cn('flex-1 h-0.5 mx-2 rounded-full', done?'bg-[#2D6A4F]':'bg-[#EDF0EB]')} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Paso 1 — Información general */}
        {step===1 && (
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9aa79d]">Información general</p>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Nombre de la receta</label>
              <Input placeholder="Ej: Tarta de almendra chiquitana" value={form.titulo} onChange={e=>set('titulo',e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Tiempo de preparación (min)</label>
                <input type="number" min="1" value={form.tiempo} onChange={e=>set('tiempo',e.target.value)} className={numCls} />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Porciones</label>
                <input type="number" min="1" value={form.porciones} onChange={e=>set('porciones',e.target.value)} className={numCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Dificultad</label>
                <select value={form.dificultad} onChange={e=>set('dificultad',e.target.value)} className={selectCls}>
                  {DIFICULTADES.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Categoría</label>
                <select value={form.categoria} onChange={e=>set('categoria',e.target.value)} className={selectCls}>
                  {CATEGORIAS_RECETA.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Producto principal</label>
              <select value={form.productoPrincipal} onChange={e=>set('productoPrincipal',e.target.value)} className={selectCls}>
                <option value="">Selecciona un producto…</option>
                {FAN.PRODUCTS.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Descripción corta</label>
              <textarea value={form.descripcion} onChange={e=>set('descripcion',e.target.value)} rows={2}
                placeholder="Una breve descripción de la receta…"
                className="w-full rounded-lg border border-[#D9E0DA] p-3 text-sm text-[#2a352c] placeholder:text-[#9aa79d] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 resize-none" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Imagen de la receta</label>
              {form.imagen && form.imagen !== '/bosque-logo.jpeg' && (
                <div className="mb-2 h-28 rounded-xl overflow-hidden bg-[#F3F6F3]">
                  <img src={form.imagen} alt="Vista previa" className="w-full h-full object-cover"
                    onError={e=>{e.target.style.display='none';}} />
                </div>
              )}
              <label className={cn('flex items-center gap-2.5 h-10 px-4 rounded-lg border cursor-pointer transition text-[13.5px] font-medium w-fit',
                subiendoImg?'bg-[#F4F7F4] text-[#9aa79d] border-[#E2E7DE]':'bg-white border-[#D9E0DA] text-[#2D6A4F] hover:bg-[#EDF2ED] hover:border-[#2D6A4F]/30')}>
                {subiendoImg
                  ? <><Icon name="loader" size={15} className="animate-spin" />Subiendo…</>
                  : <><Icon name="upload" size={15} />{form.imagen&&form.imagen!=='/bosque-logo.jpeg'?'Cambiar imagen':'Subir imagen'}</>}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  disabled={subiendoImg} onChange={subirImagen} />
              </label>
              {form.imagen && form.imagen !== '/bosque-logo.jpeg' && (
                <button onClick={()=>set('imagen','')} className="ml-2 text-[12px] text-[#9aa79d] hover:text-[#B23A48] transition">
                  Quitar imagen
                </button>
              )}
            </div>
          </div>
        )}

        {/* Paso 2 — Ingredientes */}
        {step===2 && (
          <div className="space-y-3 max-h-[58vh] overflow-y-auto pr-1 no-scrollbar">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9aa79d]">Ingredientes</p>
            {secciones.map((sec,si)=>(
              <div key={si} className="border border-[#E8EBE6] rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <input placeholder="Nombre de la sección (ej: Salsa, Masa…)" value={sec.nombre}
                    onChange={e=>setSecciones(ss=>ss.map((s,i)=>i===si?{...s,nombre:e.target.value}:s))}
                    className="flex-1 h-9 rounded-lg border border-[#D9E0DA] bg-[#FAFBF9] px-3 text-[13px] text-[#2a352c] placeholder:text-[#9aa79d] focus:outline-none focus:border-[#2D6A4F]" />
                  {secciones.length>1&&(
                    <button onClick={()=>setSecciones(ss=>ss.filter((_,i)=>i!==si))} className="w-8 h-8 rounded-lg hover:bg-[#FCEEF0] flex items-center justify-center text-[#B23A48]">
                      <Icon name="trash" size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {sec.items.map((it,ii)=>(
                    <div key={ii} className="flex items-center gap-2">
                      <input placeholder={`Ingrediente ${ii+1}`} value={it}
                        onChange={e=>setSecciones(ss=>ss.map((s,si2)=>si2===si?{...s,items:s.items.map((x,j)=>j===ii?e.target.value:x)}:s))}
                        className={inlineCls} />
                      {sec.items.length>1&&(
                        <button onClick={()=>setSecciones(ss=>ss.map((s,si2)=>si2===si?{...s,items:s.items.filter((_,j)=>j!==ii)}:s))} className="w-7 h-7 rounded-lg hover:bg-[#F4F7F4] flex items-center justify-center text-[#9aa79d]">
                          <Icon name="x" size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={()=>setSecciones(ss=>ss.map((s,i)=>i===si?{...s,items:[...s.items,'']}:s))} className="flex items-center gap-1.5 text-[12.5px] text-[#2D6A4F] font-medium hover:opacity-75">
                  <Icon name="plus" size={13} />Agregar ingrediente
                </button>
              </div>
            ))}
            <button onClick={()=>setSecciones(ss=>[...ss,{nombre:'',items:['']}])} className="flex items-center gap-1.5 text-[13px] text-[#2D6A4F] font-medium hover:opacity-75 border border-dashed border-[#2D6A4F]/40 rounded-xl w-full justify-center h-10">
              <Icon name="plus" size={14} />Agregar sección
            </button>
          </div>
        )}

        {/* Paso 3 — Preparación */}
        {step===3 && (
          <div className="space-y-3 max-h-[58vh] overflow-y-auto pr-1 no-scrollbar">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9aa79d]">Pasos de preparación</p>
            {pasos.map((paso,i)=>(
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white text-[12px] font-semibold flex items-center justify-center shrink-0 mt-1">{i+1}</span>
                <textarea value={paso} onChange={e=>setPasos(ps=>ps.map((p,j)=>j===i?e.target.value:p))} rows={2}
                  placeholder={`Paso ${i+1}…`}
                  className="flex-1 rounded-lg border border-[#D9E0DA] p-3 text-sm text-[#2a352c] placeholder:text-[#9aa79d] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 resize-none" />
                {pasos.length>1&&(
                  <button onClick={()=>setPasos(ps=>ps.filter((_,j)=>j!==i))} className="w-8 h-8 rounded-lg hover:bg-[#FCEEF0] flex items-center justify-center text-[#B23A48] mt-1 shrink-0">
                    <Icon name="trash" size={14} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={()=>setPasos(ps=>[...ps,''])} className="flex items-center gap-1.5 text-[13px] text-[#2D6A4F] font-medium hover:opacity-75 border border-dashed border-[#2D6A4F]/40 rounded-xl w-full justify-center h-10">
              <Icon name="plus" size={14} />Agregar paso
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#EDF0EB]">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <div className="flex items-center gap-2.5">
            {step>1&&(
              <Button variant="secondary" size="sm" onClick={()=>setStep(s=>s-1)}>
                <Icon name="chevronLeft" size={15} />Anterior
              </Button>
            )}
            {step<3?(
              <Button onClick={()=>setStep(s=>s+1)} disabled={step===1&&!canNext1}>
                Siguiente<Icon name="chevronRight" size={15} />
              </Button>
            ):(
              <Button onClick={handleSave} disabled={guardando}>
                {guardando?<Icon name="loader" size={16} className="animate-spin" />:<Icon name="check" size={16} />}
                {receta?'Guardar cambios':'Crear receta'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Gestión de recetas (conectada al API) ---------- */
function AdminRecetario(){
  const toast = useToast();
  // Iniciamos con las recetas estáticas (igual que el visitante) y actualizamos desde la API
  const [recetas, setRecetas] = useState(()=> window.RECETAS || []);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [q, setQ] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const [modal, setModal] = useState(null);
  const [verReceta, setVerReceta] = useState(null);

  const cargar = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recetas`);
      if(!res.ok) throw new Error();
      const data = await res.json();
      if(data.recetas?.length > 0) setRecetas(data.recetas);
    } catch {
      // fallback silencioso: ya tenemos los datos estáticos
    }
  };

  useEffect(()=>{ cargar(); }, []);

  const filtradas = recetas.filter(r=>{
    const matchQ = !q || r.titulo.toLowerCase().includes(q.toLowerCase()) ||
      (r.autores||'').toLowerCase().includes(q.toLowerCase());
    const matchFiltro = filtro==='todas' ||
      (filtro==='publicadas'&&r.estado==='publicada') ||
      (filtro==='borradores'&&r.estado==='borrador') ||
      filtro==='mas-vistas' || filtro==='recientes';
    return matchQ&&matchFiltro;
  }).sort((a,b)=> filtro==='mas-vistas'?(b.vistas||0)-(a.vistas||0):0);

  const totalPublicadas = recetas.filter(r=>r.estado==='publicada').length;
  const totalBorradores = recetas.filter(r=>r.estado==='borrador').length;
  const totalVistas = recetas.reduce((acc,r)=>acc+(r.vistas||0),0);

  const toggleEstado = async r => {
    const nuevoEstado = r.estado==='publicada'?'borrador':'publicada';
    try {
      const res = await fetch(`${API_URL}/api/recetas/${r.id}`, {
        method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if(!res.ok) throw new Error();
      await cargar();
      toast(nuevoEstado==='publicada'?'Receta publicada':'Receta movida a borrador', { type:'success' });
    } catch {
      toast('Error al cambiar estado', { type:'error' });
    }
  };

  const eliminar = async id => {
    try {
      const res = await fetch(`${API_URL}/api/recetas/${id}`, { method:'DELETE' });
      if(!res.ok) throw new Error();
      await cargar();
      toast('Receta eliminada', { type:'error', desc:'Se removió del recetario.' });
    } catch {
      toast('Error al eliminar receta', { type:'error' });
    }
  };

  const guardar = async data => {
    try {
      setGuardando(true);
      const esEdicion = data.id && recetas.some(r=>r.id===data.id);
      const url = esEdicion ? `${API_URL}/api/recetas/${data.id}` : `${API_URL}/api/recetas`;
      const res = await fetch(url, {
        method: esEdicion?'PUT':'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data),
      });
      if(!res.ok) throw new Error();
      await cargar();
      toast(esEdicion?'Receta actualizada':'Receta creada', {
        type:'success', desc: esEdicion?'Los cambios quedaron guardados.':'Se guardó como borrador.' });
      setModal(null);
    } catch {
      toast('Error al guardar receta', { type:'error' });
    } finally {
      setGuardando(false);
    }
  };

  const TABS = [
    {value:'todas',label:'Todas'},{value:'publicadas',label:'Publicadas'},
    {value:'borradores',label:'Borradores'},{value:'mas-vistas',label:'Más vistas'},
    {value:'recientes',label:'Recientes'},
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2D6A4F] mb-1.5">Recetario</div>
          <h2 className="text-[24px] sm:text-[29px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>Recetario</h2>
          <p className="text-[15px] text-[#6b756c] mt-1.5">Seleccioná una receta para ver los detalles. Podés editar, publicar o agregar nuevas.</p>
        </div>
        <Button onClick={()=>setModal('crear')}><Icon name="plus" size={16} />Nueva receta</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon="book" label="Total recetas" value={recetas.length} />
        <Stat icon="eye" label="Publicadas" value={totalPublicadas} accent="#2D6A4F" />
        <Stat icon="edit" label="Borradores" value={totalBorradores} accent="#9aa79d" />
        <Stat icon="trending" label="Total vistas" value={totalVistas.toLocaleString()} accent="#F4A261" />
      </div>

      {/* Search + filtros */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative sm:w-[360px] shrink-0">
          <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa79d]" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar receta, autor o ingrediente"
            className="w-full h-11 pl-9 pr-3 rounded-xl border border-[#E2E7DE] bg-white text-[14px] text-[#1f2a21] placeholder:text-[#9aa79d] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/15 focus:border-[#2D6A4F]/40" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TABS.map(t=>(
            <button key={t.value} onClick={()=>setFiltro(t.value)}
              className={cn('px-3.5 h-9 rounded-xl text-[13.5px] font-medium transition whitespace-nowrap',
                filtro===t.value?'bg-[#2D6A4F] text-white':'bg-white border border-[#E2E7DE] text-[#5e6b60] hover:border-[#bcc9bf]')}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla de recetas (misma visual que visitante + acciones de gestión) */}
      <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtradas.map(r=>{
              const pub = r.estado==='publicada';
              const titulo = r.titulo.charAt(0) + r.titulo.slice(1).toLowerCase();
              return (
                <div key={r.id} className="group relative bg-white rounded-2xl border border-[#E8EBE6] overflow-hidden shadow-[0_6px_20px_rgba(45,60,45,0.06)] hover:shadow-[0_10px_30px_rgba(45,60,45,0.08)] transition flex flex-col">
                  {/* Imagen */}
                  <div className="h-36 bg-[#F3F6F3] overflow-hidden relative shrink-0">
                    <img src={r.imagen||'/bosque-logo.jpeg'} alt={r.titulo}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ filter:'brightness(1.04) contrast(1.03) saturate(1.05)' }}
                      onError={e=>{e.target.src='/bosque-logo.jpeg';}} />
                    <div className="absolute inset-0 pointer-events-none" style={{ background:'linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,0.32) 100%)' }} />
                    {/* Badge estado (arriba izq) */}
                    <div className="absolute top-2 left-2">
                      <Badge style={{ background:pub?'rgba(227,241,234,0.95)':'rgba(241,242,241,0.95)', color:pub?'#1B5036':'#52564F' }} className="text-[10.5px]">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background:pub?'#2D6A4F':'#9CA3AF' }}></span>
                        {pub?'Publicada':'Borrador'}
                      </Badge>
                    </div>
                    {/* Acciones (arriba der, visibles al hover) */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button onClick={e=>{e.stopPropagation();setModal({receta:r});}}
                        title="Editar" className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center text-[#2D6A4F] shadow-sm transition">
                        <Icon name="edit" size={13} />
                      </button>
                      <button onClick={e=>{e.stopPropagation();toggleEstado(r);}}
                        title={pub?'Despublicar':'Publicar'}
                        className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-sm transition"
                        style={{ color: pub?'#9aa79d':'#2D6A4F' }}>
                        <Icon name={pub?'x':'check'} size={13} />
                      </button>
                      <button onClick={e=>{e.stopPropagation();eliminar(r.id);}}
                        title="Eliminar" className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-[#FCEEF0] flex items-center justify-center text-[#B23A48] shadow-sm transition">
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </div>
                  {/* Texto — click abre detalle */}
                  <button onClick={()=>setVerReceta(r)} className="p-3 text-left flex-1">
                    <div className="font-semibold text-[#1f2a21] text-[14px] leading-snug line-clamp-2">{titulo}</div>
                    <div className="text-[12px] text-[#8a948a] mt-1 truncate">{r.autores||'Equipo FAN'}</div>
                  </button>
                </div>
              );
            })}
          </div>
          {filtradas.length===0 && (
            <div className="rounded-2xl border border-[#E8EBE6] bg-white p-8 text-center text-[#8a948a]">
              {q?'No encontré recetas con ese texto.':'No hay recetas en esta categoría.'}
            </div>
          )}
      </>

      {modal&&(
        <RecetaModal
          receta={modal==='crear'?null:modal.receta}
          onClose={()=>setModal(null)}
          onSave={guardar}
          guardando={guardando}
        />
      )}
      {verReceta&&<AdminRecipeDetail receta={verReceta} onClose={()=>setVerReceta(null)} />}
    </div>
  );
}

/* ---------- Modal crear / editar producto ---------- */
const CATEGORIAS_PRODUCTO = ['Frutos secos','Frutos de palmera','Frutos del bosque','Aromáticas y especias','Flores y hierbas','Frutas','Otros productos'];
const ORIGENES_PRODUCTO = [{value:'chiquitania',label:'Bosque Chiquitano'},{value:'amazonia',label:'Amazonía Norte'}];

function ProductoModal({ producto, onClose, onSave, guardando }){
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(()=> producto ? {
    nombre: producto.nombre||'', cientifico: producto.cientifico||'',
    tipo: producto.tipo||'', categoria: producto.categoria||'Frutos secos',
    origen: producto.origen||'chiquitania', color: producto.color||'#2D6A4F',
    cosecha: producto.cosecha||'', fuente: producto.fuente||'',
    descripcion: producto.desc||producto.descripcion||'',
  } : { nombre:'', cientifico:'', tipo:'', categoria:'Frutos secos', origen:'chiquitania',
       color:'#2D6A4F', cosecha:'', fuente:'', descripcion:'' });

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const [meses, setMeses] = useState(()=> producto?.m || producto?.meses_temporada || []);
  const toggleMes = i => setMeses(ms=> ms.includes(i)?ms.filter(x=>x!==i):[...ms,i].sort((a,b)=>a-b));

  const [regiones, setRegiones] = useState(()=> producto?.regiones?.length>0 ? [...producto.regiones,''] : ['']);
  const [usos, setUsos] = useState(()=> producto?.usos?.length>0 ? [...producto.usos,''] : ['']);
  const [presentaciones, setPresentaciones] = useState(()=> producto?.presentaciones?.length>0 ? [...producto.presentaciones,''] : ['']);

  const canNext1 = form.nombre.trim().length>0;

  const handleSave = () => {
    onSave({
      ...producto, ...form,
      m: meses,
      meses_temporada: meses,
      regiones: regiones.filter(r=>r.trim()),
      usos: usos.filter(u=>u.trim()),
      presentaciones: presentaciones.filter(p=>p.trim()),
    });
  };

  const inlineCls = 'flex-1 h-9 rounded-lg border border-[#D9E0DA] bg-white px-3 text-[13px] text-[#2a352c] placeholder:text-[#9aa79d] focus:outline-none focus:border-[#2D6A4F]';
  const selectCls = 'w-full h-10 rounded-lg border border-[#D9E0DA] bg-white px-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15';
  const stepLabels = ['Info básica','Temporada','Detalles'];

  const DynamicList = ({ items, setItems, placeholder }) => (
    <div className="space-y-2">
      {items.map((it,i)=>(
        <div key={i} className="flex items-center gap-2">
          <input value={it} onChange={e=>setItems(arr=>arr.map((x,j)=>j===i?e.target.value:x))}
            placeholder={placeholder} className={inlineCls} />
          {items.length>1&&(
            <button onClick={()=>setItems(arr=>arr.filter((_,j)=>j!==i))} className="w-7 h-7 rounded-lg hover:bg-[#F4F7F4] flex items-center justify-center text-[#9aa79d]">
              <Icon name="x" size={13} />
            </button>
          )}
        </div>
      ))}
      <button onClick={()=>setItems(arr=>[...arr,''])} className="flex items-center gap-1.5 text-[12.5px] text-[#2D6A4F] font-medium hover:opacity-75">
        <Icon name="plus" size={13} />Agregar
      </button>
    </div>
  );

  return (
    <Modal open onClose={onClose} size="md">
      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#E9F1EC] flex items-center justify-center shrink-0">
            <Icon name="leaf" size={18} className="text-[#2D6A4F]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)' }}>
              {producto?'Editar producto':'Nuevo producto'}
            </h3>
            <p className="text-[13px] text-[#9aa79d] leading-snug">Completa la información del catálogo FAN</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#F4F7F4] flex items-center justify-center text-[#9aa79d] shrink-0">
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center mb-6">
          {stepLabels.map((label,i)=>{
            const s=i+1, done=step>s, active=step===s;
            return (
              <React.Fragment key={s}>
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0',
                    (done||active)?'bg-[#2D6A4F] text-white':'bg-[#EDF2ED] text-[#9aa79d]')}>
                    {done?<Icon name="check" size={12} stroke={2.5} />:s}
                  </div>
                  <span className={cn('text-[12px] font-medium hidden sm:block', active?'text-[#2D6A4F]':'text-[#9aa79d]')}>{label}</span>
                </div>
                {s<3&&<div className={cn('flex-1 h-0.5 mx-2 rounded-full', done?'bg-[#2D6A4F]':'bg-[#EDF0EB]')} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Paso 1 — Info básica */}
        {step===1&&(
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9aa79d]">Información básica</p>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Nombre del producto <span className="text-[#B23A48]">*</span></label>
              <Input placeholder="Ej: Almendra chiquitana" value={form.nombre} onChange={e=>set('nombre',e.target.value)} />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Nombre científico</label>
              <Input placeholder="Ej: Dipteryx alata" value={form.cientifico} onChange={e=>set('cientifico',e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Tipo</label>
                <Input placeholder="Ej: Fruto seco" value={form.tipo} onChange={e=>set('tipo',e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Categoría</label>
                <select value={form.categoria} onChange={e=>set('categoria',e.target.value)} className={selectCls}>
                  {CATEGORIAS_PRODUCTO.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Origen</label>
                <select value={form.origen} onChange={e=>set('origen',e.target.value)} className={selectCls}>
                  {ORIGENES_PRODUCTO.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Color representativo</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.color} onChange={e=>set('color',e.target.value)}
                    className="w-10 h-10 rounded-lg border border-[#D9E0DA] cursor-pointer p-0.5 bg-white" />
                  <input type="text" value={form.color} onChange={e=>set('color',e.target.value)}
                    placeholder="#2D6A4F" className="flex-1 h-10 rounded-lg border border-[#D9E0DA] bg-white px-3 text-sm text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] font-mono" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Paso 2 — Temporada */}
        {step===2&&(
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9aa79d]">Temporada y cosecha</p>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-2.5 block">Meses de disponibilidad</label>
              <div className="grid grid-cols-6 gap-2">
                {FAN.MONTHS_SHORT.map((m,i)=>(
                  <button key={i} onClick={()=>toggleMes(i)}
                    className={cn('h-10 rounded-xl text-[12px] font-semibold transition border',
                      meses.includes(i)?'text-white border-transparent':'bg-white border-[#E2E7DE] text-[#9aa79d] hover:border-[#2D6A4F]/40')}
                    style={meses.includes(i)?{background:form.color||'#2D6A4F'}:{}}>
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-[11.5px] text-[#9aa79d] mt-2">{meses.length===0?'Sin meses seleccionados':meses.length+' mes'+( meses.length!==1?'es':'')+' seleccionado'+( meses.length!==1?'s':'')}</p>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Notas de cosecha</label>
              <textarea value={form.cosecha} onChange={e=>set('cosecha',e.target.value)} rows={3}
                placeholder="Describe el período y condiciones de cosecha…"
                className="w-full rounded-lg border border-[#D9E0DA] p-3 text-sm text-[#2a352c] placeholder:text-[#9aa79d] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 resize-none" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-2 block">Regiones de producción</label>
              <DynamicList items={regiones} setItems={setRegiones} placeholder="Ej: San Ignacio de Velasco" />
            </div>
          </div>
        )}

        {/* Paso 3 — Detalles */}
        {step===3&&(
          <div className="space-y-5 max-h-[58vh] overflow-y-auto pr-1 no-scrollbar">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9aa79d]">Descripción y usos</p>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Descripción</label>
              <textarea value={form.descripcion} onChange={e=>set('descripcion',e.target.value)} rows={3}
                placeholder="Describe el producto, su sabor y características…"
                className="w-full rounded-lg border border-[#D9E0DA] p-3 text-sm text-[#2a352c] placeholder:text-[#9aa79d] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 resize-none" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-2 block">Usos principales</label>
              <DynamicList items={usos} setItems={setUsos} placeholder="Ej: Repostería gourmet" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-2 block">Presentaciones</label>
              <DynamicList items={presentaciones} setItems={setPresentaciones} placeholder="Ej: Bolsa 1 kg" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">Fuente bibliográfica</label>
              <Input placeholder="Autor, año, título…" value={form.fuente} onChange={e=>set('fuente',e.target.value)} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#EDF0EB]">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <div className="flex items-center gap-2.5">
            {step>1&&<Button variant="secondary" size="sm" onClick={()=>setStep(s=>s-1)}><Icon name="chevronLeft" size={15} />Anterior</Button>}
            {step<3?(
              <Button onClick={()=>setStep(s=>s+1)} disabled={step===1&&!canNext1}>
                Siguiente<Icon name="chevronRight" size={15} />
              </Button>
            ):(
              <Button onClick={handleSave} disabled={guardando}>
                {guardando?<Icon name="loader" size={16} className="animate-spin" />:<Icon name="check" size={16} />}
                {producto?'Guardar cambios':'Crear producto'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Gestión de productos del catálogo (conectada al API) ---------- */
function AdminProductos(){
  const toast = useToast();
  // Iniciamos con los productos estáticos (igual que el visitante) y actualizamos desde la API
  const [productos, setProductos] = useState(()=> FAN.PRODUCTS || []);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [q, setQ] = useState('');
  const [catFiltro, setCatFiltro] = useState('todas');
  const [tempFiltro, setTempFiltro] = useState('todos');
  const [modal, setModal] = useState(null);

  const cargar = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos`);
      if(!res.ok) throw new Error();
      const data = await res.json();
      if(data.productos?.length > 0) setProductos(data.productos);
    } catch {
      // fallback silencioso: ya tenemos FAN.PRODUCTS
    }
  };

  useEffect(()=>{ cargar(); }, []);

  const guardar = async data => {
    try {
      setGuardando(true);
      const esEdicion = data.id && productos.some(p=>p.id===data.id);
      const url = esEdicion ? `${API_URL}/api/productos/${data.id}` : `${API_URL}/api/productos`;
      const res = await fetch(url, {
        method: esEdicion?'PUT':'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data),
      });
      if(!res.ok) throw new Error();
      await cargar();
      toast(esEdicion?'Producto actualizado':'Producto creado', { type:'success' });
      setModal(null);
    } catch {
      toast('Error al guardar producto', { type:'error' });
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async id => {
    try {
      const res = await fetch(`${API_URL}/api/productos/${id}`, { method:'DELETE' });
      if(!res.ok) throw new Error();
      await cargar();
      toast('Producto eliminado', { type:'error' });
    } catch {
      toast('Error al eliminar producto', { type:'error' });
    }
  };

  const ESTADOS_TEMP = [
    {value:'todos',label:'Todos'},
    {value:'temporada',label:'En temporada'},
    {value:'terminando',label:'Terminando'},
    {value:'proximamente',label:'Próximamente'},
    {value:'fuera',label:'Fuera'},
  ];

  const items = productos
    .filter(p=> !q || p.nombre.toLowerCase().includes(q.toLowerCase()))
    .filter(p=> catFiltro==='todas' || p.categoria===catFiltro)
    .filter(p=>{
      if(tempFiltro==='todos') return true;
      return FAN.estadoTemporada(p)===tempFiltro;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2D6A4F] mb-1.5">Catálogo general</div>
          <h2 className="text-[24px] sm:text-[29px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>Catálogo</h2>
          <p className="text-[15px] text-[#6b756c] mt-1.5">Explora los productos del bosque. Filtrá por categoría, temporada o buscá por nombre.</p>
        </div>
        <Button onClick={()=>setModal('crear')}><Icon name="plus" size={16} />Agregar producto</Button>
      </div>

      {/* Búsqueda */}
      <div className="sm:w-80">
        <Input icon="search" placeholder="Buscar producto…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      {/* Filtro por categoría */}
      <div className="flex gap-2 flex-wrap">
        {['todas',...CATEGORIAS_PRODUCTO].map(cat=>(
          <button key={cat} onClick={()=>setCatFiltro(cat)}
            className={cn('px-3.5 h-9 rounded-xl text-[13.5px] font-medium transition whitespace-nowrap',
              catFiltro===cat?'bg-[#2D6A4F] text-white':'bg-white border border-[#E2E7DE] text-[#5e6b60] hover:border-[#bcc9bf]')}>
            {cat==='todas'?'Todas':cat}
          </button>
        ))}
      </div>

      {/* Filtro por temporada + conteo */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1 flex-wrap">
          {ESTADOS_TEMP.map(t=>(
            <button key={t.value} onClick={()=>setTempFiltro(t.value)}
              className={cn('px-3 h-8 rounded-lg text-[13px] font-medium transition whitespace-nowrap',
                tempFiltro===t.value?'bg-[#EDF2ED] text-[#2D6A4F] font-semibold':'text-[#8a948a] hover:text-[#2D6A4F]')}>
              {t.label}
            </button>
          ))}
        </div>
        <span className="text-[13px] text-[#8a948a]">{items.length} resultado{items.length!==1?'s':''}</span>
      </div>

      {/* Grilla de productos (misma visual que visitante + acciones de gestión) */}
      <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(p=>{
              const est = FAN.estadoTemporada(p);
              const origenNombre = FAN.ORIGENES[p.origen]?.nombre?.replace('Bosque ','') || p.origen;
              return (
                <div key={p.id} className="group relative bg-white rounded-2xl border border-[#E8EBE6] overflow-hidden shadow-[0_14px_40px_rgba(45,60,45,0.08)] hover:shadow-[0_22px_66px_rgba(45,60,45,0.13)] hover:border-[#cfdbd1] transition-all duration-300 flex flex-col">
                  {/* Imagen / glyph */}
                  <div className="relative h-44 flex items-center justify-center overflow-hidden"
                    style={{ background:`linear-gradient(135deg, ${p.color||'#2D6A4F'}26, ${p.color||'#2D6A4F'}14)` }}>
                    <ProductGlyph product={p} size={60} full />
                    <div className="absolute inset-0 pointer-events-none" style={{ background:'linear-gradient(180deg,rgba(255,255,255,0.06) 0%,rgba(0,0,0,0.04) 100%)' }} />
                    {/* Badge estado */}
                    <div className="absolute top-2.5 left-2.5"><StatusBadge estado={est} size="sm" /></div>
                    {/* Acciones de gestión (hover) */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button onClick={e=>{e.stopPropagation();setModal({producto:p});}}
                        title="Editar" className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center text-[#2D6A4F] shadow-sm transition">
                        <Icon name="edit" size={13} />
                      </button>
                      <button onClick={e=>{e.stopPropagation();eliminar(p.id);}}
                        title="Eliminar" className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-[#FCEEF0] flex items-center justify-center text-[#B23A48] shadow-sm transition">
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="font-semibold text-[#1f2a21] leading-snug text-[15px]" style={{ fontFamily:'var(--font-display)' }}>{p.nombre}</div>
                    <div className="mt-3 pt-3 border-t border-[#F0F2EE] flex items-center gap-1 text-[12px] text-[#6b756c]">
                      <Icon name="mapPin" size={13} className="shrink-0" />
                      <span className="truncate">{origenNombre}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {items.length===0 && (
            <div className="rounded-2xl border border-[#E8EBE6] bg-white p-8 text-center text-[#8a948a]">
              {q?'No se encontraron productos con ese nombre.':'No hay productos en esta categoría.'}
            </div>
          )}
      </>

      {modal&&(
        <ProductoModal
          producto={modal==='crear'?null:modal.producto}
          onClose={()=>setModal(null)}
          onSave={guardar}
          guardando={guardando}
        />
      )}
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
      <Card className="overflow-hidden w-full">
        <div className="overflow-x-auto">
          <div className="hidden sm:grid grid-cols-[1.4fr_1fr_1.4fr_80px] gap-3 px-4 py-3 bg-[#FBFCFA] border-b border-[#EDF0EB] text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d]">
            <span>Suscriptor</span><span>Canal</span><span>Intereses</span><span>Estado</span>
          </div>
          <div className="divide-y divide-[#F0F2EE] min-w-[520px]">
            {subs.map(s=>(
              <div key={s.id} className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1.4fr_80px] gap-2 sm:gap-3 sm:items-center px-3 sm:px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="inline-flex sm:hidden"><Avatar initials={initialsFrom(s.nombre||'')} color="#E3F1EA" size={40} /></div>
                  <div>
                    <div className="text-[15px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)' }}>{s.nombre}</div>
                    <div className="text-[12px] text-[#9aa79d] mt-1">{s.valor}</div>
                  </div>
                </div>
                <span className="text-[13px] text-[#6b756c] flex items-center gap-1.5"><Icon name={s.canal==='WhatsApp'?'whatsapp':'mail'} size={14} className="text-[#2D6A4F]" />{s.canal}</span>
                <div className="flex flex-wrap gap-2">
                  {s.intereses.map(FAN.getProduct).filter(Boolean).slice(0,3).map(p=> (
                    <span key={p.id} className="text-[12px] bg-[#EDF2ED] text-[#3a4a3f] px-3 py-1 rounded-full">{p.nombre}</span>
                  ))}
                </div>
                <div className="flex items-center justify-start sm:justify-end">
                  <span className={cn('text-[12px] inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold', s.activo? 'bg-[#E3F1EA] text-[#1B5036]':'bg-[#F1F2F1] text-[#52564F]')}>
                    <span className="w-2 h-2 rounded-full" style={{ background: s.activo? '#2D6A4F':'#9CA3AF' }}></span>
                    {s.activo? 'Activo' : 'Baja'}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
      {view==='recetario' && <AdminRecetario />}
      {view==='perfil' && <ProfileAdmin />}
    </div>
  );
}

window.AdminScreens = { ScreenAdmin };
Object.assign(window, { ScreenAdmin });
