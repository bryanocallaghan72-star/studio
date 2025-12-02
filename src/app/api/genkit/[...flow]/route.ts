// This file is no longer used for Genkit flows,
// as they are now called directly from Server Actions.
// This prevents build issues with server-only packages.

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'This Genkit API route is not in use.' }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ message: 'This Genkit API route is not in use.' }, { status: 404 });
}
