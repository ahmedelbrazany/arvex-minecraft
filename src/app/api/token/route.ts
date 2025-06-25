import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import * as jose from 'jose';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
      const { payload } = await jose.jwtVerify(token, secret);

      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }

      if (payload.email !== session.user.email) {
        return NextResponse.json({ error: 'Token email mismatch' }, { status: 401 });
      }

      return NextResponse.json({
        status: 'OK',
        user: {
          email: payload.email,
          name: payload.name
        }
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}