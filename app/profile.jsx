/* ============================================================
   PLATAFORMA FAN — Perfiles de usuario (editables y responsive)
   ============================================================ */

function initialsFrom(name){
  const parts = (name||'').trim().split(/\s+/).filter(Boolean);
  if(!parts.length) return '?';
  return (parts[0][0] + (parts[1]?parts[1][0]:'')).toUpperCase();
}

/* Campo de formulario reutilizable */
function Field({ label, children, full }){
  return (
    <div className={full?'sm:col-span-2':''}>
      <label className="text-[13px] font-semibold text-[#2a352c] mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

/* Selector de opciones tipo chips */
function ChipSelect({ value, onChange, options }){
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o=>(
        <button key={o} type="button" onClick={()=>onChange(o)}
          className={cn('h-9 px-3.5 rounded-lg text-[13px] font-medium border transition', value===o?'bg-[#2D6A4F] text-white border-[#2D6A4F]':'bg-white text-[#5e6b60] border-[#E2E7DE] hover:border-[#bcc9bf]')}>{o}</button>
      ))}
    </div>
  );
}

/* Pastilla de metadato para la cabecera */
function Pill({ icon, children }){
  return <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-[12px] font-medium rounded-full px-2.5 py-1 backdrop-blur">{icon&&<Icon name={icon} size={12} />}{children}</span>;
}

/* Métrica compacta para los perfiles */
function MiniStat({ icon, label, value, accent='#2D6A4F' }){
  return (
    <div className="bg-white rounded-2xl border border-[#E8EBE6] p-3.5 sm:p-4 shadow-[0_1px_2px_rgba(45,60,45,0.04)]">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background:accent+'18', color:accent }}><Icon name={icon} size={15} /></span>
      </div>
      <div className="text-[22px] sm:text-[26px] font-semibold text-[#1f2a21] leading-none tracking-tight" style={{ fontFamily:'var(--font-display)' }}>{value}</div>
      <div className="text-[12px] sm:text-[12.5px] text-[#8a948a] mt-1.5 leading-tight">{label}</div>
    </div>
  );
}

/* Cabecera de perfil — se apila en celular, fila en laptop */
function ProfileHeader({ initials, color, nombre, sub, badge, meta }){
  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#dde7df] bg-gradient-to-br from-[#2D6A4F] to-[#1c4d39] text-white">
      <div className="absolute -right-14 -top-16 w-60 h-60 rounded-full bg-white/[0.06]"></div>
      <div className="absolute right-16 -bottom-12 w-44 h-44 rounded-full bg-[#74C69D]/10"></div>
      <div className="relative px-5 sm:px-8 py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <div className="shrink-0"><Avatar initials={initials} color={color||'#74C69D'} size={64} /></div>
        <div className="min-w-0 flex-1">
          {badge}
          <h1 className="text-[23px] sm:text-[28px] font-semibold tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.12 }}>{nombre}</h1>
          <div className="text-[13.5px] sm:text-[14.5px] text-white/80 mt-1">{sub}</div>
          {meta && <div className="flex flex-wrap gap-2 mt-3.5">{meta}</div>}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VISITANTE — perfil editable + invitación a suscribirse
   ============================================================ */
function ProfileVisitante({ onNav }){
  const toast = useToast();
  const [data, setData] = useState(()=>{
    try { return JSON.parse(localStorage.getItem('fan_visitante')||'') || {}; } catch(e){ return {}; }
  });
  const d = { nombre:'', tipo:'Chef', ciudad:'', correo:'', ...data };
  const set = (k,v)=> setData(s=>({ ...d, ...s, [k]:v }));
  const save = ()=>{ localStorage.setItem('fan_visitante', JSON.stringify(d)); toast('Datos guardados', { desc:'Tu información quedó guardada en este dispositivo.' }); };
  const ini = d.nombre ? initialsFrom(d.nombre) : '?';

  return (
    <div id="perfil" className="space-y-6">
      <ProfileHeader initials={ini} color={d.nombre?'#2D6A4F':'#9CA3AF'} nombre={d.nombre||'Mi perfil'}
        sub={d.nombre?`${d.tipo}${d.ciudad?' · '+d.ciudad:''}`:'Visitante · sin registro'}
        badge={<Badge className="bg-white/15 text-white mb-2"><Icon name="user" size={13} />Visitante</Badge>}
        meta={<>
          <Pill icon="eye">Navegación libre</Pill>
          {d.ciudad && <Pill icon="mapPin">{d.ciudad}</Pill>}
          <Pill icon="bell">Sin alertas — suscríbete</Pill>
        </>} />

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* FORMULARIO EDITABLE */}
        <Card className="p-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h3 className="text-[17px] font-semibold text-[#1f2a21] whitespace-nowrap shrink-0" style={{ fontFamily:'var(--font-display)' }}>Mis datos</h3>
            <span className="text-[12px] text-[#9aa79d] flex items-center gap-1 text-right"><Icon name="info" size={13} className="shrink-0" />Se guarda en tu dispositivo</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
            <Field label="Nombre"><Input value={d.nombre} onChange={e=>set('nombre',e.target.value)} placeholder="Tu nombre" /></Field>
            <Field label="Ciudad"><Input icon="mapPin" value={d.ciudad} onChange={e=>set('ciudad',e.target.value)} placeholder="Santa Cruz, Bolivia" /></Field>
            <Field label="Tipo de usuario" full><ChipSelect value={d.tipo} onChange={v=>set('tipo',v)} options={['Chef','Restaurante','Emprendimiento','Escuela / academia','Curioso']} /></Field>
            <Field label="Correo (opcional)" full><Input icon="mail" value={d.correo} onChange={e=>set('correo',e.target.value)} placeholder="tucorreo@ejemplo.com" /></Field>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-[#F0F2EE]">
            <Button variant="secondary" onClick={()=>setData({})}>Limpiar</Button>
            <Button onClick={save}><Icon name="check" size={16} />Guardar datos</Button>
          </div>
        </Card>

        {/* INVITACIÓN A SUSCRIBIRSE */}
        <Card className="p-6 bg-gradient-to-br from-[#E9F1EC] to-[#EAF4EE] border-[#cfe3d6]">
          <span className="inline-flex w-11 h-11 rounded-xl bg-[#2D6A4F] items-center justify-center text-white mb-3"><Icon name="bell" size={20} /></span>
          <h3 className="text-[17px] font-semibold text-[#1B5036]" style={{ fontFamily:'var(--font-display)' }}>Suscríbete para recibir alertas</h3>
          <p className="text-[13.5px] text-[#4f6356] leading-relaxed mt-1.5">Las alertas de temporada son para suscriptores. Al suscribirte desbloqueas:</p>
          <div className="space-y-2 mt-4">
            {[['bell','Alertas cuando tus productos entran en temporada'],['sparkles','Recomendaciones “Para ti”'],['heart','Seguimiento de productos favoritos'],['users','Contacto directo con productores']].map(([ic,t])=>(
              <div key={t} className="flex items-center gap-2.5 text-[13px] text-[#3a4a3f]"><Icon name={ic} size={16} className="text-[#2D6A4F] shrink-0" />{t}</div>
            ))}
          </div>
          <Button className="w-full mt-5" onClick={()=>onNav('suscripcion')}><Icon name="bell" size={16} />Suscribirme gratis</Button>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   SUSCRIPTOR — perfil editable + beneficios + seguimiento
   ============================================================ */
function ProfileSuscriptor({ onNav, onOpen }){
  const toast = useToast();
  const me = FAN.ME_SUSCRIPTOR;
  const [d, setD] = useState({ nombre:me.nombre, empresa:me.empresa, rol:me.rol, canal:me.canal, valor:me.valor });
  const set = (k,v)=> setD(s=>({ ...s, [k]:v }));
  const items = me.intereses.map(FAN.getProduct).filter(Boolean);

  return (
    <div id="perfil" className="space-y-6">
      <ProfileHeader initials={initialsFrom(d.nombre)} color="#2D6A4F" nombre={d.nombre} sub={`${d.rol} · ${d.empresa}`}
        badge={<Badge className="bg-white/15 text-white mb-2"><Icon name="badge" size={13} />Suscriptor desde {me.desde}</Badge>}
        meta={<>
          <Pill icon={d.canal==='WhatsApp'?'whatsapp':'mail'}>{d.valor}</Pill>
          <Pill icon="heart">{me.intereses.length} en seguimiento</Pill>
        </>} />

      {/* métricas */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <MiniStat icon="heart" label="En seguimiento" value={me.intereses.length} />
        <MiniStat icon="bell" label="Alertas recibidas" value={me.alertasRecibidas} accent="#2D6A4F" />
        <MiniStat icon="phone" label="Contactados" value={me.contactosHechos} accent="#F4A261" />
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* COLUMNA PRINCIPAL */}
        <div className="space-y-6">
          {/* datos editables */}
          <Card className="p-6">
            <h3 className="text-[17px] font-semibold text-[#1f2a21] mb-5" style={{ fontFamily:'var(--font-display)' }}>Mis datos</h3>
            <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
              <Field label="Nombre"><Input value={d.nombre} onChange={e=>set('nombre',e.target.value)} /></Field>
              <Field label="Empresa / negocio"><Input icon="package" value={d.empresa} onChange={e=>set('empresa',e.target.value)} /></Field>
              <Field label="Rol" full><ChipSelect value={d.rol} onChange={v=>set('rol',v)} options={['Chef / Restaurante','Emprendimiento','Escuela / academia','Comprador','Otro']} /></Field>
              <Field label="Canal de alertas"><ChipSelect value={d.canal} onChange={v=>set('canal',v)} options={['WhatsApp','Correo']} /></Field>
              <Field label={d.canal==='WhatsApp'?'Número de WhatsApp':'Correo electrónico'}><Input icon={d.canal==='WhatsApp'?'phone':'mail'} value={d.valor} onChange={e=>set('valor',e.target.value)} /></Field>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-[#F0F2EE]">
              <Button variant="secondary">Cancelar</Button>
              <Button onClick={()=>toast('Perfil actualizado')}><Icon name="check" size={16} />Guardar cambios</Button>
            </div>
          </Card>

          {/* productos en seguimiento */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)' }}>Productos en seguimiento</h3>
              <Button variant="ghost" size="sm" onClick={()=>onNav('mi-suscripcion')}>Editar<Icon name="chevronRight" size={15} /></Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {items.map(p=>{
                const est = FAN.estadoTemporada(p);
                return (
                  <button key={p.id} onClick={()=>onOpen(p)} className="border border-[#E8EBE6] rounded-xl p-3 hover:border-[#cfdbd1] hover:bg-[#F7FAF7] transition text-left">
                    <ProductGlyph product={p} size={40} rounded="rounded-lg" />
                    <div className="text-[13px] font-semibold text-[#1f2a21] mt-2 truncate">{p.nombre}</div>
                    <div className="mt-1.5"><StatusBadge estado={est} size="sm" /></div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* BENEFICIOS */}
        <Card className="p-6 h-fit">
          <h3 className="text-[16px] font-semibold text-[#1f2a21] mb-4 flex items-center gap-2" style={{ fontFamily:'var(--font-display)' }}><Icon name="badge" size={18} className="text-[#2D6A4F]" />Tus beneficios</h3>
          <div className="space-y-2.5">
            {[['bell','Alertas personalizadas','WhatsApp cuando tus productos cambian de temporada'],['sparkles','Recomendaciones “Para ti”','El inicio prioriza lo que te interesa'],['users','Contacto directo','Llega al productor sin intermediarios'],['calendar','Acceso anticipado','Te avisamos primero de nuevos productores']].map(([ic,t,desc])=>(
              <div key={t} className="flex items-start gap-3 p-3 rounded-xl bg-[#F7FAF7] border border-[#EEF1EC]">
                <span className="w-8 h-8 rounded-lg bg-[#E9F1EC] flex items-center justify-center text-[#2D6A4F] shrink-0"><Icon name={ic} size={16} /></span>
                <div><div className="text-[13.5px] font-semibold text-[#1f2a21]">{t}</div><div className="text-[12px] text-[#8a948a] leading-snug mt-0.5">{desc}</div></div>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="w-full mt-4" onClick={()=>onNav('mi-suscripcion')}><Icon name="settings" size={15} />Gestionar suscripción</Button>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN — perfil editable (responsive)
   ============================================================ */
function ProfileAdmin(){
  const toast = useToast();
  const me = FAN.ME_ADMIN;
  const [d, setD] = useState({ nombre:me.nombre, cargo:me.cargo, area:me.area, correo:me.correo });
  const set = (k,v)=> setD(s=>({ ...s, [k]:v }));
  return (
    <div className="space-y-6">
      <ProfileHeader initials={initialsFrom(d.nombre)} nombre={d.nombre} sub={`${d.cargo} · ${d.area}`}
        badge={<Badge className="bg-white/15 text-white mb-2"><Icon name="shield" size={13} />Equipo FAN · miembro desde {me.desde}</Badge>}
        meta={<>
          <Pill icon="mail">{d.correo}</Pill>
          <Pill icon="shield">Acceso total</Pill>
        </>} />
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <Card className="p-6">
          <h3 className="text-[17px] font-semibold text-[#1f2a21] mb-5" style={{ fontFamily:'var(--font-display)' }}>Datos del administrador</h3>
          <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
            <Field label="Nombre"><Input value={d.nombre} onChange={e=>set('nombre',e.target.value)} /></Field>
            <Field label="Cargo"><Input value={d.cargo} onChange={e=>set('cargo',e.target.value)} /></Field>
            <Field label="Área" full><Input value={d.area} onChange={e=>set('area',e.target.value)} /></Field>
            <Field label="Correo" full><Input icon="mail" value={d.correo} onChange={e=>set('correo',e.target.value)} /></Field>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-[#F0F2EE]"><Button variant="secondary">Cancelar</Button><Button onClick={()=>toast('Perfil actualizado')}><Icon name="check" size={16} />Guardar</Button></div>
        </Card>
        <Card className="p-6 h-fit">
          <h3 className="text-[16px] font-semibold text-[#1f2a21] mb-3" style={{ fontFamily:'var(--font-display)' }}>Permisos</h3>
          <div className="flex items-center justify-between bg-[#F4F7F4] rounded-xl p-3.5 mb-3">
            <div className="text-[13px] text-[#48524a] flex items-center gap-2"><Icon name="shield" size={16} className="text-[#2D6A4F]" />Nivel de acceso</div>
            <Badge className="bg-[#E3F1EA] text-[#1B5036]">Total</Badge>
          </div>
          <div className="space-y-2">
            {['Aprobar productores','Gestionar catálogo','Editar temporadas','Enviar alertas'].map(t=>(
              <div key={t} className="flex items-center gap-2.5 text-[13px] text-[#48524a]"><Icon name="checkCircle" size={16} className="text-[#2D6A4F] shrink-0" />{t}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

window.ProfileScreens = { ProfileVisitante, ProfileSuscriptor, ProfileAdmin };
Object.assign(window, { ProfileVisitante, ProfileSuscriptor, ProfileAdmin, ProfileHeader, Pill, MiniStat, initialsFrom, Field, ChipSelect });
