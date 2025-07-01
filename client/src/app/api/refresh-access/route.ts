import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
        const res = NextResponse.json({
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

        // Supprime même si pas présent (par précaution)
        res.cookies.set("refresh_token", "", {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "none",
            domain: process.env.DOMAINE_URL, 
            expires: new Date(0),
        });

        return res;
    }

    try {
        const apiRes = await fetch(process.env.API_URL + "/api/v1/users/refresh-token", {
            method: "GET",
            credentials: "include",
            headers: {
                Cookie: `refresh_token=${refreshToken}`,
            },
        });

        const data = await apiRes.json();

        if (apiRes.status !== 200) {
            const res = NextResponse.json({
                status: apiRes.status,
                message: data.message || "Failed to refresh access token",
                error: data.error || [],
            }, { status: apiRes.status });

            res.cookies.set("refresh_token", "", {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "none",
                domain: process.env.DOMAINE_URL,
                expires: new Date(0), 
            });

            return res;
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