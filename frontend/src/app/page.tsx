'use client';

import { useEffect, useState } from 'react';
import { useStore, Mood } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';
import Link from 'next/link';

const MOOD_ASSETS = {
  in_love: {
    emoji: '🥰',
    label: 'In Love',
    bg: 'bg-secondary-container/40',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw1t0GcRDOa3qWIs_BmAEjmmmGwcaC1yxWe64znGvXWhILRb155F471pLYoAmYFse7p5KZWRNUFhPmJBZ0b7KKFF2TXKvNmwzu8VT7flhUbbv50WbgsQ6RdTp2wh-IWL5Kiv8Ey6bU1YA71o9djFq1gqhuWASOh8T8flHDh0z9jkLuTVaycbsNdQxOO2xZfagw5Srrw8cfQqyMlTzCSHYgASRxglFDzqhiBIMzs8LYiUmeu1tc7U18nti87AUb_IuNFG57vITFgPoy',
  },
  miss_you: {
    emoji: '🥺',
    label: 'Miss You',
    bg: 'bg-tertiary-container/30',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSjrLcW8d4YtmTRvzL2fJkHV6w8QJzMuPOmFcMlLAQNBFZsgCZjdZthaL5GL7AnGT82FWfbpco1yBtf7YA7x84ggzZ7KJbKLCOLgm6nK3Hl312drql7FnBhdSrDI78ktoRfYFBd3d7ISrJN883rWmEvLbnn93l4kM4ZsRiiU08buvirop463OdbpomWGhYc2PBsEMJqhxb_lyXpuPSF7mP-lAQ3zSXFdPtV1KmNSpZgm7HYoWBLjLM01hs0l38iQQ2voVW63qBlP8v',
  },
  dreaming: {
    emoji: '💭',
    label: 'Dreaming',
    bg: 'bg-primary-container/20',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLf0K3LtdffgzV0IM0XwzBT_jRs5QF8UyildkNlUI9TFyXfyCmKkLX70C3KPtFuuo0fsJ76A1qgjjyDSzaIm42uX-S7q8DiQQhPUYYOGWFDrdkA8gy_aZwRosWAid9RBXf1gjFdCFTwlH9B0v10gzfbZ_LHzXN7Dtc7aQTvknW3Lew2AG15CVMZJIMUSaXXMtmS0OAWIYclsz3xcHhDl32-IZmmS_BPX0VWQlBn4-0zBR1OjQCXp6krYC5mGfSXhs4OcdqympoFj48',
  },
  celeb: {
    emoji: '🥳',
    label: 'Celeb',
    bg: 'bg-secondary-fixed',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsA6p7ONeujHp_GBnqx9CaJsFDeWc4b2v2Aj6enuqAILz8bSo-JeXV0LAD7_IxnysDuEwQFdimKPb0RN_za_1_2VGcOxZpxbjXmObNlOp8c-kTplJDwZGWw-uerE3128wKpcV6ueXtLkC1bPGV92clGp7T9ztFyCnGp8hjLCLTkJ5cgt_k4IFWmBPxgKwSfQGKp-Ibtirt1P1GDCgTgswjR-0uuKH4K62AOzTnlbcoZsOU-35fg0__lCiVAmv0ej2pzFMYH0KRipRW',
  },
};

const GOOD_THING_ICONS = [
  { icon: 'restaurant', color: 'text-secondary' },
  { icon: 'auto_awesome', color: 'text-primary' },
  { icon: 'coffee', color: 'text-tertiary' },
  { icon: 'favorite', color: 'text-secondary' },
];

export default function HomeDashboard() {
  const { 
    currentUser, 
    coupleSettings, 
    moods, 
    loveTaps, 
    goodThings, 
    updateMood, 
    incrementLoveTaps,
    addGoodThing,
    isLoading
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [timeTogether, setTimeTogether] = useState({
    days: 428,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Note Modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteTag, setNoteTag] = useState('SmallJoy');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live Timer Calculation since 31st March 2025 12:53 AM
  useEffect(() => {
    let startDateTime = new Date('2025-03-31T00:53:00+05:30'); // Default 31st March 2025, 12:53 AM IST
    
    if (coupleSettings?.anniversary_date) {
      const customDate = coupleSettings.anniversary_date;
      if (customDate === '2025-04-01' || customDate === '2025-03-31') {
        startDateTime = new Date('2025-03-31T00:53:00+05:30');
      } else {
        startDateTime = new Date(`${customDate}T00:53:00`);
      }
    }

    const updateCounter = () => {
      const now = new Date();
      const diffMs = now.getTime() - startDateTime.getTime();
      
      if (diffMs > 0) {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        setTimeTogether({ days, hours, minutes, seconds });
      }
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [coupleSettings?.anniversary_date]);

  // Find partner's mood & user's mood
  const myMoodRecord = moods.find((m) => m.user_id === currentUser?.id);
  const myMood = myMoodRecord?.mood_type || 'in_love';

  const partnerMoodRecord = moods.find((m) => m.user_id !== currentUser?.id);
  const partnerMood = partnerMoodRecord?.mood_type || 'in_love';

  // Find partner name
  const partnerName = currentUser?.role === 'lakshya' 
    ? coupleSettings?.partner2_name || 'Vishakha'
    : coupleSettings?.partner1_name || 'Lakshya';

  // Calculate total love taps
  const totalTaps = loveTaps.reduce((acc, curr) => acc + curr.count, 0);

  const handleDailyCheckin = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerSparkles(e.clientX, e.clientY, 'dashboard');
    setCheckedIn(true);
    // Optimistically update taps as check-in action
    incrementLoveTaps();
  };

  const handleMoodSelect = (moodKey: Mood['mood_type'], e: React.MouseEvent<HTMLDivElement>) => {
    triggerSparkles(e.clientX, e.clientY, 'dashboard');
    updateMood(moodKey);
  };

  const handleFabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerSparkles(e.clientX, e.clientY, 'tapper');
    incrementLoveTaps();
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen doodle-bg-dots flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-patrick text-xl text-primary mt-4 animate-bounce">Loading our sweet scrapbook...</p>
      </div>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 pt-24 pb-12 doodle-bg-dots min-h-screen">
      {/* Hero Section: Days Together Counter */}
      <section className="mb-12 relative px-2">
        <div className="taped-paper sketchy-border p-8 flex flex-col items-center justify-center text-center relative bg-white">
          <span className="material-symbols-outlined absolute -top-4 -left-2 text-tertiary/40 text-4xl floating-heart">favorite</span>
          <span className="material-symbols-outlined absolute -bottom-6 -right-2 text-primary/30 text-5xl floating-heart" style={{ animationDelay: '1s' }}>draw</span>
          <span className="material-symbols-outlined absolute top-1/2 -right-4 text-secondary/30 text-3xl doodle-sparkle">auto_awesome</span>
          
          <p className="font-patrick text-lg text-primary uppercase tracking-widest mb-2">Journey of Us</p>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5 mb-4 select-none font-gloria text-primary">
            <div className="flex flex-col items-center">
              <span className="text-[52px] sm:text-[72px] md:text-[80px] leading-none counter-pop min-w-[70px] sm:min-w-[100px]">
                {timeTogether.days}
              </span>
              <span className="font-patrick text-xs sm:text-sm text-on-surface-variant lowercase">days</span>
            </div>
            <span className="text-3xl sm:text-5xl self-start mt-2 sm:mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-[52px] sm:text-[72px] md:text-[80px] leading-none counter-pop min-w-[50px] sm:min-w-[70px]">
                {String(timeTogether.hours).padStart(2, '0')}
              </span>
              <span className="font-patrick text-xs sm:text-sm text-on-surface-variant lowercase">hours</span>
            </div>
            <span className="text-3xl sm:text-5xl self-start mt-2 sm:mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-[52px] sm:text-[72px] md:text-[80px] leading-none counter-pop min-w-[50px] sm:min-w-[70px]">
                {String(timeTogether.minutes).padStart(2, '0')}
              </span>
              <span className="font-patrick text-xs sm:text-sm text-on-surface-variant lowercase">mins</span>
            </div>
            <span className="text-3xl sm:text-5xl self-start mt-2 sm:mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-[52px] sm:text-[72px] md:text-[80px] leading-none counter-pop min-w-[50px] sm:min-w-[70px] text-secondary">
                {String(timeTogether.seconds).padStart(2, '0')}
              </span>
              <span className="font-patrick text-xs sm:text-sm text-on-surface-variant lowercase">secs</span>
            </div>
          </div>
          <p className="font-patrick text-lg text-on-surface-variant italic">
            &quot;Every second with you is a gift.&quot;
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button 
              onClick={handleDailyCheckin}
              disabled={checkedIn}
              className={`sketchy-border px-6 py-3 font-patrick text-lg flex items-center justify-center gap-2 active:translate-y-1 transition-all ${
                checkedIn 
                  ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed opacity-75' 
                  : 'bg-primary-container text-on-primary-container hover:scale-[1.02]'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {checkedIn ? 'check_circle' : 'circle'}
              </span>
              {checkedIn ? 'Checked In!' : 'Daily Check-in'}
            </button>
            <button 
              onClick={(e) => {
                triggerSparkles(e.clientX, e.clientY, 'tapper');
                setIsNoteModalOpen(true);
              }}
              className="sketchy-border bg-white text-primary px-6 py-3 font-patrick text-lg flex items-center justify-center gap-2 active:translate-y-1 transition-all hover:scale-[1.02] w-full sm:w-auto"
            >
              <span className="material-symbols-outlined">edit_note</span>
              Write a Note
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Stats & Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-2">
        {/* Current Mood Widget */}
        <div className="md:col-span-8 taped-paper sketchy-border p-6 relative bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-gloria text-2xl text-primary">Our Current Mood</h3>
            <span className="material-symbols-outlined text-secondary">mood</span>
          </div>

          {/* Mood status display */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8 items-center justify-around border-b-2 border-dashed border-outline-variant pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden">
                <img 
                  alt="My Profile" 
                  className="w-full h-full object-cover"
                  src={currentUser?.role === 'lakshya' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-OmVxzBCPD0Lh6rTWxXk4B9LfcvRZuVKj8Gz_enOrsCf70O_WhsW0F80C8ulJwUuqAQiqpkfvCwaI748Pb7NC_nZN96BBbBrUBtqbb0a1jVMVA2dcc3AFSs0Pw6wY7TSmRtPEfRKYWoyjrFiP8M6abbnim0apy2zz_6QJnTcSAWeiv2OlLYs5hABipuJKUDsTgfKP75-Ot2W04pYX-oaU7zx4tcbNW6pDneQ9hpyiWGCO7ahHs2uoXmA1ulnLYvsS34KOtzAq-rSV' : 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2vFRmTvpOxwPjeLgUCwyPubAbgfpkhfjCbqkPSY4v1Hcj_-7XNQ12mkRsedW-JZJgirpjiXaS2FD1iHHiTEjGrh7_VDU-1zFfvaaLZIsjl-Bg9ZJFcpTjLo8JrIDqgEDQxktDO-wqlWwdaUsuhJenfyohMBZqjf454XSXb_JJ0D4GJroBhpRsnFklYLOhshpshrnX3fQVikMTtgYBa-TmsI5HcQQ71HXh-E5sbnDK71mRMLshFPwO9UnszVnrcS1AuCVa7fWr0Ez-'} 
                />
              </div>
              <div>
                <span className="font-patrick text-sm text-outline block">Your mood</span>
                <span className="font-patrick text-xl font-bold text-primary">{MOOD_ASSETS[myMood]?.label} {MOOD_ASSETS[myMood]?.emoji}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-secondary overflow-hidden">
                <img 
                  alt="Partner Profile" 
                  className="w-full h-full object-cover"
                  src={currentUser?.role === 'lakshya' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2vFRmTvpOxwPjeLgUCwyPubAbgfpkhfjCbqkPSY4v1Hcj_-7XNQ12mkRsedW-JZJgirpjiXaS2FD1iHHiTEjGrh7_VDU-1zFfvaaLZIsjl-Bg9ZJFcpTjLo8JrIDqgEDQxktDO-wqlWwdaUsuhJenfyohMBZqjf454XSXb_JJ0D4GJroBhpRsnFklYLOhshpshrnX3fQVikMTtgYBa-TmsI5HcQQ71HXh-E5sbnDK71mRMLshFPwO9UnszVnrcS1AuCVa7fWr0Ez-' : 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-OmVxzBCPD0Lh6rTWxXk4B9LfcvRZuVKj8Gz_enOrsCf70O_WhsW0F80C8ulJwUuqAQiqpkfvCwaI748Pb7NC_nZN96BBbBrUBtqbb0a1jVMVA2dcc3AFSs0Pw6wY7TSmRtPEfRKYWoyjrFiP8M6abbnim0apy2zz_6QJnTcSAWeiv2OlLYs5hABipuJKUDsTgfKP75-Ot2W04pYX-oaU7zx4tcbNW6pDneQ9hpyiWGCO7ahHs2uoXmA1ulnLYvsS34KOtzAq-rSV'} 
                />
              </div>
              <div>
                <span className="font-patrick text-sm text-outline block">{partnerName}&apos;s mood</span>
                <span className="font-patrick text-xl font-bold text-secondary">{MOOD_ASSETS[partnerMood]?.label} {MOOD_ASSETS[partnerMood]?.emoji}</span>
              </div>
            </div>
          </div>
          
          {/* Mood selection selectors */}
          <p className="font-patrick text-lg text-on-surface-variant mb-4 text-center">Tap to update how you feel right now:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
            {(Object.keys(MOOD_ASSETS) as Array<keyof typeof MOOD_ASSETS>).map((moodKey) => {
              const active = myMood === moodKey;
              const details = MOOD_ASSETS[moodKey];
              return (
                <div 
                  key={moodKey} 
                  onClick={(e) => handleMoodSelect(moodKey, e)}
                  className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 ${
                    active ? 'scale-105 opacity-100 font-bold' : 'opacity-65 hover:opacity-100'
                  }`}
                >
                  <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center p-3 relative hover:scale-110 transition-transform ${
                    active ? 'border-primary shadow-md ' + details.bg : 'border-outline-variant/60 bg-transparent'
                  }`}>
                    <img 
                      className={`w-full h-full object-contain sticker ${!active ? 'grayscale opacity-75' : ''}`} 
                      src={details.src} 
                      alt={details.label}
                    />
                    {active && (
                      <span className="absolute -top-1 -right-1 bg-primary text-[10px] text-white px-1.5 py-0.5 rounded-full font-patrick border border-white">
                        active
                      </span>
                    )}
                  </div>
                  <span className="font-patrick text-lg">{details.label}</span>
                </div>
              );
            })}
          </div>
          <span className="material-symbols-outlined absolute -top-3 right-4 text-tertiary text-2xl">featured_seasonal_and_gifts</span>
        </div>

        {/* Love Tap Tally Polaroid Card */}
        <div className="md:col-span-4 polaroid flex flex-col items-center text-center bg-white justify-between min-h-[300px]">
          <h3 className="font-gloria text-2xl text-primary mb-1">Love Tapper</h3>
          
          <div className="my-auto flex flex-col items-center">
            <span className="material-symbols-outlined text-tertiary text-5xl heart-pulsate mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            <div className="text-[64px] font-gloria text-on-primary-container leading-none select-none">
              {totalTaps}
            </div>
            <p className="font-patrick text-lg text-on-surface-variant max-w-[180px] mx-auto mt-2">
              Combined love taps sent between you two!
            </p>
          </div>

          <div className="w-full mt-4 px-2">
            <Link href="/progress" className="w-full">
              <button className="sticker-btn w-full py-2 bg-secondary text-white text-lg rounded-sm active:translate-y-1 hover:scale-102 transition-transform">
                Go to Tapper Page
              </button>
            </Link>
          </div>
        </div>

        {/* Good Things Today Timeline Section */}
        <div className="md:col-span-12 mt-4 px-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-gloria text-2xl text-primary">Good Things Today ✨</h3>
            <Link href="/good-things" className="font-patrick text-lg text-secondary hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {goodThings.slice(0, 4).map((thing, idx) => {
              const styleVariant = idx % 2 === 0 
                ? 'bg-white hover:rotate-1' 
                : 'bg-secondary-container/20 hover:-rotate-1';
                
              const iconStyle = GOOD_THING_ICONS[idx % GOOD_THING_ICONS.length];

              return (
                <div 
                  key={thing.id} 
                  className={`taped-paper sketchy-border p-5 flex flex-col gap-2 transition-transform duration-300 ${styleVariant}`}
                >
                  <span className={`material-symbols-outlined ${iconStyle.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {iconStyle.icon}
                  </span>
                  <h4 className="font-gloria text-lg text-on-surface line-clamp-1">{thing.title}</h4>
                  <p className="font-patrick text-base text-on-surface-variant line-clamp-3 leading-snug">{thing.description}</p>
                  <span className="font-patrick text-xs text-outline text-right mt-auto pt-2">{thing.time}</span>
                </div>
              );
            })}
            
            {goodThings.length === 0 && (
              <div className="col-span-full taped-paper sketchy-border p-8 text-center bg-white">
                <p className="font-patrick text-xl text-outline italic">No scrapbook memories recorded today. Go tap Write a Note!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Heart Button (Desktop Only) */}
      <button 
        onClick={handleFabClick}
        className="hidden md:flex fixed bottom-8 right-8 w-16 h-16 rounded-full sketchy-border bg-primary text-white shadow-lg items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
        aria-label="Increment Love Taps"
      >
        <span 
          className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform" 
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          favorite
        </span>
      </button>

      {/* WRITE A NOTE MODAL */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="taped-paper sketchy-border p-6 md:p-8 max-w-lg w-full relative bg-white transition-all duration-300 transform scale-100 animate-scaleUp">
            <button 
              onClick={() => setIsNoteModalOpen(false)}
              className="absolute top-4 right-4 text-outline hover:text-primary transition-colors text-2xl font-bold font-patrick"
              aria-label="Close modal"
            >
              ✕
            </button>
            
            <h3 className="font-gloria text-2xl text-primary mb-4 flex items-center gap-2">
              <span>Write a Sweet Note 💌</span>
            </h3>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!noteTitle.trim()) return;

                const rect = (e.target as HTMLElement).getBoundingClientRect();
                triggerSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'good_things');

                const now = new Date();
                const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                addGoodThing({
                  title: noteTitle.trim(),
                  description: noteDescription.trim() || 'Logged as a sweet memory.',
                  time: timeStr,
                  tags: [noteTag],
                  image_url: null,
                });

                // Clear fields
                setNoteTitle('');
                setNoteDescription('');
                setNoteTag('SmallJoy');
                setIsNoteModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Title</label>
                <input 
                  type="text" 
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                  placeholder="Give your memory a name... (e.g. Star Walk)"
                  required
                />
              </div>

              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Your Message / Note</label>
                <textarea 
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                  rows={4}
                  className="w-full p-4 doodle-border bg-surface-container-lowest font-patrick text-lg resize-none relative outline-none"
                  style={{
                    backgroundImage: 'linear-gradient(#f1f1f1 1px, transparent 1px)',
                    backgroundSize: '100% 28px',
                    lineHeight: '28px',
                    paddingTop: '6px'
                  }}
                  placeholder="Write your note down here..."
                />
              </div>

              <div>
                <label className="font-patrick text-base text-primary block mb-1">Choose Tag</label>
                <div className="flex flex-wrap gap-2 select-none">
                  {['SelfCare', 'WorkWin', 'SmallJoy', 'Relationship', 'Gratitude'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNoteTag(tag)}
                      className={`px-3 py-1 font-patrick text-sm border-2 border-outline rounded transition-all ${
                        noteTag === tag 
                          ? 'bg-primary text-white scale-105 font-bold' 
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="sticker-btn w-full py-3 bg-primary text-white text-xl active:translate-y-1 transition-all mt-4 font-gloria"
              >
                Add to Scrapbook ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
