
'use client';

// This is a minimal, temporary page to isolate and confirm that the root route '/'
// is rendering correctly. If you can see this page, it means the 404 error
// is not caused by a routing or file system issue, but by an error within
// the original LandingPageContent component.

import { useEffect, useState } from 'react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Root Page Rendered Successfully</h1>
      <p>This confirms that `src/app/page.tsx` is being correctly served.</p>
      {isClient ? (
        <p style={{ color: 'green', fontWeight: 'bold' }}>Client-side JavaScript has loaded and executed. ✅</p>
      ) : (
        <p style={{ color: 'orange', fontWeight: 'bold' }}>Rendering on server or initial client load... ⏳</p>
      )}
      <p className="mt-4">The previous 404 error was likely caused by an SSR failure inside the original page component or one of its providers.</p>
    </main>
  );
}
