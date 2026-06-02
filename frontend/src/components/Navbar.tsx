'use intelligence';
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';
import { useEffect } from 'react';

const LAKSHYA_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-OmVxzBCPD0Lh6rTWxXk4B9LfcvRZuVKj8Gz_enOrsCf70O_WhsW0F80C8ulJwUuqAQiqpkfvCwaI748Pb7NC_nZN96BBbBrUBtqbb0a1jVMVA2dcc3AFSs0Pw6wY7TSmRtPEfRKYWoyjrFiP8M6abbnim0apy2zz_6QJnTcSAWeiv2OlLYs5hABipuJKUDsTgfKP75-Ot2W04pYX-oaU7zx4tcbNW6pDneQ9hpyiWGCO7ahHs2uoXmA1ulnLYvsS34KOtzAq-rSV';
const PARTNER_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2vFRmTvpOxwPjeLgUCwyPubAbgfpkhfjCbqkPSY4v1Hcj_-7XNQ12mkRsedW-JZJgirpjiXaS2FD1iHHiTEjGrh7_VDU-1zFfvaaLZIsjl-Bg9ZJFcpTjLo8JrIDqgEDQxktDO-wqlWwdaUsuhJenfyohMBZqjf454XSXb_JJ0D4GJroBhpRsnFklYLOhshpshrnX3fQVikMTtgYBa-TmsI5HcQQ71HXh-E5sbnDK71mRMLshFPwO9UnszVnrcS1AuCVa7fWr0Ez-';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, subscribeRealtime, fetchInitialData } = useStore();

  useEffect(() => {
    fetchInitialData();
    const unsubscribe = subscribeRealtime();
    return () => {
      unsubscribe();
    };
  }, [fetchInitialData, subscribeRealtime]);

  const handleTopHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerSparkles(e.clientX, e.clientY, 'tapper');
  };

  const navItems = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/progress', label: 'Progress', icon: 'query_stats' },
    { href: '/oopsie', label: 'Oopsie', icon: 'sentiment_very_dissatisfied' },
    { href: '/plans', label: 'Plans', icon: 'calendar_today' },
    { href: '/good-things', label: 'Surprise', icon: 'card_giftcard' },
  ];

  const currentAvatar = currentUser?.role === 'lakshya' ? LAKSHYA_AVATAR : PARTNER_AVATAR;

  return (
    <>
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-sm border-b-2 border-primary/20">
        <div className="flex justify-between items-center w-full px-4 py-3 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/login" title="Switch User Profile">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline rotate-[-3deg] shadow-sm hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer bg-white">
                <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Stem */}
                  <path d="M50 45 C50 65 52 80 50 92" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
                  {/* Leaf 1 */}
                  <path d="M50 75 C35 70 28 58 32 48 C36 50 42 62 50 72" fill="#81C784" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Leaf 2 */}
                  <path d="M50 82 C65 78 72 68 68 58 C64 60 58 70 50 78" fill="#81C784" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Tulip Petals */}
                  <path d="M50 12 C40 28 60 28 50 12Z" fill="#FF8FA3" stroke="#C2185B" strokeWidth="2.5" />
                  <path d="M50 45 C28 42 22 20 40 18 C50 25 48 38 50 45Z" fill="#FF6B8B" stroke="#C2185B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M50 45 C72 42 78 20 60 18 C50 25 52 38 50 45Z" fill="#FF6B8B" stroke="#C2185B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M50 45 C38 42 38 18 50 15 C62 18 62 42 50 45Z" fill="#FF4081" stroke="#C2185B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
            <Link href="/">
              <h1 className="font-gloria text-2xl font-bold text-primary hover:opacity-85 transition-opacity cursor-pointer">
                VB&apos;s Scrapbook
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 font-patrick text-lg cursor-pointer ${
                    isActive 
                      ? 'bg-primary-container text-on-primary-container border-2 border-primary/20 rotate-1' 
                      : 'text-on-surface-variant hover:bg-primary-container/20'
                  }`}>
                    <span className="material-symbols-outlined text-xl" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <button 
            onClick={handleTopHeartClick}
            className="text-primary hover:bg-primary-container/20 transition-all p-2 rounded-full active:scale-90"
            aria-label="Sparkle Love"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
          </button>
        </div>
      </header>

      {/* Bottom Nav Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/95 border-t-2 border-primary/20 pb-safe pt-2 shadow-[0_-4px_0_rgba(129,116,120,0.05)]">
        <div className="flex justify-around items-center w-full px-2 max-w-[1440px] mx-auto h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            // Special middle button design for Oopsie matching the oopsie corner HTML
            if (item.href === '/oopsie') {
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center relative -top-3">
                  <div className={`w-14 h-14 border-2 rounded-full flex items-center justify-center shadow-lg rotate-3 active:scale-90 transition-transform ${
                    isActive 
                      ? 'bg-primary text-white border-white scale-105' 
                      : 'bg-primary-container text-on-primary-container border-primary'
                  }`}>
                    <span className="material-symbols-outlined text-2xl" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                      {item.icon}
                    </span>
                  </div>
                  <span className={`font-patrick text-xs mt-1 font-bold ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                <span className={`flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? 'text-primary scale-110 font-bold' 
                    : 'text-on-surface-variant/70 active:scale-95'
                }`}>
                  <span className="material-symbols-outlined text-2xl" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                    {item.icon}
                  </span>
                  <span className="font-patrick text-xs mt-0.5">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
