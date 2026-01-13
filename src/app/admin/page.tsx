
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { seedVenues, type SeedMode, type SeedResult } from '@/lib/seeding';
import { Loader2, CheckCircle, AlertTriangle, Database, FileWarning, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { IykykSeeder } from '@/components/admin/IykykSeeder';

type SeedStatus = 'idle' | 'loading' | 'success' | 'error';


function Seeder() {
  const [status, setStatus] = useState<SeedStatus>('idle');
  const [result, setResult] = useState<SeedResult | null>(null);
  const [seedMode, setSeedMode] = useState<SeedMode>('skip-if-exists');
  const [isDryRun, setIsDryRun] = useState(true);
  
  let firestore: any;
  try {
    firestore = useFirestore();
  } catch (e) {
    console.warn("useFirestore could not be used, likely outside of a provider. Seeding will be disabled.");
  }


  const handleSeedVenues = async () => {
    if (!firestore) {
      setStatus('error');
      setResult({
        success: false, 
        message: 'Firestore is not initialized. Cannot seed data.',
        operations: { total: 0, written: 0, skipped: 0, dryRun: isDryRun }
      });
      return;
    }

    setStatus('loading');
    setResult(null);

    const seedResult = await seedVenues(firestore, { mode: seedMode, dryRun: isDryRun });

    setResult(seedResult);
    setStatus(seedResult.success ? 'success' : 'error');
  };

  const renderStatus = () => {
    if (!result) {
        if(status === 'loading') {
            return <p className="flex items-center text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Seeding data...</p>;
        }
        return null;
    }

    const icon = result.success ? <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> : <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />;
    const color = result.success ? 'text-green-600' : 'text-destructive';

    return (
        <div className='text-left space-y-2'>
            <p className={`flex items-center font-semibold ${color}`}>{icon}{result.message}</p>
            <div className='text-xs text-muted-foreground space-y-1 pl-6'>
                <p>Total venues in seed file: {result.operations.total}</p>
                <p>Venues written: {result.operations.written}</p>
                <p>Venues skipped: {result.operations.skipped}</p>
                 {result.operations.dryRun && <p className='font-bold flex items-center'><FileWarning className="mr-1 h-3 w-3 text-amber-500" />This was a dry run. No data was actually changed.</p>}
            </div>
        </div>
    )
  }

  return (
    <>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database />
            iykyk Data Seeding
          </CardTitle>
          <CardDescription>
            Use this utility to populate your Firestore database with canonical venue data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className='space-y-4 rounded-lg border p-4'>
            <Label className='font-semibold'>Seeding Mode</Label>
            <RadioGroup value={seedMode} onValueChange={(value: any) => setSeedMode(value)}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="skip-if-exists" id="r1" />
                    <Label htmlFor="r1" className='font-normal'>Skip if exists (Safe)</Label>
                </div>
                 <p className='text-xs text-muted-foreground pl-6'>Only create venues that don't already have a document in Firestore. Good for initial seeding.</p>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upsert" id="r2" />
                    <Label htmlFor="r2" className='font-normal'>Upsert (Overwrite)</Label>
                </div>
                <p className='text-xs text-muted-foreground pl-6'>Create new venues and completely overwrite existing ones with the seed data.</p>
            </RadioGroup>
          </div>
          
           <div className="flex items-center space-x-2 rounded-lg border p-4 justify-between">
            <div className='space-y-1'>
                <Label htmlFor="dry-run-switch" className="font-semibold flex items-center gap-2">
                    <ShieldCheck className='text-green-600'/>
                    Dry Run Mode
                </Label>
                <p className='text-xs text-muted-foreground'>Simulate the seeding process without making any actual changes to the database.</p>
            </div>
            <Switch id="dry-run-switch" checked={isDryRun} onCheckedChange={setIsDryRun} />
          </div>

          <Button 
            onClick={handleSeedVenues} 
            disabled={status === 'loading' || !firestore}
            className="w-full"
          >
            {status === 'loading' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Database className="mr-2 h-4 w-4" />
            )}
            Seed Venues
          </Button>

          <div className="h-20 text-center">
            {renderStatus()}
          </div>

        </CardContent>
      </Card>
      
      <IykykSeeder />

      <Button variant="link" asChild className='mx-auto mt-6 block'>
        <Link href="/discover">Back to App</Link>
      </Button>
    </>
  );
}


export default function AdminPage() {
    return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <FirebaseClientProvider>
          <Seeder />
      </FirebaseClientProvider>
    </div>
    )
}
