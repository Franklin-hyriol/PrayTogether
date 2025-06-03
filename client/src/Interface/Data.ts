export interface Data<T> {
    status: number;
    message: string;
    data: T;
    pagination?: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }
}