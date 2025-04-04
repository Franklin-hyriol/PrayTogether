export interface ApiError {
    status: number;
    message: string;
    error: FieldError[];
}

interface FieldError {
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
}