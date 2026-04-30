export function RinkBg() {
  return (
    <svg className="absolute inset-0 w-full h-full text-white bg-slate-50" preserveAspectRatio="none" viewBox="0 0 1000 1000">
      {/* Blue lines (crease outline etc) */}
      <path d="M 300 100 C 300 250, 700 250, 700 100" fill="#E0F2FE" stroke="#0284C7" strokeWidth="8"/>
      {/* Red goal line */}
      <line x1="100" y1="100" x2="900" y2="100" stroke="#EF4444" strokeWidth="12" />
      
      {/* Center red line */}
      <line x1="0" y1="950" x2="1000" y2="950" stroke="#EF4444" strokeWidth="16" />
      {/* Faceoff circles */}
      <circle cx="200" cy="500" r="80" stroke="#EF4444" strokeWidth="8" fill="none" />
      <circle cx="800" cy="500" r="80" stroke="#EF4444" strokeWidth="8" fill="none" />
    </svg>
  );
}

export function NetSVG({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="net-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 10 M 0 0 L 10 10" fill="none" stroke="#CBD5E1" strokeWidth="1"/>
        </pattern>
      </defs>
      {/* Back of net */}
      <path d="M 20 80 L 40 20 L 160 20 L 180 80 Z" fill="url(#net-pattern)" />
      {/* Goal Posts */}
      <path d="M 20 80 L 20 0 L 180 0 L 180 80" stroke="#EF4444" strokeWidth="12" strokeLinejoin="round" />
    </svg>
  );
}

export function PuckSVG({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Puck body */}
      <ellipse cx="50" cy="40" rx="45" ry="25" fill="#1E293B"/> {/* bottom thickness */}
      <ellipse cx="50" cy="30" rx="45" ry="25" fill="#0F172A"/> {/* top face */}
      {/* Highlights */}
      <ellipse cx="50" cy="30" rx="35" ry="18" stroke="#334155" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function RinkBgGoalieView() {
  return (
    <svg className="absolute inset-0 w-full h-full text-white bg-slate-50" preserveAspectRatio="none" viewBox="0 0 1000 1000">
      {/* Background Rink looking outwards */}
      
      {/* Center red line in distance */}
      <line x1="0" y1="400" x2="1000" y2="400" stroke="#EF4444" strokeWidth="12" />
      
      {/* Blue line closer */}
      <line x1="0" y1="600" x2="1000" y2="600" stroke="#0284C7" strokeWidth="16" />
      
      {/* Crease curving towards us */}
      <path d="M 200 1000 C 200 800, 800 800, 800 1000" fill="#E0F2FE" stroke="#0284C7" strokeWidth="8"/>
      
      {/* Goal line (red) at the very bottom */}
      <line x1="0" y1="980" x2="1000" y2="980" stroke="#EF4444" strokeWidth="40" />
    </svg>
  );
}

export function ViewportGoalNet() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-50" preserveAspectRatio="none" viewBox="0 0 1000 1000">
      {/* Soft vignette */}
      <rect x="0" y="0" width="1000" height="1000" fill="url(#maskFade)" opacity="0.3" />
      <defs>
        <radialGradient id="maskFade" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="70%" stopColor="transparent" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
      </defs>

      {/* Goal Posts framing the left/right/top */}
      <path d="M 50 1000 L 50 50 L 950 50 L 950 1000" stroke="#EF4444" strokeWidth="40" strokeLinejoin="round" fill="none" />
      <path d="M 70 1000 L 70 70 L 930 70 L 930 1000" stroke="#CBD5E1" strokeWidth="10" strokeLinejoin="round" fill="none" opacity="0.4"/>
    </svg>
  );
}

export function GoalieGlove({ className = '', status = 'idle' }: { className?: string, status?: 'idle' | 'save' | 'miss' }) {
  return (
    <div className={`relative ${className}`}>
      {status === 'save' && (
        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-60 animate-ping z-0" />
      )}
      {status === 'miss' && (
        <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-60 animate-pulse z-0" />
      )}
      <svg className="relative z-10 w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glove brown leather base */}
      <path d="M 30 150 C 10 150, 20 60, 60 40 C 90 20, 130 20, 150 50 C 180 90, 190 140, 150 170 C 110 190, 50 180, 30 150 Z" fill="#B9975B" stroke="#0F172A" strokeWidth="8" />
      {/* Pocket webbing */}
      <path d="M 70 40 L 140 100 M 90 30 L 160 80 M 50 60 L 120 120" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
      {/* Padding shape */}
      <path d="M 40 120 C 60 110, 80 120, 100 140" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
      <circle cx="140" cy="140" r="15" fill="#C0C0C0" stroke="#0F172A" strokeWidth="4"/> 
      </svg>
    </div>
  );
}

export function Stick47({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="-20 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shaft */}
      <path d="M 80 10 L 30 180" stroke="#000000" strokeWidth="16" strokeLinecap="round" />
      {/* Tape Top */}
      <path d="M 80 10 L 67 46" stroke="#C0C0C0" strokeWidth="18" strokeLinecap="round" />
      {/* Blade */}
      <path d="M 33 175 C 10 185 -10 190 -15 185 C -20 180 10 165 30 160" fill="#C0C0C0" stroke="#C0C0C0" strokeWidth="8" strokeLinejoin="round" />
      {/* Number 47 */}
      <text x="55" y="100" fill="#C0C0C0" fontSize="16" fontWeight="900" fontStyle="italic" transform="rotate(-73.6 55 95)" textAnchor="middle">47</text>
    </svg>
  );
}

export function KnightHelmet({ className = '', isGoalie = false }: { className?: string, isGoalie?: boolean }) {
  return (
    <svg className={className} viewBox="-50 0 300 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      {isGoalie && (
        <>
          <rect x="0" y="50" width="200" height="180" rx="20" fill="#B9975B" opacity="0.8" /> {/* Goalie pads */}
          <path d="M -40 220 L 240 220 L 240 180 L -40 180 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="4" /> {/* Goalie Stick blade block */}
          <path d="M 180 200 L 100 0" stroke="#F1F5F9" strokeWidth="16" strokeLinecap="round" /> {/* Goalie Stick shaft */}
        </>
      )}
      {!isGoalie && (
         <>
           <path d="M 160 220 L 220 220 C 240 220, 250 210, 250 190" stroke="#000" strokeWidth="12" fill="none" /> {/* Player Stick blade */}
           <path d="M 180 220 L 100 0" stroke="#333" strokeWidth="12" strokeLinecap="round" /> {/* Player Stick shaft */}
         </>
      )}
      
      {/* Helmet Base (Silver) */}
      <path d="M 30 100 C 30 20, 170 20, 170 100 L 170 180 C 170 220, 130 240, 100 240 C 70 240, 30 220, 30 180 Z" fill="#C0C0C0" stroke="#1E293B" strokeWidth="8" strokeLinejoin="round"/>
      
      {/* Vegas Gold accents */}
      <path d="M 100 20 L 100 240" stroke="#B9975B" strokeWidth="12" />
      <path d="M 30 140 C 60 150, 140 150, 170 140" stroke="#B9975B" strokeWidth="12" fill="none" />
      
      {/* Visor/Eye slot (Black) */}
      <path d="M 50 80 C 70 100, 130 100, 150 80 L 150 110 C 130 130, 70 130, 50 110 Z" fill="#000000" />
      
      {/* Helmet details */}
      <circle cx="100" cy="80" r="10" fill="#EF4444" /> {/* Red glowing eye/gem */}
    </svg>
  );
}
