/* ============================================================
   PLATAFORMA FAN — Experiencia del Suscriptor
   ============================================================ */

function ScreenSuscriptor(){
  const toast = useToast();
  const [tab, setTab] = useState('preferencias');
  const [canal, setCanal] = useState('whatsapp');
  const [valor, setValor] = useState('+591 700 55512');
  const [sel, setSel] = useState(['almendra-chiquitana','asai','totai']);
  const [baja, setBaja] = useState(false);
  const toggle = id => setSel(s=> s.includes(id)? s.filter(x=>x!==id):[...s,id]);

  if(baja) return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-[#F1F2F1] flex items-center justify-center mx-auto mb-5"><Icon name="bell" size={30} className="text-[#9CA3AF]" /></div>
      <h2 className="text-[26px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>Te diste de baja</h2>
      <p className="text-[15px] text-[#6b756c] mt-3">Ya no recibirás alertas de temporada. Puedes volver a suscribirte cuando quieras — el bosque siempre tiene algo nuevo.</p>
      <Button className="mt-6" onClick={()=>{ setBaja(false); toast('¡Bienvenido de vuelta!'); }}>Volver a suscribirme</Button>
    </div>
  );

  return (
    <div id="mi-suscripcion" className="max-w-2xl mx-auto">
      <SectionTitle overline="Mi suscripción" title="Gestiona tus alertas" desc="Actualiza tus productos de interés, tu canal de contacto, o date de baja cuando quieras." />
      <div className="my-5"><SegTabs tabs={[{value:'preferencias',label:'Mis preferencias',icon:'heart'},{value:'cuenta',label:'Canal y baja',icon:'settings'}]} value={tab} onChange={setTab} /></div>

      {tab==='preferencias' && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-[14px] font-semibold text-[#2a352c]">Productos de interés</label>
            <span className="text-[13px] text-[#9aa79d]">{sel.length} seleccionados</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FAN.PRODUCTS.map(p=>{
              const on = sel.includes(p.id);
              const est = FAN.estadoTemporada(p);
              return (
                <button key={p.id} onClick={()=>toggle(p.id)} className={cn('flex items-center gap-2 border rounded-xl p-2.5 transition text-left', on?'border-[#2D6A4F] bg-[#E9F1EC]':'border-[#E8EBE6] hover:border-[#cfdbd1]')}>
                  <ProductGlyph product={p} size={34} rounded="rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[#1f2a21] truncate">{p.nombre}</div>
                    <span className="w-2 h-2 rounded-full inline-block mt-1" style={{ background:FAN.ESTADOS[est].dot }}></span>
                  </div>
                  {on && <Icon name="check" size={15} className="text-[#2D6A4F]" stroke={3} />}
                </button>
              );
            })}
          </div>
          <Button className="w-full" onClick={()=>toast('Preferencias guardadas', { desc:`Recibirás alertas de ${sel.length} productos.` })}><Icon name="check" size={16} />Guardar preferencias</Button>
        </Card>
      )}

      {tab==='cuenta' && (
        <div className="space-y-4">
          <Card className="p-6 space-y-5">
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-2.5 block">¿Cómo te avisamos?</label>
              <div className="grid grid-cols-2 gap-3">
                {[['whatsapp','WhatsApp','whatsapp'],['correo','Correo','mail']].map(([v,l,ic])=>(
                  <button key={v} onClick={()=>setCanal(v)} className={cn('flex items-center gap-2.5 border rounded-xl p-3.5 transition', canal===v?'border-[#2D6A4F] bg-[#E9F1EC]':'border-[#E2E7DE] hover:border-[#cfdbd1]')}>
                    <Icon name={ic} size={18} className={canal===v?'text-[#2D6A4F]':'text-[#8a948a]'} /><span className={cn('text-sm font-medium', canal===v?'text-[#1B5036]':'text-[#5e6b60]')}>{l}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#2a352c] mb-2 block">{canal==='whatsapp'?'Número de WhatsApp':'Correo electrónico'}</label>
              <Input icon={canal==='whatsapp'?'phone':'mail'} value={valor} onChange={e=>setValor(e.target.value)} />
            </div>
            <Button variant="secondary" className="w-full" onClick={()=>toast('Datos actualizados')}>Actualizar canal</Button>
          </Card>
          <Card className="p-6 border-[#f0d9dc]">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-lg bg-[#FCEEF0] flex items-center justify-center text-[#B23A48] shrink-0"><Icon name="bell" size={17} /></span>
              <div className="flex-1">
                <div className="text-[14.5px] font-semibold text-[#1f2a21]">Darse de baja</div>
                <div className="text-[13px] text-[#6b756c] mt-0.5">Dejarás de recibir todas las alertas de temporada.</div>
              </div>
              <Button variant="danger" onClick={()=>{ setBaja(true); toast('Te diste de baja', { type:'error' }); }}>Darme de baja</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

window.SubscriberScreens = { ScreenSuscriptor };
Object.assign(window, { ScreenSuscriptor });
