// upload.middleware.ts

import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';



// Configuration du dossier de destination
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads');
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
        cb(null, uniqueName);
    },
});

// Filtrage des types MIME autorisés
const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non autorisé'));
    }
};

// Taille maximale : 5 Mo
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
