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
import { Loader2 } from 'lucide-react';
import { WithId } from '@/firebase/firestore/use-collection';

type UserProfileData = WithId<{ 
  username: string; 
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
}>;

type EditProfileDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userProfile: UserProfileData;
};

// Simple URL validator
const isValidUrl = (url: string) => {
  if (!url) return true; // Allow empty strings
  return url.startsWith('http://') || url.startsWith('https://');
};

export function EditProfileDialog({ isOpen, onOpenChange, userProfile }: EditProfileDialogProps) {
  const firestore = useFirestore();
  const [username, setUsername] = useState(userProfile.username);
  const [bio, setBio] = useState(userProfile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl || '');
  const [bannerUrl, setBannerUrl] = useState(userProfile.bannerUrl || '');
  const [errors, setErrors] = useState({ avatarUrl: '', bannerUrl: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      setUsername(userProfile.username);
      setBio(userProfile.bio || '');
      setAvatarUrl(userProfile.avatarUrl || '');
      setBannerUrl(userProfile.bannerUrl || '');
      setErrors({ avatarUrl: '', bannerUrl: '' });
    }
  }, [isOpen, userProfile]);

  const handleSave = () => {
    const avatarError = !isValidUrl(avatarUrl) ? 'Invalid URL. Must start with http.' : '';
    const bannerError = !isValidUrl(bannerUrl) ? 'Invalid URL. Must start with http.' : '';

    if (avatarError || bannerError) {
      setErrors({ avatarUrl: avatarError, bannerUrl: bannerError });
      return;
    }

    if (!firestore) return;
    setIsSaving(true);
    setErrors({ avatarUrl: '', bannerUrl: '' });
    
    const userDocRef = doc(firestore, 'users', userProfile.id);
    const updatedData = {
      username,
      bio,
      avatarUrl,
      bannerUrl,
    };
    
    updateDocumentNonBlocking(userDocRef, updatedData);

    setTimeout(() => {
        setIsSaving(false);
        onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="col-span-3"
              placeholder="Tell us a little about yourself"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="avatarUrl" className="text-right pt-2">
              Avatar URL
            </Label>
            <div className="col-span-3">
              <Input
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
              {errors.avatarUrl && <p className="text-xs text-destructive mt-1">{errors.avatarUrl}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="bannerUrl" className="text-right pt-2">
              Banner URL
            </Label>
             <div className="col-span-3">
              <Input
                id="bannerUrl"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://..."
              />
              {errors.bannerUrl && <p className="text-xs text-destructive mt-1">{errors.bannerUrl}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
