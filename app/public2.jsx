/* ============================================================
   PLATAFORMA FAN — Ficha de producto, perfil de productor,
   suscripción y mapa de orígenes (Visitante)
   ============================================================ */

/* ---------- Ficha de producto (detalle) ---------- */
const PRODUCT_IMG_MAP = {
  'albahaca-silvestre':'ALBAHACA SILVESTRE.png',
  'almendra-chiquitana':'ALMENDRA CHIQUITANA.png',
  'asai':'ASAI.png',
  'canelon':'CANELÓN.png',
  'castana':'CASTAÑA.png',
  'flor-colonia':'FLOR DE COLONIA.png',
  'limon-cambita':'LIMONCITO.png',
  'majo':'MAJO.png',
  'miel':'MIEL.png',
  'motacu':'MOTACU.png',
  'motojobo':'MOTOJOBO.png',
  'paja-cedron':'PAJA CEDRÓN.png',
  'pesoe':'PESOE.png',
  'piton':'PITON.png',
  'sujo':'SUJO.png',
  'totai':'TOTAI.png',
  'yuca':'YUCA.png'
};

function ProductDetail({ product, onClose, onOpenProductor, onNav }){
  if(!product) return null;
  const toast = useToast();
  const est = FAN.estadoTemporada(product);
  const prods = FAN.productoresDe(product.id);
  const heroFile = PRODUCT_IMG_MAP[product.id];
  const heroSrc = heroFile ? '/' + encodeURIComponent(heroFile) : null;

  // Recetas que mencionan el producto en sus ingredientes
  const allRecetas = window.RECETAS || [];
  const related = allRecetas.filter(r => {
    const ing = Object.values(r.ingredientes).flat().join(' ').toLowerCase();
    return ing.includes(product.nombre.toLowerCase().split(' ')[0]);
  });
  const recetasToShow = related.length ? related.slice(0,2) : allRecetas.slice(0,1);

  const handleShare = async () => {
    const meses = FAN.MONTHS_SHORT.filter((_,i) => product.m.includes(i)).join(', ');
    const texto = `${product.nombre} (${product.cientifico})\n${product.desc}\n\nTemporada: ${meses}\nUsos: ${product.usos.join(', ')}\n\nPlataforma FAN — Bosque Chiquitano`;
    const shareData = { title: `${product.nombre} — FAN`, text: texto, url: window.location.href };
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(texto);
        toast('¡Copiado al portapapeles!', { desc: `Información de ${product.nombre} lista para compartir.` });
      }
    } catch(err) {
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(texto);
          toast('¡Copiado!', { desc: 'Información copiada al portapapeles.' });
        } catch(e) {
          toast('No se pudo compartir', { type:'error' });
        }
      }
    }
  };

  return (
    <Modal open={!!product} onClose={onClose} size="lg" className="p-0" skipSidebar={true} fullWidth={true}>
      {/* Hero image */}
      <div className="relative w-full h-[340px] sm:h-[420px] overflow-hidden">
        {heroSrc ? (
          <img src={heroSrc} alt={product.nombre} className="absolute inset-0 w-full h-full object-cover" style={{ filter:'brightness(0.9) saturate(1.05)' }} />
        ) : (
          <div className="absolute inset-0" style={{ background:`linear-gradient(135deg,${product.color}70,${product.color}30)` }} />
        )}
        <div className="absolute inset-0" style={{ background:'linear-gradient(180deg,rgba(255,255,255,0) 30%,rgba(255,255,255,0.22) 65%,rgba(255,255,255,0.6) 100%)' }} />
        {/* Botón volver — top-left */}
        <button onClick={onClose} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-[#5e6b60] shadow-sm transition">
          <Icon name="arrowLeft" size={18} />
        </button>
        {/* Botón compartir — top-right */}
        <button onClick={handleShare} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-[#5e6b60] shadow-sm transition">
          <Icon name="send" size={16} />
        </button>
      </div>

      {/* Tarjeta blanca que emerge sobre el hero */}
      <div className="relative z-10 max-w-[880px] mx-auto -mt-36 px-4 sm:px-8 pb-10">
        <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ boxShadow:'0 8px 48px rgba(18,30,18,0.13)' }}>

          {/* Badge de estado */}
          <div className="mb-3"><StatusBadge estado={est} /></div>

          {/* Categoría */}
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9aa79d] mb-1">{product.categoria}</div>

          {/* Nombre */}
          <h2 className="text-[36px] sm:text-[44px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)', lineHeight:1.05 }}>{product.nombre}</h2>

          {/* Nombre científico */}
          <div className="text-[15px] italic text-[#7d877d] mt-2 mb-4">{product.cientifico}</div>

          {/* Descripción */}
          <p className="text-[15.5px] leading-relaxed text-[#48524a]">{product.desc}</p>

          {/* Calendario de disponibilidad */}
          <div className="mt-7">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-3 flex items-center gap-1.5">
              <Icon name="calendar" size={13} />Calendario de disponibilidad
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {FAN.MONTHS_SHORT.map((m,i)=>(
                <div key={m} className={cn('px-3 py-2 rounded-full text-[13px] font-semibold', product.m.includes(i) ? 'bg-[#2D6A4F] text-white' : 'bg-[#F6F6F4] text-[#9aa79d]')}>{m}</div>
              ))}
            </div>
          </div>

          {/* Usos gastronómicos */}
          <div className="mt-6">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-3 flex items-center gap-1.5">
              <Icon name="sparkles" size={13} />Usos gastronómicos
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.usos.map(u=>(
                <span key={u} className="px-3 py-1.5 rounded-full border border-[#E2E7DE] text-[13px] text-[#3a4a3f] bg-white">{u}</span>
              ))}
            </div>
          </div>

          {/* Derivados disponibles */}
          <div className="mt-6">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-3 flex items-center gap-1.5">
              <Icon name="leaf" size={13} />Derivados disponibles
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.presentaciones.map(p=>(
                <span key={p} className="px-3 py-1.5 rounded-full border border-[#E2E7DE] text-[13px] text-[#5e6b60] bg-white">{p}</span>
              ))}
            </div>
          </div>

          {/* Productor / Comunidad */}
          <div className="mt-6">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-3 flex items-center gap-1.5">
              <Icon name="mapPin" size={13} />Productor / Comunidad
            </h4>
            {prods.length ? (
              <div className="bg-[#E9F6EA] rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar initials={prods[0].iniciales} color="#2D6A4F" size={48} />
                  <div className="min-w-0">
                    <div className="font-semibold text-[#1f2a21] text-[15px] truncate">{prods[0].nombre}</div>
                    <div className="text-[13px] text-[#6b756c]">{prods[0].ubicacion.split(',')[0]}</div>
                  </div>
                </div>
                <button className="text-[13px] font-medium text-[#2D6A4F] hover:underline whitespace-nowrap shrink-0" onClick={()=>{
                  onClose();
                  onNav('mapa');
                  setTimeout(()=> onOpenProductor && onOpenProductor(prods[0]), 120);
                }}>
                  Ver en mapa →
                </button>
              </div>
            ) : (
              <div className="text-[14px] text-[#8a948a]">Sin productores disponibles.</div>
            )}
          </div>

          {/* Recetas relacionadas */}
          {recetasToShow.length > 0 && (
            <div className="mt-6">
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2D6A4F] mb-3">Recetas relacionadas</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {recetasToShow.map(r=>(
                  <div key={r.id} className="rounded-xl overflow-hidden border border-[#E8EBE6] bg-white">
                    <div className="h-28 overflow-hidden bg-[#F6F6F4]">
                      <img src={r.imagen} alt={r.titulo} className="w-full h-full object-cover" onError={e=>{ e.target.style.display='none'; }} />
                    </div>
                    <div className="p-3">
                      <div className="text-[12.5px] font-semibold text-[#1f2a21] leading-tight line-clamp-2">{r.titulo.charAt(0)+r.titulo.slice(1).toLowerCase()}</div>
                      <div className="text-[11px] text-[#9aa79d] mt-1">45 min</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA — Contactar productor */}
          {prods.length > 0 && (
            <div className="mt-7 flex flex-col items-center">
              <a href={`https://wa.me/${prods[0].contacto.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <div className="px-8 py-3.5 rounded-2xl text-white font-semibold text-[15px] flex items-center gap-2 cursor-pointer transition hover:brightness-95" style={{ background:'#2D6A4F' }}>
                  <Icon name="phone" size={17} />Contactar productor
                </div>
              </a>
              <div className="text-center text-[12px] text-[#aab1a6] mt-3 leading-relaxed">
                FANNY conecta — no comercializa. La transacción se acuerda directamente con la comunidad.
              </div>
            </div>
          )}

          {/* Fuente */}
          <div className="mt-5 border-t border-[#F0F2EE] pt-4 flex items-start gap-1.5 text-[11px] text-[#aab1a6]">
            <Icon name="info" size={12} className="text-[#9aa79d] mt-0.5 shrink-0" />
            <span>Fuente: {product.fuente}</span>
          </div>
        </div>
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
