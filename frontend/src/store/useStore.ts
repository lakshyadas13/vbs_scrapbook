import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  role: 'lakshya' | 'partner';
  couple_id: string | null;
  invite_code: string;
}

export interface CoupleSettings {
  couple_id: string;
  anniversary_date: string;
  partner1_name: string;
  partner2_name: string;
}

export interface Mood {
  id: string;
  user_id: string;
  mood_type: 'in_love' | 'miss_you' | 'dreaming' | 'angry';
}

export interface LoveLetter {
  id: string;
  couple_id: string;
  sender_id: string;
  category: 'sad' | 'miss_me' | 'motivation' | 'general';
  title: string;
  content: string;
  created_at: string;
}

export interface Memory {
  id: string;
  couple_id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string;
  memory_date: string;
  created_at: string;
}

export interface GoodThing {
  id: string;
  user_id: string;
  couple_id: string;
  title: string;
  description: string;
  time: string;
  tags: string[];
  image_url: string | null;
  created_at: string;
}

export interface Oopsie {
  id: string;
  user_id: string;
  couple_id: string;
  title: string;
  description: string;
  tags: string[];
  image_url: string | null;
  status: 'pending' | 'promised';
  created_at: string;
}

export interface Plan {
  id: string;
  couple_id: string;
  title: string;
  description: string;
  time: string;
  image_url: string | null;
  tags: string[];
  date: string;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  couple_id: string;
  task: string;
  is_completed: boolean;
  created_at: string;
}

interface LoveTap {
  user_id: string;
  count: number;
}

interface AppState {
  session: Session | null;
  currentUser: Profile | null;
  coupleSettings: CoupleSettings | null;
  moods: Mood[];
  loveTaps: LoveTap[];
  goodThings: GoodThing[];
  oopsies: Oopsie[];
  plans: Plan[];
  checklist: ChecklistItem[];
  loveLetters: LoveLetter[];
  memories: Memory[];
  isLoading: boolean;
  error: string | null;
  
  // Auth Actions
  setSession: (session: Session | null) => void;
  signUp: (email: string, password: string, displayName: string, role: 'lakshya' | 'partner') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  linkCouple: (partnerCode: string, role: 'lakshya' | 'partner') => Promise<void>;
  updateAnniversary: (date: string) => Promise<void>;
  
  // Data Actions
  fetchInitialData: () => Promise<void>;
  updateMood: (moodType: Mood['mood_type']) => Promise<void>;
  incrementLoveTaps: () => Promise<void>;
  
  // CRUD Operations
  addGoodThing: (thing: Omit<GoodThing, 'id' | 'user_id' | 'couple_id' | 'created_at'>) => Promise<void>;
  deleteGoodThing: (id: string) => Promise<void>;
  addOopsie: (oopsie: Omit<Oopsie, 'id' | 'couple_id' | 'status' | 'created_at'>) => Promise<void>;
  promiseOopsie: (id: string) => Promise<void>;
  deleteOopsie: (id: string) => Promise<void>;
  addPlan: (plan: Omit<Plan, 'id' | 'couple_id' | 'created_at'>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  addChecklistItem: (task: string) => Promise<void>;
  toggleChecklistItem: (id: string, completed: boolean) => Promise<void>;
  deleteChecklistItem: (id: string) => Promise<void>;
  addLoveLetter: (letter: Omit<LoveLetter, 'id' | 'sender_id' | 'couple_id' | 'created_at'>) => Promise<void>;
  deleteLoveLetter: (id: string) => Promise<void>;
  addMemory: (memory: Omit<Memory, 'id' | 'user_id' | 'couple_id' | 'created_at'>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  
  subscribeRealtime: () => () => void;
}

// Check if Supabase keys exist and are not placeholder values
const isSupabaseConfigured = 
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder';

// Mock local storage helpers for fallback mode
const getLocal = (key: string, fallback: any) => {
  if (typeof window === 'undefined') return fallback;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

const setLocal = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const removeLocal = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

const DEFAULT_COUPLE_SETTINGS: CoupleSettings = {
  couple_id: 'mock-couple-id',
  anniversary_date: '2025-04-01',
  partner1_name: 'Lakshya',
  partner2_name: 'Vishakha',
};

const MOCK_PROFILE: Profile = {
  id: '00000000-0000-0000-0000-000000000000',
  display_name: 'Lakshya',
  avatar_url: null,
  role: 'lakshya',
  couple_id: 'mock-couple-id',
  invite_code: 'LAKSHYA',
};

export const useStore = create<AppState>((set, get) => ({
  session: null,
  currentUser: getLocal('doodly_user', isSupabaseConfigured ? null : MOCK_PROFILE),
  coupleSettings: getLocal('doodly_settings', isSupabaseConfigured ? null : DEFAULT_COUPLE_SETTINGS),
  moods: getLocal('doodly_moods', [
    { id: '1', user_id: '00000000-0000-0000-0000-000000000000', mood_type: 'in_love' },
    { id: '2', user_id: '11111111-1111-1111-1111-111111111111', mood_type: 'miss_you' },
  ]),
  loveTaps: getLocal('doodly_love_taps', [
    { user_id: '00000000-0000-0000-0000-000000000000', count: 48 },
    { user_id: '11111111-1111-1111-1111-111111111111', count: 52 },
  ]),
  goodThings: getLocal('doodly_good_things', [
    {
      id: 'gt1',
      user_id: '00000000-0000-0000-0000-000000000000',
      couple_id: 'mock-couple-id',
      title: 'Dinner Date',
      description: 'The pasta was amazing at that new place.',
      time: '7:30 PM',
      tags: ['Dinner', 'Food'],
      image_url: null,
      created_at: new Date().toISOString(),
    },
    {
      id: 'gt2',
      user_id: 'partner',
      couple_id: 'mock-couple-id',
      title: 'Shared Laughs',
      description: 'That silly cat video you sent made my day.',
      time: '2:15 PM',
      tags: ['Laughter', 'Joy'],
      image_url: null,
      created_at: new Date().toISOString(),
    },
  ]),
  oopsies: getLocal('doodly_oopsies', [
    {
      id: 'o1',
      user_id: '00000000-0000-0000-0000-000000000000',
      couple_id: 'mock-couple-id',
      title: 'Forgot our check-in',
      description: "I was so busy with work that the time just slipped away. I promise it won't happen again!",
      tags: ['WorkBusy'],
      image_url: null,
      status: 'promised',
      created_at: new Date().toISOString(),
    },
  ]),
  plans: getLocal('doodly_plans', [
    {
      id: 'p1',
      couple_id: 'mock-couple-id',
      title: 'Morning Garden Walk',
      description: 'A peaceful stroll through the botanical gardens...',
      time: '08:00 AM',
      tags: ['Outdoor', 'Nature'],
      image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    },
  ]),
  checklist: getLocal('doodly_checklist', [
    { id: 'c1', couple_id: 'mock-couple-id', task: 'Book the rooftop table', is_completed: false, created_at: new Date().toISOString() },
    { id: 'c2', couple_id: 'mock-couple-id', task: 'Charge the camera', is_completed: true, created_at: new Date().toISOString() },
  ]),
  loveLetters: getLocal('doodly_letters', []),
  memories: getLocal('doodly_memories', []),
  isLoading: false,
  error: null,

  setSession: (session) => {
    set({ session });
    if (!session) {
      set({ currentUser: null, coupleSettings: null, loveLetters: [], memories: [] });
      removeLocal('doodly_user');
      removeLocal('doodly_settings');
      removeLocal('doodly_letters');
      removeLocal('doodly_memories');
    }
  },

  signUp: async (email, password, displayName, role) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role,
          },
        },
      });

      if (error) throw error;
      set({ session: data.session });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      set({ session: data.session });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      set({
        session: null,
        currentUser: null,
        coupleSettings: null,
        moods: [],
        loveTaps: [],
        goodThings: [],
        oopsies: [],
        plans: [],
        checklist: [],
        loveLetters: [],
        memories: [],
      });
      removeLocal('doodly_user');
      removeLocal('doodly_settings');
      removeLocal('doodly_moods');
      removeLocal('doodly_love_taps');
      removeLocal('doodly_good_things');
      removeLocal('doodly_oopsies');
      removeLocal('doodly_plans');
      removeLocal('doodly_checklist');
      removeLocal('doodly_letters');
      removeLocal('doodly_memories');
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  linkCouple: async (partnerCode, role) => {
    set({ isLoading: true, error: null });
    try {
      if (!isSupabaseConfigured) {
        // Mock linking
        const mockCoupleId = 'mock-linked-couple';
        const updatedUser: Profile = {
          ...MOCK_PROFILE,
          couple_id: mockCoupleId,
          role,
        };
        const updatedSettings: CoupleSettings = {
          couple_id: mockCoupleId,
          anniversary_date: '2025-04-01',
          partner1_name: role === 'lakshya' ? 'Lakshya' : 'Vishakha',
          partner2_name: role === 'partner' ? 'Vishakha' : 'Lakshya',
        };
        set({ currentUser: updatedUser, coupleSettings: updatedSettings });
        setLocal('doodly_user', updatedUser);
        setLocal('doodly_settings', updatedSettings);
        return;
      }

      const { data, error } = await supabase.rpc('link_couples', {
        partner_code: partnerCode,
        user_role: role,
      });

      if (error) throw error;

      // Reload initial data to fetch the new linked couple's entries
      await get().fetchInitialData();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAnniversary: async (date) => {
    const { coupleSettings } = get();
    if (!coupleSettings) return;

    const newSettings = { ...coupleSettings, anniversary_date: date };
    set({ coupleSettings: newSettings });
    setLocal('doodly_settings', newSettings);

    if (!isSupabaseConfigured) return;

    try {
      await supabase
        .from('couple_settings')
        .update({ anniversary_date: date })
        .eq('couple_id', coupleSettings.couple_id);
    } catch (err: any) {
      console.error('Error updating anniversary:', err);
    }
  },

  fetchInitialData: async () => {
    if (!isSupabaseConfigured) return;
    set({ isLoading: true, error: null });
    try {
      // 1. Fetch profiles matching current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ currentUser: null });
        return;
      }

      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileErr) throw profileErr;
      set({ currentUser: profile });
      setLocal('doodly_user', profile);

      if (!profile.couple_id) {
        set({ coupleSettings: null });
        return;
      }

      // 2. Fetch shared couple settings
      const { data: settings, error: settingsErr } = await supabase
        .from('couple_settings')
        .select('*')
        .eq('couple_id', profile.couple_id)
        .single();

      if (settingsErr) throw settingsErr;
      set({ coupleSettings: settings });
      setLocal('doodly_settings', settings);

      // 3. Fetch partners in couple
      const { data: partners, error: partnersErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('couple_id', profile.couple_id);

      if (partnersErr) throw partnersErr;
      const partnerIds = partners.map(p => p.id);

      // 4. Fetch moods of both partners
      const { data: moods } = await supabase
        .from('moods')
        .select('*')
        .in('user_id', partnerIds);
      
      if (moods) {
        set({ moods });
        setLocal('doodly_moods', moods);
      }

      // 5. Fetch love taps of both partners
      const { data: taps } = await supabase
        .from('love_taps')
        .select('*')
        .in('user_id', partnerIds);
      
      if (taps) {
        set({ loveTaps: taps });
        setLocal('doodly_love_taps', taps);
      }

      // 6. Fetch good things
      const { data: goodThings } = await supabase
        .from('good_things')
        .select('*')
        .eq('couple_id', profile.couple_id)
        .order('created_at', { ascending: false });

      if (goodThings) {
        set({ goodThings });
        setLocal('doodly_good_things', goodThings);
      }

      // 7. Fetch oopsies
      const { data: oopsies } = await supabase
        .from('oopsies')
        .select('*')
        .eq('couple_id', profile.couple_id)
        .order('created_at', { ascending: false });

      if (oopsies) {
        set({ oopsies });
        setLocal('doodly_oopsies', oopsies);
      }

      // 8. Fetch plans
      const { data: plans } = await supabase
        .from('plans')
        .select('*')
        .eq('couple_id', profile.couple_id)
        .order('time', { ascending: true });

      if (plans) {
        set({ plans });
        setLocal('doodly_plans', plans);
      }

      // 9. Fetch checklist items
      const { data: checklist } = await supabase
        .from('plans_checklist')
        .select('*')
        .eq('couple_id', profile.couple_id)
        .order('created_at', { ascending: true });

      if (checklist) {
        set({ checklist });
        setLocal('doodly_checklist', checklist);
      }

      // 10. Fetch love letters
      const { data: loveLetters } = await supabase
        .from('love_letters')
        .select('*')
        .eq('couple_id', profile.couple_id)
        .order('created_at', { ascending: false });

      if (loveLetters) {
        set({ loveLetters: loveLetters as LoveLetter[] });
        setLocal('doodly_letters', loveLetters);
      }

      // 11. Fetch memories
      const { data: memories } = await supabase
        .from('memories')
        .select('*')
        .eq('couple_id', profile.couple_id)
        .order('memory_date', { ascending: false });

      if (memories) {
        set({ memories: memories as Memory[] });
        setLocal('doodly_memories', memories);
      }

    } catch (err: any) {
      set({ error: err.message });
      console.error('Error fetching initial data:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateMood: async (moodType) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updatedMoods = get().moods.map((m) =>
      m.user_id === currentUser.id ? { ...m, mood_type: moodType } : m
    );
    if (!updatedMoods.some((m) => m.user_id === currentUser.id)) {
      updatedMoods.push({ id: Math.random().toString(), user_id: currentUser.id, mood_type: moodType });
    }
    set({ moods: updatedMoods });
    setLocal('doodly_moods', updatedMoods);

    if (!isSupabaseConfigured) return;

    try {
      await supabase
        .from('moods')
        .upsert(
          { user_id: currentUser.id, mood_type: moodType },
          { onConflict: 'user_id' }
        );
    } catch (err: any) {
      console.error('Error saving mood:', err);
    }
  },

  incrementLoveTaps: async () => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updatedTaps = get().loveTaps.map((t) =>
      t.user_id === currentUser.id ? { ...t, count: t.count + 1 } : t
    );
    if (!updatedTaps.some((t) => t.user_id === currentUser.id)) {
      updatedTaps.push({ user_id: currentUser.id, count: 1 });
    }
    set({ loveTaps: updatedTaps });
    setLocal('doodly_love_taps', updatedTaps);

    if (!isSupabaseConfigured) return;

    try {
      const current = get().loveTaps.find(t => t.user_id === currentUser.id);
      await supabase
        .from('love_taps')
        .upsert(
          { user_id: currentUser.id, count: (current?.count || 1) },
          { onConflict: 'user_id' }
        );
    } catch (err: any) {
      console.error('Error saving love taps:', err);
    }
  },

  addGoodThing: async (thing) => {
    const { currentUser } = get();
    if (!currentUser || !currentUser.couple_id) return;

    if (!isSupabaseConfigured) {
      const newThing: GoodThing = {
        ...thing,
        id: Math.random().toString(),
        user_id: currentUser.id,
        couple_id: currentUser.couple_id,
        created_at: new Date().toISOString(),
      };
      set({ goodThings: [newThing, ...get().goodThings] });
      setLocal('doodly_good_things', get().goodThings);
      return;
    }

    try {
      await supabase.from('good_things').insert({
        couple_id: currentUser.couple_id,
        user_id: currentUser.id,
        title: thing.title,
        description: thing.description,
        time: thing.time,
        tags: thing.tags,
        image_url: thing.image_url,
      });
    } catch (err: any) {
      console.error('Error saving good thing:', err);
    }
  },

  deleteGoodThing: async (id) => {
    const original = get().goodThings;
    set({ goodThings: original.filter(gt => gt.id !== id) });
    setLocal('doodly_good_things', get().goodThings);

    if (!isSupabaseConfigured) return;

    try {
      await supabase.from('good_things').delete().eq('id', id);
    } catch (err: any) {
      set({ goodThings: original });
      console.error('Error deleting good thing:', err);
    }
  },

  addOopsie: async (oopsie) => {
    const { currentUser } = get();
    if (!currentUser || !currentUser.couple_id) return;

    const oopsieUserId = oopsie.user_id || currentUser.id;

    if (!isSupabaseConfigured) {
      const newOopsie: Oopsie = {
        ...oopsie,
        user_id: oopsieUserId,
        id: Math.random().toString(),
        couple_id: currentUser.couple_id,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      set({ oopsies: [newOopsie, ...get().oopsies] });
      setLocal('doodly_oopsies', get().oopsies);
      return;
    }

    try {
      await supabase.from('oopsies').insert({
        couple_id: currentUser.couple_id,
        user_id: oopsieUserId,
        title: oopsie.title,
        description: oopsie.description,
        tags: oopsie.tags,
        image_url: oopsie.image_url,
        status: 'pending',
      });
    } catch (err: any) {
      console.error('Error saving oopsie:', err);
    }
  },

  promiseOopsie: async (id) => {
    set({
      oopsies: get().oopsies.map(o => o.id === id ? { ...o, status: 'promised' as const } : o),
    });
    setLocal('doodly_oopsies', get().oopsies);

    if (!isSupabaseConfigured) return;

    try {
      await supabase.from('oopsies').update({ status: 'promised' }).eq('id', id);
    } catch (err: any) {
      console.error('Error promising oopsie:', err);
    }
  },

  deleteOopsie: async (id) => {
    const original = get().oopsies;
    set({ oopsies: original.filter(o => o.id !== id) });
    setLocal('doodly_oopsies', get().oopsies);

    if (!isSupabaseConfigured) return;

    try {
      await supabase.from('oopsies').delete().eq('id', id);
    } catch (err: any) {
      set({ oopsies: original });
      console.error('Error deleting oopsie:', err);
    }
  },

  addPlan: async (plan) => {
    const { currentUser } = get();
    if (!currentUser || !currentUser.couple_id) return;

    if (!isSupabaseConfigured) {
      const newPlan: Plan = {
        ...plan,
        id: Math.random().toString(),
        couple_id: currentUser.couple_id,
        created_at: new Date().toISOString(),
      };
      set({ plans: [...get().plans, newPlan].sort((a, b) => a.time.localeCompare(b.time)) });
      setLocal('doodly_plans', get().plans);
      return;
    }

    try {
      await supabase.from('plans').insert({
        couple_id: currentUser.couple_id,
        title: plan.title,
        description: plan.description,
        time: plan.time,
        date: plan.date,
        tags: plan.tags,
        image_url: plan.image_url,
      });
    } catch (err: any) {
      console.error('Error saving plan:', err);
    }
  },

  deletePlan: async (id) => {
    const original = get().plans;
    set({ plans: original.filter(p => p.id !== id) });
    setLocal('doodly_plans', get().plans);

    if (!isSupabaseConfigured) return;

    try {
      await supabase.from('plans').delete().eq('id', id);
    } catch (err: any) {
      set({ plans: original });
      console.error('Error deleting plan:', err);
    }
  },

  addChecklistItem: async (task) => {
    const { currentUser } = get();
    if (!currentUser || !currentUser.couple_id) return;

    if (!isSupabaseConfigured) {
      const newItem: ChecklistItem = {
        id: Math.random().toString(),
        couple_id: currentUser.couple_id,
        task,
        is_completed: false,
        created_at: new Date().toISOString(),
      };
      set({ checklist: [...get().checklist, newItem] });
      setLocal('doodly_checklist', get().checklist);
      return;
    }

    try {
      await supabase.from('plans_checklist').insert({
        couple_id: currentUser.couple_id,
        task,
        is_completed: false,
      });
    } catch (err: any) {
      console.error('Error saving checklist item:', err);
    }
  },

  toggleChecklistItem: async (id, completed) => {
    set({
      checklist: get().checklist.map(c => c.id === id ? { ...c, is_completed: completed } : c),
    });
    setLocal('doodly_checklist', get().checklist);

    if (!isSupabaseConfigured) return;

    try {
      await supabase.from('plans_checklist').update({ is_completed: completed }).eq('id', id);
    } catch (err: any) {
      console.error('Error updating checklist item:', err);
    }
  },

  deleteChecklistItem: async (id) => {
    const original = get().checklist;
    set({ checklist: original.filter(c => c.id !== id) });
    setLocal('doodly_checklist', get().checklist);

    if (!isSupabaseConfigured) return;

    try {
      await supabase.from('plans_checklist').delete().eq('id', id);
    } catch (err: any) {
      set({ checklist: original });
      console.error('Error deleting checklist item:', err);
    }
  },

  addLoveLetter: async (letter) => {
    const { currentUser } = get();
    if (!currentUser || !currentUser.couple_id) return;

    if (!isSupabaseConfigured) {
      const newLetter: LoveLetter = {
        ...letter,
        id: Math.random().toString(),
        sender_id: currentUser.id,
        couple_id: currentUser.couple_id,
        created_at: new Date().toISOString(),
      };
      const updated = [newLetter, ...get().loveLetters];
      set({ loveLetters: updated });
      setLocal('doodly_letters', updated);
      return;
    }

    try {
      await supabase.from('love_letters').insert({
        couple_id: currentUser.couple_id,
        sender_id: currentUser.id,
        category: letter.category,
        title: letter.title,
        content: letter.content,
      });
    } catch (err: any) {
      console.error('Error saving love letter:', err);
    }
  },

  deleteLoveLetter: async (id) => {
    const original = get().loveLetters;
    set({ loveLetters: original.filter(l => l.id !== id) });
    setLocal('doodly_letters', get().loveLetters);

    if (!isSupabaseConfigured) return;

    try {
      await supabase.from('love_letters').delete().eq('id', id);
    } catch (err: any) {
      set({ loveLetters: original });
      console.error('Error deleting love letter:', err);
    }
  },

  addMemory: async (memory) => {
    const { currentUser } = get();
    if (!currentUser || !currentUser.couple_id) return;

    if (!isSupabaseConfigured) {
      const newMemory: Memory = {
        ...memory,
        id: Math.random().toString(),
        user_id: currentUser.id,
        couple_id: currentUser.couple_id,
        created_at: new Date().toISOString(),
      };
      const allMemories = [newMemory, ...get().memories];
      const sortedByCreated = [...allMemories].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const trimmed = sortedByCreated.slice(0, 5);
      trimmed.sort((a, b) => b.memory_date.localeCompare(a.memory_date));
      
      set({ memories: trimmed });
      setLocal('doodly_memories', trimmed);
      return;
    }

    try {
      const { data: existing, error: fetchErr } = await supabase
        .from('memories')
        .select('id, created_at')
        .eq('couple_id', currentUser.couple_id)
        .order('created_at', { ascending: true });

      if (fetchErr) throw fetchErr;

      if (existing && existing.length >= 5) {
        const numToDelete = existing.length - 5 + 1;
        const idsToDelete = existing.slice(0, numToDelete).map(m => m.id);
        const { error: deleteErr } = await supabase
          .from('memories')
          .delete()
          .in('id', idsToDelete);
        
        if (deleteErr) throw deleteErr;
        
        set({
          memories: get().memories.filter(m => !idsToDelete.includes(m.id))
        });
      }

      const { data: inserted, error: insertErr } = await supabase
        .from('memories')
        .insert({
          couple_id: currentUser.couple_id,
          user_id: currentUser.id,
          title: memory.title,
          description: memory.description,
          image_url: memory.image_url,
          memory_date: memory.memory_date,
        })
        .select();

      if (insertErr) throw insertErr;

      if (inserted && inserted.length > 0) {
        const newMemory = inserted[0] as Memory;
        const exists = get().memories.some(m => m.id === newMemory.id);
        if (!exists) {
          const updated = [newMemory, ...get().memories].sort((a, b) => b.memory_date.localeCompare(a.memory_date));
          set({ memories: updated });
          setLocal('doodly_memories', updated);
        }
      }
    } catch (err: any) {
      console.error('Error saving memory:', err);
    }
  },

  deleteMemory: async (id) => {
    const original = get().memories;
    set({ memories: original.filter(m => m.id !== id) });
    setLocal('doodly_memories', get().memories);

    if (!isSupabaseConfigured) return;

    try {
      await supabase.from('memories').delete().eq('id', id);
    } catch (err: any) {
      set({ memories: original });
      console.error('Error deleting memory:', err);
    }
  },

  subscribeRealtime: () => {
    if (!isSupabaseConfigured) return () => {};

    const channel = supabase
      .channel('doodly_changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        const { table, eventType, new: newRecord, old: oldRecord } = payload;
        const { currentUser } = get();
        if (!currentUser) return;
        
        if (table === 'moods') {
          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            const updatedMoods = get().moods.filter(m => m.user_id !== newRecord.user_id);
            updatedMoods.push(newRecord as Mood);
            set({ moods: updatedMoods });
            setLocal('doodly_moods', updatedMoods);
          }
        }
        
        else if (table === 'love_taps') {
          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            const updatedTaps = get().loveTaps.filter(t => t.user_id !== newRecord.user_id);
            updatedTaps.push(newRecord as LoveTap);
            set({ loveTaps: updatedTaps });
            setLocal('doodly_love_taps', updatedTaps);
          }
        }
        
        else if (table === 'good_things') {
          if (newRecord && (newRecord as any).couple_id !== currentUser.couple_id) return;
          if (eventType === 'INSERT') {
            const exists = get().goodThings.some(gt => gt.id === newRecord.id);
            if (!exists) {
              set({ goodThings: [newRecord as GoodThing, ...get().goodThings] });
              setLocal('doodly_good_things', get().goodThings);
            }
          } else if (eventType === 'UPDATE') {
            set({
              goodThings: get().goodThings.map(gt => gt.id === newRecord.id ? (newRecord as GoodThing) : gt),
            });
            setLocal('doodly_good_things', get().goodThings);
          } else if (eventType === 'DELETE') {
            set({
              goodThings: get().goodThings.filter(gt => gt.id !== oldRecord.id),
            });
            setLocal('doodly_good_things', get().goodThings);
          }
        }
        
        else if (table === 'oopsies') {
          if (newRecord && (newRecord as any).couple_id !== currentUser.couple_id) return;
          if (eventType === 'INSERT') {
            const exists = get().oopsies.some(o => o.id === newRecord.id);
            if (!exists) {
              set({ oopsies: [newRecord as Oopsie, ...get().oopsies] });
              setLocal('doodly_oopsies', get().oopsies);
            }
          } else if (eventType === 'UPDATE') {
            set({
              oopsies: get().oopsies.map(o => o.id === newRecord.id ? (newRecord as Oopsie) : o),
            });
            setLocal('doodly_oopsies', get().oopsies);
          } else if (eventType === 'DELETE') {
            set({
              oopsies: get().oopsies.filter(o => o.id !== oldRecord.id),
            });
            setLocal('doodly_oopsies', get().oopsies);
          }
        }
        
        else if (table === 'plans') {
          if (newRecord && (newRecord as any).couple_id !== currentUser.couple_id) return;
          if (eventType === 'INSERT') {
            const exists = get().plans.some(p => p.id === newRecord.id);
            if (!exists) {
              set({ plans: [...get().plans, newRecord as Plan].sort((a, b) => a.time.localeCompare(b.time)) });
              setLocal('doodly_plans', get().plans);
            }
          } else if (eventType === 'UPDATE') {
            set({
              plans: get().plans.map(p => p.id === newRecord.id ? (newRecord as Plan) : p).sort((a, b) => a.time.localeCompare(b.time)),
            });
            setLocal('doodly_plans', get().plans);
          } else if (eventType === 'DELETE') {
            set({
              plans: get().plans.filter(p => p.id !== oldRecord.id),
            });
            setLocal('doodly_plans', get().plans);
          }
        }
        
        else if (table === 'plans_checklist') {
          if (newRecord && (newRecord as any).couple_id !== currentUser.couple_id) return;
          if (eventType === 'INSERT') {
            const exists = get().checklist.some(c => c.id === newRecord.id);
            if (!exists) {
              set({ checklist: [...get().checklist, newRecord as ChecklistItem] });
              setLocal('doodly_checklist', get().checklist);
            }
          } else if (eventType === 'UPDATE') {
            set({
              checklist: get().checklist.map(c => c.id === newRecord.id ? (newRecord as ChecklistItem) : c),
            });
            setLocal('doodly_checklist', get().checklist);
          } else if (eventType === 'DELETE') {
            set({
              checklist: get().checklist.filter(c => c.id !== oldRecord.id),
            });
            setLocal('doodly_checklist', get().checklist);
          }
        }
        
        else if (table === 'love_letters') {
          if (newRecord && (newRecord as any).couple_id !== currentUser.couple_id) return;
          if (eventType === 'INSERT') {
            const exists = get().loveLetters.some(l => l.id === newRecord.id);
            if (!exists) {
              const updated = [newRecord as LoveLetter, ...get().loveLetters];
              set({ loveLetters: updated });
              setLocal('doodly_letters', updated);
            }
          } else if (eventType === 'DELETE') {
            const updated = get().loveLetters.filter(l => l.id !== oldRecord.id);
            set({ loveLetters: updated });
            setLocal('doodly_letters', updated);
          }
        }
        
        else if (table === 'memories') {
          if (newRecord && (newRecord as any).couple_id !== currentUser.couple_id) return;
          if (eventType === 'INSERT') {
            const exists = get().memories.some(m => m.id === newRecord.id);
            if (!exists) {
              const updated = [newRecord as Memory, ...get().memories].sort((a, b) => b.memory_date.localeCompare(a.memory_date));
              set({ memories: updated });
              setLocal('doodly_memories', updated);
            }
          } else if (eventType === 'DELETE') {
            const updated = get().memories.filter(m => m.id !== oldRecord.id);
            set({ memories: updated });
            setLocal('doodly_memories', updated);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
export default useStore;
