import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '24';
  const offset = searchParams.get('offset') || '0';
  const sort = searchParams.get('sort') || 'latest';
  const model = searchParams.get('model') || 'gpt-image';

  try {
    const res = await fetch(
      `https://promptsref.com/api/home/showcase-works?limit=${limit}&offset=${offset}&sort=${sort}&model=${model}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        next: { revalidate: 60 }, // Cache 1 phút
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
