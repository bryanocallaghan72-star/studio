'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Loader2, Save, Sparkles, Utensils, Armchair, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VenueOption {
  slug: string;
  name: string;
}

export function VenueEnricher() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [venues, setVenues] = useState<VenueOption[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [vibeTags, setVibeTags] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [seating, setSeating] = useState<'indoor' | 'outdoor' | 'both' | ''>('');
  const [description, setDescription] = useState('');

  // Initial fetch of all venues
  useEffect(() => {
    async function fetchVenues() {
      if (!firestore) return;
      try {
        const q = query(collection(firestore, 'venues'), orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        const options = snapshot.docs.map(doc => ({
          slug: doc.id,
          name: doc.data().name || doc.id
        }));
        setVenues(options);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setIsLoadingVenues(false);
      }
    }
    fetchVenues();
  }, [firestore]);

  // Fetch venue details when selection changes
  useEffect(() => {
    async function fetchVenueDetails() {
      if (!firestore || !selectedSlug) return;
      
      setIsLoadingDetails(true);
      try {
        const docRef = doc(firestore, 'venues', selectedSlug);
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
          const data = snap.data();
          setVibeTags(Array.isArray(data.vibeTags) ? data.vibeTags.join(', ') : '');
          setCuisine(data.cuisine || '');
          setSeating(data.seating || '');
          setDescription(data.description || '');
        }
      } catch (error) {
        console.error("Error fetching venue details:", error);
      } finally {
        setIsLoadingDetails(false);
      }
    }
    fetchVenueDetails();
  }, [firestore, selectedSlug]);

  const handleSave = async () => {
    if (!firestore || !selectedSlug) return;

    setIsSaving(true);
    
    // Parse vibe tags
    const tagsArray = vibeTags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    const updatePayload = {
      vibeTags: tagsArray,
      cuisine: cuisine,
      seating: seating,
      description: description,
      updatedAt: serverTimestamp(),
    };

    try {
      const docRef = doc(firestore, 'venues', selectedSlug);
      await setDoc(docRef, updatePayload, { merge: true });
      
      toast({
        title: "Enrichment Saved",
        description: `Successfully updated metadata for ${venues.find(v => v.slug === selectedSlug)?.name}`,
      });
    } catch (error: any) {
      console.error("Error saving enrichment:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mt-6 border-[#c4762a]/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#c4762a]">
          <Sparkles className="h-5 w-5" />
          Venue Enricher
        </CardTitle>
        <CardDescription>
          Manually add vibes and attributes to improve Bondi's contextual logic.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Venue Selector */}
        <div className="space-y-2">
          <Label htmlFor="venue-select">Select Venue</Label>
          <Select value={selectedSlug} onValueChange={setSelectedSlug} disabled={isLoadingVenues}>
            <SelectTrigger id="venue-select" className="bg-white border-black/10">
              <SelectValue placeholder={isLoadingVenues ? "Loading venues..." : "Choose a venue..."} />
            </SelectTrigger>
            <SelectContent className="bg-white border-black/10 max-h-60">
              {venues.map((venue) => (
                <SelectItem key={venue.slug} value={venue.slug}>
                  {venue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSlug && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
            {isLoadingDetails ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mb-2" />
                <p className="text-xs font-medium uppercase tracking-widest">Loading Details...</p>
              </div>
            ) : (
              <>
                {/* Vibe Tags */}
                <div className="space-y-2">
                  <Label htmlFor="vibeTags" className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Vibe Tags
                  </Label>
                  <Input
                    id="vibeTags"
                    placeholder="e.g. social, outdoor, hidden gem"
                    value={vibeTags}
                    onChange={(e) => setVibeTags(e.target.value)}
                    className="bg-white border-black/10"
                  />
                  <p className="text-[10px] text-muted-foreground">Separate tags with commas.</p>
                </div>

                {/* Cuisine */}
                <div className="space-y-2">
                  <Label htmlFor="cuisine" className="flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5 text-blue-500" />
                    Cuisine
                  </Label>
                  <Input
                    id="cuisine"
                    placeholder="e.g. Modern Australian, Sushi, Tapas"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="bg-white border-black/10"
                  />
                </div>

                {/* Seating */}
                <div className="space-y-2">
                  <Label htmlFor="seating" className="flex items-center gap-1.5">
                    <Armchair className="h-3.5 w-3.5 text-emerald-500" />
                    Seating Type
                  </Label>
                  <Select value={seating} onValueChange={(val: any) => setSeating(val)}>
                    <SelectTrigger id="seating" className="bg-white border-black/10">
                      <SelectValue placeholder="Select seating..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-black/10">
                      <SelectItem value="indoor">Indoor Only</SelectItem>
                      <SelectItem value="outdoor">Outdoor Only</SelectItem>
                      <SelectItem value="both">Both Indoor & Outdoor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-slate-500" />
                    Short Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="A sentence or two about the vibe..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white border-black/10 min-h-[80px] resize-none"
                    maxLength={160}
                  />
                  <div className="flex justify-end">
                    <span className="text-[10px] text-muted-foreground">{description.length}/160</span>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-[#c4762a] hover:bg-[#b06824] text-white font-bold h-12 rounded-xl mt-4"
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isSaving ? "Saving..." : "Save Enrichment"}
                </Button>
              </>
            )}
          </div>
        )}

        {!selectedSlug && !isLoadingVenues && (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-black/5 rounded-2xl">
            <Sparkles className="h-10 w-10 text-black/5 mb-2" />
            <p className="text-sm font-bold text-black/20 uppercase tracking-widest">Select a venue to begin</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
