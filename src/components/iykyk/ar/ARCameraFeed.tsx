'use client';

import { RefObject } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CameraOff } from 'lucide-react';

type ARCameraFeedProps = {
    videoRef: RefObject<HTMLVideoElement>;
    hasCameraPermission: boolean | null;
};

export function ARCameraFeed({ videoRef, hasCameraPermission }: ARCameraFeedProps) {

    return (
        <>
            <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" autoPlay muted playsInline />
            <div className="absolute inset-0 bg-black/40" />

            {hasCameraPermission === false && (
                <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                    <Alert variant="destructive" className="bg-destructive/80 text-destructive-foreground border-destructive-foreground/50">
                        <CameraOff className="h-4 w-4" />
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access in your browser settings to use the iykyk Lens. You may need to click the lock icon in the address bar.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </>
    );
}
