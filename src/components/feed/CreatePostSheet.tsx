'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, MapPin, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface CreatePostSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostSheet({ isOpen, onClose }: CreatePostSheetProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [caption, setCaption] = useState('');
  const [venueName, setVenueName] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore || !caption) return;

    setIsSubmitting(true);

    try {
      const postsRef = collection(firestore, 'posts');
      const postData = {
        caption,
        venueName,
        location,
        imageUrl: imageUrl.trim() || '',
        creatorId: user.uid,
        creatorEmail: user.email ?? '',
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        source: 'user_created',
      };

      // Initiate non-blocking write to Firestore
      addDocumentNonBlocking(postsRef, postData);
      
      toast({
        title: "Posted to IYKYK 🤙",
        description: "Your vibe is now live on the feed.",
      });
      
      // Reset form state
      setCaption('');
      setVenueName('');
      setLocation('');
      setImageUrl('');
      
      // Close the sheet
      onClose();
    } catch (err) {
      console.error('Post creation failed:', err);
      toast({
        variant: "destructive",
        title: "Failed to post. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Global Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          
          {/* Animated Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[101] max-h-[90vh] overflow-y-auto rounded-t-[32px] bg-[#f2ece0] p-6 shadow-2xl"
          >
            {/* Grab Handle */}
            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-black/10" />
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tighter text-[#1a1208]">NEW POST</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-black/5 text-[#1a1208]/40 hover:text-[#1a1208] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {!user ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#c4762a]/10">
                  <Loader2 className="h-8 w-8 text-[#c4762a]" />
                </div>
                <p className="text-lg font-bold text-[#1a1208]/60 mb-6">Sign in to share your vibe with the circle.</p>
                <Button 
                  className="bg-[#c4762a] hover:bg-[#b06824] text-white rounded-2xl h-14 w-full text-lg font-bold"
                  onClick={onClose}
                >
                  Got it
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 pb-8">
                {/* Caption Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Caption</label>
                    <span className={`text-[10px] font-bold ${caption.length >= 280 ? 'text-red-500' : 'text-[#1a1208]/30'}`}>
                      {caption.length}/280
                    </span>
                  </div>
                  <Textarea 
                    placeholder="What's the word? Share the mood..."
                    className="min-h-[120px] rounded-2xl border-black/[0.08] bg-white p-4 text-base text-[#1a1208] placeholder:text-[#1a1208]/20 focus:border-[#c4762a]/30 focus:ring-0"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={280}
                    required
                  />
                </div>

                {/* Optional Metadata Fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Venue Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1208]/20" size={18} />
                      <Input 
                        placeholder="e.g. Icebergs, Raw Bar"
                        className="pl-12 h-14 rounded-2xl border-black/[0.08] bg-white text-[#1a1208] placeholder:text-[#1a1208]/20"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1208]/20" size={18} />
                      <Input 
                        placeholder="e.g. Bondi Beach"
                        className="pl-12 h-14 rounded-2xl border-black/[0.08] bg-white text-[#1a1208] placeholder:text-[#1a1208]/20"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Image URL (optional)</label>
                    <div className="relative">
                      <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1208]/20" size={18} />
                      <Input 
                        placeholder="Paste an image URL"
                        className="pl-12 h-14 rounded-2xl border-black/[0.08] bg-white text-[#1a1208] placeholder:text-[#1a1208]/20"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-[#1a1208]/40 mt-1">
                      Paste a URL from Unsplash or leave blank
                    </p>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                  <Button 
                    type="submit"
                    disabled={isSubmitting || !caption.trim()}
                    className="h-16 w-full rounded-2xl bg-[#c4762a] text-lg font-black tracking-tighter text-white shadow-xl shadow-[#c4762a]/20 hover:bg-[#b06824] disabled:opacity-50 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 animate-spin" size={24} />
                    ) : (
                      "POST TO FEED 🤙"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
