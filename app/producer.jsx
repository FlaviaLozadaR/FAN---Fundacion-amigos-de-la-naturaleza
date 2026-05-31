/* ============================================================
   PLATAFORMA FAN — Experiencia del Productor
   ============================================================ */

const ESTADO_PRODUCTOR = {
  PENDIENTE: { label:'Pendiente de aprobación', bg:'#FCEFE1', color:'#9A4D14', dot:'#F4A261', icon:'clock' },
  APROBADO:  { label:'Aprobado', bg:'#E3F1EA', color:'#1B5036', dot:'#2D6A4F', icon:'checkCircle' },
  RECHAZADO: { label:'Rechazado', bg:'#FCEEF0', color:'#B23A48', dot:'#B23A48', icon:'x' },
  SUSPENDIDO:{ label:'Suspendido', bg:'#F1F2F1', color:'#52564F', dot:'#9CA3AF', icon:'info' }
};
const ESTADO_PROD = {
  PUBLICADO: { label:'Publicado', bg:'#E3F1EA', color:'#1B5036', dot:'#2D6A4F' },
  BORRADOR:  { label:'Borrador', bg:'#F1F2F1', color:'#52564F', dot:'#9CA3AF' },
  REVISION:  { label:'En revisión', bg:'#FCEFE1', color:'#9A4D14', dot:'#F4A261' },
  PAUSADO:   { label:'Pausado', bg:'#E3F1EA', color:'#1B5036', dot:'#2D6A4F' }
};

/* ---------- Banner de estado de cuenta ---------- */
function EstadoCuentaBanner({ estado, onAprobar }){
  const e = ESTADO_PRODUCTOR[estado];
  if(estado==='APROBADO') return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6" style={{ background:e.bg }}>
      <Icon name="checkCircle" size={20} style={{ color:e.color }} />
      <div className="text-[14px] font-medium" style={{ color:e.color }}>Tu cuenta está aprobada. Puedes publicar productos en el catálogo público.</div>
    </div>
  );
  if(estado==='PENDIENTE') return (
    <div className="rounded-xl px-5 py-4 mb-6 border border-[#f1dcc0]" style={{ background:e.bg }}>
      <div className="flex items-start gap-3">
        <Icon name="clock" size={20} style={{ color:e.color }} className="mt-0.5" />
        <div className="flex-1">
          <div className="text-[15px] font-semibold" style={{ color:e.color }}>Tu cuenta está en revisión</div>
          <div className="text-[13.5px] mt-1 leading-relaxed" style={{ color:e.color, opacity:0.85 }}>El equipo de FAN está revisando tu perfil. Mientras tanto puedes preparar tus productos como borrador — se publicarán automáticamente al ser aprobado. Suele tomar 1–2 días hábiles.</div>
          <button onClick={onAprobar} className="mt-3 text-[12.5px] font-medium px-3 py-1.5 rounded-lg bg-white/70 hover:bg-white transition" style={{ color:e.color }}>▶ Simular aprobación de FAN (demo)</button>
        </div>
      </div>
    </div>
  );
  return null;
}

/* ---------- Generador de ficha desde conversación ---------- */
function generarFichaDesdeChat(producto, mensajes){
  const userMsgs = mensajes.filter(m=>m.rol==='usuario').map(m=>m.texto);
  const t0 = (userMsgs[0]||'').toLowerCase();
  const t2 = (userMsgs[2]||'').toLowerCase();
  const t3 = userMsgs[3]||'';

  let pres = '';
  if(t0.includes('quintal')) pres = 'quintal (46 kg)';
  else if(t0.match(/\d*\s*(kg|kilo)/)) pres = 'bolsa por kilogramo';
  else if(t0.includes('litro')) pres = 'envase por litro';
  else if(t0.includes('frasco')) pres = 'frasco artesanal';
  else if(t0.includes('aceite')) pres = 'aceite envasado';

  const temporadaBase = producto.cosecha ? producto.cosecha.split('.')[0] : 'disponible en temporada';

  const partes = [
    `${producto.nombre} del bosque chiquitano, recolectada artesanalmente.`,
    producto.desc,
    pres ? `Disponible en presentación de ${pres}.` : '',
    temporadaBase + '.',
    t2.length > 10 ? `Proceso: ${userMsgs[2]}.` : '',
    t3.length > 10 ? t3 : '',
  ].filter(Boolean);

  return {
    titulo: producto.nombre,
    desc: partes.join(' '),
    prod: producto,
    presentaciones: pres ? [pres] : (producto.presentaciones||[]),
  };
}

/* ---------- Subir producto — selector + chatbot IA ---------- */
const FLUJO_IA = [
  p=>`¡Excelente elección! La **${p.nombre}** tiene mucha demanda entre chefs y cocineros. Para armar tu ficha te voy a hacer unas preguntas cortas.\n\n¿Cuánto tenés disponible para vender y en qué presentación? Por ejemplo: "10 quintales", "vendo por kilo", "frascos de 500 ml"…`,
  ()=>`Perfecto. ¿En qué época del año lo podés entregar? ¿Hay meses de mayor disponibilidad o lo tenés todo el año?`,
  ()=>`¿Tiene algún proceso especial de calidad, limpieza o certificación que valga la pena mencionar? ¿Viene de recolección silvestre, cultivo orgánico, etc.?`,
  ()=>`Última pregunta: ¿hay algo único del origen, la comunidad o el bosque de donde viene que quieras que los chefs conozcan?`,
];

function SubirProductoIA({ onClose, onPublicar }){
  const toast = useToast();
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const [fase, setFase] = useState('seleccionar'); // seleccionar | chat | resultado
  const [productoSel, setProductoSel] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const [resultado, setResultado] = useState(null);

  const scrollBottom = () => setTimeout(()=>chatEndRef.current?.scrollIntoView({ behavior:'smooth' }), 80);

  const seleccionar = p => {
    setProductoSel(p);
    setMensajes([{ rol:'ia', texto: FLUJO_IA[0](p).replace(/\*\*(.*?)\*\*/g,'$1'), ts:Date.now() }]);
    setFase('chat');
    setTimeout(()=>inputRef.current?.focus(), 250);
  };

  const enviar = () => {
    if(!input.trim() || escribiendo) return;
    const userMsg = { rol:'usuario', texto:input.trim(), ts:Date.now() };
    const newMsgs = [...mensajes, userMsg];
    setMensajes(newMsgs);
    setInput('');
    scrollBottom();

    const nUser = newMsgs.filter(m=>m.rol==='usuario').length;
    setEscribiendo(true);

    if(nUser < FLUJO_IA.length){
      setTimeout(()=>{
        setMensajes(ms=>[...ms,{ rol:'ia', texto: FLUJO_IA[nUser](productoSel).replace(/\*\*(.*?)\*\*/g,'$1'), ts:Date.now() }]);
        setEscribiendo(false);
        scrollBottom();
      }, 600 + Math.random()*600);
    } else {
      setTimeout(()=>{
        setMensajes(ms=>[...ms,{ rol:'ia', texto:'¡Listo! Con todo lo que me contaste generé tu ficha. Revisala antes de enviarla a FAN.', ts:Date.now() }]);
        setTimeout(()=>{
          setResultado(generarFichaDesdeChat(productoSel, newMsgs));
          setEscribiendo(false);
          setFase('resultado');
          scrollBottom();
        }, 900);
      }, 700 + Math.random()*500);
    }
  };

  const headerSubtitle = {
    seleccionar: 'Elegí el producto del bosque que querés publicar',
    chat: 'Contame sobre tu oferta y la IA arma la ficha',
    resultado: 'Revisá la ficha antes de enviarla al catálogo FAN',
  };

  return (
    <Modal open onClose={onClose} size="lg" className="p-0 flex flex-col overflow-hidden" style={{ maxHeight:'90vh' }}>
      {/* Header fijo */}
      <div className="px-6 pt-5 pb-4 border-b border-[#F0F2EE] flex items-center gap-3 shrink-0">
        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1f4d39] flex items-center justify-center text-white shrink-0">
          <Icon name="sparkles" size={18} />
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="text-[18px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.2 }}>
            {fase==='seleccionar'?'Subir producto':fase==='chat'&&productoSel?`${productoSel.nombre} — Asistente IA`:'Ficha generada'}
          </h2>
          <p className="text-[12.5px] text-[#9aa79d] leading-tight">{headerSubtitle[fase]}</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-[#F1F2F1] flex items-center justify-center text-[#8a948a] shrink-0">
          <Icon name="x" size={18} />
        </button>
      </div>

      {/* Fase 1 — Selector de producto */}
      {fase==='seleccionar'&&(
        <div className="overflow-y-auto no-scrollbar flex-1 px-5 py-5">
          <p className="text-[13px] text-[#6b756c] mb-4">Estos son los productos del bosque chiquitano que podés publicar en el catálogo FAN.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FAN.PRODUCTS.map(p=>(
              <button key={p.id} onClick={()=>seleccionar(p)}
                className="text-left bg-white rounded-2xl border border-[#E8EBE6] overflow-hidden hover:border-[#2D6A4F]/50 hover:shadow-[0_4px_20px_rgba(45,106,79,0.12)] transition-all duration-200 group">
                <div className="h-24 flex items-center justify-center relative overflow-hidden"
                  style={{ background:`linear-gradient(135deg,${p.color}22,${p.color}0a)` }}>
                  <ProductGlyph product={p} size={44} full />
                </div>
                <div className="px-3 py-2.5">
                  <div className="font-semibold text-[13.5px] text-[#1f2a21] leading-tight">{p.nombre}</div>
                  <div className="text-[11px] text-[#9aa79d] mt-0.5 truncate">{p.categoria}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fase 2 — Chat IA */}
      {fase==='chat'&&(
        <>
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-3">
            {mensajes.map((m,i)=>(
              <div key={i} className={cn('flex gap-2.5 items-end', m.rol==='usuario'&&'flex-row-reverse')}>
                {m.rol==='ia'?(
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1f4d39] flex items-center justify-center text-white shrink-0">
                    <Icon name="sparkles" size={13} />
                  </span>
                ):(
                  <span className="w-8 h-8 rounded-xl bg-[#6B4226] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {FAN.getProductor('sabores-chiquitos')?.iniciales||'PR'}
                  </span>
                )}
                <div className={cn('max-w-[78%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap',
                  m.rol==='ia'?'bg-[#F4F7F4] text-[#2a352c] rounded-tl-sm':'bg-[#2D6A4F] text-white rounded-tr-sm')}>
                  {m.texto}
                </div>
              </div>
            ))}
            {escribiendo&&(
              <div className="flex gap-2.5 items-end">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1f4d39] flex items-center justify-center text-white shrink-0">
                  <Icon name="sparkles" size={13} />
                </span>
                <div className="bg-[#F4F7F4] rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5">
                  {[0,1,2].map(i=>(
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#9aa79d] animate-bounce"
                      style={{ animationDelay:`${i*0.15}s` }}></span>
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="px-5 pb-5 pt-3 border-t border-[#F0F2EE] shrink-0">
            <div className="flex gap-2">
              <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),enviar())}
                placeholder="Escribí tu respuesta y presioná Enter…"
                disabled={escribiendo}
                className="flex-1 h-11 rounded-xl border border-[#D9E0DA] px-4 text-[14px] text-[#2a352c] placeholder:text-[#9aa79d] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 disabled:opacity-50" />
              <Button onClick={enviar} disabled={!input.trim()||escribiendo} className="h-11 w-11 shrink-0 p-0 flex items-center justify-center">
                <Icon name="send" size={16} />
              </Button>
            </div>
            <button onClick={()=>setFase('seleccionar')} className="mt-2 text-[11.5px] text-[#9aa79d] hover:text-[#2D6A4F] transition flex items-center gap-1">
              <Icon name="chevronLeft" size={12} />Cambiar producto seleccionado
            </button>
          </div>
        </>
      )}

      {/* Fase 3 — Resultado */}
      {fase==='resultado'&&resultado&&(
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5 space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#E9F1EC] text-[#1B5036]"><Icon name="sparkles" size={12} />Generado por IA</Badge>
            <span className="text-[12.5px] text-[#9aa79d]">Basado en tu conversación</span>
          </div>
          <Card className="p-5 border-[#c8ddd0]">
            <div className="flex items-start gap-4 mb-4 pb-4 border-b border-[#EEF1EC]">
              <ProductGlyph product={resultado.prod} size={56} rounded="rounded-xl" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase tracking-wide text-[#9aa79d] mb-1">Producto seleccionado</div>
                <div className="text-[18px] font-semibold text-[#1f2a21] leading-tight" style={{ fontFamily:'var(--font-display)' }}>{resultado.titulo}</div>
                {resultado.presentaciones?.length>0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {resultado.presentaciones.map(p=>(
                      <Badge key={p} className="bg-[#EDF2ED] text-[#2D6A4F] text-[11px]">{p}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-[#9aa79d] mb-1.5">Descripción para el catálogo FAN</div>
              <p className="text-[13.5px] leading-relaxed text-[#48524a]">{resultado.desc}</p>
            </div>
          </Card>
          <div className="bg-[#FBFCFA] border border-[#EEF1EC] rounded-xl p-3.5 flex items-start gap-2">
            <Icon name="info" size={15} className="text-[#9aa79d] mt-0.5 shrink-0" />
            <p className="text-[12px] text-[#6b756c] leading-relaxed">Esta ficha fue redactada por la IA usando tu conversación. Podés seguir conversando para ajustarla o enviarla directo a FAN para revisión.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 pb-2">
            <Button variant="secondary" onClick={()=>setFase('chat')}>
              <Icon name="sparkles" size={15} />Seguir ajustando
            </Button>
            <Button onClick={()=>{
              onPublicar(resultado);
              toast('Producto enviado a FAN',{ desc:'Se publicará cuando el equipo lo revise.' });
              onClose();
            }}>
              <Icon name="upload" size={15} />Enviar para publicar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* mantener compatibilidad — generarFichaIA ya no se usa externamente */
function generarFichaIA(texto){ return generarFichaDesdeChat(FAN.PRODUCTS[0],[{rol:'usuario',texto}]); }

window.ProducerCore = { EstadoCuentaBanner, SubirProductoIA, ESTADO_PRODUCTOR, ESTADO_PROD, generarFichaIA };
Object.assign(window, { EstadoCuentaBanner, SubirProductoIA, ESTADO_PRODUCTOR, ESTADO_PROD });
