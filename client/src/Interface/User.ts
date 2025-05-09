export interface User {
    _id: string;
    username: string;
    email: string;
    profilePhoto: string;
    role: string;
    provider: string;
    isBenefactor: boolean;
    badges: string[];
}