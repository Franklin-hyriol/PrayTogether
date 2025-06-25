import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { JWT_SECRET, NEXT_PUBLIC_ENDPOINT_BASE_URL } from './config/Env';
import jwt from 'jsonwebtoken';

let io: SocketIOServer;

interface TokenPayload {
    id: string;
    iat?: number;
    exp?: number;
}

export const initSocket = (server: HttpServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: NEXT_PUBLIC_ENDPOINT_BASE_URL as string,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        }
    });

    // Middleware d'authentification
    io.use((socket, next) => {
        const token = socket.handshake.headers.authorization?.split(" ")[1];
        if (!token) {
            return next(new Error("No token provided"));
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET as string) as TokenPayload;
            (socket as any).user = decoded;
            next();
        } catch (err) {
            return next(new Error("Invalid token"));
        }
    });

    // Gestion des connexions
    io.on('connection', (socket: Socket) => {
        const user = (socket as any).user;
        if (user?.id) {
            socket.join(user.id);
        }

        socket.on('disconnect', () => {
            if (user?.id) {
                socket.leave(user.id);
            }
        });
    });
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io non initialisé");
    return io;
};