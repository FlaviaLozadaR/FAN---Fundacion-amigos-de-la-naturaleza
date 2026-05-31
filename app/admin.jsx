/* ============================================================
   PLATAFORMA FAN — Panel Administrador (back office)
   ============================================================ */

// Acceso explícito vía window para evitar ReferenceError si producer.jsx carga en orden distinto
const ESTADO_PRODUCTOR = window.ESTADO_PRODUCTOR || {
  PENDIENTE:  { label:'Pendiente de aprobación', bg:'#FCEFE1', color:'#9A4D14', dot:'#F4A261', icon:'clock' },
  APROBADO:   { label:'Aprobado',                bg:'#E3F1EA', color:'#1B5036', dot:'#2D6A4F', icon:'checkCircle' },
  RECHAZADO:  { label:'Rechazado',               bg:'#FCEEF0', color:'#B23A48', dot:'#B23A48', icon:'x' },
  SUSPENDIDO: { label:'Suspendido',              bg:'#F1F2F1', color:'#52564F', dot:'#9CA3AF', icon:'info' },
};

/* mini gráfica de barras */
function BarChart({ data, labels, color='#2D6A4F', height=160 }){
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((v,i)=>(
        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
          <div
            className="w-full rounded-t-md transition-all duration-200 relative hover:-translate-y-0.5"
            title={`${labels[i]} · ${v.toLocaleString()} visitas`}
            style={{
              height:(v/max*(height-26))+'px',
              background: i===data.length-1
                ? `linear-gradient(180deg, ${color} 0%, #245e43 100%)`
                : `linear-gradient(180deg, ${color}cc 0%, ${color}66 100%)`,
              boxShadow: i===data.length-1 ? '0 8px 18px rgba(45,106,79,0.14)' : 'none'
            }}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#48524a] opacity-0 group-hover:opacity-100 transition tabular-nums whitespace-nowrap">{v.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-[#9aa79d]">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function AdminDashboard({ onTab }){
  const m = FAN.METRICAS;
  return (
    <div className="space-y-6">
      <SectionTitle overline="Panel FAN" title="Resumen general" desc="El pulso de la plataforma: visitas, suscriptores y contactos generados hacia los productores." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon="eye" label="Visitas este mes" value={m.visitasMes.toLocaleString()} delta={14} />
        <Stat icon="bell" label="Suscriptores" value={m.suscriptores.toLocaleString()} delta={7} accent="#2D6A4F" />
        <Stat icon="phone" label="Contactos generados" value={m.contactosMes} delta={21} accent="#F4A261" />
        <Stat icon="users" label="Productores activos" value={`${m.productoresActivos}/${m.productores}`} accent="#6B4226" />
      </div>
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-[15px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>Visitas mensuales</h4>
            <Badge className="bg-[#E9F1EC] text-[#1B5036]"><Icon name="trending" size={13} />+14% vs. mes anterior</Badge>
          </div>
          <BarChart data={FAN.SERIE_VISITAS} labels={FAN.MONTHS_SHORT} />
        </Card>
        <Card className="p-6">
          <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-4" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>Requiere tu atención</h4>
          <div className="space-y-2.5">
            <button onClick={()=>onTab('aprobaciones')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#FCEFE1] hover:brightness-[0.98] transition text-left">
              <span className="w-9 h-9 rounded-lg bg-[#F4A261] flex items-center justify-center text-white"><Icon name="clock" size={17} /></span>
              <div className="flex-1"><div className="text-[14px] font-semibold text-[#9A4D14]">{FAN.METRICAS.pendientes} productores pendientes</div><div className="text-[12px] text-[#9A4D14]/80">Esperan tu aprobación</div></div>
              <Icon name="chevronRight" size={18} className="text-[#9A4D14]" />
            </button>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F4F7F4]">
              <span className="w-9 h-9 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-white"><Icon name="package" size={17} /></span>
              <div className="flex-1"><div className="text-[14px] font-semibold text-[#1f2a21]">{FAN.METRICAS.productosCatalogo} productos en catálogo</div><div className="text-[12px] text-[#6b756c]">Todos publicados</div></div>
            </div>
            <button onClick={()=>onTab('alertas')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#E1F1F5] hover:brightness-[0.98] transition text-left">
              <span className="w-9 h-9 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-white"><Icon name="send" size={16} /></span>
              <div className="flex-1"><div className="text-[14px] font-semibold text-[#1B5036]">Enviar alerta de temporada</div><div className="text-[12px] text-[#1B5036]/80">A {FAN.METRICAS.suscriptores.toLocaleString()} suscriptores</div></div>
              <Icon name="chevronRight" size={18} className="text-[#0E5468]" />
            </button>
            <button onClick={()=>onTab('recetario')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#F4F7F4] hover:bg-[#EDF2ED] transition text-left">
              <span className="w-9 h-9 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-white"><Icon name="book" size={16} /></span>
              <div className="flex-1"><div className="text-[14px] font-semibold text-[#1f2a21]">Gestionar recetario</div><div className="text-[12px] text-[#6b756c]">20 recetas publicadas</div></div>
              <Icon name="chevronRight" size={18} className="text-[#9aa79d]" />
            </button>
          </div>
        </Card>
      </div>
      <Card className="p-6">
        <h4 className="text-[15px] font-semibold text-[#1f2a21] mb-1" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>Indicador de impacto</h4>
        <p className="text-[13px] text-[#8a948a] mb-4">Productos consultados y aprovechados en su temporada óptima.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[['Productos consultados','17 / 17','Todo el catálogo visto este mes','#2D6A4F'],['Contactos a productores',m.contactos,'Total acumulado','#F4A261'],['Conexión oferta-demanda','82%','Consultas que llegan a contacto','#2D6A4F']].map(([l,v,d,c])=>(
            <div key={l} className="border border-[#EEF1EC] rounded-xl p-4">
              <div className="text-[26px] font-semibold tracking-tight" style={{ fontFamily:'var(--font-display)', color:c }}>{v}</div>
              <div className="text-[13px] font-medium text-[#3a4a3f] mt-0.5">{l}</div>
              <div className="text-[12px] text-[#9aa79d] mt-0.5">{d}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[15px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>Recetario FAN</h4>
          <button onClick={()=>onTab('recetario')} className="text-[13px] text-[#2D6A4F] font-medium flex items-center gap-1 hover:opacity-75 transition">
            Ver todo <Icon name="arrowRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[['Total recetas','20','book','#2D6A4F'],['Publicadas','20','eye','#2D6A4F'],['Borradores','0','edit','#9aa79d'],['Total vistas','19.043','trending','#F4A261']].map(([l,v,ic,c])=>(
            <div key={l} className="border border-[#EEF1EC] rounded-xl p-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-3" style={{ background:c+'18', color:c }}>
                <Icon name={ic} size={14} />
              </div>
              <div className="text-[24px] font-semibold tracking-tight leading-none" style={{ fontFamily:'var(--font-display)', color:c }}>{v}</div>
              <div className="text-[12.5px] text-[#6b756c] mt-1">{l}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- Aprobaciones ---------- */
function AdminAprobaciones({ onApproveProducer }){
  const toast = useToast();
  const [productores, setProductores] = useState(FAN.PRODUCTORES.map(p=>({...p})));
  const [revisar, setRevisar] = useState(null);
  const pendientes = productores.filter(p=>p.estado==='PENDIENTE');
  const decidir = (id, estado) => {
    setProductores(ps=>ps.map(p=>p.id===id?{...p, estado}:p));
    setRevisar(null);
    if(onApproveProducer) onApproveProducer(id, estado);
    toast(estado==='APROBADO'?'Productor aprobado':'Productor rechazado', { type: estado==='APROBADO'?'success':'error', desc:'Se notificó al productor con el resultado.' });
  };
  return (
    <div className="space-y-6">
      <SectionTitle overline="Gestión de productores" title="Pendientes de aprobación" desc="Revisa el perfil y los productos antes de aprobar. El productor recibirá una notificación con el resultado." />
      {pendientes.length===0 ? (
        <Card className="p-12 text-center text-[#8a948a]"><Icon name="checkCircle" size={30} className="mx-auto mb-3 text-[#74C69D]" />No hay productores pendientes. ¡Todo al día!</Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {pendientes.map(pr=>(
            <Card key={pr.id} className="p-5">
              <div className="flex items-start gap-3.5">
                <Avatar initials={pr.iniciales} color="#F4A261" size={48} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#1f2a21] text-[16px]" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{pr.nombre}</div>
                  <div className="text-[12.5px] text-[#8a948a] flex items-center gap-1"><Icon name="mapPin" size={13} />{pr.ubicacion}</div>
                </div>
                <Badge style={{ background:'#FCEFE1', color:'#9A4D14' }}><span className="w-1.5 h-1.5 rounded-full bg-[#F4A261]"></span>Pendiente</Badge>
              </div>
              <p className="text-[13.5px] text-[#48524a] mt-3 leading-relaxed line-clamp-2">{pr.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {pr.productos.map(FAN.getProduct).filter(Boolean).map(p=> <Badge key={p.id} className="bg-[#EDF2ED] text-[#3a4a3f]">{p.nombre}</Badge>)}
              </div>
              <div className="flex gap-2.5 mt-4 pt-4 border-t border-[#F0F2EE]">
                <Button variant="secondary" size="sm" className="flex-1" onClick={()=>setRevisar(pr)}><Icon name="eye" size={15} />Revisar</Button>
                <Button variant="danger" size="sm" onClick={()=>decidir(pr.id,'RECHAZADO')}><Icon name="x" size={15} />Rechazar</Button>
                <Button size="sm" onClick={()=>decidir(pr.id,'APROBADO')}><Icon name="check" size={15} />Aprobar</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-[16px] font-semibold text-[#1f2a21] tracking-tight mb-3 mt-2" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>Todos los productores</h3>
        <Card className="divide-y divide-[#F0F2EE] overflow-hidden">
          {productores.map(pr=>{
            const e = ESTADO_PRODUCTOR[pr.estado];
            return (
              <div key={pr.id} className="flex items-center gap-3.5 p-3.5">
                <Avatar initials={pr.iniciales} color={e.dot} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#1f2a21] text-[14.5px] flex items-center gap-1.5">{pr.nombre}{pr.verificado && <Icon name="badge" size={14} className="text-[#2D6A4F]" />}</div>
                  <div className="text-[12px] text-[#8a948a] truncate">{pr.ubicacion} · {pr.productos.length} productos</div>
                </div>
                <Badge style={{ background:e.bg, color:e.color }}><span className="w-1.5 h-1.5 rounded-full" style={{ background:e.dot }}></span>{e.label}</Badge>
                {pr.estado==='APROBADO' && <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={()=>{ setProductores(ps=>ps.map(x=>x.id===pr.id?{...x,estado:'SUSPENDIDO'}:x)); if(onApproveProducer) onApproveProducer(pr.id,'SUSPENDIDO'); toast('Productor suspendido'); }}>Suspender</Button>}
                {pr.estado==='SUSPENDIDO' && <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={()=>{ setProductores(ps=>ps.map(x=>x.id===pr.id?{...x,estado:'APROBADO'}:x)); if(onApproveProducer) onApproveProducer(pr.id,'APROBADO'); toast('Productor reactivado'); }}>Reactivar</Button>}
              </div>
            );
          })}
        </Card>
      </div>

      {revisar && (
        <Modal open onClose={()=>setRevisar(null)} size="md">
          <div className="p-6">
            <div className="flex items-center gap-3.5 mb-4">
              <Avatar initials={revisar.iniciales} color="#F4A261" size={52} />
              <div><div className="text-[19px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{revisar.nombre}</div><div className="text-[13px] text-[#8a948a]">{revisar.tipo} · {revisar.ubicacion}</div></div>
            </div>
            <p className="text-[14px] text-[#48524a] leading-relaxed">{revisar.desc}</p>
            <div className="mt-4 space-y-2">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d]">Contacto</div>
              <div className="flex flex-wrap gap-3 text-[13px] text-[#48524a]">
                <span className="flex items-center gap-1.5"><Icon name="phone" size={14} className="text-[#2D6A4F]" />{revisar.contacto.tel}</span>
                <span className="flex items-center gap-1.5"><Icon name="mail" size={14} className="text-[#2D6A4F]" />{revisar.contacto.correo}</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-[#9aa79d] mb-2">Productos a publicar</div>
              <div className="space-y-2">
                {revisar.productos.map(FAN.getProduct).filter(Boolean).map(p=>(
                  <div key={p.id} className="flex items-center gap-3 border border-[#E8EBE6] rounded-lg p-2.5">
                    <ProductGlyph product={p} size={38} rounded="rounded-lg" />
                    <div className="flex-1 min-w-0"><div className="text-[13.5px] font-semibold text-[#1f2a21]">{p.nombre}</div><div className="text-[12px] text-[#8a948a] line-clamp-1">{p.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="danger" className="flex-1" onClick={()=>decidir(revisar.id,'RECHAZADO')}><Icon name="x" size={16} />Rechazar</Button>
              <Button className="flex-1" onClick={()=>decidir(revisar.id,'APROBADO')}><Icon name="check" size={16} />Aprobar productor</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

window.AdminCore = { AdminDashboard, AdminAprobaciones, BarChart };
Object.assign(window, { AdminDashboard, AdminAprobaciones, BarChart });
