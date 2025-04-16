import { User } from "./User";

export interface GetMeResponse {
    status: number;
    message: string;
    data: User;
}