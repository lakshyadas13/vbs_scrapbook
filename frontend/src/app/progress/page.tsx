'use client';

import { useEffect, useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';

interface FloatingItem {
  id: number;
  x: number;
  size: number;
  icon: string;
}

export default function HeartTapperPage() {
  const { currentUser, loveTaps, incrementLoveTaps } = useStore();
  const [decorations, setDecorations] = useState<FloatingItem[]>([]);
  const [isPopping, setIsPopping] = useState(false);
  const nextId = useRef(0);

  // Get active taps for current user
  const userTapRecord = loveTaps.find((t) => t.user_id === currentUser?.id);
  const userTapCount = userTapRecord?.count || 0;

  // Floating background doodles effect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = setInterval(() => {
      const newItem: FloatingItem = {
        id: nextId.current++,
        x: Math.random() * 100, // percentage
        size: Math.random() * 18 + 12,
        icon: Math.random() > 0.4 ? 'favorite' : 'auto_awesome',
      };
      setDecorations((prev) => [...prev, newItem]);

      // Remove after animation completes (6 seconds)
      setTimeout(() => {
        setDecorations((prev) => prev.filter((item) => item.id !== newItem.id));
      }, 6000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Prevent default touch behaviors
    if ('touches' in e) {
      e.preventDefault();
      const touch = e.touches[0];
      triggerSparkles(touch.clientX, touch.clientY, 'tapper');
    } else {
      triggerSparkles(e.clientX, e.clientY, 'tapper');
    }

    incrementLoveTaps();
    
    // Trigger pop animation on counter
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 200);
  };

  return (
    <main className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden doodle-bg-grid pt-16 select-none">
      
      {/* Floating Ambient Doodles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {decorations.map((deco) => (
          <div
            key={deco.id}
            className="floating-deco"
            style={{
              left: `${deco.x}%`,
              top: '105%',
            }}
          >
            <span 
              className="material-symbols-outlined text-primary/10 select-none"
              style={{ 
                fontSize: `${deco.size}px`, 
                fontVariationSettings: "'wght' 200" 
              }}
            >
              {deco.icon}
            </span>
          </div>
        ))}
      </div>

      {/* Score Dashboard Card */}
      <div className="scrapbook-card px-8 py-5 rounded-sm text-center bg-white z-10 select-none relative mb-12">
        <p className="font-patrick text-sm text-on-surface-variant uppercase tracking-widest">Love Counter</p>
        <div className={`font-gloria text-5xl md:text-6xl text-primary tabular-nums ${isPopping ? 'counter-pop' : ''}`}>
          {userTapCount}
        </div>
        <p className="font-patrick text-lg text-tertiary mt-1 italic">
          Taps by {currentUser?.display_name || 'You'}
        </p>
      </div>

      {/* The Pulsating Heart Tap Area */}
      <div 
        onMouseDown={handleTap}
        onTouchStart={handleTap}
        className="heart-container relative cursor-pointer group active:scale-95 transition-transform duration-75 z-10"
        id="tap-area"
      >
        {/* Decorative Ornaments */}
        <div className="absolute -top-14 -left-14 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
          <span className="material-symbols-outlined text-4xl text-tertiary-fixed-dim rotate-12">auto_awesome</span>
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
          <span className="material-symbols-outlined text-3xl text-primary-container -rotate-45">celebration</span>
        </div>
        
        {/* Main Pulsating Heart - Sketchy Style */}
        <div className="heart-pulsate relative z-10 transition-transform duration-75">
          <span 
            className="sketchy-heart select-none block" 
            style={{ fontSize: '220px', lineHeight: '1' }}
          >
            favorite
          </span>
        </div>
        
        {/* Glow */}
        <div className="absolute inset-0 bg-primary-container/10 blur-[40px] rounded-full scale-125 -z-10"></div>
      </div>

      {/* Subtext info */}
      <div className="mt-16 text-center max-w-xs z-10">
        <p className="font-gloria text-2xl text-primary mb-3">How much I missed you...</p>
        <p className="font-patrick text-lg text-on-surface-variant leading-relaxed">
          Every tap is a heartbeat across the distance. Keep tapping to fill the world with sparkles.
        </p>
      </div>
    </main>
  );
}
