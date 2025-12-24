
'use client';

import { useEffect, useRef, useState } from 'react';

export function useCamera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    useEffect(() => {
        const getCameraPermission = async () => {
            if (hasCameraPermission) return;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                  video: { 
                    facingMode: 'environment' // <--- This forces the rear camera
                  } 
                });
                setHasCameraPermission(true);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
            }
        };

        getCameraPermission();

        // Cleanup function to stop video stream
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [hasCameraPermission]); // Rerun if permission state changes from null

    return { videoRef, hasCameraPermission };
}
