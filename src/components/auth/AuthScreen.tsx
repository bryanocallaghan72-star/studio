'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  OAuthProvider,
  getRedirectResult,
  Auth
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function AuthScreen() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const [showEmailForm, setShowEmail] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for redirect result on mount (for mobile Google Sign-in)
  useEffect(() => {
    if (auth) {
      getRedirectResult(auth).then((result) => {
        if (result?.user) {
          handleAuthSuccess(result.user.uid, result.user.email, result.user.displayName, result.user.photoURL);
        }
      }).catch((err) => {
        setError(err.message);
      });
    }
  }, [auth]);

  const handleAuthSuccess = async (uid: string, email: string | null, displayName: string | null, photoURL: string | null) => {
    if (!firestore) return;
    
    try {
      const userRef = doc(firestore, 'users', uid);
      await setDoc(userRef, {
        email,
        username: displayName || email?.split('@')[0] || `user_${uid.substring(0, 5)}`,
        avatarUrl: photoURL || null,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(), // merge: true handles this
        isCreator: false,
      }, { merge: true });

      router.push('/discover');
    } catch (err: any) {
      console.error("Profile sync error:", err);
      setError("Successfully signed in, but couldn't sync profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setError(null);
    setIsLoading(true);
    
    const provider = new GoogleAuthProvider();
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

    try {
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        await handleAuthSuccess(result.user.uid, result.user.email, result.user.displayName, result.user.photoURL);
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setError(null);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      await handleAuthSuccess(result.user.uid, result.user.email, result.user.displayName, null);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05014a] flex flex-col items-center justify-start overflow-y-auto pb-12">
      {/* Top Branding */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mt-16 px-6"
      >
        <h1 className="text-white font-black text-5xl tracking-tighter text-center">iykyk</h1>
        <p className="text-white/50 text-sm tracking-[0.2em] uppercase text-center mt-3">
          Your Cultural Concierge · Bondi
        </p>
      </motion.div>

      {/* Auth Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm px-6 mt-12"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-[32px] p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-white font-bold text-2xl">Join the inner circle</h2>
            <p className="text-white/50 text-sm mt-2">
              Your insider guide to Bondi.
            </p>
          </div>

          <div className="space-y-3">
            {/* Google Button */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white text-[#1a1208] font-bold rounded-2xl py-4 flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-3.3 3.28-8.19 3.28-13.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#05014a]/50 px-2 text-white/30 tracking-widest">or</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showEmailForm ? (
              <motion.button 
                key="email-link"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEmail(true)}
                className="w-full text-white/50 text-sm font-medium underline underline-offset-4 hover:text-white transition-colors"
              >
                Continue with Email
              </motion.button>
            ) : (
              <motion.form 
                key="email-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleEmailAuth}
                className="space-y-3"
              >
                <input 
                  type="email" 
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
                {isSignUp && (
                  <input 
                    type="password" 
                    placeholder="Confirm password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                )}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#c4762a] text-white font-black text-lg rounded-2xl py-4 shadow-xl shadow-[#c4762a]/20 transition-transform active:scale-95 flex items-center justify-center"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setError(null);
                    setIsSignUp(!isSignUp);
                  }}
                  className="w-full text-white/40 text-xs mt-2 hover:text-white/60 transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-xs text-center mt-6 bg-red-400/10 p-3 rounded-xl border border-red-400/20"
            >
              {error}
            </motion.p>
          )}
        </div>

        <p className="text-white/20 text-[10px] font-medium text-center mt-8 px-8 leading-relaxed uppercase tracking-wider">
          By continuing you agree to our <br/>
          <span className="underline">Terms of Service</span> & <span className="underline">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}
