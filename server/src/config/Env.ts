import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const DB_NAME = process.env.DB_NAME;
export const JWT_SECRET = process.env.JWT_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
export const REFRESH_TOKEN_EXPIRATION_TIME = process.env.REFRESH_TOKEN_EXPIRATION_TIME;