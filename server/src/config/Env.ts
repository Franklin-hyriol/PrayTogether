import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const DB_NAME = process.env.DB_NAME;
export const JWT_SECRET = process.env.JWT_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const BASE_URL = process.env.BASE_URL;
export const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
export const REFRESH_TOKEN_EXPIRATION_TIME = process.env.REFRESH_TOKEN_EXPIRATION_TIME;
export const NEXT_PUBLIC_ENDPOINT_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT_BASE_URL;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const PRAYER_VISIBILITY_DURATION = process.env.PRAYER_VISIBILITY_DURATION;
export const PRAYER_EXPIRATION_DURATION = process.env.PRAYER_EXPIRATION_DURATION;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;