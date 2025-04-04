import { User } from "./User";

export interface RegisterResponse {
    status: number;
    message: string;
    data: {
        user: User;
        accessToken: string;
    };
}

