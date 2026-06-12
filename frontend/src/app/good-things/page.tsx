'use client';

import { useState } from 'react';
import { useStore, GoodThing } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';
import { compressImage } from '@/utils/image';

export default function GoodThingsPage() {
  const { goodThings, addGoodThing, deleteGoodThing, currentUser, loveTaps, coupleSettings } = useStore();
  const [inputText, setInputText] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [activeTag, setActiveTag] = useState<string>('SmallJoy');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Helper to determine who wrote the note
  const getAuthorName = (noteUserId: string) => {
    if (!currentUser) return 'Someone';

    const MOCK_ID = '00000000-0000-0000-0000-000000000000';
    const isMe = noteUserId === currentUser.id ||
      (currentUser.id === MOCK_ID && noteUserId === MOCK_ID) ||
      (currentUser.role === 'partner' && noteUserId === 'partner');

    if (isMe) {
      return currentUser.display_name || 'Me';
    } else {
      if (currentUser.role === 'lakshya') {
        return coupleSettings?.partner2_name || 'Vishakha';
      } else {
        return coupleSettings?.partner1_name || 'Lakshya';
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const dataUrl = await compressImage(file);
      setImageUrl(dataUrl);
    } catch (err) {
      console.error('Image compression failed:', err);
      alert('Could not process the uploaded image. Please try a different one!');
    } finally {
      setIsCompressing(false);
    }
  };

  // Secret Surprises Milestones Logic
  const totalLoveTapsCombined = loveTaps.reduce((acc, curr) => acc + curr.count, 0);
  
  const milestones = [
    {
      target: 100,
      title: 'Sweet Beginning 🍨',
      desc: 'Keep tapping the heart to unlock a sweet treats milestone surprise.',
      voucher: "SECRET COUPLE VOUCHER: 'One Free Late Night Ice Cream Run & Infinite Back Rubs.' Valid forever! ✨",
    },
    {
      target: 500,
      title: 'Deep Connection 🎬',
      desc: 'Unlock this once you reach 500 total taps to claim a cozy weekend treat.',
      voucher: "SECRET COUPLE VOUCHER: 'A Lazy Sunday Movie Marathon with home-cooked meals served by your partner.' 🍿",
    },
    {
      target: 1000,
      title: 'Infinite Love ✈️',
      desc: 'The ultimate milestone reward at 1000 total combined love taps!',
      voucher: "SECRET COUPLE VOUCHER: 'A Weekend Getaway trip planned and funded by the other partner + a handmade letter.' 💖",
    }
  ];

  const handleTagSelect = (tag: string) => {
    setActiveTag(tag);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Trigger sparkles near target
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    triggerSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'good_things');

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    addGoodThing({
      title: inputText.trim(),
      description: descriptionText.trim() || 'Logged as a daily accomplishment.',
      time: timeStr,
      tags: [activeTag],
      image_url: imageUrl,
    });

    setInputText('');
    setDescriptionText('');
    setImageUrl(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerSparkles(e.clientX, e.clientY, 'good_things');
    deleteGoodThing(id);
  };

  const handleRevealSurprise = (e: React.MouseEvent) => {
    triggerSparkles(e.clientX, e.clientY, 'good_things');
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-12 pt-24 pb-32 doodle-bg-grid min-h-screen">
      {/* Hero Section */}
      <section className="mb-12 text-center relative select-none">
        <div className="absolute top-0 right-10 text-tertiary-container/30 font-gloria text-6xl -rotate-12 -z-10">★</div>
        <div className="absolute bottom-10 left-10 text-secondary-container/30 font-gloria text-5xl rotate-12 -z-10">❤</div>
        <div className="inline-block relative mb-4">
          <span className="material-symbols-outlined text-6xl text-primary floating-doodle" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
        </div>
        <h2 className="font-gloria text-3xl md:text-4xl text-primary mb-2">Scrapbook Notes & Surprises</h2>
        <div className="inline-block rotate-1 bg-white/60 p-4 border-2 border-outline-variant/60 rounded">
          <p className="font-patrick text-xl text-on-surface-variant max-w-lg mx-auto">
            Every small step is a beautiful achievement. Let&apos;s celebrate all the sweet memories and milestones together.
          </p>
        </div>
      </section>

      {/* Secret Surprise Grid */}
      <section className="mb-12 select-none">
        <h3 className="font-gloria text-2xl text-primary text-center mb-6">Love Tapper Milestones & Surprises 🎁</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {milestones.map((m, idx) => {
            const isUnlocked = totalLoveTapsCombined >= m.target;
            const progress = Math.min(100, Math.round((totalLoveTapsCombined / m.target) * 100));
            const rotDeg = idx === 0 ? '-rotate-1' : idx === 1 ? 'rotate-1' : 'rotate-[-2deg]';

            return (
              <div 
                key={m.target}
                className={`doodle-card p-6 bg-white relative transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[340px] ${rotDeg} ${
                  isUnlocked ? 'border-primary shadow-md scale-[1.01]' : 'border-outline-variant/60'
                }`}
              >
                <div className="doodle-tape"></div>
                
                <div className="flex flex-col items-center text-center mt-3">
                  {isUnlocked ? (
                    <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center border-2 border-primary mb-3 animate-bounce">
                      <span className="material-symbols-outlined text-primary text-3xl">celebration</span>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center border-2 border-outline-variant relative mb-3">
                      <span className="material-symbols-outlined text-outline text-3xl">lock</span>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center border border-white text-[9px] text-white font-bold">
                        {progress}%
                      </div>
                    </div>
                  )}
                  <h4 className="font-gloria text-lg text-primary font-bold mb-1">{m.title}</h4>
                  <span className="font-patrick text-xs text-outline bg-surface-container px-2 py-0.5 border border-outline rounded mb-3 uppercase tracking-wider">
                    {m.target} Taps
                  </span>
                </div>

                <div className="flex-grow flex flex-col justify-center text-center px-1">
                  {isUnlocked ? (
                    <div 
                      onClick={handleRevealSurprise}
                      className="p-3 bg-secondary-container/30 rounded border-2 border-dashed border-secondary rotate-[-1deg] font-patrick text-base text-on-secondary-container shadow-sm cursor-pointer hover:rotate-0 transition-transform leading-relaxed"
                    >
                      <span className="font-bold">🎫 {m.voucher}</span>
                    </div>
                  ) : (
                    <div>
                      <p className="font-patrick text-base text-on-surface-variant leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-2 border-t border-dashed border-outline-variant/50">
                  <div className="flex justify-between items-center font-patrick text-xs text-outline mb-1">
                    <span>Progress: {totalLoveTapsCombined} / {m.target}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-surface-container h-2.5 border border-outline rounded-full p-0.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Input Section */}
      <section className="mb-12 max-w-2xl mx-auto">
        <div className="doodle-card p-6 md:p-8 bg-white relative">
          <div className="doodle-tape"></div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-patrick text-lg text-primary block mb-1">Title</label>
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="What's one good thing you did today?"
                className="w-full h-12 px-4 border-2 border-outline rounded bg-surface-container-lowest focus:outline-none focus:border-primary font-patrick text-lg"
                required
              />
            </div>
            
            <div>
              <label className="font-patrick text-lg text-primary block mb-1">Description / Details</label>
              <textarea 
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                placeholder="Add more details or write a sweet note..."
                rows={3}
                className="w-full p-4 border-2 border-outline rounded bg-surface-container-lowest focus:outline-none focus:border-primary font-patrick text-lg resize-none relative outline-none"
                style={{
                  backgroundImage: 'linear-gradient(#f1f1f1 1px, transparent 1px)',
                  backgroundSize: '100% 28px',
                  lineHeight: '28px',
                  paddingTop: '6px'
                }}
              />
            </div>

            <div>
              <label className="font-patrick text-lg text-primary block mb-1">Add a Photo / Stamp (Optional)</label>
              <div className="flex flex-col gap-3">
                {/* Upload Area */}
                <div className="relative">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant hover:border-primary/50 rounded-lg cursor-pointer bg-surface-container-lowest hover:bg-surface-container-low transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className="material-symbols-outlined text-4xl text-outline mb-2">upload_file</span>
                      <p className="font-patrick text-sm text-outline">
                        <span className="font-bold">Choose a file</span> or drag and drop
                      </p>
                      <p className="font-patrick text-xs text-outline-variant mt-1">PNG, JPG, GIF (Automatically optimized)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  
                  {isCompressing && (
                    <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-lg">
                      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="font-patrick text-sm text-primary mt-2">Optimizing image...</p>
                    </div>
                  )}
                </div>

                {/* Preview Area */}
                {imageUrl && (
                  <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-dashed border-outline-variant">
                    <div className="w-16 h-16 relative aspect-square rounded bg-surface-container overflow-hidden flex-shrink-0">
                      <img src={imageUrl} alt="Upload preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-patrick text-sm text-on-surface truncate">Selected Photo</p>
                      <p className="font-patrick text-xs text-outline truncate">Local file uploaded & optimized</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl(null)}
                      className="text-red-500 hover:text-red-700 font-patrick text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 px-1 select-none py-1">
              {['SelfCare', 'WorkWin', 'SmallJoy', 'Relationship', 'Gratitude'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagSelect(tag)}
                  className={`px-3 py-1 font-patrick text-sm border-2 border-outline rounded transition-all ${
                    activeTag === tag 
                      ? 'bg-primary text-white scale-105 font-bold' 
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            <button 
              type="submit"
              className="w-full h-12 bg-primary text-white font-gloria text-lg border-2 border-outline rounded squishy flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform font-bold"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              <span>Add to Scrapbook ✨</span>
            </button>
          </form>
        </div>
      </section>

      {/* Bento Grid List of Good Things */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goodThings.map((thing, index) => {
          const isWide = index % 4 === 0;
          const rotationClass = index % 3 === 0 ? '-rotate-1' : index % 3 === 1 ? 'rotate-1' : 'rotate-2';
          const pinOrTape = index % 2 === 0 ? <div className="doodle-pin"></div> : <div className="doodle-tape"></div>;

          return (
            <div 
              key={thing.id}
              className={`doodle-card p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 group bg-white flex flex-col justify-between ${
                isWide ? 'md:col-span-2' : ''
              } ${rotationClass}`}
            >
              {pinOrTape}

              {/* Postcard Stamp Image (Top Right) */}
              {thing.image_url && (
                <div className="absolute top-8 right-6 z-10 w-16 h-20 postcard-stamp rotate-[4deg] hover:rotate-0 hover:scale-105 transition-all duration-300 pointer-events-auto">
                  <img 
                    src={thing.image_url} 
                    alt="Stamp" 
                    className="w-full h-full object-cover rounded-[1px]" 
                  />
                  {/* Vintage cancellation postmark stamp */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 border border-dashed border-slate-700/35 rounded-full flex items-center justify-center -rotate-12 pointer-events-none select-none text-[6px] font-patrick text-slate-700/35 font-bold leading-none bg-white/20 backdrop-blur-[0.5px]">
                    <div className="text-center">
                      <div>VB LOVE</div>
                      <div className="text-[5px] mt-0.5">POST</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-center mb-4 text-outline font-patrick text-sm select-none">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                      </span>
                      <span>
                        {thing.time} - {new Date(thing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {currentUser && (thing.user_id === currentUser.id || thing.user_id === '00000000-0000-0000-0000-000000000000') && (
                        <button 
                          onClick={(e) => handleDelete(thing.id, e)}
                          className="text-red-400 hover:text-red-600 hover:scale-110 active:scale-95 transition-all p-1 ml-1"
                          aria-label="Delete note"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <h3 className={`font-gloria text-xl md:text-2xl text-primary mb-3 leading-snug ${thing.image_url ? 'pr-20' : ''}`}>
                    {thing.title}
                  </h3>
                  {thing.description && thing.description !== 'Logged as a daily accomplishment.' && (
                    <p className={`font-patrick text-lg text-on-surface-variant mb-4 ${thing.image_url ? 'pr-20' : ''}`}>
                      {thing.description}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 select-none pt-2 border-t border-dashed border-outline-variant/40">
                  {/* Bottom Left: Written by */}
                  <div className="font-patrick text-sm text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      edit_note
                    </span>
                    <span>Written by <span className="font-bold text-primary">{getAuthorName(thing.user_id)}</span></span>
                  </div>

                  {/* Bottom Right: Tags */}
                  <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      celebration
                    </span>
                    <span className="font-patrick text-xs bg-surface-container px-2 py-0.5 border border-outline rounded">
                      {thing.tags?.[0] || 'Win'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {goodThings.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white/50 border-2 border-dashed border-outline-variant/60 rounded p-8">
            <p className="font-patrick text-xl text-outline italic">No achievements logged today yet. You got this! 🌟</p>
          </div>
        )}
      </section>
    </main>
  );
}
