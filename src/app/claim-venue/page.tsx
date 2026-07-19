'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useFirestore, useAuth, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { CheckCircle, Loader2 } from 'lucide-react';

const inputClass =
  'w-full rounded-2xl border border-black/[0.08] bg-white px-5 py-4 text-[#1a1208] placeholder:text-[#1a1208]/30 focus:outline-none focus:border-[#c4762a]/40 transition-colors';

export default function ClaimVenuePage() {
  const [venueName, setVenueName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [offer, setOffer] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const firestore = useFirestore();
  const auth = useAuth();
  const { user } = useUser();

  const canSubmit =
    venueName.trim().length > 1 &&
    contactName.trim().length > 1 &&
    email.includes('@') &&
    offer.trim().length > 3 &&
    status !== 'sending';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !firestore) return;
    setStatus('sending');
    try {
      if (!user && auth) {
        await signInAnonymously(auth);
      }
      await addDoc(collection(firestore, 'venueSubmissions'), {
        venueName: venueName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        instagram: instagram.trim().replace(/^@/, ''),
        offer: offer.trim(),
        campaign: 'city2surf-2026',
        status: 'pending_review',
        createdAt: serverTimestamp(),
      });
      setStatus('done');
    } catch (err) {
      console.error('Venue submission failed:', err);
      setStatus('error');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#f2ece0] px-4 pb-32 pt-10 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {status !== 'done' && (
          <>
            <div className="text-center">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#c4762a]">
                City2Surf - Sun 9 Aug
              </span>
              <h1 className="mt-3 text-3xl font-black text-[#1a1208] leading-tight">
                Claim your venue.
              </h1>
              <p className="mt-3 text-sm text-[#1a1208]/60 leading-relaxed">
                90,000 finishers arrive at Bondi by 2pm. iykyk sends them to a
                hand-picked list of local venues. Free, no commission. Submit
                your race-day offer to lock your spot.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
              <input
                className={inputClass}
                placeholder="Venue name"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                maxLength={80}
              />
              <input
                className={inputClass}
                placeholder="Your name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                maxLength={80}
              />
              <input
                className={inputClass}
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={120}
              />
              <input
                className={inputClass}
                placeholder="Instagram handle (optional)"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                maxLength={60}
              />
              <textarea
                className={inputClass + ' min-h-[110px] resize-none'}
                placeholder="Your race-day offer, e.g. 15% off for City2Surf finishers"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                maxLength={200}
              />

              <Button
                type="submit"
                disabled={!canSubmit}
                className="mt-2 h-14 w-full rounded-2xl bg-[#c4762a] text-lg font-bold text-white shadow-lg shadow-[#c4762a]/20 hover:bg-[#b06824] disabled:opacity-40"
              >
                {status === 'sending' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Claim My Spot'
                )}
              </Button>

              {status === 'error' && (
                <p className="text-center text-sm font-medium text-red-600">
                  Something hiccuped. Please try again, or DM us on Instagram.
                </p>
              )}

              <p className="mt-2 text-center text-[11px] text-[#1a1208]/40 leading-relaxed">
                Zero cost - No commission - Curated list. Submissions reviewed
                personally before going live.
              </p>
            </form>
          </>
        )}

        {status === 'done' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-16 flex flex-col items-center text-center"
          >
            <CheckCircle className="h-16 w-16 text-[#c4762a]" strokeWidth={1.5} />
            <h2 className="mt-6 text-2xl font-black text-[#1a1208]">
              You&apos;re on the list.
            </h2>
            <p className="mt-3 text-sm text-[#1a1208]/60 leading-relaxed max-w-xs">
              We review every venue personally and will be in touch at your email
              before race day. See you Sunday 9 August.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
