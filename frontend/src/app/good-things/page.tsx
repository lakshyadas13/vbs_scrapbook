'use client';

import { useState } from 'react';
import { useStore, GoodThing } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';

export default function GoodThingsPage() {
  const { goodThings, addGoodThing, deleteGoodThing, currentUser, loveTaps } = useStore();
  const [inputText, setInputText] = useState('');
  const [activeTag, setActiveTag] = useState<string>('SmallJoy');

  // Secret Surprise Logic
  const totalLoveTapsCombined = loveTaps.reduce((acc, curr) => acc + curr.count, 0);
  const targetTaps = 100;
  const isSurpriseUnlocked = totalLoveTapsCombined >= targetTaps;
  const surpriseProgress = Math.min(100, Math.round((totalLoveTapsCombined / targetTaps) * 100));

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
      description: 'Logged as a daily accomplishment.',
      time: timeStr,
      tags: [activeTag],
      image_url: null,
    });

    setInputText('');
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
        <h2 className="font-gloria text-3xl md:text-4xl text-primary mb-2">Proud of You</h2>
        <div className="inline-block rotate-1 bg-white/60 p-4 border-2 border-outline-variant/60 rounded">
          <p className="font-patrick text-xl text-on-surface-variant max-w-lg mx-auto">
            Every small step is a beautiful achievement. Let&apos;s celebrate all the good things you did today.
          </p>
        </div>
      </section>

      {/* Secret Surprise Box */}
      <section className="mb-12 max-w-2xl mx-auto select-none">
        <div className={`doodle-card p-6 md:p-8 bg-white relative transition-all duration-500 overflow-hidden ${
          isSurpriseUnlocked ? 'border-primary shadow-lg scale-[1.02] rotate-1' : 'border-outline-variant/80 -rotate-1'
        }`}>
          <div className="doodle-tape"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {isSurpriseUnlocked ? (
                <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center border-2 border-primary animate-bounce">
                  <span className="material-symbols-outlined text-primary text-5xl">celebration</span>
                </div>
              ) : (
                <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center border-2 border-outline-variant relative">
                  <span className="material-symbols-outlined text-outline text-5xl">lock</span>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center border border-white text-[10px] text-white font-bold">
                    {surpriseProgress}%
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="font-gloria text-2xl text-primary mb-2">Secret Surprise Envelope 🎁</h3>
              
              {isSurpriseUnlocked ? (
                <div>
                  <p className="font-patrick text-lg text-secondary font-bold mb-4">
                    🎉 UNLOCKED! You achieved {totalLoveTapsCombined} love taps together! 🎉
                  </p>
                  <div 
                    onClick={handleRevealSurprise}
                    className="p-4 bg-secondary-container/40 rounded border-2 border-dashed border-secondary rotate-[-1deg] font-patrick text-xl text-on-secondary-container shadow-sm cursor-pointer hover:rotate-0 transition-transform"
                  >
                    🎫 <span className="font-bold">SECRET COUPLE VOUCHER:</span> &apos;One Free Late Night Ice Cream Run &amp; Infinite Back Rubs.&apos; Valid forever! ✨
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-patrick text-lg text-on-surface-variant mb-4">
                    This envelope contains a special surprise. Keep tapping the heart together in the Tapper page to unlock it!
                  </p>
                  <div>
                    <div className="flex justify-between items-center font-patrick text-sm text-outline mb-1">
                      <span>Taps Goal: {totalLoveTapsCombined} / {targetTaps}</span>
                      <span>{surpriseProgress}%</span>
                    </div>
                    <div className="w-full bg-surface-container h-3 border border-outline rounded-full p-0.5 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-500" 
                        style={{ width: `${surpriseProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section className="mb-12 max-w-2xl mx-auto">
        <div className="doodle-card p-6 md:p-8 bg-white relative">
          <div className="doodle-tape"></div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="relative flex flex-col sm:flex-row gap-3">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="What's one good thing you did today?"
                className="flex-grow h-14 px-6 border-2 border-outline rounded bg-surface-container-lowest focus:outline-none focus:border-primary font-patrick text-xl"
                required
              />
              <button 
                type="submit"
                className="h-14 px-6 bg-primary-container text-on-primary-container font-gloria text-lg border-2 border-outline rounded squishy flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform font-bold"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                <span>Add</span>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 px-1 select-none">
              {['SelfCare', 'WorkWin', 'SmallJoy', 'Relationship', 'Gratitude'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagSelect(tag)}
                  className={`px-3 py-1 font-patrick text-base border-2 border-outline rounded transition-all ${
                    activeTag === tag 
                      ? 'bg-primary text-white scale-105' 
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
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
                    </div>
                    {currentUser && (thing.user_id === currentUser.id || thing.user_id === '00000000-0000-0000-0000-000000000000') && (
                      <button 
                        onClick={(e) => handleDelete(thing.id, e)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Delete note"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    )}
                  </div>
                  <h3 className="font-gloria text-xl md:text-2xl text-primary mb-3 leading-snug">
                    {thing.title}
                  </h3>
                  {thing.description && thing.description !== 'Logged as a daily accomplishment.' && (
                    <p className="font-patrick text-lg text-on-surface-variant mb-4">
                      {thing.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-primary mt-4 select-none">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    celebration
                  </span>
                  <span className="font-patrick text-sm bg-surface-container px-2 py-0.5 border border-outline rounded">
                    {thing.tags?.[0] || 'Win'}
                  </span>
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
