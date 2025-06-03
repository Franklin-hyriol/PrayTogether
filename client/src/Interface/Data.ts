import { IPagination } from "./IPagination";

export interface Data<T> {
    status: number;
    message: string;
    data: T;
    pagination?: IPagination;
}