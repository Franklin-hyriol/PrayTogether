import { baseUrl } from "./baseUrl";

export const createPrayersEndpoint = `${baseUrl}/prayer`;
export const getMyPrayersEndpoint = `${baseUrl}/prayer/my`;
export const getAllPrayersEndpoint = `${baseUrl}/prayer/`;
export const getPrayerByIdEndpoint = `${baseUrl}/prayer/`;
export const deletePrayerByIdEndpoint = `${baseUrl}/prayer/`;
export const updatePrayerByIdEndpoint = `${baseUrl}/prayer/`;

export const prayForPrayerEndpoint = (prayerId: string) => `${baseUrl}/prayer/${prayerId}/pray`;
export const likePrayerEndpoint = (prayerId: string) => `${baseUrl}/prayer/${prayerId}/like`;
