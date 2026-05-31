/* ============================================================
   PLATAFORMA FAN — Sistema de diseño compartido
   Iconos (estilo Lucide) + primitivos tipo shadcn/ui
   ============================================================ */
const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

/* ---------- Iconos (stroke, 24x24, currentColor) ---------- */
const ICON_PATHS = {
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
  sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8Z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2Z"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  users: '<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  list: '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
  mapPin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  phone: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.06 6.04z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  whatsapp: '<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>',
  filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  logout: '<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  book: '<path d="M3 4h8v16H3z"/><path d="M13 4h8v16h-8z"/>',
  edit: '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
  eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  trending: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  badge: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  loader: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
  wand: '<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  chefHat: '<path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1z"/><path d="M6 21h12"/>',
  bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>'
};

function Icon({ name, size = 20, stroke = 2, className = '', style = {} }){
  const path = ICON_PATHS[name] || '';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={{ flexShrink: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: path }} />
  );
}

/* ---------- cn helper ---------- */
function cn(...a){ return a.filter(Boolean).join(' '); }

/* ---------- Button ---------- */
function Button({ variant='default', size='md', className='', children, ...props }){
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-700/40 disabled:opacity-50 disabled:pointer-events-none active:scale-[.98] whitespace-nowrap';
  const variants = {
    default: 'bg-[#2D6A4F] text-white hover:bg-[#235741] shadow-sm',
    secondary: 'bg-white text-[#1B5036] border border-[#D9E0DA] hover:bg-[#F4F7F4] hover:border-[#bcc9bf]',
    ghost: 'text-[#3a4a3f] hover:bg-[#EDF2ED]',
    outline: 'border border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#E9F1EC]',
    danger: 'bg-white text-[#B23A48] border border-[#e9c4c9] hover:bg-[#FCEEF0]',
    subtle: 'bg-[#EDF2ED] text-[#2D6A4F] hover:bg-[#e0e9e2]'
  };
  const sizes = { sm:'text-[13px] h-8 px-3', md:'text-sm h-10 px-4', lg:'text-[15px] h-12 px-6', icon:'h-10 w-10' };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>;
}

/* ---------- Card ---------- */
function Card({ className='', children, ...props }){
  return <div className={cn('bg-white rounded-2xl border border-[#E8EBE6] shadow-[0_1px_2px_rgba(45,60,45,0.04)]', className)} {...props}>{children}</div>;
}

/* ---------- Badge ---------- */
function Badge({ className='', children, style={}, ...props }){
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full text-xs font-medium px-2.5 py-1 leading-none', className)} style={style} {...props}>{children}</span>;
}

/* ---------- Estado de temporada (semáforo) ---------- */
function StatusBadge({ estado, size='md' }){
  const e = FAN.ESTADOS[estado];
  if(!e) return null;
  const pad = size==='sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full font-semibold leading-none', pad)}
      style={{ background:e.bg, color:e.text }}>
      <span className="rounded-full" style={{ width: size==='sm'?6:7, height:size==='sm'?6:7, background:e.dot }}></span>
      {e.label}
    </span>
  );
}

/* ---------- Input ---------- */
function Input({ className='', icon, ...props }){
  const el = <input className={cn('w-full h-10 rounded-lg border border-[#D9E0DA] bg-white px-3 text-sm text-[#2a352c] placeholder:text-[#9aa79d] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 transition', icon&&'pl-9', className)} {...props} />;
  if(!icon) return el;
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa79d] pointer-events-none"><Icon name={icon} size={16} /></span>
      {el}
    </div>
  );
}

/* ---------- Avatar / producto placeholder ---------- */
function ProductGlyph({ product, size=48, rounded='rounded-xl', full=false }){
  // Try to show an image from public/ if available (mapping by product.id), otherwise show monogram placeholder.
  const IMG_MAP = {
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

  const key = product.id || product.nombre && product.nombre.toLowerCase().replace(/\s+/g,'-').normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[^a-z0-9-]/g,'');
  const fileName = IMG_MAP[key];
  if(fileName){
    const src = '/' + encodeURIComponent(fileName);
    if(full){
      return (
        <img src={src} alt={product.nombre}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 transform will-change-transform group-hover:scale-105"
          style={{ filter: 'brightness(1.06) contrast(1.04) saturate(1.08)', willChange: 'transform, filter' }} />
      );
    }
    return (
      <img src={src} alt={product.nombre} className={cn('object-cover', rounded)} style={{ width:size, height:size }} />
    );
  }

  // Fallback: monogram
  const initials = product.nombre.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  return (
    <div className={cn('flex items-center justify-center font-semibold text-white shrink-0 select-none', rounded)}
      style={{ width:size, height:size, background:`linear-gradient(140deg, ${product.color}, ${shade(product.color,-18)})`, fontSize:size*0.34, letterSpacing:'-0.02em' }}>
      {initials}
    </div>
  );
}

function Avatar({ initials, color='#2D6A4F', size=44 }){
  return (
    <div className="flex items-center justify-center font-semibold text-white rounded-full shrink-0"
      style={{ width:size, height:size, background:`linear-gradient(140deg, ${color}, ${shade(color,-18)})`, fontSize:size*0.36 }}>
      {initials}
    </div>
  );
}

/* color shade util */
function shade(hex, percent){
  const n = parseInt(hex.slice(1),16);
  let r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  const t = percent<0?0:255, p=Math.abs(percent)/100;
  r=Math.round((t-r)*p)+r; g=Math.round((t-g)*p)+g; b=Math.round((t-b)*p)+b;
  return '#'+(0x1000000+(r<<16)+(g<<8)+b).toString(16).slice(1);
}

/* ---------- Tira de 12 meses ---------- */
function SeasonStrip({ product, current=FAN.CURRENT_MONTH, compact=false }){
  return (
    <div className="flex gap-[3px]" role="img" aria-label="Calendario de temporada">
      {FAN.MONTHS_SHORT.map((m, i)=>{
        const inSeason = product.m.includes(i);
        const est = FAN.estadoTemporada(product, i);
        const isCur = i===current;
        const c = inSeason ? FAN.ESTADOS[est==='fuera'?'temporada':est].dot : '#E6E9E4';
        return (
          <div key={i} className="flex flex-col items-center gap-1" style={{ flex:1 }}>
            <div className="w-full rounded-full transition" style={{ height: compact?6:8, background:c, outline:isCur?'2px solid #2D6A4F':'none', outlineOffset:1 }}></div>
            {!compact && <span className={cn('text-[9px] font-medium', isCur?'text-[#2D6A4F]':'text-[#aab1a6]')}>{m[0]}</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Modal / Sheet ---------- */
function Modal({ open, onClose, children, className='', size='md', skipSidebar=false, fullWidth=false }){
  useEffect(()=>{
    if(!open) return;
    const onKey = e => { if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if(!open) return null;
  const widths = { sm:'max-w-md', md:'max-w-xl', lg:'max-w-3xl', xl:'max-w-5xl' };
  // calculate left offset to keep sidebar visible on large screens
  let leftOffset = 0;
  try{ if(skipSidebar && typeof window !== 'undefined' && window.innerWidth >= 1024) leftOffset = 270; }catch(e){}
  const backdropStyle = leftOffset ? { position:'absolute', left: leftOffset, right:0, top:0, bottom:0 } : { position:'absolute', inset:0 };
  // Bug fix: solo aplicar paddingLeft al contenedor para modales NO fullWidth.
  // Los fullWidth usan marginLeft en innerStyle para evitar el doble offset.
  const containerStyle = (leftOffset && !fullWidth) ? { paddingLeft: leftOffset } : {};
  const innerStyle = fullWidth
    ? (leftOffset ? { marginLeft: leftOffset, width: `calc(100% - ${leftOffset}px)` } : { width:'100%' })
    : undefined;

  // If a modal is marked with a special class (e.g. recipe-modal) and we're on small screens,
  // force it to occupy the full viewport height and align to the very top so nothing shows above it.
  let finalInnerStyle = innerStyle;
  try{
    if(typeof window !== 'undefined' && className && className.includes('recipe-modal') && window.innerWidth <= 640){
      // ensure outer container has no padding and is pinned
      containerStyle = Object.assign({}, containerStyle || {}, { padding:0, top:0 });
      finalInnerStyle = Object.assign({}, finalInnerStyle || {}, { top:0, height: '100vh', margin:0, borderRadius:0 });
      // also remove any rounded class from innerClass by appending a small utility
      innerClass = innerClass + ' rounded-none';
    }
  }catch(e){}

  const innerClass = cn('relative bg-white w-full shadow-2xl overflow-y-auto no-scrollbar animate-[sheetUp_.22s_cubic-bezier(.2,.8,.2,1)]',
    fullWidth ? 'max-w-none h-screen' : 'max-h-[92vh] ' + widths[size],
    fullWidth ? 'rounded-none' : 'rounded-t-2xl sm:rounded-2xl',
    className);

  return (
    <div className={fullWidth ? 'fixed inset-0 flex items-start justify-start' : 'fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4'} style={{ ...containerStyle, zIndex: fullWidth ? 9999 : 60 }}>
      <div className="bg-[#1a241c]/45 backdrop-blur-[2px] animate-[fadeIn_.18s_ease]" style={backdropStyle} onClick={onClose}></div>
      <div className={innerClass} style={finalInnerStyle}>
        {children}
      </div>
    </div>
  );
}

/* ---------- Tabs simple ---------- */
function SegTabs({ tabs, value, onChange, className='' }){
  return (
    <div className={cn('inline-flex p-1 bg-[#EDF2ED] rounded-xl', className)}>
      {tabs.map(t=>(
        <button key={t.value} onClick={()=>onChange(t.value)}
          className={cn('px-3.5 h-9 rounded-lg text-sm font-medium transition flex items-center gap-1.5 whitespace-nowrap',
            value===t.value ? 'bg-white text-[#1B5036] shadow-sm' : 'text-[#5e6b60] hover:text-[#2D6A4F]')}>
          {t.icon && <Icon name={t.icon} size={15} />}{t.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Toast (Sonner-like) ---------- */
const ToastCtx = createContext(()=>{});
function ToastProvider({ children }){
  const [toasts, setToasts] = useState([]);
  const push = (msg, opts={}) => {
    const id = Math.random();
    setToasts(t=>[...t, { id, msg, ...opts }]);
    setTimeout(()=> setToasts(t=>t.filter(x=>x.id!==id)), opts.duration||3200);
  };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[80] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map(t=>(
          <div key={t.id} className="pointer-events-auto bg-white border border-[#E8EBE6] shadow-lg rounded-xl px-4 py-3 flex items-center gap-3 min-w-[260px] max-w-sm animate-[sheetUp_.2s_ease]">
            <span className="flex items-center justify-center w-7 h-7 rounded-full shrink-0" style={{ background: t.type==='error'?'#FCEEF0':'#E3F1EA', color: t.type==='error'?'#B23A48':'#2D6A4F' }}>
              <Icon name={t.type==='error'?'x':'check'} size={16} stroke={2.5} />
            </span>
            <div className="text-sm">
              <div className="font-semibold text-[#2a352c]">{t.msg}</div>
              {t.desc && <div className="text-[#6b756c] text-[13px] mt-0.5">{t.desc}</div>}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
function useToast(){ return useContext(ToastCtx); }

/* ---------- Stat tile ---------- */
function Stat({ icon, label, value, delta, accent='#2D6A4F' }){
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: accent+'18', color:accent }}>
          <Icon name={icon} size={18} />
        </span>
        {delta && <span className="text-xs font-semibold flex items-center gap-1" style={{ color: delta>0?'#2D6A4F':'#B23A48' }}>
          <Icon name="trending" size={13} /> +{delta}
        </span>}
      </div>
      <div className="mt-3 text-[28px] font-semibold text-[#1f2a21] leading-none tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{value}</div>
      <div className="text-[13px] text-[#6b756c] mt-1.5">{label}</div>
    </Card>
  );
}

/* ---------- Empty hint ---------- */
function SectionTitle({ overline, title, desc, action }){
  return (
    <div className={action ? 'flex items-end justify-between gap-4 flex-wrap' : ''}>
      <div className="max-w-3xl">
        {overline && <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2D6A4F] mb-1.5">{overline}</div>}
        <h2 className="text-[24px] sm:text-[29px] font-semibold text-[#1f2a21] tracking-tight" style={{ fontFamily:'var(--font-display)', lineHeight:1.3 }}>{title}</h2>
        {desc && <p className="text-[15px] text-[#6b756c] mt-2.5 max-w-2xl leading-relaxed">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

Object.assign(window, {
  Icon, ICON_PATHS, cn, Button, Card, Badge, StatusBadge, Input, ProductGlyph, Avatar, shade,
  SeasonStrip, Modal, SegTabs, ToastProvider, useToast, Stat, SectionTitle,
  useState, useEffect, useRef, useMemo, createContext, useContext
});