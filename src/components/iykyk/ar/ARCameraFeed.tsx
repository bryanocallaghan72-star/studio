
'use client';

import { useEffect, useRef } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CameraOff } from 'lucide-react';

type ARCameraFeedProps = {
    setHasCameraPermission: (hasPermission: boolean) => void;
};

export function ARCameraFeed({ setHasCameraPermission }: ARCameraFeedProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hasPermission = useRef<boolean | null>(null);

    useEffect(() => {
        const getCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                hasPermission.current = true;
                setHasCameraPermission(true);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                hasPermission.current = false;
                setHasCameraPermission(false);
            }
        };

        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [setHasCameraPermission]);

    return (
        <>
            <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" autoPlay muted playsInline />
            <div className="absolute inset-0 bg-black/40" />

            {hasPermission.current === false && (
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
