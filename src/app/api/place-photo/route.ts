import { NextRequest, NextResponse } from 'next/server';

/**
 * @fileOverview Server-side proxy for Google Places photos.
 * Fetches images from Google on-demand and streams them to the client
 * to avoid permanent storage of binary assets in violation of Google ToS.
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Support both 'photoReference' and 'ref' for convenience
  const photoReference = searchParams.get('photoReference') || searchParams.get('ref');
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // 1. Validate Input
  if (!photoReference) {
    return new NextResponse('Missing photoReference parameter', { status: 400 });
  }

  // 2. Check Server Configuration
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY is not configured on the server.');
    return new NextResponse('Server configuration error', { status: 500 });
  }

  // 3. Construct Google Places Photo URL
  // We use a maxwidth of 800px as a reasonable default for high-quality mobile display.
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${apiKey}`;

  try {
    const res = await fetch(url);

    // 4. Handle Google API Failures
    if (!res.ok) {
      console.error(`Google Places Photo API returned ${res.status} for reference: ${photoReference}`);
      return new NextResponse('Failed to fetch image from Google', { status: 502 });
    }

    // 5. Extract Metadata and Stream Response
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    
    // We proxy the body as a stream and set aggressive caching headers (24 hours)
    // res.body is a ReadableStream which is supported by NextResponse
    return new NextResponse(res.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Place photo proxy critical error:', error);
    // Returning a descriptive error instead of a generic one to help debugging
    return new NextResponse(`Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
