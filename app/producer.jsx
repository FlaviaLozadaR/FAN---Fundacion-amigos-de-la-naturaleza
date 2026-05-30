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
  PAUSADO:   { label:'Pausado', bg:'#E1F1F5', color:'#0E5468', dot:'#219EBC' }
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

/* ---------- Generador IA simulado ---------- */
function generarFichaIA(texto){
  const t = texto.toLowerCase();
  // detectar producto conocido
  const prod = FAN.PRODUCTS.find(p=> t.includes(p.nombre.toLowerCase().split(' ')[0]));
  const meses = FAN.MONTHS.filter((m,i)=> t.includes(m.toLowerCase()));
  // presentación
  let pres = '';
  if(t.includes('quintal')) pres = 'presentación de 1 quintal (46 kg)';
  else if(t.match(/\bkg|kilo/)) pres = 'presentación por kilogramo';
  else if(t.includes('litro')) pres = 'presentación por litro';
  else if(t.includes('frasco')) pres = 'frasco artesanal';
  const nombre = prod ? prod.nombre : (texto.split(/[\s,]/)[1] ? texto.split(' ').slice(0,2).join(' ') : 'Producto del bosque');
  const temporada = meses.length ? `durante su temporada óptima (${meses.join(' a ')})` : (prod ? `durante su temporada (${prod.m.map(i=>FAN.MONTHS[i]).filter((_,k,a)=>k===0||k===a.length-1).join(' a ')})` : 'durante su temporada de cosecha');
  const usos = prod ? prod.usos.slice(0,3).join(', ').toLowerCase() : 'repostería gourmet, aceites naturales y preparaciones de alta cocina';
  const titulo = prod ? `${prod.nombre} silvestre del bosque chiquitano` : nombre;
  const descripcion = `${prod?prod.nombre:nombre} silvestre, recolectada artesanalmente del bosque chiquitano ${temporada}.${pres?` Disponible en ${pres}.`:''} Ideal para ${usos}. Producto de origen sostenible con trazabilidad comunitaria.`;
  return { titulo, descripcion, prod, presentaciones: pres?[pres.replace('presentación de ','').replace('presentación ','')]:[] };
}

/* ---------- Pantalla: Subir producto con IA ---------- */
function SubirProductoIA({ onClose, onPublicar }){
  const toast = useToast();
  const [entrada, setEntrada] = useState('');
  const [fase, setFase] = useState('input'); // input | generando | resultado
  const [resultado, setResultado] = useState(null);
  const ejemplos = [
    'vendo almendra chiquitana en quintal, sale del bosque en marzo',
    'tengo asaí fresco, pulpa congelada por kilo, temporada febrero',
    'miel de abeja del monte, frasco, cosecha en octubre y noviembre'
  ];
  const generar = () => {
    if(entrada.trim().length<8){ toast('Escribe un poco más', { type:'error', desc:'Describe tu producto en una frase.' }); return; }
    setFase('generando');
    setTimeout(()=>{ setResultado(generarFichaIA(entrada)); setFase('resultado'); }, 1700);
  };
  return (
    <Modal open onClose={onClose} size="lg" className="p-0">
      <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-[#F0F2EE] flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1f4d39] flex items-center justify-center text-white"><Icon name="sparkles" size={19} /></span>
        <div className="flex-1">
          <h2 className="text-[20px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>Subir producto con asistente IA</h2>
          <p className="text-[13px] text-[#8a948a]">Escribe en simple cómo lo dirías tú. La IA redacta una ficha atractiva y vendible.</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-[#F1F2F1] flex items-center justify-center text-[#5e6b60]"><Icon name="x" size={18} /></button>
      </div>

      <div className="px-6 sm:px-8 py-6">
        {/* Paso 1: entrada */}
        <div className={cn('transition', fase!=='input'&&'opacity-60')}>
          <label className="text-[13px] font-semibold text-[#2a352c] mb-2 block flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-[#2D6A4F] text-white text-[11px] font-bold flex items-center justify-center">1</span> Describe tu producto</label>
          <textarea value={entrada} onChange={e=>setEntrada(e.target.value)} disabled={fase==='generando'} rows={3}
            placeholder="Ej: vendo almendra chiquitana en quintal, sale del bosque en marzo…"
            className="w-full rounded-xl border border-[#D9E0DA] p-3.5 text-[15px] text-[#2a352c] placeholder:text-[#aab1a6] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 resize-none" />
          <div className="flex flex-wrap gap-2 mt-2.5">
            {ejemplos.map(ej=>(
              <button key={ej} onClick={()=>setEntrada(ej)} className="text-[12px] text-[#5e6b60] bg-[#F4F7F4] hover:bg-[#E9F1EC] border border-[#E2E7DE] rounded-full px-3 py-1.5 transition text-left">“{ej.length>42?ej.slice(0,42)+'…':ej}”</button>
            ))}
          </div>
        </div>

        {fase==='input' && (
          <Button size="lg" className="w-full mt-5" onClick={generar}><Icon name="wand" size={17} />Generar ficha con IA</Button>
        )}

        {/* Paso 2: generando */}
        {fase==='generando' && (
          <div className="mt-6 flex flex-col items-center justify-center py-8 gap-4">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-[#2D6A4F]/20 animate-ping"></span>
              <span className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#1f4d39] flex items-center justify-center text-white"><Icon name="sparkles" size={22} /></span>
            </div>
            <div className="text-center">
              <div className="text-[15px] font-semibold text-[#1f2a21]">La IA está redactando tu ficha…</div>
              <div className="text-[13px] text-[#8a948a] mt-1">Analizando tu descripción y enriqueciéndola</div>
            </div>
          </div>
        )}

        {/* Paso 3: resultado */}
        {fase==='resultado' && resultado && (
          <div className="mt-6 animate-[fadeIn_.3s_ease]">
            <div className="flex items-center gap-2 mb-3"><span className="w-5 h-5 rounded-full bg-[#2D6A4F] text-white text-[11px] font-bold flex items-center justify-center">2</span><span className="text-[13px] font-semibold text-[#2a352c]">Ficha generada</span><Badge className="bg-[#E9F1EC] text-[#1B5036] ml-1"><Icon name="sparkles" size={12} />Redactado por IA</Badge></div>
            <Card className="p-5 border-[#cfe0d4]">
              <div className="flex items-start gap-4">
                {resultado.prod ? <ProductGlyph product={resultado.prod} size={56} rounded="rounded-xl" /> : <div className="w-14 h-14 rounded-xl bg-[#E9F1EC] flex items-center justify-center text-[#2D6A4F]"><Icon name="package" size={24} /></div>}
                <div className="flex-1">
                  <div className="text-[12px] uppercase tracking-wide text-[#9aa79d] mb-1">Título sugerido</div>
                  <div className="text-[18px] font-semibold text-[#1f2a21] capitalize" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{resultado.titulo}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-[12px] uppercase tracking-wide text-[#9aa79d] mb-1.5">Descripción atractiva</div>
                <p className="text-[14.5px] leading-relaxed text-[#48524a]">{resultado.descripcion}</p>
              </div>
            </Card>
            <div className="bg-[#FBFCFA] border border-[#EEF1EC] rounded-xl p-3.5 mt-3 flex items-start gap-2.5">
              <Icon name="info" size={16} className="text-[#9aa79d] mt-0.5" />
              <p className="text-[12.5px] text-[#6b756c] leading-relaxed">Tú escribiste: <span className="italic">“{entrada}”</span>. La IA lo transformó en una ficha lista para vender. Puedes editarla antes de enviarla a FAN.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              <Button variant="secondary" onClick={()=>{ setFase('input'); }}><Icon name="wand" size={16} />Volver a generar</Button>
              <Button onClick={()=>{ onPublicar(resultado); toast('Producto enviado a FAN', { desc:'Se publicará al ser aprobado.' }); onClose(); }}><Icon name="upload" size={16} />Enviar para publicar</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

window.ProducerCore = { EstadoCuentaBanner, SubirProductoIA, ESTADO_PRODUCTOR, ESTADO_PROD, generarFichaIA };
Object.assign(window, { EstadoCuentaBanner, SubirProductoIA, ESTADO_PRODUCTOR, ESTADO_PROD });
