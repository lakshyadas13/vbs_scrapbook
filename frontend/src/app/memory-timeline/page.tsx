'use client';

import { useState, useEffect } from 'react';
import { useStore, Memory } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';
import { compressImage } from '@/utils/image';
import Link from 'next/link';

const PHOTO_PRESETS = [
  { label: '🌸 Cherry Blossom Walk', url: 'https://images.unsplash.com/photo-1522383225653-ed1111816951?auto=format&fit=crop&w=600&q=80' },
  { label: '☕ Cafe Date', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80' },
  { label: '🌅 Beach Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { label: '🏔️ Mountain Adventure', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80' },
  { label: '🍦 Sweet Treat', url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80' }
];

export default function MemoryTimelinePage() {
  const { currentUser, coupleSettings, memories, addMemory, deleteMemory, isLoading } = useStore();
  const [mounted, setMounted] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().split('T')[0]);
  const [isCompressing, setIsCompressing] = useState(false);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    triggerSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'good_things');

    await addMemory({
      title: title.trim(),
      description: description.trim() || null,
      image_url: imageUrl.trim(),
      memory_date: memoryDate
    });

    setTitle('');
    setDescription('');
    setImageUrl('');
    setMemoryDate(new Date().toISOString().split('T')[0]);
    setShowAddForm(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this memory polaroid?")) {
      triggerSparkles(e.clientX, e.clientY, 'oopsie');
      await deleteMemory(id);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen doodle-bg-dots flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-patrick text-xl text-primary mt-4">Assembling Polaroid Memories...</p>
      </div>
    );
  }

  // Calculate "On This Day" memories (same month and day, but different year)
  const today = new Date();
  const todayMonth = today.getMonth(); // 0-indexed
  const todayDay = today.getDate();

  const onThisDayMemories = memories.filter((memory) => {
    const memDate = new Date(memory.memory_date);
    // Check if month and date are the same, and year is different
    return (
      memDate.getMonth() === todayMonth &&
      memDate.getDate() === todayDay &&
      memDate.getFullYear() !== today.getFullYear()
    );
  });

  const partnerName = currentUser?.role === 'lakshya'
    ? coupleSettings?.partner2_name || 'Vishakha'
    : coupleSettings?.partner1_name || 'Lakshya';

  return (
    <main className="max-w-6xl mx-auto px-4 pt-24 pb-12 doodle-bg-dots min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <span className="material-symbols-outlined text-secondary text-5xl animate-spin-slow mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
          camera
        </span>
        <h2 className="font-gloria text-4xl text-primary">Our Memory Timeline</h2>
        <p className="font-patrick text-lg text-on-surface-variant max-w-lg mt-2">
          Pin memories as wobbly polaroid pictures on our scrapbook board. Relive the golden moments of our journey!
        </p>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="sketchy-border mt-6 px-6 py-2.5 bg-primary text-white font-patrick text-lg hover:scale-102 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">{showAddForm ? 'close' : 'add_a_photo'}</span>
          {showAddForm ? 'Cancel Panning' : 'Pin a New Polaroid'}
        </button>
      </div>

      {/* "On This Day" Spotlight Banner */}
      {onThisDayMemories.length > 0 && (
        <section className="mb-10 px-2 animate-scaleUp">
          <div className="bg-gradient-to-r from-amber-50 to-rose-50 border-2 border-dashed border-rose-300 rounded p-6 shadow-md relative overflow-hidden">
            {/* Sparkles */}
            <span className="material-symbols-outlined absolute top-2 right-4 text-rose-400 text-3xl animate-pulse">auto_awesome</span>
            <span className="material-symbols-outlined absolute bottom-2 left-4 text-amber-400 text-2xl animate-pulse">auto_awesome</span>
            
            <h3 className="font-gloria text-2xl text-rose-600 mb-2 flex items-center gap-2">
              <span>📅 On This Day Spotlight!</span>
            </h3>
            <p className="font-patrick text-lg text-on-surface-variant mb-6">
              Look back at what you and {partnerName} were doing on this exact date in past years!
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center items-center">
              {onThisDayMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="polaroid mx-auto bg-white scale-98 rotate-[-1deg] border border-outline-variant/60 shadow-md max-w-[260px] w-full"
                >
                  {/* Tape */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-5 bg-amber-200/50 border border-amber-300/40 rotate-[3deg] z-10 shadow-sm"></div>
                  
                  <div className="relative aspect-square overflow-hidden bg-surface-container">
                    <img
                      src={memory.image_url}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 pt-3 text-center">
                    <span className="font-patrick text-xs text-rose-500 font-bold block mb-1">
                      {new Date(memory.memory_date).getFullYear()} ({today.getFullYear() - new Date(memory.memory_date).getFullYear()} years ago)
                    </span>
                    <h4 className="font-gloria text-base text-on-surface line-clamp-1">{memory.title}</h4>
                    <p className="font-patrick text-xs text-outline line-clamp-2 mt-1">{memory.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Add Memory Form */}
      {showAddForm && (
        <section className="mb-10 max-w-xl mx-auto taped-paper sketchy-border p-6 bg-white transition-all animate-scaleUp">
          <h3 className="font-gloria text-2xl text-primary mb-4">Add Polaroid Polaroid 📸</h3>
          
          <form onSubmit={handleCreateMemory} className="space-y-4">
            <div>
              <label className="font-patrick text-lg text-primary block mb-1">Memory Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                placeholder="Give this polaroid a sweet name..."
                required
              />
            </div>

            <div>
              <label className="font-patrick text-lg text-primary block mb-1">Memory Date</label>
              <input
                type="date"
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
                className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                required
              />
            </div>

            <div>
              <label className="font-patrick text-lg text-primary block mb-1">Photo / Image</label>
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
                      <p className="font-patrick text-sm text-on-surface truncate">Selected Image</p>
                      <p className="font-patrick text-xs text-outline truncate">
                        {imageUrl.startsWith('data:') ? 'Local file uploaded' : 'Hosted Image URL'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-red-500 hover:text-red-700 font-patrick text-sm px-2 py-1 rounded"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* OR divider */}
                <div className="flex items-center my-1 select-none">
                  <div className="flex-grow border-t border-dashed border-outline-variant/60"></div>
                  <span className="font-patrick text-xs text-outline px-3 font-semibold">OR USE AN IMAGE URL</span>
                  <div className="flex-grow border-t border-dashed border-outline-variant/60"></div>
                </div>

                {/* URL Input */}
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                  placeholder="Paste image URL here..."
                />
              </div>

              {/* Preset Shortcuts */}
              <div className="mt-2.5">
                <span className="font-patrick text-sm text-outline block mb-1.5">No photo URL? Use one of our sweet presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PHOTO_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`px-2.5 py-1 text-xs border border-dashed rounded font-patrick hover:bg-primary-container/20 transition-all ${
                        imageUrl === preset.url
                          ? 'bg-primary-container text-on-primary-container border-primary font-bold'
                          : 'bg-white text-outline border-outline-variant'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="font-patrick text-lg text-primary block mb-1">Caption / Short Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 doodle-border bg-surface-container-lowest font-patrick text-lg resize-none"
                placeholder="Describe this golden memory..."
              />
            </div>

            <button
              type="submit"
              className="sticker-btn w-full py-3 bg-primary text-white text-xl active:translate-y-1 transition-all mt-2 font-gloria"
            >
              Pin to Scrapbook ✨
            </button>
          </form>
        </section>
      )}

      {/* Polaroid Scrapbook Board Grid */}
      <section className="taped-paper sketchy-border p-6 md:p-8 bg-amber-50/20 shadow-inner min-h-[500px]">
        <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-dashed border-outline-variant/60">
          <h3 className="font-gloria text-2xl text-slate-800 flex items-center gap-1.5">
            <span>📌 Polaroid Scrapbook Board</span>
          </h3>
          <span className="font-patrick text-base text-outline italic">
            ({memories.length}/5 pinned{memories.length > 0 && ", swipe to see all 📸"})
          </span>
        </div>

        {memories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-outline text-6xl mb-3">add_a_photo</span>
            <p className="font-patrick text-xl text-outline italic max-w-xs">
              No polaroid pins on the board yet. Tap Pin a New Polaroid to pin your first memory!
            </p>
          </div>
        ) : (
          <div className="relative w-full overflow-x-auto pt-12 pb-8 px-6 scrollbar-hide">
            {/* The Clothesline Rope */}
            <div className="absolute top-[40px] left-0 right-0 h-[4px] clothes-rope z-0"></div>

            {/* Hanging Polaroids List */}
            <div className="flex flex-row justify-start md:justify-center items-start gap-8 min-w-max md:min-w-0 pb-6">
              {memories.map((memory, index) => {
                // Create slight wobbly rotations
                const rotations = ['rotate-[-1.5deg]', 'rotate-[1.2deg]', 'rotate-[-0.8deg]', 'rotate-[2deg]', 'rotate-[-2.3deg]', 'rotate-[0.5deg]'];
                const rotation = rotations[index % rotations.length];
                
                const isMyOwn = memory.user_id === currentUser?.id;

                return (
                  <div
                    key={memory.id}
                    className={`polaroid bg-white border border-outline-variant/40 hover:scale-[1.03] active:scale-98 transition-all duration-300 relative ${rotation} group cursor-default w-[220px] flex-shrink-0 mt-2`}
                  >
                    {/* Wooden Clothespin / Peg clipping the polaroid to the rope */}
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-3.5 h-8 wood-peg z-10 shadow-sm"></div>
                    
                    {/* Photo area */}
                    <div className="relative aspect-square overflow-hidden bg-surface-container select-none">
                      <img
                        src={memory.image_url}
                        alt={memory.title}
                        className="w-full h-full object-cover"
                        draggable="false"
                      />
                      
                      {/* Delete button (displays on hover) */}
                      {isMyOwn && (
                        <button
                          onClick={(e) => handleDelete(memory.id, e)}
                          className="absolute bottom-2 right-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                          title="Delete Memory"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      )}
                    </div>
                    
                    {/* Label area */}
                    <div className="p-4 pt-3 text-center">
                      <span className="font-patrick text-xs text-outline block mb-1">
                        {new Date(memory.memory_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <h4 className="font-gloria text-base text-on-surface line-clamp-1">{memory.title}</h4>
                      {memory.description && (
                        <p className="font-patrick text-sm text-on-surface-variant line-clamp-2 mt-1 italic leading-tight">
                          &ldquo;{memory.description}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
