// app/api/refresh-access/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
        return NextResponse.json({
            status: 401,
            message: "Refresh token not found",
            error: [{
                type: "cookie",
                value: null,
                msg: "Refresh token not found",
                path: "refresh_token",
                location: "cookies"
            }]
        }, { status: 401 });
    }

    try {
        const res = await fetch(process.env.API_URL + "/api/v1/users/refresh-token", {
            method: "GET",
            headers: {
                Cookie: `refresh_token=${refreshToken}`,
            },
        });

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json({
                status: res.status,
                message: data.message || "Failed to refresh access token",
                error: data.error || [{
                    type: "cookie",
                    value: refreshToken,
                    msg: "Invalid or expired refresh token",
                    path: "refresh_token",
                    location: "cookies"
                }]
            }, { status: res.status });
        }

        return NextResponse.json({
            status: 200,
            message: "Access token refreshed successfully",
            data: {
                accessToken: data.data.accessToken
            }
        }, { status: 200 });

    } catch (error: unknown) {
        return NextResponse.json({
            status: 500,
            message: "Internal server error",
            error: {
                message: error instanceof Error ? error.message : "Unknown error occurred",
                stack: error instanceof Error ? error.stack : ""
            }
        }, { status: 500 });
    }
}