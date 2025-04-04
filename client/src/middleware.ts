import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken');

    if (request.nextUrl.pathname.startsWith('/auth/login') || request.nextUrl.pathname.startsWith('/auth/register') || request.nextUrl.pathname.startsWith('/auth/forgot-password')) {
        if (token?.value) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return;
}

