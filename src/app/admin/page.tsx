
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { appData } from '@/lib/data';
import { writeBatch, collection, doc, getDocs } from 'firebase/firestore';
import { Loader2, CheckCircle, AlertTriangle, Database } from 'lucide-react';
import Link from 'next/link';

type SeedStatus = 'idle' | 'loading' | 'success' | 'skipped' | 'error';

export default function AdminPage() {
  const firestore = useFirestore();
  const [status, setStatus] = useState<SeedStatus>('idle');
  const [message, setMessage] = useState('');

  const handleSeedVenues = async () => {
    if (!firestore) {
      setStatus('error');
      setMessage('Firestore is not initialized. Cannot seed data.');
      return;
    }

    setStatus('loading');
    const venuesCollection = collection(firestore, 'venues');

    try {
      // 1. Check if the collection is already populated
      const snapshot = await getDocs(venuesCollection);
      if (!snapshot.empty) {
        setStatus('skipped');
        setMessage('Seeding skipped. The "venues" collection already contains data.');
        return;
      }

      // 2. Prepare a batch write operation
      const batch = writeBatch(firestore);
      appData.map.pins.forEach(venue => {
        // Use the venue's slug as the document ID for clean URLs
        const docRef = doc(venuesCollection, venue.slug);
        batch.set(docRef, venue);
      });

      // 3. Commit the batch
      await batch.commit();
      setStatus('success');
      setMessage(`Successfully seeded ${appData.map.pins.length} venues to Firestore.`);

    } catch (error: any) {
      setStatus('error');
      if (error.code === 'permission-denied') {
        setMessage('Permission denied. Please ensure your Firestore security rules allow you to write to the "venues" collection. This is a temporary requirement for seeding.');
      } else {
        setMessage(`An error occurred: ${error.message}`);
      }
      console.error('Error seeding venues:', error);
    }
  };

  const renderStatus = () => {
    switch (status) {
      case 'loading':
        return <p className="flex items-center text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Seeding data...</p>;
      case 'success':
        return <p className="flex items-center text-green-600"><CheckCircle className="mr-2 h-4 w-4" />{message}</p>;
      case 'skipped':
        return <p className="flex items-center text-yellow-600"><AlertTriangle className="mr-2 h-4 w-4" />{message}</p>;
      case 'error':
        return <p className="flex items-center text-destructive"><AlertTriangle className="mr-2 h-4 w-4" />{message}</p>;
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database />
            iykyk Data Seeding
          </CardTitle>
          <CardDescription>
            Use this utility to perform a one-time population of your Firestore database with the initial set of venues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleSeedVenues} 
            disabled={status === 'loading'}
            className="w-full"
          >
            {status === 'loading' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Database className="mr-2 h-4 w-4" />
            )}
            Seed Venues to Firestore
          </Button>
          <div className="h-6 text-center">
            {renderStatus()}
          </div>
           <Button variant="link" asChild>
            <Link href="/discover">Back to App</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
