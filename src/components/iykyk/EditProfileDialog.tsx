'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useStorage } from '@/firebase/storage';
import { Loader2, Camera, User, Image as ImageIcon } from 'lucide-react';
import { WithId } from '@/firebase/firestore/use-collection';
import Image from 'next/image';

type UserProfileData = WithId<{ 
  username: string; 
  bio?: string;
  avatarUrl?: string | null;
  bannerUrl?: string;
}>;

type EditProfileDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userProfile: UserProfileData;
};

export function EditProfileDialog({ isOpen, onOpenChange, userProfile }: EditProfileDialogProps) {
  const firestore = useFirestore();
  const storage = useStorage();
  
  const [username, setUsername] = useState(userProfile.username);
  const [bio, setBio] = useState(userProfile.bio || '');
  
  // File state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  
  // Preview state
  const [avatarPreview, setAvatarPreview] = useState<string>(userProfile.avatarUrl || '');
  const [bannerPreview, setBannerPreview] = useState<string>(userProfile.bannerUrl || '');
  
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      setUsername(userProfile.username);
      setBio(userProfile.bio || '');
      setAvatarPreview(userProfile.avatarUrl || '');
      setBannerPreview(userProfile.bannerUrl || '');
      setAvatarFile(null);
      setBannerFile(null);
    }
  }, [isOpen, userProfile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setBannerPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!firestore) return;
    setIsSaving(true);
    
    let finalAvatarUrl = userProfile.avatarUrl;
    let finalBannerUrl = userProfile.bannerUrl;

    try {
      // 1. Upload Avatar if selected
      if (avatarFile) {
        const storagePath = `avatars/${userProfile.id}/${Date.now()}_${avatarFile.name}`;
        const storageRef = ref(storage, storagePath);
        const snapshot = await uploadBytes(storageRef, avatarFile);
        finalAvatarUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Upload Banner if selected
      if (bannerFile) {
        const storagePath = `banners/${userProfile.id}/${Date.now()}_${bannerFile.name}`;
        const storageRef = ref(storage, storagePath);
        const snapshot = await uploadBytes(storageRef, bannerFile);
        finalBannerUrl = await getDownloadURL(snapshot.ref);
      }

      // 3. Update Firestore
      const userDocRef = doc(firestore, 'users', userProfile.id);
      const updatedData = {
        username,
        bio,
        avatarUrl: finalAvatarUrl,
        bannerUrl: finalBannerUrl,
      };
      
      updateDocumentNonBlocking(userDocRef, updatedData);

      // Success transition
      setTimeout(() => {
          setIsSaving(false);
          onOpenChange(false);
      }, 500);
    } catch (error) {
      console.error("Upload or profile update failed:", error);
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#f2ece0] border-none rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1a1208]">Edit Profile</DialogTitle>
          <DialogDescription className="text-[rgba(26,18,8,0.50)]">
            Keep your Bondi vibe up to date.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Banner Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Profile Banner</label>
            <label className="relative block w-full h-24 rounded-2xl border-2 border-dashed border-[#c4762a]/20 bg-white cursor-pointer overflow-hidden group">
              {bannerPreview ? (
                <Image src={bannerPreview} alt="Banner Preview" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full gap-2 text-[rgba(26,18,8,0.30)]">
                  <ImageIcon size={20} />
                  <span className="text-xs font-bold uppercase tracking-tighter">Pick Banner</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white" size={24} />
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
            </label>
          </div>

          {/* Avatar & Basic Info */}
          <div className="flex gap-4 items-start">
            <div className="space-y-2 shrink-0">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Avatar</label>
              <label className="relative block w-20 h-20 rounded-full border-2 border-dashed border-[#c4762a]/20 bg-white cursor-pointer overflow-hidden group">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar Preview" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-[rgba(26,18,8,0.30)]">
                    <User size={24} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-white" size={20} />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl border-black/[0.08] bg-white h-11 text-sm font-bold text-[#1a1208]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="rounded-xl border-black/[0.08] bg-white text-sm leading-relaxed text-[#1a1208] min-h-[80px]"
              placeholder="Tell us a little about yourself"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving} className="text-[rgba(26,18,8,0.40)] font-bold">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !username.trim()}
            className="rounded-2xl bg-[#c4762a] hover:bg-[#b06824] h-12 px-8 font-black tracking-tighter text-white shadow-lg shadow-[#c4762a]/20"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSaving ? "SAVING..." : "SAVE CHANGES"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
