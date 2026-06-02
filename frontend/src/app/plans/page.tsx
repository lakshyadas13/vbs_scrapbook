'use client';

import { useState } from 'react';
import { useStore, Plan } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';

export default function PlansPage() {
  const { 
    plans, 
    checklist, 
    addPlan, 
    deletePlan,
    addChecklistItem, 
    toggleChecklistItem,
    deleteChecklistItem
  } = useStore();
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  
  // New Plan form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tagsStr, setTagsStr] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // New Checklist item state
  const [newChecklistTask, setNewChecklistTask] = useState('');

  // Relationship Goals calculation
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter((c) => c.is_completed).length;
  const relationshipProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const handleFabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerSparkles(e.clientX, e.clientY, 'plans');
    setIsAddingPlan(!isAddingPlan);
  };

  const handleCheckboxToggle = (id: string, currentStatus: boolean, e: React.MouseEvent<HTMLDivElement>) => {
    triggerSparkles(e.clientX, e.clientY, 'plans');
    toggleChecklistItem(id, !currentStatus);
  };

  const handleAddChecklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTask.trim()) return;
    addChecklistItem(newChecklistTask.trim());
    setNewChecklistTask('');
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addPlan({
      title,
      description,
      time,
      date,
      tags,
      image_url: imageUrl.trim() || null,
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setTime('08:00 AM');
    setDate(new Date().toISOString().split('T')[0]);
    setTagsStr('');
    setImageUrl('');
    setIsAddingPlan(false);

    // Trigger sparkles
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    triggerSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'plans');
  };

  const handleDeletePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerSparkles(e.clientX, e.clientY, 'plans');
    deletePlan(id);
  };

  const handleDeleteChecklistItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerSparkles(e.clientX, e.clientY, 'plans');
    deleteChecklistItem(id);
  };

  return (
    <main className="pt-24 pb-32 px-4 max-w-lg mx-auto doodle-bg-dots min-h-screen">
      {/* Header Section */}
      <section className="mb-8 relative select-none">
        <div className="absolute -top-4 -right-2 text-primary opacity-30 floating-doodle">
          <span className="material-symbols-outlined text-4xl">star</span>
        </div>
        <div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-primary-container text-on-primary-container font-patrick text-sm mb-2 transform -rotate-1">
            Today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <h2 className="font-gloria text-3xl text-primary">Today&apos;s Plans</h2>
          <p className="font-patrick text-lg text-on-surface-variant mt-2">
            Sweet moments scheduled just for us. Every plan is a memory in the making.
          </p>
        </div>
        
        {/* Weather Card */}
        <div className="mt-4 flex justify-start">
          <div className="sketchy-card px-4 py-2 flex items-center gap-3 bg-white transform rotate-1 select-none">
            <span className="material-symbols-outlined text-primary floating-doodle">cloud</span>
            <div>
              <p className="font-patrick text-xs text-on-surface-variant">Weather</p>
              <p className="font-patrick text-lg font-bold text-primary">22°C &amp; Sunny</p>
            </div>
          </div>
        </div>
      </section>

      {/* Add Plan Form Card (Collapsible) */}
      {isAddingPlan && (
        <div className="sketchy-card p-6 bg-white rotate-[-0.5deg] mb-8 relative z-30">
          <div className="tape"></div>
          <h3 className="font-gloria text-xl text-primary mb-4">Add Couple Plan</h3>
          
          <form onSubmit={handlePlanSubmit} className="space-y-4">
            <div>
              <label className="font-patrick text-base text-primary block mb-1">Plan Title</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cooking Dinner Together"
                className="w-full p-2 border-2 border-outline-variant/60 rounded font-patrick text-lg"
                required
              />
            </div>
            <div>
              <label className="font-patrick text-base text-primary block mb-1">Time &amp; Date</label>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 08:30 PM"
                  className="p-2 border-2 border-outline-variant/60 rounded font-patrick text-lg"
                  required
                />
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="p-2 border-2 border-outline-variant/60 rounded font-patrick text-lg"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-patrick text-base text-primary block mb-1">Details</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about what we'll do..."
                className="w-full p-2 border-2 border-outline-variant/60 rounded font-patrick text-lg min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-patrick text-base text-primary block mb-1">Tags (comma separated)</label>
                <input 
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="Dinner, Fun"
                  className="w-full p-2 border-2 border-outline-variant/60 rounded font-patrick text-lg"
                />
              </div>
              <div>
                <label className="font-patrick text-base text-primary block mb-1">Image URL (optional)</label>
                <input 
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 border-2 border-outline-variant/60 rounded font-patrick text-lg"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="sticker-btn w-full py-2.5 bg-primary text-white text-lg font-bold"
            >
              Add to Timeline ✨
            </button>
          </form>
        </div>
      )}

      {/* Scrapbook Timeline */}
      <div className="space-y-4">
        {plans.map((plan, index) => {
          const rotationClass = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
          const isLast = index === plans.length - 1;

          return (
            <div key={plan.id} className="relative group">
              <div className={`sketchy-card p-4 transform ${rotationClass} hover:rotate-0 transition-transform duration-300 bg-white relative`}>
                <div className="tape"></div>
                
                <button 
                  onClick={(e) => handleDeletePlan(plan.id, e)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors p-1 z-20"
                  aria-label="Delete plan"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>

                <div className="flex flex-col gap-4">
                  {plan.image_url && (
                    <div className="w-full aspect-video rounded border-2 border-outline-variant overflow-hidden bg-surface-container-low">
                      <img 
                        className="w-full h-full object-cover" 
                        src={plan.image_url} 
                        alt={plan.title} 
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                      <span className="font-patrick text-base text-primary font-bold">{plan.time}</span>
                    </div>
                    <h3 className="font-gloria text-xl text-primary pr-8">{plan.title}</h3>
                    <p className="font-patrick text-lg text-on-surface-variant leading-relaxed mb-4">
                      {plan.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {plan.tags.map((tag) => (
                        <span key={tag} className="px-3 py-0.5 rounded border border-primary/30 text-primary font-patrick text-sm bg-primary-container/10">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hand-drawn arrow/divider down to next card */}
              {!isLast && (
                <div className="hand-drawn-arrow select-none">
                  <span className="material-symbols-outlined">south</span>
                </div>
              )}
            </div>
          );
        })}

        {plans.length === 0 && (
          <div className="taped-paper sketchy-border p-8 text-center bg-white">
            <p className="font-patrick text-xl text-outline italic">No plans logged for today. Tap the bottom right + to add one!</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="sketchy-card p-6 bg-surface-container-lowest">
          <h4 className="font-gloria text-lg text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">edit_note</span> Summary
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between font-patrick text-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">timer</span>
                <span>Total Plans Today</span>
              </div>
              <span className="font-bold">{plans.length} items</span>
            </div>
            <div className="flex items-center justify-between font-patrick text-lg border-b border-dashed border-outline pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">auto_awesome</span>
                <span>Surprise Bonus</span>
              </div>
              <span className="font-bold text-secondary">+1</span>
            </div>
            <div className="pt-2 select-none">
              <div className="flex justify-between items-center mb-1 font-patrick text-base text-primary">
                <span>Relationship Goals</span>
                <span>{relationshipProgress}%</span>
              </div>
              <div className="w-full bg-surface-container h-3 border border-outline rounded-full p-0.5 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500" 
                  style={{ width: `${relationshipProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="sketchy-card p-6 bg-white relative overflow-hidden">
          <div className="absolute top-2 right-2 text-outline-variant opacity-20 select-none">
            <span className="material-symbols-outlined text-6xl">draw</span>
          </div>
          
          <h4 className="font-gloria text-lg text-primary mb-4">Things to do!</h4>
          
          {/* Checklist Items list */}
          <div className="space-y-3 font-patrick text-lg">
            {checklist.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between group py-1"
              >
                <div 
                  onClick={(e) => handleCheckboxToggle(item.id, item.is_completed, e)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <div className={`w-6 h-6 border-2 border-primary flex items-center justify-center rounded sketchy-border transition-colors ${
                    item.is_completed ? 'bg-primary-container/40' : 'hover:bg-primary-container/20'
                  }`}>
                    {item.is_completed && (
                      <span className="material-symbols-outlined text-xs text-primary font-bold">check</span>
                    )}
                  </div>
                  <span className={`transition-all ${
                    item.is_completed ? 'line-through text-on-surface-variant/60' : 'hover:text-primary'
                  }`}>
                    {item.task}
                  </span>
                </div>
                
                <button 
                  onClick={(e) => handleDeleteChecklistItem(item.id, e)}
                  className="text-red-400 hover:text-red-600 transition-colors p-1 opacity-0 group-hover:opacity-100"
                  aria-label="Delete checklist item"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            ))}
          </div>

          {/* Add Todo Checklist item inline form */}
          <form onSubmit={handleAddChecklistSubmit} className="mt-6 flex gap-2 border-t-2 border-dashed border-outline-variant/60 pt-4">
            <input 
              type="text" 
              value={newChecklistTask}
              onChange={(e) => setNewChecklistTask(e.target.value)}
              placeholder="Add checklist item..." 
              className="flex-1 px-3 py-1 border border-outline rounded font-patrick text-base"
              required
            />
            <button 
              type="submit" 
              className="sticker-btn px-4 py-1 bg-secondary text-white font-bold font-patrick text-base"
            >
              Add
            </button>
          </form>
        </div>

        {/* Quote */}
        <div className="p-6 text-center italic font-patrick text-lg text-on-primary-fixed-variant relative select-none">
          <span className="material-symbols-outlined absolute -top-2 left-0 opacity-20 text-4xl">format_quote</span>
          &quot;The best thing to hold onto in life is each other.&quot;
          <p className="mt-2 text-sm font-normal">— Audrey Hepburn</p>
        </div>
      </div>

      {/* Floating Add Plan Action Button */}
      <button 
        onClick={handleFabClick}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg squishy-button z-40 flex items-center justify-center sketchy-border border-2 border-white"
        aria-label="Toggle Add Plan"
      >
        <span className="material-symbols-outlined text-2xl font-bold">add</span>
      </button>
    </main>
  );
}
