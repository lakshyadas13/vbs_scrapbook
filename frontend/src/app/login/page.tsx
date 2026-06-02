'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { 
    currentUser, 
    signUp, 
    signIn, 
    linkCouple, 
    signOut,
    isLoading, 
    error 
  } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup' | 'link'>('signin');
  
  // Auth Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'lakshya' | 'partner'>('lakshya');
  
  // Couple Link Field
  const [partnerCode, setPartnerCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Automatically transition to 'link' mode if logged in but not linked
  useEffect(() => {
    if (currentUser) {
      if (currentUser.couple_id) {
        router.push('/');
      } else {
        setMode('link');
      }
    }
  }, [currentUser, router]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    triggerSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'dashboard');

    try {
      if (mode === 'signup') {
        await signUp(email, password, displayName, role);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerCode.trim()) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    triggerSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'dashboard');

    try {
      await linkCouple(partnerCode.trim().toUpperCase(), role);
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  const copyInviteCode = () => {
    if (!currentUser?.invite_code) return;
    navigator.clipboard.writeText(currentUser.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 pt-28 pb-12 flex items-center justify-center min-h-[85vh] doodle-bg-dots">
      <div className="taped-paper sketchy-border p-8 max-w-md w-full relative bg-white transition-all duration-300">
        <span className="material-symbols-outlined absolute -top-5 -left-3 text-tertiary/40 text-4xl floating-heart">favorite</span>
        <span className="material-symbols-outlined absolute top-1/2 -right-5 text-secondary/30 text-3xl doodle-sparkle">auto_awesome</span>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-400 rounded font-patrick text-red-700 text-base">
            ⚠️ {error}
          </div>
        )}

        {/* LOADING INDICATOR */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center rounded">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-patrick text-lg text-primary mt-2">Loading magic...</p>
          </div>
        )}

        {/* MODE 1: SIGN IN */}
        {mode === 'signin' && (
          <>
            <h2 className="font-gloria text-3xl text-primary text-center mb-2">Welcome Back</h2>
            <p className="font-patrick text-lg text-on-surface-variant text-center mb-6">Open your shared scrapbook memories.</p>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                  placeholder="e.g. sweetheart@love.com"
                  required
                />
              </div>

              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Secret Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit"
                className="sticker-btn w-full py-3 bg-primary text-white text-xl active:translate-y-1 transition-all mt-4"
              >
                Sign In 💌
              </button>

              <p className="font-patrick text-center text-lg mt-4 text-on-surface-variant">
                New to Scrapbook?{' '}
                <button 
                  type="button" 
                  onClick={() => setMode('signup')}
                  className="text-primary underline font-bold"
                >
                  Create an Account
                </button>
              </p>
            </form>
          </>
        )}

        {/* MODE 2: SIGN UP */}
        {mode === 'signup' && (
          <>
            <h2 className="font-gloria text-3xl text-primary text-center mb-2">Join Scrapbook</h2>
            <p className="font-patrick text-lg text-on-surface-variant text-center mb-6">Build a shared space for the two of you.</p>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Sweet Nickname</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                  placeholder="e.g. Cutie Pie"
                  required
                />
              </div>

              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Role Choice</label>
                <div className="grid grid-cols-2 gap-4 my-2">
                  <button 
                    type="button"
                    onClick={() => setRole('lakshya')}
                    className={`p-2 border-2 rounded font-patrick text-lg ${
                      role === 'lakshya' 
                        ? 'border-primary bg-primary-container/20 font-bold' 
                        : 'border-outline-variant/40'
                    }`}
                  >
                    Lakshya
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('partner')}
                    className={`p-2 border-2 rounded font-patrick text-lg ${
                      role === 'partner' 
                        ? 'border-secondary bg-secondary-container/20 font-bold' 
                        : 'border-outline-variant/40'
                    }`}
                  >
                    Vishakha
                  </button>
                </div>
              </div>

              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                  placeholder="e.g. sweetheart@love.com"
                  required
                />
              </div>

              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Create Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
              </div>

              <button 
                type="submit"
                className="sticker-btn w-full py-3 bg-primary text-white text-xl active:translate-y-1 transition-all mt-4"
              >
                Sign Up 💌
              </button>

              <p className="font-patrick text-center text-lg mt-4 text-on-surface-variant">
                Already have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => setMode('signin')}
                  className="text-primary underline font-bold"
                >
                  Sign In
                </button>
              </p>
            </form>
          </>
        )}

        {/* MODE 3: COUPLE LINKING PANEL */}
        {mode === 'link' && currentUser && (
          <>
            <h2 className="font-gloria text-3xl text-primary text-center mb-2">Connect Hearts</h2>
            <p className="font-patrick text-lg text-on-surface-variant text-center mb-6">
              Link up with your partner to start editing your shared scrapbook together.
            </p>
            
            <div className="space-y-6">
              {/* Share invite code card */}
              <div className="p-4 bg-primary-container/20 rounded border-2 border-primary border-dashed text-center">
                <span className="font-patrick text-sm text-outline block uppercase tracking-wider">Your Invite Code</span>
                <span className="font-gloria text-3xl text-primary block py-2 select-all">{currentUser.invite_code}</span>
                <button 
                  type="button"
                  onClick={copyInviteCode}
                  className="sticker-btn py-1.5 px-4 bg-primary text-white font-patrick text-base font-bold"
                >
                  {copied ? 'Copied! ✨' : 'Copy Code 📋'}
                </button>
              </div>

              {/* Enter partner code form */}
              <form onSubmit={handleLinkSubmit} className="space-y-4 pt-4 border-t border-dashed border-outline-variant/60">
                <div>
                  <label className="font-patrick text-lg text-primary block mb-1">Partner&apos;s Invite Code</label>
                  <input 
                    type="text" 
                    value={partnerCode}
                    onChange={(e) => setPartnerCode(e.target.value)}
                    className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg uppercase text-center font-bold tracking-widest placeholder:normal-case placeholder:font-normal placeholder:tracking-normal"
                    placeholder="Enter 6-digit code"
                    required
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="font-patrick text-base text-primary block mb-1">Confirm Your Role</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setRole('lakshya')}
                      className={`p-2 border-2 rounded font-patrick text-sm ${
                        role === 'lakshya' 
                          ? 'border-primary bg-primary-container/20 font-bold' 
                          : 'border-outline-variant/40'
                      }`}
                    >
                      Lakshya
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole('partner')}
                      className={`p-2 border-2 rounded font-patrick text-sm ${
                        role === 'partner' 
                          ? 'border-secondary bg-secondary-container/20 font-bold' 
                          : 'border-outline-variant/40'
                      }`}
                    >
                      Vishakha
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="sticker-btn w-full py-3 bg-secondary text-white text-xl active:translate-y-1 transition-all mt-4"
                >
                  Link Hearts! 💞
                </button>
              </form>

              <button 
                type="button"
                onClick={() => signOut()}
                className="w-full text-center text-outline underline font-patrick text-lg hover:text-primary transition-colors mt-2"
              >
                Sign Out / Start Over
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
