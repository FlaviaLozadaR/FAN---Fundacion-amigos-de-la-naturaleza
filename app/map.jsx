/* ============================================================
   PLATAFORMA FAN — Mapa de procedencia con Leaflet real
   ============================================================ */

function MapaReal({ lugares, hover, onHover, onOpenProductor }){
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef({});

  // Inicializar mapa una sola vez
  useEffect(()=>{
    if(!containerRef.current || mapRef.current || typeof L === 'undefined') return;

    const map = L.map(containerRef.current, {
      center: [-15.5, -63.5],
      zoom: 6,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;
    return ()=>{ map.remove(); mapRef.current = null; };
  }, []);

  // Actualizar marcadores al filtrar región
  useEffect(()=>{
    const map = mapRef.current;
    if(!map) return;

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    const validos = lugares.filter(l => l.lat && l.lng);

    validos.forEach(l => {
      const color = FAN.ORIGENES[l.region].color;

      // Productores aprobados en este punto
      const prods = FAN.PRODUCTORES.filter(p =>
        p.estado === 'APROBADO' &&
        p.ubicacion.toLowerCase().includes(l.nombre.split(',')[0].toLowerCase())
      );
      const tieneProductor = prods.length > 0;

      // Marcador grande + anillo para puntos con productor activo
      const size  = tieneProductor ? 20 : 12;
      const ring  = tieneProductor
        ? `<div style="position:absolute;inset:-5px;border-radius:50%;border:2px solid ${color};opacity:0.35;pointer-events:none"></div>` : '';
      const icon = L.divIcon({
        className: '',
        html: `<div style="position:relative;width:${size}px;height:${size}px">
          ${ring}
          <div style="
            width:${size}px;height:${size}px;border-radius:50%;
            background:${color};border:${tieneProductor?3:2}px solid white;
            box-shadow:0 2px ${tieneProductor?10:5}px rgba(0,0,0,${tieneProductor?0.28:0.18});
            cursor:${tieneProductor?'pointer':'default'};
          "></div>
        </div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -size/2 - 6],
      });

      // Contenido del popup
      const popupHtml = tieneProductor
        ? `<div style="font-family:'Hanken Grotesk',system-ui,sans-serif;min-width:180px">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${color};margin-bottom:6px">${FAN.ORIGENES[l.region].nombre}</div>
            <div style="font-weight:700;font-size:13px;color:#1f2a21;margin-bottom:8px">${l.nombre}</div>
            ${prods.map(p=>`
              <div class="fan-producer-link" data-id="${p.id}" style="
                display:flex;align-items:center;gap:9px;
                padding:7px 9px;margin:-2px -4px 4px;border-radius:10px;
                background:#F7FAF7;border:1px solid #E2EBE3;
                cursor:pointer;transition:background .15s
              ">
                <div style="width:30px;height:30px;border-radius:50%;background:${color};
                  display:flex;align-items:center;justify-content:center;
                  font-size:10px;font-weight:700;color:white;flex-shrink:0">
                  ${p.iniciales}
                </div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:12.5px;font-weight:700;color:#1f2a21;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.nombre}</div>
                  <div style="font-size:11px;color:#8a948a">${p.productos.length} producto${p.productos.length!==1?'s':''}</div>
                </div>
                <div style="font-size:16px;color:${color};font-weight:700;line-height:1">›</div>
              </div>`).join('')}
            <div style="font-size:10.5px;color:#9aa79d;margin-top:3px;text-align:center">
              Toca para ver el perfil completo
            </div>
          </div>`
        : `<div style="font-family:'Hanken Grotesk',system-ui,sans-serif">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${color};margin-bottom:4px">${FAN.ORIGENES[l.region].nombre}</div>
            <div style="font-weight:700;font-size:13px;color:#1f2a21;margin-bottom:5px">${l.nombre}</div>
            <div style="font-size:11px;color:#9aa79d;font-style:italic">Sin productores activos</div>
          </div>`;

      const marker = L.marker([l.lat, l.lng], { icon })
        .bindPopup(popupHtml, { className:'fan-popup', closeButton:false, minWidth:tieneProductor?190:150, autoPan:false })
        .on('mouseover', ()=>{ onHover(l.id); marker.openPopup(); })
        .on('mouseout',  ()=>{ onHover(null); })
        .on('click', ()=>{
          // Un solo productor → abrir modal directamente
          if(prods.length === 1){
            map.closePopup();
            onOpenProductor(prods[0]);
          } else {
            marker.openPopup();
          }
        })
        // Cuando el popup abre, cablear clics en las tarjetas de productor
        .on('popupopen', (e)=>{
          const el = e.popup.getElement();
          if(!el) return;
          el.querySelectorAll('.fan-producer-link').forEach(row => {
            const id = row.getAttribute('data-id');
            const prod = prods.find(p => p.id === id);
            if(!prod) return;
            row.addEventListener('mouseenter', ()=>{ row.style.background='#E3F1EA'; });
            row.addEventListener('mouseleave', ()=>{ row.style.background='#F7FAF7'; });
            row.addEventListener('click', ()=>{ map.closePopup(); onOpenProductor(prod); });
          });
        })
        .addTo(map);

      markersRef.current[l.id] = marker;
    });

    if(validos.length > 0){
      const bounds = L.latLngBounds(validos.map(l => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding:[50, 50], maxZoom:8, animate:true });
    }
  }, [lugares]);

  // Sincronizar hover lista → popup
  useEffect(()=>{
    const map = mapRef.current;
    if(!map) return;
    if(hover && markersRef.current[hover]){
      markersRef.current[hover].openPopup();
    } else {
      map.closePopup();
    }
  }, [hover]);

  return (
    <div className="fan-map-wrap rounded-2xl overflow-hidden border border-[#E8EBE6] shadow-[0_1px_4px_rgba(45,60,45,0.07)]"
      style={{ height:440 }}>
      <div ref={containerRef} style={{ height:'100%', width:'100%' }} />
    </div>
  );
}

/* ---------- Pantalla Mapa ---------- */
function ScreenMapa({ onOpen, onOpenProductor }){
  const [region, setRegion] = useState('todas');
  const [hover, setHover]   = useState(null);

  const productores     = FAN.PRODUCTORES.filter(p => p.estado === 'APROBADO' && (region === 'todas' || p.region === region));
  // Solo mostrar en el mapa los puntos que tienen al menos un productor aprobado
  const lugares         = FAN.LUGARES.filter(l => {
    if(region !== 'todas' && l.region !== region) return false;
    return FAN.PRODUCTORES.some(p =>
      p.estado === 'APROBADO' &&
      p.ubicacion.toLowerCase().includes(l.nombre.split(',')[0].toLowerCase())
    );
  });
  const productosRegion = FAN.PRODUCTS.filter(p => region === 'todas' || p.origen === region);

  return (
    <div id="mapa" className="space-y-6">
      <SectionTitle overline="Procedencia" title="De dónde viene cada producto"
        desc="El bosque chiquitano y la amazonía norte de Bolivia. Explora los puntos de origen y los productores de cada territorio." />

      {/* Filtro de región */}
      <div className="flex gap-2 flex-wrap">
        {[['todas','Todo el territorio','#3a4a3f'],['chiquitania','Bosque Chiquitano','#2D6A4F'],['amazonia','Amazonía Norte','#1B5E5A']].map(([v,l,c])=>(
          <button key={v} onClick={()=>setRegion(v)}
            className={cn('h-9 px-4 rounded-lg text-[13px] font-medium border transition flex items-center gap-2',
              region===v ? 'text-white border-transparent' : 'bg-white text-[#5e6b60] border-[#E2E7DE] hover:border-[#bcc9bf]')}
            style={region===v ? { background:c } : {}}>
            {v!=='todas' && <span className="w-2 h-2 rounded-full" style={{ background:region===v?'#fff':c }}></span>}
            {l}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">

        {/* MAPA */}
        <div className="space-y-2.5">
          <MapaReal lugares={lugares} hover={hover} onHover={setHover} onOpenProductor={onOpenProductor} />
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-5 text-[12px] text-[#6b756c]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{background:'#2D6A4F'}}></span>Bosque Chiquitano
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{background:'#1B5E5A'}}></span>Amazonía Norte
              </span>
            </div>
            <span className="text-[11.5px] text-[#b0b8b0] flex items-center gap-1">
              <Icon name="mapPin" size={12} />Toca un punto para ver el productor
            </span>
          </div>
        </div>

        {/* LISTA lateral */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[['Puntos',lugares.length],['Productores',productores.length],['Productos',productosRegion.length]].map(([l,v])=>(
              <Card key={l} className="p-3.5 text-center">
                <div className="text-[24px] font-semibold text-[#1f2a21]" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{v}</div>
                <div className="text-[12px] text-[#9aa79d]">{l}</div>
              </Card>
            ))}
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#F0F2EE] text-[13px] font-semibold uppercase tracking-wide text-[#9aa79d]">
              Productores en el territorio
            </div>
            <div className="divide-y divide-[#F0F2EE] max-h-[330px] overflow-y-auto">
              {productores.map(pr => {
                const lugar = FAN.LUGARES.find(l => pr.ubicacion.toLowerCase().includes(l.nombre.split(',')[0].toLowerCase()));
                const isHovered = hover === lugar?.id;
                return (
                  <button key={pr.id} onClick={()=>onOpenProductor(pr)}
                    className={cn('w-full flex items-center gap-3 p-3.5 transition text-left',
                      isHovered ? 'bg-[#EDF2ED]' : 'hover:bg-[#F7FAF7]')}
                    onMouseEnter={()=>setHover(lugar?.id||null)}
                    onMouseLeave={()=>setHover(null)}>
                    <Avatar initials={pr.iniciales} color={FAN.ORIGENES[pr.region].color} size={40} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-[#1f2a21] flex items-center gap-1.5">
                        {pr.nombre}
                        {pr.verificado && <Icon name="badge" size={14} className="text-[#2D6A4F]" />}
                      </div>
                      <div className="text-[12px] text-[#8a948a] truncate flex items-center gap-1">
                        <Icon name="mapPin" size={12} />{pr.ubicacion}
                      </div>
                    </div>
                    <span className="text-[12px] text-[#6b756c] tabular-nums shrink-0">{pr.productos.length} prod.</span>
                    <Icon name="chevronRight" size={16} className="text-[#c2cbc3]" />
                  </button>
                );
              })}
              {productores.length === 0 && (
                <div className="p-6 text-center text-[13px] text-[#9aa79d]">
                  No hay productores activos en este territorio.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Productos de la región */}
      <div>
        <h3 className="text-[17px] font-semibold text-[#1f2a21] tracking-tight mb-4"
          style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>
          Productos de {region==='todas' ? 'todo el territorio' : FAN.ORIGENES[region].nombre}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productosRegion.map(p => <ProductCard key={p.id} product={p} onOpen={onOpen} />)}
        </div>
      </div>
    </div>
  );
}

window.MapScreen = { ScreenMapa };
Object.assign(window, { ScreenMapa });
