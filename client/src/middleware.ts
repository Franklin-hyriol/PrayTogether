import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('refresh_token');
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/forgot-password')
    ) {
        if (token?.value) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    if (pathname === '/prayer-room' && !token?.value) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', '/prayer-room');
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
