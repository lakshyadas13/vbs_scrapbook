'use client';

import { useState, useEffect } from 'react';
import { useStore, LoveLetter } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';
import Link from 'next/link';

const CATEGORY_MAP = {
  sad: {
    label: "Open when you're sad 🥺",
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100/50',
    icon: 'sentiment_very_dissatisfied',
    textColor: 'text-blue-700'
  },
  miss_me: {
    label: 'Open when you miss me 😭',
    color: 'bg-rose-50 border-rose-200 hover:bg-rose-100/50',
    icon: 'volunteer_activism',
    textColor: 'text-rose-700'
  },
  motivation: {
    label: 'Open when you need motivation 💪',
    color: 'bg-amber-50 border-amber-200 hover:bg-amber-100/50',
    icon: 'insights',
    textColor: 'text-amber-700'
  },
  general: {
    label: 'Open anytime 💖',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100/50',
    icon: 'drafts',
    textColor: 'text-purple-700'
  }
};

export default function LoveLettersPage() {
  const { currentUser, coupleSettings, loveLetters, addLoveLetter, deleteLoveLetter, isLoading } = useStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'vault' | 'write'>('vault');

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'sad' | 'miss_me' | 'motivation' | 'general'>('general');

  // Active Letter Modal
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [openedLetterIdToday, setOpenedLetterIdToday] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedDate = localStorage.getItem('doodly_last_letter_opened_date');
      const savedId = localStorage.getItem('doodly_today_opened_letter_id');
      if (savedDate === new Date().toDateString() && savedId) {
        setOpenedLetterIdToday(savedId);
      } else {
        localStorage.removeItem('doodly_last_letter_opened_date');
        localStorage.removeItem('doodly_today_opened_letter_id');
      }
    }
  }, []);

  const handleCreateLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    triggerSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'good_things');

    await addLoveLetter({
      title: title.trim(),
      content: content.trim(),
      category
    });

    setTitle('');
    setContent('');
    setCategory('general');
    setActiveTab('vault');
  };

  const handleOpenLetter = (letter: LoveLetter, e: React.MouseEvent) => {
    const isMyOwn = letter.sender_id === currentUser?.id;
    triggerSparkles(e.clientX, e.clientY, 'tapper');

    if (isMyOwn) {
      // User can open their own letters anytime
      setSelectedLetter(letter);
      return;
    }

    // Checking 1-letter-per-day restriction for partner-written letters
    const todayStr = new Date().toDateString();
    const lastOpenedDate = localStorage.getItem('doodly_last_letter_opened_date');
    const todayOpenedId = localStorage.getItem('doodly_today_opened_letter_id');

    if (lastOpenedDate === todayStr && todayOpenedId && todayOpenedId !== letter.id) {
      alert("🕰️ You can only open one love letter from your partner per day. Let's savor the sweet words! Come back tomorrow.");
      return;
    }

    // Set opened today details
    localStorage.setItem('doodly_last_letter_opened_date', todayStr);
    localStorage.setItem('doodly_today_opened_letter_id', letter.id);
    setOpenedLetterIdToday(letter.id);
    setSelectedLetter(letter);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this letter? This cannot be undone.")) {
      await deleteLoveLetter(id);
      if (selectedLetter?.id === id) {
        setSelectedLetter(null);
      }
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen doodle-bg-dots flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-patrick text-xl text-primary mt-4">Unlocking Love Vault...</p>
      </div>
    );
  }

  const partnerName = currentUser?.role === 'lakshya'
    ? coupleSettings?.partner2_name || 'Vishakha'
    : coupleSettings?.partner1_name || 'Lakshya';

  // Group letters
  const myLetters = loveLetters.filter(l => l.sender_id === currentUser?.id);
  const partnerLetters = loveLetters.filter(l => l.sender_id !== currentUser?.id);

  return (
    <main className="max-w-5xl mx-auto px-4 pt-24 pb-12 doodle-bg-dots min-h-screen">
      <div className="flex flex-col items-center mb-8 text-center">
        <span className="material-symbols-outlined text-rose-500 text-5xl animate-bounce mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
          mail
        </span>
        <h2 className="font-gloria text-4xl text-primary">Love Letter Vault</h2>
        <p className="font-patrick text-lg text-on-surface-variant max-w-lg mt-2">
          A secret digital drawer to hide handwritten-style letters for {partnerName}. Fill their day with warmth!
        </p>

        {/* Tab Switchers */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setActiveTab('vault')}
            className={`sketchy-border px-5 py-2 font-patrick text-lg transition-all ${
              activeTab === 'vault'
                ? 'bg-primary text-white scale-105 rotate-[-1deg]'
                : 'bg-white text-on-surface hover:bg-surface-container'
            }`}
          >
            📬 Opened & Closed Vault
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`sketchy-border px-5 py-2 font-patrick text-lg transition-all ${
              activeTab === 'write'
                ? 'bg-secondary text-white scale-105 rotate-[1deg]'
                : 'bg-white text-on-surface hover:bg-surface-container'
            }`}
          >
            ✍️ Write a Letter
          </button>
        </div>
      </div>

      {activeTab === 'vault' ? (
        <div className="space-y-12">
          {/* Letters from Partner */}
          <div className="taped-paper sketchy-border p-6 bg-white">
            <h3 className="font-gloria text-2xl text-primary mb-4 flex items-center gap-2">
              <span>💌 Letters from {partnerName}</span>
              <span className="font-patrick text-sm text-outline-variant">({partnerLetters.length} total)</span>
            </h3>
            
            {partnerLetters.length === 0 ? (
              <p className="font-patrick text-lg text-outline italic text-center py-8">
                No letters from {partnerName} in the vault yet. Send them a nudge to write one!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {partnerLetters.map((letter) => {
                  const isOpenedToday = openedLetterIdToday === letter.id;
                  const cat = CATEGORY_MAP[letter.category];
                  return (
                    <div
                      key={letter.id}
                      onClick={(e) => handleOpenLetter(letter, e)}
                      className={`sketchy-border p-5 cursor-pointer relative transition-all duration-300 transform hover:scale-[1.03] ${cat.color} flex flex-col justify-between min-h-[160px]`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`material-symbols-outlined ${cat.textColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                            {cat.icon}
                          </span>
                          <span className="font-patrick text-xs text-outline bg-white px-2 py-0.5 rounded border border-outline/30">
                            {new Date(letter.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-gloria text-lg text-on-surface line-clamp-1">{letter.title}</h4>
                        <p className="font-patrick text-sm text-on-surface-variant mt-1 line-clamp-2 italic">
                          Click to open...
                        </p>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-patrick text-xs text-outline">{cat.label}</span>
                        {isOpenedToday ? (
                          <span className="text-emerald-600 font-patrick text-xs font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">drafts</span> Opened
                          </span>
                        ) : (
                          <span className="text-rose-500 font-patrick text-xs font-bold flex items-center gap-0.5 animate-pulse">
                            <span className="material-symbols-outlined text-xs">lock</span> Sealed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Letters Written by User */}
          <div className="taped-paper sketchy-border p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-gloria text-2xl text-secondary flex items-center gap-2">
                <span>✉️ Letters Written by You</span>
                <span className="font-patrick text-sm text-outline-variant">({myLetters.length} total)</span>
              </h3>
            </div>

            {myLetters.length === 0 ? (
              <p className="font-patrick text-lg text-outline italic text-center py-8">
                You haven&apos;t written any love letters yet. Switch to the Write tab to draft one!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {myLetters.map((letter) => {
                  const cat = CATEGORY_MAP[letter.category];
                  return (
                    <div
                      key={letter.id}
                      onClick={(e) => handleOpenLetter(letter, e)}
                      className={`sketchy-border p-5 cursor-pointer relative transition-all duration-300 transform hover:scale-[1.03] bg-white border-outline-variant hover:border-secondary flex flex-col justify-between min-h-[160px]`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>
                            mark_as_unread
                          </span>
                          <span className="font-patrick text-xs text-outline">
                            {new Date(letter.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-gloria text-lg text-on-surface line-clamp-1">{letter.title}</h4>
                        <p className="font-patrick text-sm text-on-surface-variant mt-1 line-clamp-2">
                          {letter.content}
                        </p>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-patrick text-xs text-outline">{cat.label}</span>
                        <button
                          onClick={(e) => handleDelete(letter.id, e)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                          title="Delete Letter"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Write Letter Form */
        <div className="max-w-2xl mx-auto taped-paper sketchy-border p-6 bg-white">
          <h3 className="font-gloria text-2xl text-primary mb-4">Write a Sealed Letter ✉️</h3>
          <p className="font-patrick text-base text-on-surface-variant mb-6">
            Choose a folder category. Your partner can only open one partner-written letter per day, so choose your timing and title wisely!
          </p>

          <form onSubmit={handleCreateLetter} className="space-y-6">
            {/* Category selection */}
            <div>
              <label className="font-patrick text-lg text-primary block mb-2">Open when your partner is...</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.keys(CATEGORY_MAP) as Array<keyof typeof CATEGORY_MAP>).map((key) => {
                  const active = category === key;
                  const item = CATEGORY_MAP[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      className={`sketchy-border p-3 flex items-center gap-3 transition-all text-left ${
                        active 
                          ? 'bg-primary text-white scale-102 border-primary font-bold' 
                          : 'bg-white hover:bg-surface-container text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {item.icon}
                      </span>
                      <div>
                        <p className="font-patrick text-base leading-tight">{item.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="font-patrick text-lg text-primary block mb-1">Letter Title / Envelope Label</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                placeholder="E.g., Read this when you feel down about work"
                required
              />
            </div>

            {/* Handwritten Paper Styling */}
            <div>
              <label className="font-patrick text-lg text-primary block mb-1">Your Handwritten Letter</label>
              <div className="relative border-2 border-slate-400/80 rounded bg-[#fdfaf2] p-6 shadow-inner min-h-[250px]">
                {/* Lined Paper Margins */}
                <div className="absolute left-10 top-0 bottom-0 w-[1.5px] bg-red-400/60"></div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full h-full pl-8 bg-transparent font-patrick text-lg resize-none outline-none text-slate-800 leading-7 relative z-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 255, 0.08) 1px, transparent 1px)',
                    backgroundSize: '100% 28px',
                    lineHeight: '28px',
                    paddingTop: '4px'
                  }}
                  placeholder="Dearest... I'm writing this to remind you that..."
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="sticker-btn w-full py-3 bg-primary text-white text-xl active:translate-y-1 transition-all mt-4 font-gloria"
            >
              Seal and Store in Vault 💌
            </button>
          </form>
        </div>
      )}

      {/* LETTER READ DIALOG */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl my-auto animate-scaleUp transform rotate-[-0.5deg]">
            {/* Sealed/Handwritten sliding-out letter wrapper */}
            <div className="sketchy-border bg-[#FCF8EE] p-8 shadow-2xl relative border-2 border-amber-900/30">
              {/* Notebook binding dots */}
              <div className="absolute top-2 left-0 right-0 flex justify-center gap-4 opacity-40">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-slate-800"></div>
                ))}
              </div>

              {/* Red margin line */}
              <div className="absolute left-12 top-0 bottom-0 w-[1.5px] bg-red-400/50"></div>

              {/* Envelope back styling detail */}
              <div className="absolute -top-3 right-6 bg-rose-200 text-rose-700 border-2 border-rose-300 font-patrick text-xs px-3 py-1 rotate-3 shadow-sm rounded-sm">
                {CATEGORY_MAP[selectedLetter.category].label}
              </div>

              <div className="pl-8 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-patrick text-sm text-outline font-bold">
                    From: {selectedLetter.sender_id === currentUser?.id ? 'You' : partnerName}
                  </span>
                  <span className="font-patrick text-sm text-outline">
                    Dated: {new Date(selectedLetter.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-gloria text-2xl text-slate-800 mb-6 border-b border-dashed border-slate-300 pb-2">
                  {selectedLetter.title}
                </h3>

                <div 
                  className="font-patrick text-xl text-slate-700 leading-8 whitespace-pre-wrap min-h-[180px]"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '100% 32px',
                    lineHeight: '32px',
                  }}
                >
                  {selectedLetter.content}
                </div>
                
                <div className="mt-8 text-right font-gloria text-lg text-primary italic border-t border-dashed border-slate-300 pt-4">
                  With love, selalu.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                {selectedLetter.sender_id === currentUser?.id && (
                  <button
                    onClick={(e) => handleDelete(selectedLetter.id, e)}
                    className="sketchy-border px-4 py-2 bg-red-100 text-red-700 font-patrick text-base hover:bg-red-200 transition-colors"
                  >
                    Delete Letter
                  </button>
                )}
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="sketchy-border px-5 py-2 bg-primary text-white font-patrick text-base hover:bg-primary/95 transition-all"
                >
                  Fold & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
