import { socketUrl } from "@/endpoint/baseUrl";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (token: string): Socket => {
    if (!socket) {
        socket = io(socketUrl, {
            withCredentials: true,
            extraHeaders: {
                Authorization: token,
            },
        });

        socket.on("connect", () => {
            console.info("socket connected");

        });

        socket.on("disconnect", () => {
            console.info("socket disconnected");
        });

        socket.on("connect_error", (err) => {
            console.error("Erreur WebSocket :", err.message);
        });
    }

    return socket;
};

export const getSocket = () => socket;