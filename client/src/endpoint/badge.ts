import { baseUrl } from "./baseUrl";

export const getAllBadgesEndpoint = (page: number = 1, limit: number = 10, filter: string = 'all') =>
  `${baseUrl}/badges?page=${page}&limit=${limit}&filter=${filter}`;
