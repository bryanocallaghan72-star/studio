import { NextRequest, NextResponse } from 'next/server';

/**
 * @fileOverview Server-side proxy for Google Places photos.
 * Bypasses browser-based CORS and referer restrictions by fetching 
 * images on the server using the private GOOGLE_MAPS_API_KEY.
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref');
  
  // Use the secure server-side API key defined in apphosting.yaml
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!ref) {
    return new NextResponse('Missing photo reference', { status: 400 });
  }

  if (!apiKey) {
    return new NextResponse('Google Maps API key is not configured on the server', { status: 500 });
  }

  // Construct the canonical Google Places photo URL
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${ref}&key=${apiKey}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`Google Places Photo API returned ${res.status}: ${res.statusText}`);
      return new NextResponse('Failed to fetch image from Google', { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    
    // Return the image stream with aggressive caching (24 hours)
    return new NextResponse(res.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Place photo proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
