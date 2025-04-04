import { User } from "./User";

export interface LoginResponse {
    status: number;
    message: string;
    data: {
        user: User,
        accessToken: string
    };
}