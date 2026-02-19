'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { writeBatch, collection, doc, GeoPoint, serverTimestamp } from 'firebase/firestore';
import { SEED_VENUES } from '@/data/seeds/venues';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertTriangle, Database, FileWarning } from 'lucide-react';

type SeedStatus = 'idle' | 'loading' | 'success' | 'error';

interface SeedResult {
    success: boolean;
    message: string;
    operations: {
        total: number;
        written: number;
    };
}

export function IykykSeeder() {
    const [status, setStatus] = useState<SeedStatus>('idle');
    const [result, setResult] = useState<SeedResult | null>(null);
    const firestore = useFirestore();

    const handleSeed = async () => {
        if (!firestore) {
            setStatus('error');
            setResult({
                success: false,
                message: 'Firestore is not initialized. Cannot seed data.',
                operations: { total: 0, written: 0 }
            });
            return;
        }

        setStatus('loading');
        setResult(null);

        const batch = writeBatch(firestore);
        const venuesCollection = collection(firestore, 'venues');
        let writtenCount = 0;

        SEED_VENUES.forEach((venue) => {
            // 🔐 Guard: skip venues without location
            if (!venue.location) {
                console.warn(`Skipping venue without location: ${venue.slug}`);
                return;
            }
        
            const docRef = doc(venuesCollection, venue.slug);
        
            const enrichedVenue = {
                ...venue,
                image: `https://picsum.photos/seed/${venue.slug}/800/600`,
                location: {
                    ...venue.location,
                    geopoint: new GeoPoint(
                        venue.location.latitude,
                        venue.location.longitude
                    ),
                },
                isFire: Math.random() > 0.7,
                trendingScore: Math.floor(Math.random() * 100),
                lastUpdated: serverTimestamp(),
            };
        
            batch.set(docRef, enrichedVenue, { merge: true });
            writtenCount++;
        });
        

        try {
            await batch.commit();
            setStatus('success');
            setResult({
                success: true,
                message: `Successfully seeded ${writtenCount} venues with soul.`,
                operations: { total: SEED_VENUES.length, written: writtenCount }
            });
        } catch (error: any) {
            setStatus('error');
            setResult({
                success: false,
                message: `Seeding failed: ${error.message}`,
                operations: { total: SEED_VENUES.length, written: 0 }
            });
            console.error("Seeding error:", error);
        }
    };
    
     const renderStatus = () => {
        if (!result) {
            if(status === 'loading') {
                return <p className="flex items-center text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Injecting soul...</p>;
            }
            return null;
        }

        const icon = result.success ? <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> : <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />;
        const color = result.success ? 'text-green-600' : 'text-destructive';

        return (
            <div className='text-left space-y-2'>
                <p className={`flex items-center font-semibold ${color}`}>{icon}{result.message}</p>
                <div className='text-xs text-muted-foreground space-y-1 pl-6'>
                    <p>Venues in seed file: {result.operations.total}</p>
                    <p>Venues written to Firestore: {result.operations.written}</p>
                </div>
            </div>
        )
    }

    return (
        <Card className="w-full max-w-lg mt-6 border-amber-500/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                    <Database />
                    Soul Injector
                </CardTitle>
                <CardDescription>
                    This is a one-time operation to enrich the venue data with images and fire attributes.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Button
                    onClick={handleSeed}
                    disabled={status === 'loading' || !firestore}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                >
                    {status === 'loading' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Database className="mr-2 h-4 w-4" />
                    )}
                    Inject Soul into Venues
                </Button>
                <div className="h-16 text-center">
                    {renderStatus()}
                </div>
            </CardContent>
        </Card>
    );
}
