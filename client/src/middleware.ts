import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('refresh_token');

    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register') || request.nextUrl.pathname.startsWith('/forgot-password')) {
        if (token?.value) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return;
}