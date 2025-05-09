import fs from 'fs';

export function ensureUploadsFolder() {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
}