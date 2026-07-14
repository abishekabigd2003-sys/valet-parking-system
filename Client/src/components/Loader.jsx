import { useEffect, useState } from 'react';

const Loader = ({ fullScreen = true, global = false }) => {
  const [isVisible, setIsVisible] = useState(!global);

  useEffect(() => {
    if (!global) return;

    const showLoader = () => setIsVisible(true);
    const hideLoader = () => setIsVisible(false);

    window.addEventListener('showLoader', showLoader);
    window.addEventListener('hideLoader', hideLoader);

    return () => {
      window.removeEventListener('showLoader', showLoader);
      window.removeEventListener('hideLoader', hideLoader);
    };
  }, [global]);

  if (!isVisible) return null;

  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-[9999]' : 'absolute inset-0 z-50'} bg-[#0B0B0B] flex flex-col items-center justify-center transition-opacity duration-300`}>
      <div className="relative w-64 h-32 flex flex-col items-center justify-center">
        
        {/* Speed Lines */}
        <div className="absolute inset-0 overflow-hidden opacity-50 flex flex-col justify-center gap-3">
          <div className="speed-line w-24 h-0.5 bg-primary/40 rounded-full"></div>
          <div className="speed-line w-16 h-0.5 bg-primary/60 rounded-full translate-x-8"></div>
          <div className="speed-line w-32 h-0.5 bg-primary/30 rounded-full -translate-x-4"></div>
        </div>

        {/* Animated Car SVG */}
        <div className="car-container z-10 relative">
          <svg width="140" height="60" viewBox="0 0 140 60" xmlns="http://www.w3.org/2000/svg">
            {/* Car Shadow */}
            <ellipse cx="70" cy="54" rx="55" ry="4" fill="rgba(0,0,0,0.5)" />
            
            {/* Car Body */}
            <path d="M15 42 C 15 42, 25 25, 35 22 C 50 16, 70 14, 95 16 C 115 18, 125 25, 132 34 C 135 38, 137 42, 137 42 L 137 48 C 137 52, 133 54, 128 54 L 15 54 C 8 54, 5 50, 5 46 L 5 42 Z" fill="#FBBF24" />
            
            {/* Windows */}
            <path d="M38 23 C 50 18, 70 16, 85 18 C 98 20, 110 25, 118 32 L 80 32 L 40 32 Z" fill="#111827" />
            
            {/* Window Pillar */}
            <path d="M75 17 L 85 32" stroke="#FBBF24" strokeWidth="4" />

            {/* Headlight */}
            <path d="M130 38 L 137 40 L 137 44 L 128 44 Z" fill="#FFFFFF" opacity="0.9" />
            <ellipse cx="132" cy="42" rx="15" ry="4" fill="rgba(255,255,255,0.4)" className="headlight-beam" />
            
            {/* Taillight */}
            <path d="M5 42 L 10 40 L 10 44 L 5 44 Z" fill="#EF4444" />

            {/* Rear Wheel */}
            <g className="wheel" style={{ transformOrigin: '35px 54px' }}>
              <circle cx="35" cy="54" r="10" fill="#111827" stroke="#374151" strokeWidth="3" />
              <circle cx="35" cy="54" r="7" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="6 4" />
              <circle cx="35" cy="54" r="3" fill="#FBBF24" />
            </g>
            
            {/* Front Wheel */}
            <g className="wheel" style={{ transformOrigin: '110px 54px' }}>
              <circle cx="110" cy="54" r="10" fill="#111827" stroke="#374151" strokeWidth="3" />
              <circle cx="110" cy="54" r="7" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="6 4" />
              <circle cx="110" cy="54" r="3" fill="#FBBF24" />
            </g>
          </svg>
        </div>

        <div className="mt-4 text-white font-bold tracking-widest uppercase text-sm flex items-center">
          Loading<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span>
        </div>

      </div>
    </div>
  );
};

export default Loader;
