import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '24';
  const offset = searchParams.get('offset') || '0';
  const sort = searchParams.get('sort') || 'latest';
  const model = searchParams.get('model') || 'gpt-image';

  try {
    const apiUrl = `https://promptsref.com/api/home/showcase-works?limit=${limit}&offset=${offset}&sort=${sort}&model=${model}`;
    
    const res = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('API error:', res.status, res.statusText);
      return NextResponse.json(
        { data: [], hasMore: false, nextOffset: 0, error: 'Failed to fetch' }, 
        { status: 200 } // Return 200 với empty data để frontend không crash
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { data: [], hasMore: false, nextOffset: 0, error: 'Failed to fetch images' }, 
      { status: 200 }
    );
  }
}
