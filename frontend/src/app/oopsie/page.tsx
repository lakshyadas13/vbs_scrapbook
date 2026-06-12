'use client';

import { useState } from 'react';
import { useStore, Oopsie } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';

export default function OopsieCornerPage() {
  const { oopsies, addOopsie, promiseOopsie, deleteOopsie, currentUser, loveTaps } = useStore();
  const [isLogging, setIsLogging] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [oopsieOwner, setOopsieOwner] = useState<'me' | 'partner'>('me');

  const getOopsieLabel = (oopsUserId: string) => {
    if (oopsUserId === currentUser?.id) {
      return "oopsie by me";
    }
    return currentUser?.role === 'lakshya' ? "oopsie by her" : "oopsie by him";
  };

  // Stats calculation
  const totalOopsies = oopsies.length;
  const promisedOopsies = oopsies.filter(o => o.status === 'promised').length;
  const progressPercent = totalOopsies > 0 ? (promisedOopsies / totalOopsies) * 100 : 100;

  const handleLogClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerSparkles(e.clientX, e.clientY, 'oopsie');
    setIsLogging(!isLogging);
  };

  const handlePromiseClick = (oopsieId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    triggerSparkles(e.clientX, e.clientY, 'oopsie');
    promiseOopsie(oopsieId);
  };

  const handleDeleteClick = (oopsieId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerSparkles(e.clientX, e.clientY, 'oopsie');
    deleteOopsie(oopsieId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;

    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const partnerTap = loveTaps.find(t => t.user_id !== currentUser.id);
    const partnerId = partnerTap ? partnerTap.user_id : '11111111-1111-1111-1111-111111111111';

    addOopsie({
      title,
      description,
      tags,
      image_url: imageUrl.trim() || null,
      user_id: oopsieOwner === 'me' ? currentUser.id : partnerId,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setTagsStr('');
    setImageUrl('');
    setOopsieOwner('me');
    setIsLogging(false);

    // Trigger success sparkles
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    triggerSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'oopsie');
  };

  return (
    <main className="max-w-[1440px] mx-auto pt-24 px-4 pb-12 doodle-bg-grid min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center mb-12 gap-6 text-center">
        <div className="relative inline-block select-none">
          <h2 className="font-gloria text-4xl text-primary relative z-10">Oopsie Corner</h2>
          <div className="absolute -bottom-1 left-0 w-full h-3 bg-primary-container/40 -rotate-1 z-0"></div>
        </div>
        <p className="font-patrick text-lg text-on-surface-variant max-w-sm leading-relaxed">
          &quot;Everyone makes tiny mistakes sometimes. This is our safe space to track them and promise to do better. Every oopsie is just a chance for more love!&quot;
        </p>
        
        <div className="relative">
          <div className="absolute -top-4 -right-4 animate-bounce">
            <span className="material-symbols-outlined text-primary text-3xl opacity-60">cloud</span>
          </div>
          <button 
            onClick={handleLogClick}
            className="sticker-btn px-8 py-3 bg-secondary-container text-on-secondary-container rounded-sm transition-all text-xl font-bold"
          >
            {isLogging ? 'Cancel Entry' : 'Log New Oopsie +'}
          </button>
          <div className="absolute -bottom-3 -left-5 rotate-12">
            <span className="material-symbols-outlined text-tertiary text-2xl opacity-50">edit_note</span>
          </div>
        </div>
      </section>

      {/* Log Form Card (Collapsible) */}
      {isLogging && (
        <div className="max-w-xl mx-auto mb-12 taped-paper sketchy-border p-6 bg-white rotate-[0.5deg]">
          <h3 className="font-gloria text-xl text-primary mb-4">What happened?</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-patrick text-base text-primary block mb-1">Oopsie Title</label>
              <input 
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Forgot to text when I got home"
                className="w-full p-2.5 border-2 border-outline-variant/60 rounded focus:border-primary font-patrick text-lg"
                required
              />
            </div>
            <div>
              <label className="font-patrick text-base text-primary block mb-1">Details / Apology Note</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Write a sweet note about what happened..."
                className="w-full p-2.5 border-2 border-outline-variant/60 rounded focus:border-primary font-patrick text-lg min-h-[100px]"
              />
            </div>
            <div>
              <label className="font-patrick text-base text-primary block mb-1.5">Whose oopsie is this?</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setOopsieOwner('me')}
                  className={`sketchy-border px-5 py-2 font-patrick text-lg transition-all ${
                    oopsieOwner === 'me'
                      ? 'bg-primary text-white scale-102 font-bold'
                      : 'bg-white text-on-surface hover:bg-surface-container'
                  }`}
                >
                  🙋‍♂️ Mine (Me)
                </button>
                <button
                  type="button"
                  onClick={() => setOopsieOwner('partner')}
                  className={`sketchy-border px-5 py-2 font-patrick text-lg transition-all ${
                    oopsieOwner === 'partner'
                      ? 'bg-secondary text-white scale-102 font-bold'
                      : 'bg-white text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {currentUser?.role === 'lakshya' ? '🙋‍♀️ Hers (Vishakha)' : '🙋‍♂️ His (Lakshya)'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-patrick text-base text-primary block mb-1">Tags (comma separated)</label>
                <input 
                  type="text"
                  value={tagsStr}
                  onChange={e => setTagsStr(e.target.value)}
                  placeholder="LateReply, Busy"
                  className="w-full p-2.5 border-2 border-outline-variant/60 rounded focus:border-primary font-patrick text-lg"
                />
              </div>
              <div>
                <label className="font-patrick text-base text-primary block mb-1">Image URL (optional)</label>
                <input 
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 border-2 border-outline-variant/60 rounded focus:border-primary font-patrick text-lg"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="sticker-btn w-full py-2.5 bg-primary text-white text-lg font-bold"
            >
              Post Oopsie ✨
            </button>
          </form>
        </div>
      )}

      {/* Grid of Oopsies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Stats / Summary Card */}
        <div className="sketch-card p-6 flex flex-col justify-between bg-primary-container/20 relative">
          <div className="tape" style={{ background: 'rgba(186, 26, 26, 0.2)' }}></div>
          <div>
            <h3 className="font-gloria text-2xl text-primary mb-2">Oopsie Count</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-primary font-gloria">{String(totalOopsies).padStart(2, '0')}</span>
              <span className="text-on-surface-variant font-patrick text-lg">active scrapbook mistakes</span>
            </div>
          </div>
          <div className="relative mt-8">
            <div className="h-3 w-full bg-white border-2 border-outline rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="font-patrick text-xs text-outline">Promises kept: {promisedOopsies}/{totalOopsies}</span>
              <span className="font-patrick text-xs font-bold text-primary">Getting better! ✨</span>
            </div>
          </div>
        </div>

        {/* Dynamic Oopsie Cards */}
        {oopsies.map((oops) => {
          const isPending = oops.status === 'pending';

          return (
            <div key={oops.id} className="sketch-card flex flex-col bg-white overflow-hidden relative min-h-[320px]">
              <div className="tape"></div>

              {/* Chalkboard Badge */}
              <div className="absolute top-3 left-3 chalkboard-badge px-2.5 py-1 z-10 rotate-[-3deg] text-xs font-bold uppercase tracking-wider">
                {getOopsieLabel(oops.user_id)}
              </div>
              
              {currentUser && (
                <button 
                  onClick={(e) => handleDeleteClick(oops.id, e)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors p-1 z-10"
                  aria-label="Delete oopsie"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              )}
              
              {oops.image_url && (
                <div className="relative h-40 w-full overflow-hidden border-b-2 border-outline">
                  <img 
                    src={oops.image_url} 
                    alt={oops.title}
                    className="w-full h-full object-cover" 
                  />
                  <span className="material-symbols-outlined absolute bottom-2 right-2 text-white drop-shadow-md">water_drop</span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="material-symbols-outlined text-secondary text-3xl">
                      {isPending ? 'sentiment_dissatisfied' : 'sentiment_satisfied'}
                    </span>
                    <span 
                      className={`material-symbols-outlined text-primary transition-opacity ${
                        isPending ? 'opacity-35' : 'opacity-100'
                      }`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      favorite
                    </span>
                  </div>

                  <h3 className="font-gloria text-xl text-primary mb-2 line-clamp-1">{oops.title}</h3>
                  <p className="text-on-surface-variant font-patrick text-lg leading-snug mb-4">{oops.description}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {oops.tags.map((tag) => (
                      <span key={tag} className="border border-outline px-2.5 py-0.5 rounded-full text-xs font-patrick bg-surface-container">
                        #{tag}
                      </span>
                    ))}
                    <span className="border border-outline px-2.5 py-0.5 rounded-full text-xs font-patrick ml-auto">
                      {new Date(oops.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {isPending ? (
                    <button 
                      onClick={(e) => handlePromiseClick(oops.id, e)}
                      className="sticker-btn w-full py-2 bg-primary text-white text-lg font-bold hover:scale-[1.01] transition-transform"
                    >
                      I&apos;ll do better
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 py-2 bg-primary-container/20 border-2 border-dashed border-primary/30 text-primary font-patrick text-lg rounded font-bold">
                      <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                      Promised! ✨
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {oopsies.length === 0 && (
          <div className="col-span-full taped-paper sketchy-border p-8 text-center bg-white">
            <p className="font-patrick text-xl text-outline italic">No oopsies logged. Yay! We are doing amazing! 🎉</p>
          </div>
        )}
      </div>
    </main>
  );
}
