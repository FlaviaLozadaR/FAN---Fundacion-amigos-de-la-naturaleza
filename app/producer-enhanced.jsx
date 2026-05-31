/* ============================================================
   PLATAFORMA FAN — Panel del Productor MEJORADO
   UX mobile-first · Flujo guiado · Asistente FANNY IA real
   ============================================================ */

/* ─── Constantes de estado ─────────────────────────────────── */
const ESTADO_PRODUCTOR = {
  PENDIENTE:  { label:'Pendiente de aprobación', bg:'#FCEFE1', color:'#9A4D14', dot:'#F4A261', icon:'clock' },
  APROBADO:   { label:'Aprobado',                bg:'#E3F1EA', color:'#1B5036', dot:'#2D6A4F', icon:'checkCircle' },
  RECHAZADO:  { label:'Rechazado',               bg:'#FCEEF0', color:'#B23A48', dot:'#B23A48', icon:'x' },
  SUSPENDIDO: { label:'Suspendido',              bg:'#F1F2F1', color:'#52564F', dot:'#9CA3AF', icon:'info' }
};
const ESTADO_PROD = {
  PUBLICADO: { label:'Publicado', bg:'#E3F1EA', color:'#1B5036', dot:'#2D6A4F' },
  BORRADOR:  { label:'Borrador',  bg:'#F1F2F1', color:'#52564F', dot:'#9CA3AF' },
  REVISION:  { label:'En revisión', bg:'#FCEFE1', color:'#9A4D14', dot:'#F4A261' },
};

/* ─── Banner de estado de cuenta ───────────────────────────── */
function EstadoCuentaBanner({ estado, onAprobar }) {
  const e = ESTADO_PRODUCTOR[estado];
  if (estado === 'APROBADO') return (
    <div className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-5" style={{ background: e.bg }}>
      <Icon name="checkCircle" size={18} style={{ color: e.color }} />
      <p className="text-[13.5px] font-medium" style={{ color: e.color }}>
        Tu cuenta está aprobada. Tus productos son visibles en el catálogo público.
      </p>
    </div>
  );
  if (estado === 'PENDIENTE') return (
    <div className="rounded-2xl px-5 py-4 mb-5 border border-[#f1dcc0]" style={{ background: e.bg }}>
      <div className="flex items-start gap-3">
        <Icon name="clock" size={19} style={{ color: e.color }} className="mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-[14.5px] font-semibold" style={{ color: e.color }}>Tu cuenta está en revisión</p>
          <p className="text-[13px] mt-1 leading-relaxed" style={{ color: e.color, opacity: 0.85 }}>
            El equipo de FAN revisará tu perfil. Mientras tanto puedes preparar tus productos como borrador — se publicarán cuando seas aprobado.
          </p>
          <button
            onClick={onAprobar}
            className="mt-3 text-[12.5px] font-semibold px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white transition"
            style={{ color: e.color }}
          >
            ▶ Simular aprobación de FAN (demo)
          </button>
        </div>
      </div>
    </div>
  );
  return null;
}

/* ─── FANNY IA: asistente conversacional real con Claude API ── */
function FannyIAChat({ producto, onDescripcionGenerada }) {
  const [msgs, setMsgs] = useState([{
    role: 'assistant',
    text: `¡Hola! Soy FANNY, tu asistente. Cuéntame sobre **${producto || 'tu producto'}** — cómo lo recolectas, en qué época, cómo se puede usar. Yo me encargo de redactarlo de forma atractiva.`
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [mostrarDesc, setMostrarDesc] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const enviar = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMsgs(m => [...m, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const history = [...msgs, { role: 'user', text: userMsg }];
      const apiMessages = history.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text
      }));
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `Eres FANNY, asistente amigable de la plataforma FAN (Fundación Amigos de la Naturaleza de Bolivia). Ayudas a productores del Bosque Chiquitano a describir sus productos de forma atractiva para chefs y compradores.

Producto que se está registrando: "${producto || 'producto del bosque'}".

Tu rol: conversar naturalmente en español simple, hacer preguntas concretas (una a la vez) para entender el producto, y cuando tengas suficiente info, ofrecer generar una descripción comercial.

Cuando tengas suficiente información (mínimo 2-3 respuestas del usuario), añade al final de tu mensaje:
[LISTO_PARA_GENERAR]

Cuando el usuario pida generar o confirme que está listo, responde SOLO con:
[DESCRIPCION]
<título aquí>
<descripción aquí, 2-3 oraciones naturales y atractivas para chef>
[FIN_DESCRIPCION]

Sé cálido, usa emojis con moderación, y escribe de forma simple y directa.`,
          messages: apiMessages
        })
      });
      const data = await resp.json();
      const text = data.content?.map(b => b.text || '').join('') || '';

      // Detectar descripción generada
      const descMatch = text.match(/\[DESCRIPCION\]([\s\S]*?)\[FIN_DESCRIPCION\]/);
      if (descMatch) {
        const lines = descMatch[1].trim().split('\n').filter(Boolean);
        const titulo = lines[0];
        const desc = lines.slice(1).join(' ');
        setDescripcion({ titulo, desc });
        setMostrarDesc(true);
        setMsgs(m => [...m, { role: 'assistant', text: '✅ ¡Listo! Aquí está tu ficha redactada. Puedes aceptarla o pedirme que la mejore.' }]);
      } else {
        const cleanText = text.replace('[LISTO_PARA_GENERAR]', '').trim();
        setMsgs(m => [...m, { role: 'assistant', text: cleanText }]);
        if (text.includes('[LISTO_PARA_GENERAR]')) {
          setMsgs(m => [...m, { role: 'assistant', text: '¿Quieres que genere la descripción ahora? 🌿' }]);
        }
      }
    } catch {
      setMsgs(m => [...m, { role: 'assistant', text: 'Ups, tuve un problema. ¿Puedes intentarlo de nuevo?' }]);
    }
    setLoading(false);
  };

  const renderText = (text) => {
    return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: 280 }}>
        {msgs.map((m, i) => (
          <div key={i} className={cn('flex gap-2.5', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#1f4d39] flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="sparkles" size={13} className="text-white" />
              </div>
            )}
            <div
              className={cn('max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed', m.role === 'user'
                ? 'bg-[#2D6A4F] text-white rounded-tr-sm'
                : 'bg-[#F4F7F4] text-[#1f2a21] rounded-tl-sm'
              )}
            >
              {renderText(m.text)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#1f4d39] flex items-center justify-center shrink-0">
              <Icon name="sparkles" size={13} className="text-white" />
            </div>
            <div className="bg-[#F4F7F4] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#9aa79d] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Resultado generado */}
      {mostrarDesc && descripcion && (
        <div className="mx-4 mb-3 rounded-xl border border-[#cfe0d4] bg-[#F0F7F2] p-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <Icon name="sparkles" size={13} className="text-[#2D6A4F]" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#2D6A4F]">Ficha generada por FANNY</span>
          </div>
          <p className="text-[13px] font-semibold text-[#1f2a21] mb-1">{descripcion.titulo}</p>
          <p className="text-[12.5px] text-[#48524a] leading-relaxed">{descripcion.desc}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => { setMostrarDesc(false); setDescripcion(''); setMsgs(m => [...m, { role: 'assistant', text: '¿Cómo la mejoramos? Cuéntame qué cambiar. 😊' }]); }}
              className="flex-1 text-[12.5px] font-medium h-8 rounded-lg border border-[#D9E0DA] bg-white text-[#5e6b60] hover:bg-[#F4F7F4] transition"
            >
              Mejorar
            </button>
            <button
              onClick={() => onDescripcionGenerada(descripcion)}
              className="flex-1 text-[12.5px] font-semibold h-8 rounded-lg bg-[#2D6A4F] text-white hover:bg-[#235741] transition"
            >
              Usar esta ✓
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviar()}
          placeholder="Escribe aquí…"
          className="flex-1 h-10 rounded-xl border border-[#D9E0DA] px-3.5 text-[14px] text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15"
          disabled={loading}
        />
        <button
          onClick={enviar}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center hover:bg-[#235741] disabled:opacity-40 transition"
        >
          <Icon name="send" size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── Wizard de subida de producto (6 pasos) ────────────────── */
const PASOS = [
  { id: 1, label: 'Información básica', icon: 'package' },
  { id: 2, label: 'Temporada',          icon: 'calendar' },
  { id: 3, label: 'Presentaciones',     icon: 'layers' },
  { id: 4, label: 'Descripción',        icon: 'sparkles' },
  { id: 5, label: 'Contacto',           icon: 'phone' },
  { id: 6, label: 'Revisión',           icon: 'check' },
];

function SubirProductoWizard({ onClose, onPublicar }) {
  const toast = useToast();
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({
    productoBase: '',
    esDerivado: false,
    nombreDerivado: '',
    disponibilidad: 'disponible',
    meses: [],
    presentaciones: [{ nombre: '', disponible: true }],
    titulo: '',
    desc: '',
    contacto: '',
    whatsapp: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const prodBase = FAN.PRODUCTS.find(p => p.id === form.productoBase);
  const totalPasos = PASOS.length;
  const pct = ((paso - 1) / (totalPasos - 1)) * 100;

  const toggleMes = (i) => set('meses', form.meses.includes(i) ? form.meses.filter(x => x !== i) : [...form.meses, i]);

  const addPresentacion = () => set('presentaciones', [...form.presentaciones, { nombre: '', disponible: true }]);
  const setPresentacion = (i, k, v) => {
    const arr = [...form.presentaciones];
    arr[i] = { ...arr[i], [k]: v };
    set('presentaciones', arr);
  };
  const removePresentacion = (i) => set('presentaciones', form.presentaciones.filter((_, j) => j !== i));

  const canContinue = () => {
    if (paso === 1) return !!form.productoBase;
    if (paso === 2) return form.meses.length > 0 || form.disponibilidad === 'todo-el-ano';
    if (paso === 3) return form.presentaciones.some(p => p.nombre.trim());
    if (paso === 4) return form.titulo && form.desc;
    return true;
  };

  const publicar = () => {
    onPublicar(form, prodBase);
    toast('Producto enviado para revisión', { desc: 'FAN revisará y publicará tu producto.' });
    onClose();
  };

  return (
    <Modal open onClose={onClose} size="lg" className="p-0">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#F0F2EE]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[18px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>
              Registrar producto
            </h2>
            <p className="text-[12.5px] text-[#8a948a]">Paso {paso} de {totalPasos} — {PASOS[paso - 1].label}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#F1F2F1] flex items-center justify-center text-[#5e6b60]">
            <Icon name="x" size={17} />
          </button>
        </div>
        {/* Progress bar */}
        <div className="relative h-1.5 bg-[#EEF1EC] rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full rounded-full bg-[#2D6A4F] transition-all duration-500" style={{ width: pct + '%' }} />
        </div>
        {/* Steps pills */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-0.5">
          {PASOS.map(p => (
            <button
              key={p.id}
              onClick={() => p.id < paso && setPaso(p.id)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium transition',
                paso === p.id ? 'bg-[#2D6A4F] text-white' : p.id < paso ? 'bg-[#E3F1EA] text-[#1B5036] cursor-pointer' : 'bg-[#F4F7F4] text-[#9aa79d]'
              )}
            >
              {p.id < paso
                ? <Icon name="check" size={11} stroke={2.5} />
                : <Icon name={p.icon} size={11} />
              }
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del paso */}
      <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 420 }}>

        {/* PASO 1: Producto base */}
        {paso === 1 && (
          <div className="space-y-4">
            <p className="text-[13.5px] text-[#48524a]">¿Qué producto estás registrando?</p>
            <div className="grid grid-cols-2 gap-2.5">
              {FAN.PRODUCTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => set('productoBase', p.id)}
                  className={cn(
                    'flex items-center gap-3 border rounded-xl p-3 text-left transition',
                    form.productoBase === p.id ? 'border-[#2D6A4F] bg-[#E9F1EC]' : 'border-[#E8EBE6] hover:border-[#cfdbd1]'
                  )}
                >
                  <ProductGlyph product={p} size={36} rounded="rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[#1f2a21] truncate">{p.nombre}</div>
                    <div className="text-[11px] text-[#8a948a] truncate">{p.categoria}</div>
                  </div>
                  {form.productoBase === p.id && <Icon name="check" size={15} className="text-[#2D6A4F] shrink-0" stroke={2.5} />}
                </button>
              ))}
            </div>

            {form.productoBase && (
              <div className="mt-4 pt-4 border-t border-[#F0F2EE]">
                <label className="text-[13px] font-semibold text-[#2a352c] mb-2.5 block">¿Es un producto derivado?</label>
                <div className="flex gap-3">
                  {[['No, es natural', false], ['Sí, es derivado', true]].map(([l, v]) => (
                    <button
                      key={String(v)}
                      onClick={() => set('esDerivado', v)}
                      className={cn(
                        'flex-1 h-10 rounded-xl border text-[13.5px] font-medium transition',
                        form.esDerivado === v ? 'border-[#2D6A4F] bg-[#E9F1EC] text-[#1B5036]' : 'border-[#E2E7DE] text-[#5e6b60] hover:border-[#bcc9bf]'
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                {form.esDerivado && (
                  <div className="mt-3">
                    <label className="text-[12.5px] text-[#2a352c] font-medium mb-1.5 block">Nombre del derivado</label>
                    <input
                      value={form.nombreDerivado}
                      onChange={e => set('nombreDerivado', e.target.value)}
                      placeholder={`Ej: Mantequilla de ${prodBase?.nombre || 'almendra'}`}
                      className="w-full h-10 rounded-lg border border-[#D9E0DA] px-3 text-[14px] text-[#2a352c] focus:outline-none focus:border-[#2D6A4F]"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PASO 2: Temporada */}
        {paso === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-[13.5px] font-semibold text-[#2a352c] mb-2.5 block">Disponibilidad general</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['disponible', '✅ Disponible ahora', '#E3F1EA', '#1B5036'],
                  ['limitada', '⚡ Disponibilidad limitada', '#FCEFE1', '#9A4D14'],
                  ['proximamente', '🕐 Próximamente', '#F1F2F1', '#52564F'],
                  ['todo-el-ano', '📆 Todo el año', '#E3F1EA', '#1B5036'],
                ].map(([v, l, bg, color]) => (
                  <button
                    key={v}
                    onClick={() => set('disponibilidad', v)}
                    className={cn('border rounded-xl px-3 py-2.5 text-[13px] font-medium transition text-left', form.disponibilidad === v ? 'border-transparent' : 'border-[#E2E7DE] bg-white hover:border-[#cfdbd1] text-[#5e6b60]')}
                    style={form.disponibilidad === v ? { background: bg, color, border: '1.5px solid ' + color + '55' } : {}}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {form.disponibilidad !== 'todo-el-ano' && (
              <div>
                <label className="text-[13.5px] font-semibold text-[#2a352c] mb-1 block">Meses de temporada</label>
                <p className="text-[12px] text-[#9aa79d] mb-3">
                  {prodBase ? `Referencia FAN: ${prodBase.m.map(i => FAN.MONTHS_SHORT[i]).join(', ')}` : 'Selecciona los meses en que tienes el producto.'}
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {FAN.MONTHS_SHORT.map((m, i) => {
                    const on = form.meses.includes(i);
                    const esRef = prodBase?.m.includes(i);
                    return (
                      <button
                        key={i}
                        onClick={() => toggleMes(i)}
                        className={cn('h-10 rounded-xl text-[12.5px] font-semibold transition border', on ? 'text-white border-transparent' : esRef ? 'border-dashed border-[#2D6A4F]/40 text-[#2D6A4F] hover:bg-[#E9F1EC]' : 'border-[#E8EBE6] text-[#9aa79d] hover:border-[#cfdbd1]')}
                        style={on ? { background: prodBase?.color || '#2D6A4F' } : {}}
                        title={on ? 'Quitar mes' : esRef ? 'Mes de temporada oficial' : 'Agregar mes'}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
                {form.meses.length > 0 && (
                  <p className="text-[12.5px] text-[#48524a] mt-2 flex items-center gap-1.5">
                    <Icon name="calendar" size={13} className="text-[#2D6A4F]" />
                    Temporada: {form.meses.sort((a,b)=>a-b).map(i => FAN.MONTHS[i]).join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* PASO 3: Presentaciones */}
        {paso === 3 && (
          <div className="space-y-3">
            <p className="text-[13.5px] text-[#48524a]">¿En qué formatos o tamaños vendes este producto?</p>
            {form.presentaciones.map((p, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-[#FAFBF9] border border-[#E8EBE6] rounded-xl p-3">
                <div className="flex-1">
                  <input
                    value={p.nombre}
                    onChange={e => setPresentacion(i, 'nombre', e.target.value)}
                    placeholder={`Ej: Quintal (46 kg), Bolsa 1 kg, Aceite 250 ml…`}
                    className="w-full h-9 rounded-lg border border-[#D9E0DA] px-3 text-[13.5px] text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] bg-white"
                  />
                </div>
                <button
                  onClick={() => setPresentacion(i, 'disponible', !p.disponible)}
                  className={cn('shrink-0 h-9 px-3 rounded-lg border text-[12px] font-medium transition', p.disponible ? 'bg-[#E3F1EA] border-[#cfe0d4] text-[#1B5036]' : 'bg-[#F1F2F1] border-[#E2E7DE] text-[#9aa79d]')}
                >
                  {p.disponible ? '✅ Disponible' : '❌ No disp.'}
                </button>
                {form.presentaciones.length > 1 && (
                  <button onClick={() => removePresentacion(i)} className="w-9 h-9 rounded-lg hover:bg-[#FCEEF0] flex items-center justify-center text-[#B23A48] transition">
                    <Icon name="trash" size={15} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addPresentacion}
              className="w-full h-10 border-2 border-dashed border-[#D9E0DA] rounded-xl text-[13px] text-[#2D6A4F] font-medium hover:border-[#2D6A4F] hover:bg-[#F7FAF7] transition flex items-center justify-center gap-2"
            >
              <Icon name="plus" size={15} />Agregar presentación
            </button>
            {prodBase?.presentaciones?.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#F0F2EE]">
                <p className="text-[11.5px] text-[#9aa79d] mb-2 flex items-center gap-1"><Icon name="info" size={12} />Presentaciones usuales de {prodBase.nombre}:</p>
                <div className="flex flex-wrap gap-1.5">
                  {prodBase.presentaciones.map((pres, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const empty = form.presentaciones.findIndex(p => !p.nombre.trim());
                        if (empty >= 0) setPresentacion(empty, 'nombre', pres);
                        else addPresentacion();
                      }}
                      className="text-[12px] text-[#5e6b60] bg-[#F4F7F4] hover:bg-[#E9F1EC] border border-[#E2E7DE] rounded-full px-2.5 py-1 transition"
                    >
                      + {pres}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PASO 4: Descripción con FANNY IA */}
        {paso === 4 && (
          <div className="space-y-4">
            {!form.titulo ? (
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1f4d39] flex items-center justify-center">
                    <Icon name="sparkles" size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1f2a21]">Asistente FANNY</p>
                    <p className="text-[12px] text-[#8a948a]">Chatea y genera tu descripción</p>
                  </div>
                </div>
                <div className="border border-[#E8EBE6] rounded-2xl overflow-hidden bg-white">
                  <FannyIAChat
                    producto={form.esDerivado ? (form.nombreDerivado || prodBase?.nombre) : prodBase?.nombre}
                    onDescripcionGenerada={d => { set('titulo', d.titulo); set('desc', d.desc); }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="sparkles" size={15} className="text-[#2D6A4F]" />
                  <span className="text-[12px] font-semibold text-[#2D6A4F] uppercase tracking-wide">Generado por FANNY</span>
                </div>
                <div>
                  <label className="text-[12.5px] text-[#2a352c] font-semibold mb-1.5 block">Título del producto</label>
                  <input
                    value={form.titulo}
                    onChange={e => set('titulo', e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#D9E0DA] px-3 text-[14px] text-[#2a352c] focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="text-[12.5px] text-[#2a352c] font-semibold mb-1.5 block">Descripción</label>
                  <textarea
                    value={form.desc}
                    onChange={e => set('desc', e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-[#D9E0DA] p-3 text-[14px] text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] resize-none leading-relaxed"
                  />
                </div>
                <button
                  onClick={() => { set('titulo', ''); set('desc', ''); }}
                  className="text-[12.5px] text-[#2D6A4F] font-medium flex items-center gap-1.5 hover:underline"
                >
                  <Icon name="wand" size={13} />Volver a chatear con FANNY
                </button>
              </div>
            )}
          </div>
        )}

        {/* PASO 5: Contacto */}
        {paso === 5 && (
          <div className="space-y-4">
            <p className="text-[13.5px] text-[#48524a]">¿Cómo pueden contactarte los chefs interesados?</p>
            <div className="space-y-3">
              <div>
                <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Número de contacto / teléfono</label>
                <div className="relative">
                  <Icon name="phone" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa79d]" />
                  <input
                    value={form.contacto}
                    onChange={e => set('contacto', e.target.value)}
                    placeholder="+591 700 XXXXX"
                    className="w-full h-10 rounded-lg border border-[#D9E0DA] pl-9 pr-3 text-[14px] text-[#2a352c] focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">WhatsApp</label>
                <div className="relative">
                  <Icon name="whatsapp" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa79d]" />
                  <input
                    value={form.whatsapp}
                    onChange={e => set('whatsapp', e.target.value)}
                    placeholder="+591 700 XXXXX"
                    className="w-full h-10 rounded-lg border border-[#D9E0DA] pl-9 pr-3 text-[14px] text-[#2a352c] focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
              </div>
              <div className="bg-[#E9F1EC] rounded-xl px-4 py-3 flex gap-2.5">
                <Icon name="info" size={15} className="text-[#2D6A4F] mt-0.5 shrink-0" />
                <p className="text-[12.5px] text-[#2D6A4F] leading-relaxed">
                  Tu contacto solo será visible para quienes consulten tu producto en la plataforma. No se publica públicamente sin tu aprobación.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PASO 6: Revisión */}
        {paso === 6 && (
          <div className="space-y-4">
            <p className="text-[13.5px] text-[#48524a]">Revisa que todo esté correcto antes de enviar.</p>
            <Card className="p-4 space-y-3.5">
              {[
                ['Producto', form.esDerivado ? `${form.nombreDerivado} (base: ${prodBase?.nombre})` : prodBase?.nombre, 'package'],
                ['Disponibilidad', { disponible: 'Disponible ahora', limitada: 'Limitada', proximamente: 'Próximamente', 'todo-el-ano': 'Todo el año' }[form.disponibilidad], 'check'],
                ['Temporada', form.disponibilidad === 'todo-el-ano' ? 'Todo el año' : form.meses.sort((a,b)=>a-b).map(i => FAN.MONTHS_SHORT[i]).join(', ') || '—', 'calendar'],
                ['Presentaciones', form.presentaciones.filter(p=>p.nombre).map(p=>p.nombre).join(', ') || '—', 'layers'],
                ['Descripción', form.desc ? '✓ Generada con FANNY' : '—', 'sparkles'],
                ['Contacto', form.contacto || form.whatsapp || '—', 'phone'],
              ].map(([l, v, ic]) => (
                <div key={l} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#EEF1EC] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name={ic} size={13} className="text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-[11.5px] text-[#9aa79d] uppercase tracking-wide font-semibold">{l}</p>
                    <p className="text-[13.5px] text-[#1f2a21] font-medium mt-0.5">{v || '—'}</p>
                  </div>
                </div>
              ))}
            </Card>
            {form.desc && (
              <Card className="p-4 border-[#cfe0d4] bg-[#F7FAF8]">
                <p className="text-[11.5px] text-[#9aa79d] uppercase tracking-wide font-semibold mb-1.5">Descripción final</p>
                <p className="text-[13.5px] font-semibold text-[#1f2a21] mb-1">{form.titulo}</p>
                <p className="text-[13px] text-[#48524a] leading-relaxed">{form.desc}</p>
              </Card>
            )}
            <div className="bg-[#FCEFE1] border border-[#f1dcc0] rounded-xl px-4 py-3 flex gap-2.5">
              <Icon name="clock" size={15} className="text-[#9A4D14] mt-0.5 shrink-0" />
              <p className="text-[12.5px] text-[#9A4D14] leading-relaxed">
                Tu producto quedará <strong>en revisión</strong> hasta que FAN lo apruebe para publicar en el catálogo.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer de navegación */}
      <div className="px-6 pb-5 pt-4 border-t border-[#F0F2EE] flex gap-3">
        {paso > 1
          ? <Button variant="secondary" onClick={() => setPaso(p => p - 1)} className="flex-1"><Icon name="arrowLeft" size={16} />Atrás</Button>
          : <Button variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
        }
        {paso < totalPasos
          ? <Button onClick={() => setPaso(p => p + 1)} disabled={!canContinue()} className="flex-1">Continuar<Icon name="arrowRight" size={16} /></Button>
          : <Button onClick={publicar} className="flex-1"><Icon name="upload" size={16} />Enviar a FAN</Button>
        }
      </div>
    </Modal>
  );
}

/* ─── Panel de métricas mejorado ────────────────────────────── */
function MetricasProductor({ productos }) {
  const total = productos.length;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: 'eye', label: 'Visitas este mes', value: '312', delta: 12, color: '#2D6A4F' },
          { icon: 'phone', label: 'Contactos recibidos', value: '28', delta: 6, color: '#2D6A4F' },
          { icon: 'package', label: 'Productos publicados', value: total, delta: null, color: '#F4A261' },
        ].map(s => (
          <Card key={s.label} className="p-3.5 text-center">
            <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: s.color + '18', color: s.color }}>
              <Icon name={s.icon} size={17} />
            </div>
            <div className="text-[22px] font-semibold text-[#1f2a21] leading-none" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
            {s.delta != null && (
              <span className="text-[10.5px] font-semibold text-[#1B5036] bg-[#E3F1EA] px-1.5 py-0.5 rounded-full mt-1 inline-block">↑ {s.delta}%</span>
            )}
            <div className="text-[11px] text-[#9aa79d] mt-1.5 leading-tight">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Interés por producto</h4>
        <div className="space-y-3.5">
          {productos.map((p, i) => {
            const val = [18, 10, 6, 4][i] || 3;
            const pct = (val / 18) * 100;
            return (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <ProductGlyph product={p} size={24} rounded="rounded-md" />
                    <span className="text-[13px] font-medium text-[#1f2a21]">{p.nombre}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-[#8a948a] flex items-center gap-1"><Icon name="eye" size={12} />{val * 4} visitas</span>
                    <span className="text-[12px] font-semibold text-[#2D6A4F]">{val} contactos</span>
                  </div>
                </div>
                <div className="h-2 bg-[#EEF1EC] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: pct + '%', background: p.color || '#2D6A4F' }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-5">
        <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-3" style={{ fontFamily: 'var(--font-display)' }}>Tu perfil esta semana</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Clics en WhatsApp', '12', 'whatsapp', '#2D6A4F'],
            ['Productos guardados', '7', 'heart', '#B23A48'],
            ['Desde búsqueda', '68%', 'search', '#6B4226'],
            ['Desde mapa', '32%', 'map', '#219EBC'],
          ].map(([l, v, ic, c]) => (
            <div key={l} className="flex items-center gap-3 bg-[#FAFBF9] rounded-xl p-3 border border-[#F0F2EE]">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: c + '18', color: c }}>
                <Icon name={ic} size={15} />
              </div>
              <div>
                <div className="text-[16px] font-semibold text-[#1f2a21]">{v}</div>
                <div className="text-[11px] text-[#9aa79d] leading-tight">{l}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── Pantalla principal del productor ──────────────────────── */
function ScreenProductor({ view = 'inicio', setView, subir, setSubir, estado, setEstado }) {
  const toast = useToast();
  const yo = FAN.getProductor('sabores-chiquitos');
  const baseProds = yo.productos.map(FAN.getProduct).filter(Boolean).map(p => ({
    ...p, estadoPub: estado === 'APROBADO' ? 'PUBLICADO' : 'BORRADOR'
  }));
  const [misProductos, setMisProductos] = useState(baseProds);
  const [editando, setEditando] = useState(null);
  const [perfil, setPerfil] = useState({ nombre: yo.nombre, tipo: yo.tipo, ubicacion: yo.ubicacion, desc: yo.desc, tel: yo.contacto.tel, correo: yo.contacto.correo });
  const [perfilSaved, setPerfilSaved] = useState({ ...perfil });

  useEffect(() => {
    if (estado === 'APROBADO') {
      setMisProductos(ms => ms.map(p => ({ ...p, estadoPub: p.estadoPub === 'BORRADOR' ? 'PUBLICADO' : p.estadoPub })));
    }
  }, [estado]);

  const aprobar = () => { setEstado('APROBADO'); toast('¡Felicidades! FAN aprobó tu cuenta', { desc: 'Tus productos ya son visibles en el catálogo.' }); };

  /* ── Inicio (home) ── */
  if (view === 'inicio') return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Saludo */}
      <div className="flex items-center gap-4">
        <Avatar initials={yo.iniciales} color="#2D6A4F" size={56} />
        <div>
          <p className="text-[13px] text-[#8a948a]">Buenos días,</p>
          <h1 className="text-[22px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>{perfilSaved.nombre}</h1>
          <Badge style={{ background: ESTADO_PRODUCTOR[estado].bg, color: ESTADO_PRODUCTOR[estado].color }} className="mt-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: ESTADO_PRODUCTOR[estado].dot }} />
            {ESTADO_PRODUCTOR[estado].label}
          </Badge>
        </div>
      </div>

      <EstadoCuentaBanner estado={estado} onAprobar={aprobar} />

      {/* Acciones grandes mobile-first */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Mis productos', desc: `${misProductos.length} publicados`, icon: 'package', color: '#2D6A4F', view: 'productos' },
          { label: 'Subir producto', desc: 'Con asistente FANNY IA', icon: 'sparkles', color: '#6B4226', action: () => setSubir(true) },
          { label: 'Interés generado', desc: '28 contactos este mes', icon: 'eye', color: '#219EBC', view: 'metricas' },
          { label: 'Mi perfil', desc: 'Editar información', icon: 'user', color: '#1B5036', view: 'perfil' },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action || (() => setView(item.view))}
            className="flex flex-col items-start gap-3 p-4 rounded-2xl border border-[#E8EBE6] bg-white hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-transform group-hover:scale-105" style={{ background: item.color }}>
              <Icon name={item.icon} size={22} />
            </div>
            <div>
              <div className="text-[14.5px] font-semibold text-[#1f2a21]">{item.label}</div>
              <div className="text-[12px] text-[#8a948a]">{item.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Acceso rápido a temporada actual */}
      {estado === 'APROBADO' && (
        <Card className="p-4">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d] mb-3">Tus productos en temporada ahora</p>
          <div className="space-y-2">
            {misProductos.filter(p => p.m?.includes(FAN.CURRENT_MONTH)).map(p => {
              const ep = ESTADO_PROD[p.estadoPub];
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <ProductGlyph product={p} size={36} rounded="rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-[#1f2a21] truncate">{p.nombre}</p>
                  </div>
                  <Badge style={{ background: ep.bg, color: ep.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: ep.dot }} />{ep.label}
                  </Badge>
                </div>
              );
            })}
            {misProductos.filter(p => p.m?.includes(FAN.CURRENT_MONTH)).length === 0 && (
              <p className="text-[13px] text-[#9aa79d]">Ningún producto en temporada este mes.</p>
            )}
          </div>
        </Card>
      )}

      {subir && (
        <SubirProductoWizard
          onClose={() => setSubir(false)}
          onPublicar={(formData, prodBase) => {
            if (prodBase && !misProductos.find(p => p.id === prodBase.id)) {
              setMisProductos(ms => [{
                ...prodBase,
                nombre: formData.titulo || prodBase.nombre,
                desc: formData.desc || prodBase.desc,
                estadoPub: estado === 'APROBADO' ? 'REVISION' : 'BORRADOR',
                presentaciones: formData.presentaciones.filter(p => p.nombre).map(p => p.nombre)
              }, ...ms]);
            }
          }}
        />
      )}
    </div>
  );

  /* ── Productos ── */
  if (view === 'productos') return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setView('inicio')} className="w-9 h-9 rounded-xl hover:bg-[#EDF2ED] flex items-center justify-center text-[#5e6b60] transition">
          <Icon name="arrowLeft" size={18} />
        </button>
        <h2 className="text-[19px] font-semibold text-[#1f2a21] flex-1" style={{ fontFamily: 'var(--font-display)' }}>Mis productos</h2>
        <Button size="sm" onClick={() => setSubir(true)}><Icon name="sparkles" size={15} />Subir</Button>
      </div>

      <EstadoCuentaBanner estado={estado} onAprobar={aprobar} />

      {misProductos.map(p => {
        const ep = ESTADO_PROD[p.estadoPub];
        return (
          <Card key={p.id} className="p-4">
            <div className="flex items-start gap-3.5">
              <ProductGlyph product={p} size={54} rounded="rounded-xl" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#1f2a21] text-[15px]" style={{ fontFamily: 'var(--font-display)' }}>{p.nombre}</p>
                    <Badge style={{ background: ep.bg, color: ep.color }} className="mt-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: ep.dot }} />{ep.label}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setEditando(p)}>
                    <Icon name="edit" size={17} />
                  </Button>
                </div>
                <p className="text-[12.5px] text-[#8a948a] mt-2 line-clamp-2">{p.desc}</p>
                {p.presentaciones?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.presentaciones.map((pr, i) => (
                      <span key={i} className="text-[11.5px] bg-[#F4F7F4] border border-[#E8EBE6] text-[#6b756c] px-2 py-0.5 rounded-full">{pr}</span>
                    ))}
                  </div>
                )}
                {p.m?.length > 0 && (
                  <p className="text-[11.5px] text-[#9aa79d] mt-2 flex items-center gap-1.5">
                    <Icon name="calendar" size={12} />
                    Temporada: {p.m.map(i => FAN.MONTHS_SHORT[i]).join(', ')}
                    {p.m.includes(FAN.CURRENT_MONTH) && <span className="text-[#2D6A4F] font-semibold">· Ahora activo</span>}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}

      <button
        onClick={() => setSubir(true)}
        className="w-full border-2 border-dashed border-[#dbe3dc] rounded-2xl py-6 text-[#2D6A4F] font-medium hover:border-[#2D6A4F] hover:bg-[#F7FAF7] transition flex items-center justify-center gap-2"
      >
        <Icon name="sparkles" size={18} />Subir nuevo producto con FANNY IA
      </button>

      {subir && (
        <SubirProductoWizard
          onClose={() => setSubir(false)}
          onPublicar={(formData, prodBase) => {
            if (prodBase && !misProductos.find(p => p.id === prodBase.id)) {
              setMisProductos(ms => [{
                ...prodBase,
                nombre: formData.titulo || prodBase.nombre,
                desc: formData.desc || prodBase.desc,
                estadoPub: estado === 'APROBADO' ? 'REVISION' : 'BORRADOR',
                presentaciones: formData.presentaciones.filter(p => p.nombre).map(p => p.nombre)
              }, ...ms]);
            }
          }}
        />
      )}

      {editando && (
        <Modal open onClose={() => setEditando(null)} size="md">
          <div className="px-6 pt-6 pb-5 border-b border-[#F0F2EE] flex items-center gap-3">
            <ProductGlyph product={editando} size={44} rounded="rounded-xl" />
            <div className="flex-1">
              <h2 className="text-[18px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>Editar producto</h2>
            </div>
            <button onClick={() => setEditando(null)} className="w-9 h-9 rounded-full hover:bg-[#F1F2F1] flex items-center justify-center text-[#5e6b60]">
              <Icon name="x" size={17} />
            </button>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Nombre</label>
              <input
                value={editando.nombre}
                onChange={e => setEditando(p => ({ ...p, nombre: e.target.value }))}
                className="w-full h-10 rounded-lg border border-[#D9E0DA] px-3 text-[14px] text-[#2a352c] focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>
            <div>
              <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Descripción</label>
              <textarea
                value={editando.desc}
                onChange={e => setEditando(p => ({ ...p, desc: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-[#D9E0DA] p-3 text-[14px] text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] resize-none"
              />
            </div>
          </div>
          <div className="px-6 pb-5 flex gap-3 border-t border-[#F0F2EE] pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setEditando(null)}>Cancelar</Button>
            <Button className="flex-1" onClick={() => {
              setMisProductos(ms => ms.map(p => p.id === editando.id ? editando : p));
              setEditando(null);
              toast('Producto actualizado');
            }}><Icon name="check" size={16} />Guardar</Button>
          </div>
        </Modal>
      )}
    </div>
  );

  /* ── Métricas ── */
  if (view === 'metricas') return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setView('inicio')} className="w-9 h-9 rounded-xl hover:bg-[#EDF2ED] flex items-center justify-center text-[#5e6b60] transition">
          <Icon name="arrowLeft" size={18} />
        </button>
        <h2 className="text-[19px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)' }}>Interés generado</h2>
      </div>
      {estado !== 'APROBADO'
        ? <Card className="p-10 text-center text-[#8a948a]">
            <Icon name="chart" size={28} className="mx-auto mb-3 opacity-40" />
            Tus métricas estarán disponibles cuando tu cuenta sea aprobada.
          </Card>
        : <MetricasProductor productos={misProductos} />
      }
    </div>
  );

  /* ── Perfil ── */
  if (view === 'perfil') return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => setView('inicio')} className="w-9 h-9 rounded-xl hover:bg-[#EDF2ED] flex items-center justify-center text-[#5e6b60] transition">
          <Icon name="arrowLeft" size={18} />
        </button>
        <h2 className="text-[19px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)' }}>Mi perfil</h2>
      </div>
      <div className="flex flex-col items-center gap-3 pb-2">
        <div className="relative">
          <Avatar initials={yo.iniciales} color="#2D6A4F" size={72} />
          <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shadow border-2 border-white hover:bg-[#235741] transition">
            <Icon name="image" size={14} />
          </button>
        </div>
        <div className="text-center">
          <p className="text-[17px] font-semibold text-[#1f2a21]" style={{ fontFamily: 'var(--font-display)' }}>{perfilSaved.nombre}</p>
          <p className="text-[13px] text-[#8a948a]">{perfilSaved.ubicacion}</p>
        </div>
      </div>
      <Card className="p-5 space-y-4">
        {[
          ['Nombre de la organización', 'nombre', 'text'],
          ['Tipo de organización', 'tipo', 'text'],
          ['Ubicación', 'ubicacion', 'text'],
          ['Teléfono', 'tel', 'tel'],
          ['Correo electrónico', 'correo', 'email'],
        ].map(([label, key, type]) => (
          <div key={key}>
            <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">{label}</label>
            <input
              type={type}
              value={perfil[key]}
              onChange={e => setPerfil(p => ({ ...p, [key]: e.target.value }))}
              className="w-full h-10 rounded-lg border border-[#D9E0DA] px-3 text-[14px] text-[#2a352c] focus:outline-none focus:border-[#2D6A4F]"
            />
          </div>
        ))}
        <div>
          <label className="text-[12.5px] font-semibold text-[#2a352c] mb-1.5 block">Descripción de la organización</label>
          <textarea
            value={perfil.desc}
            onChange={e => setPerfil(p => ({ ...p, desc: e.target.value }))}
            rows={3}
            className="w-full rounded-lg border border-[#D9E0DA] p-3 text-[14px] text-[#2a352c] focus:outline-none focus:border-[#2D6A4F] resize-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={() => setPerfil({ ...perfilSaved })}>Cancelar</Button>
          <Button className="flex-1" onClick={() => { setPerfilSaved({ ...perfil }); toast('Perfil guardado'); }}>
            <Icon name="check" size={16} />Guardar cambios
          </Button>
        </div>
      </Card>
    </div>
  );

  return null;
}

window.ProducerScreensV2 = { ScreenProductor, EstadoCuentaBanner, ESTADO_PRODUCTOR, ESTADO_PROD };
Object.assign(window, { ScreenProductor, EstadoCuentaBanner, ESTADO_PRODUCTOR, ESTADO_PROD });
