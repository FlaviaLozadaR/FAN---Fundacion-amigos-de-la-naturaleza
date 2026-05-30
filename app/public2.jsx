/* ============================================================
   PLATAFORMA FAN — Ficha de producto, perfil de productor,
   suscripción y mapa de orígenes (Visitante)
   ============================================================ */

/* ---------- Ficha de producto (detalle) ---------- */
function ProductDetail({ product, onClose, onOpenProductor, onNav }){
  if(!product) return null;
  const est = FAN.estadoTemporada(product);
  const e = FAN.ESTADOS[est];
  const prods = FAN.productoresDe(product.id);
  const origen = FAN.ORIGENES[product.origen];
  return (
    <Modal open={!!product} onClose={onClose} size="lg" className="p-0">
      {/* cabecera */}
      <div className="relative px-6 sm:px-8 pt-7 pb-6" style={{ background:`linear-gradient(135deg, ${product.color}20, ${product.color}0c)` }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-[#5e6b60] transition"><Icon name="x" size={18} /></button>
        <div className="flex items-start gap-4">
          <ProductGlyph product={product} size={72} rounded="rounded-2xl" />
          <div className="flex-1 min-w-0 pt-1">
            <div className="mb-2"><StatusBadge estado={est} /></div>
            <h2 className="text-[26px] sm:text-[30px] font-semibold text-[#1f2a21] leading-tight tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{product.nombre}</h2>
            <div className="text-[14px] italic text-[#7d877d] mt-0.5">{product.cientifico} · {product.tipo}</div>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-6 space-y-7">
        <p className="text-[15.5px] leading-relaxed text-[#48524a]">{product.desc}</p>

        {/* calendario grande */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] flex items-center gap-1.5"><Icon name="calendar" size={14} /> Temporada de cosecha</h4>
            <span className="text-[12px] text-[#9aa79d]">Mes actual: {FAN.MONTHS[FAN.CURRENT_MONTH]}</span>
          </div>
          <div className="bg-[#FBFCFA] border border-[#EEF1EC] rounded-xl p-4">
            <SeasonStrip product={product} />
            <p className="text-[13.5px] text-[#6b756c] mt-3.5 leading-relaxed flex gap-2"><Icon name="info" size={15} className="text-[#9aa79d] mt-0.5 shrink-0" />{product.cosecha}</p>
          </div>
        </div>

        {/* usos + presentaciones */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-2.5 flex items-center gap-1.5"><Icon name="sparkles" size={14} /> Usos culinarios</h4>
            <div className="flex flex-wrap gap-2">
              {product.usos.map(u=> <Badge key={u} className="bg-[#EDF2ED] text-[#3a4a3f]">{u}</Badge>)}
            </div>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-2.5 flex items-center gap-1.5"><Icon name="package" size={14} /> Presentaciones</h4>
            <div className="flex flex-wrap gap-2">
              {product.presentaciones.map(u=> <Badge key={u} className="bg-white border border-[#E2E7DE] text-[#5e6b60]">{u}</Badge>)}
            </div>
          </div>
        </div>

        {/* procedencia */}
        <div className="flex items-center gap-3 bg-[#F4F7F4] rounded-xl p-3.5">
          <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background:origen.color }}><Icon name="mapPin" size={17} /></span>
          <div className="text-[13.5px]">
            <span className="text-[#9aa79d]">Procedencia · </span>
            <span className="font-semibold text-[#2a352c]">{origen.nombre}</span>
            <span className="text-[#6b756c]"> — {product.regiones.join(', ')}</span>
          </div>
        </div>

        {/* productores */}
        <div>
          <h4 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-3 flex items-center gap-1.5"><Icon name="users" size={14} /> ¿Con quién me contacto?</h4>
          {prods.length ? (
            <div className="space-y-2.5">
              {prods.map(pr=>(
                <div key={pr.id} className="flex items-center gap-3 border border-[#E8EBE6] rounded-xl p-3 hover:border-[#cfdbd1] transition">
                  <Avatar initials={pr.iniciales} color="#2D6A4F" size={42} />
                  <div className="flex-1 min-w-0">
                    <button onClick={()=>onOpenProductor(pr)} className="font-semibold text-[#1f2a21] hover:text-[#2D6A4F] transition flex items-center gap-1.5 text-left">{pr.nombre}{pr.verificado && <Icon name="badge" size={15} className="text-[#2D6A4F]" />}</button>
                    <div className="text-[12px] text-[#8a948a] truncate">{pr.ubicacion}</div>
                  </div>
                  <a href={`https://wa.me/${pr.contacto.whatsapp}`} target="_blank" className="hidden sm:inline-flex"><Button size="sm" variant="subtle"><Icon name="whatsapp" size={15} />WhatsApp</Button></a>
                  <Button size="icon" variant="ghost" onClick={()=>onOpenProductor(pr)}><Icon name="chevronRight" size={18} /></Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[14px] text-[#8a948a] bg-[#FBFCFA] border border-dashed border-[#E2E7DE] rounded-xl p-4">Aún no hay productores aprobados para este producto. <button onClick={()=>{onClose(); onNav('suscripcion');}} className="text-[#2D6A4F] font-medium underline-offset-2 hover:underline">Suscríbete para recibir alertas</button> cuando haya disponibilidad.</div>
          )}
        </div>

        {/* CTA suscripción */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gradient-to-r from-[#E9F1EC] to-[#EAF4EE] rounded-xl p-4 border border-[#d7e6dc]">
          <div className="flex-1">
            <div className="font-semibold text-[#1B5036] flex items-center gap-1.5"><Icon name="bell" size={15} /> ¿Te avisamos cuando entre en temporada?</div>
            <div className="text-[13px] text-[#4f6356] mt-0.5">Recibe una alerta al inicio de la próxima cosecha de {product.nombre.toLowerCase()}.</div>
          </div>
          <Button onClick={()=>{onClose(); onNav('suscripcion');}}>Suscribirme</Button>
        </div>

        <p className="text-[11.5px] text-[#aab1a6] leading-relaxed border-t border-[#F0F2EE] pt-4 flex gap-1.5"><Icon name="info" size={13} className="mt-0.5 shrink-0" />Fuente: {product.fuente} El calendario es indicativo y puede variar por factores climáticos y productivos.</p>
      </div>
    </Modal>
  );
}

/* ---------- Perfil de productor ---------- */
function ProductorDetail({ productor, onClose, onOpen }){
  if(!productor) return null;
  const pr = productor;
  const prods = pr.productos.map(FAN.getProduct).filter(Boolean);
  return (
    <Modal open={!!productor} onClose={onClose} size="md" className="p-0">
      <div className="relative px-6 sm:px-8 pt-7 pb-6 bg-gradient-to-br from-[#2D6A4F] to-[#1f4d39] text-white">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition"><Icon name="x" size={18} /></button>
        <div className="flex items-start gap-4">
          <Avatar initials={pr.iniciales} color="#74C69D" size={64} />
          <div className="pt-1">
            {pr.verificado && <Badge className="bg-white/15 text-white mb-2"><Icon name="badge" size={13} /> Productor verificado por FAN</Badge>}
            <h2 className="text-[24px] font-semibold leading-tight tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{pr.nombre}</h2>
            <div className="text-[13.5px] text-white/80 mt-1 flex items-center gap-1.5"><Icon name="mapPin" size={14} />{pr.ubicacion}</div>
          </div>
        </div>
      </div>
      <div className="px-6 sm:px-8 py-6 space-y-6">
        <p className="text-[15px] leading-relaxed text-[#48524a]">{pr.desc}</p>
        <div className="grid grid-cols-3 gap-3">
          {[['Productos',prods.length,'package'],['Activo desde',pr.desde,'calendar'],['Tipo',pr.tipo.split(' ')[0],'users']].map(([l,v,ic])=>(
            <div key={l} className="bg-[#FBFCFA] border border-[#EEF1EC] rounded-xl p-3 text-center">
              <Icon name={ic} size={16} className="mx-auto text-[#2D6A4F] mb-1.5" />
              <div className="text-[15px] font-semibold text-[#1f2a21]">{v}</div>
              <div className="text-[11px] text-[#9aa79d]">{l}</div>
            </div>
          ))}
        </div>
        <div>
          <h4 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-3">Productos disponibles</h4>
          <div className="grid grid-cols-2 gap-3">
            {prods.map(p=>{
              const est = FAN.estadoTemporada(p);
              return (
                <button key={p.id} onClick={()=>{ onClose(); setTimeout(()=>onOpen(p),120); }} className="flex items-center gap-2.5 border border-[#E8EBE6] rounded-xl p-2.5 hover:border-[#cfdbd1] hover:bg-[#F7FAF7] transition text-left">
                  <ProductGlyph product={p} size={40} rounded="rounded-lg" />
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold text-[#1f2a21] truncate">{p.nombre}</div>
                    <div className="mt-1"><StatusBadge estado={est} size="sm" /></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="border-t border-[#F0F2EE] pt-5">
          <h4 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-3">Contacto directo</h4>
          <div className="grid sm:grid-cols-3 gap-2.5">
            <a href={`https://wa.me/${pr.contacto.whatsapp}`} target="_blank"><Button variant="default" className="w-full"><Icon name="whatsapp" size={16} />WhatsApp</Button></a>
            <a href={`tel:${pr.contacto.tel}`}><Button variant="secondary" className="w-full"><Icon name="phone" size={15} />Llamar</Button></a>
            <a href={`mailto:${pr.contacto.correo}`}><Button variant="secondary" className="w-full"><Icon name="mail" size={15} />Correo</Button></a>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Suscripción a alertas ---------- */
function ScreenSuscripcion(){
  const toast = useToast();
  const [canal, setCanal] = useState('whatsapp');
  const [sel, setSel] = useState([]);
  const [valor, setValor] = useState('');
  const [done, setDone] = useState(false);
  const toggle = id => setSel(s=> s.includes(id)? s.filter(x=>x!==id):[...s,id]);
  const submit = () => {
    if(!valor || !sel.length){ toast('Completa tus datos', { type:'error', desc:'Elige al menos un producto y deja tu contacto.' }); return; }
    setDone(true); toast('¡Suscripción activada!', { desc:`Te avisaremos por ${canal==='whatsapp'?'WhatsApp':'correo'}.` });
  };
  if(done) return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-[#E3F1EA] flex items-center justify-center mx-auto mb-5"><Icon name="checkCircle" size={32} className="text-[#2D6A4F]" /></div>
      <h2 className="text-[26px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>¡Listo! Estás suscrito</h2>
      <p className="text-[15px] text-[#6b756c] mt-3">Te avisaremos cuando los {sel.length} producto{sel.length!==1?'s':''} que elegiste entren o salgan de temporada, y cuando haya nuevos productores disponibles.</p>
      <Button className="mt-6" variant="secondary" onClick={()=>{ setDone(false); setSel([]); setValor(''); }}>Editar mis preferencias</Button>
    </div>
  );
  return (
    <div id="suscripcion" className="max-w-[1080px] mx-auto">
      {/* encabezado */}
      <div className="flex items-start gap-4 mb-7">
        <span className="hidden sm:inline-flex w-14 h-14 rounded-2xl bg-[#E9F1EC] items-center justify-center shrink-0"><Icon name="bell" size={26} className="text-[#2D6A4F]" /></span>
        <div>
          <h2 className="text-[clamp(24px,4vw,32px)] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.2 }}>Recibe alertas de temporada</h2>
          <p className="text-[15px] text-[#6b756c] mt-2 max-w-2xl leading-relaxed">Elige tus productos de interés y te avisamos cuando inicien o terminen su temporada, y cuando haya nuevos productores. Sin spam, date de baja cuando quieras.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-5 items-start">
        {/* COLUMNA IZQUIERDA — canal + contacto + beneficios + acción */}
        <div className="space-y-4 lg:sticky lg:top-6">
          <Card className="p-5 space-y-5">
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-2.5 block">¿Cómo te avisamos?</label>
              <div className="grid grid-cols-2 gap-3">
                {[['whatsapp','WhatsApp','whatsapp'],['correo','Correo','mail']].map(([v,l,ic])=>(
                  <button key={v} onClick={()=>setCanal(v)} className={cn('flex items-center gap-2.5 border rounded-xl p-3.5 transition', canal===v?'border-[#2D6A4F] bg-[#E9F1EC]':'border-[#E2E7DE] hover:border-[#cfdbd1]')}>
                    <Icon name={ic} size={18} className={canal===v?'text-[#2D6A4F]':'text-[#8a948a]'} />
                    <span className={cn('text-sm font-medium', canal===v?'text-[#1B5036]':'text-[#5e6b60]')}>{l}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-2 block">{canal==='whatsapp'?'Número de WhatsApp':'Correo electrónico'}</label>
              <Input icon={canal==='whatsapp'?'phone':'mail'} placeholder={canal==='whatsapp'?'+591 700 00000':'tucorreo@ejemplo.com'} value={valor} onChange={e=>setValor(e.target.value)} />
            </div>
            <div className="flex items-center justify-between bg-[#F4F7F4] rounded-xl px-3.5 py-2.5">
              <span className="text-[13px] text-[#6b756c]">Productos elegidos</span>
              <span className="text-[15px] font-semibold text-[#2D6A4F] tabular-nums">{sel.length}</span>
            </div>
            <Button size="lg" className="w-full" onClick={submit}><Icon name="bell" size={17} />Activar mis alertas</Button>
          </Card>

          <Card className="p-5">
            <div className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-3">Qué vas a recibir</div>
            <ul className="space-y-2.5">
              {[['calendar','Aviso cuando un producto entra en temporada'],['clock','Alerta cuando está por terminar su cosecha'],['users','Notificación de nuevos productores disponibles']].map(([ic,t])=>(
                <li key={t} className="flex items-start gap-2.5 text-[13.5px] text-[#48524a] leading-snug">
                  <span className="w-6 h-6 rounded-lg bg-[#E9F1EC] flex items-center justify-center shrink-0 mt-0.5"><Icon name={ic} size={13} className="text-[#2D6A4F]" /></span>{t}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* COLUMNA DERECHA — selección de productos (llena el ancho) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)' }}>Productos de interés</h3>
            <div className="flex items-center gap-2">
              <button onClick={()=>setSel(FAN.PRODUCTS.map(p=>p.id))} className="text-[12.5px] font-medium text-[#2D6A4F] hover:underline underline-offset-2">Todos</button>
              <span className="text-[#d6ddd6]">·</span>
              <button onClick={()=>setSel([])} className="text-[12.5px] font-medium text-[#8a948a] hover:underline underline-offset-2">Ninguno</button>
            </div>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5">
            {FAN.PRODUCTS.map(p=>{
              const on = sel.includes(p.id);
              const est = FAN.estadoTemporada(p);
              return (
                <button key={p.id} onClick={()=>toggle(p.id)} className={cn('relative flex items-center gap-2.5 border rounded-xl p-2.5 transition text-left', on?'border-[#2D6A4F] bg-[#E9F1EC]':'border-[#E8EBE6] hover:border-[#cfdbd1]')}>
                  <ProductGlyph product={p} size={38} rounded="rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[#1f2a21] leading-tight line-clamp-2">{p.nombre}</div>
                    <span className="inline-flex items-center gap-1 mt-1 text-[10.5px] text-[#9aa79d]"><span className="w-2 h-2 rounded-full" style={{ background:FAN.ESTADOS[est].dot }}></span>{FAN.ESTADOS[est].short}</span>
                  </div>
                  <span className={cn('rounded-[6px] border flex items-center justify-center shrink-0', on?'bg-[#2D6A4F] border-[#2D6A4F]':'border-[#c4ccc4]')} style={{ width:18, height:18 }}>{on && <Icon name="check" size={12} className="text-white" stroke={3} />}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

window.PublicDetail = { ProductDetail, ProductorDetail, ScreenSuscripcion };
Object.assign(window, { ProductDetail, ProductorDetail, ScreenSuscripcion });
