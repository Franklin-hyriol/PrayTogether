import { randomBytes } from 'crypto';

export const generateVerificationToken = (length: number = 32): string => {
    return randomBytes(length).toString('hex');
};