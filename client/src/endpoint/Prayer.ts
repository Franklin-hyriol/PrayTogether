import { baseUrl } from "./baseUrl";

export const createPrayersEndpoint = `${baseUrl}/prayer`;
export const getMyPrayersEndpoint = (page: number = 1, limit: number = 10, onlyActive: boolean = true) => `${baseUrl}/prayer/my?page=${page}&limit=${limit}&onlyActive=${onlyActive}`;
export const getAllPrayersEndpoint = `${baseUrl}/prayer/`;
export const getPrayerByIdEndpoint = `${baseUrl}/prayer/`;
export const deletePrayerByIdEndpoint = `${baseUrl}/prayer/`;
export const updatePrayerByIdEndpoint = `${baseUrl}/prayer/`;

export const prayForPrayerEndpoint = (prayerId: string) => `${baseUrl}/prayer/${prayerId}/pray`;
export const likePrayerEndpoint = (prayerId: string) => `${baseUrl}/prayer/${prayerId}/like`;
export const getPeopleWhoPrayedEndpoint = (prayerId: string, page: number = 1, limit: number = 4) => `${baseUrl}/prayer/${prayerId}/prayed-by?page=${page}&limit=${limit}`;
export const getPeopleWhoLikedEndpoint = (prayerId: string, page: number = 1, limit: number = 4) => `${baseUrl}/prayer/${prayerId}/liked-by?page=${page}&limit=${limit}`;
