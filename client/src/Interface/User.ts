export interface User {
    id: string;
    username: string;
    email: string;
    profilePhoto: string;
    role: string;
    provider: string;
    isBenefactor: boolean;
    badges: string[];
}