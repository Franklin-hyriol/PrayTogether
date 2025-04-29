import { baseUrl } from "./baseUrl";

export const getMeEndpoint = `${baseUrl}/users/me`;
export const getResetPasswordTokenEndpoint = `${baseUrl}/users/reset-password-token`;
export const loginUserEndpoint = `${baseUrl}/users/login`;
export const registerUserEndpoint = `${baseUrl}/users/register`;
export const resetUserPasswordEndpoint = `${baseUrl}/users/reset-password`;
export const googleAuthEndpoint = `${baseUrl}/users/google`;
export const logoutUserEndpoint = `${baseUrl}/users/logout`;