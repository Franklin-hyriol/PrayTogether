export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    isAnonymous: boolean;
    tempId: string;
    provider: string;
    profilePhoto: string;
}