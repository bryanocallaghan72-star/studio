'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, MapPin, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useStorage } from '@/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CreatePostSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCATIONS = ['Bondi Beach', 'Bondi', 'North Bondi'];

export function CreatePostSheet({ isOpen, onClose }: CreatePostSheetProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const [caption, setCaption] = useState('');
  const [venueName, setVenueName] = useState('');
  const [location, setLocation] = useState('Bondi Beach');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore || !caption) return;

    setIsSubmitting(true);
    let finalImageUrl = '';

    try {
      // 1. Handle image upload if a file was picked
      if (imageFile) {
        setIsUploading(true);
        const storagePath = `posts/${user.uid}/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, storagePath);
        
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
        setIsUploading(false);
      }

      // 2. Prepare post data
      const postsRef = collection(firestore, 'posts');
      const postData = {
        caption,
        venueName,
        location,
        imageUrl: finalImageUrl,
        creatorId: user.uid,
        creatorEmail: user.email ?? '',
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        source: 'user_created',
      };

      // 3. Initiate non-blocking write to Firestore
      addDocumentNonBlocking(postsRef, postData);
      
      toast({
        title: "Posted to IYKYK 🤙",
        description: "Your vibe is now live on the feed.",
      });
      
      // Reset form state
      setCaption('');
      setVenueName('');
      setLocation('Bondi Beach');
      setImageFile(null);
      setImagePreview('');
      
      // Close the sheet
      onClose();
    } catch (err) {
      console.error('Post creation failed:', err);
      setIsUploading(false);
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

                {/* Photo Picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-[#c4762a]">
                    Photo (optional)
                  </label>
                  
                  <label className="flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-[#c4762a]/30 bg-white cursor-pointer hover:border-[#c4762a]/60 transition-colors overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Camera className="h-8 w-8 text-[#c4762a]/40" />
                        <span className="text-xs text-[#1a1208]/40 font-medium">
                          Tap to add a photo
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImagePick}
                    />
                  </label>
                </div>

                {/* Metadata Fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Venue Name (optional)</label>
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
                    <div className="flex gap-2">
                      {LOCATIONS.map((loc) => (
                        <button key={loc} type="button"
                          onClick={() => setLocation(loc)}
                          className={cn(
                            "flex-1 h-12 rounded-2xl text-sm font-bold transition-all",
                            location === loc
                              ? "bg-[#c4762a] text-white"
                              : "bg-white text-[#1a1208]/60 border border-black/[0.08]"
                          )}>
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                  <Button 
                    type="submit"
                    disabled={isSubmitting || isUploading || !caption.trim()}
                    className="h-16 w-full rounded-2xl bg-[#c4762a] text-lg font-black tracking-tighter text-white shadow-xl shadow-[#c4762a]/20 hover:bg-[#b06824] disabled:opacity-50 transition-all active:scale-[0.98]"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={24} />
                        UPLOADING...
                      </>
                    ) : isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={24} />
                        POSTING...
                      </>
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
