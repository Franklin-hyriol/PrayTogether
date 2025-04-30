import { baseUrl } from "./baseUrl";

export const createPrayersEndpoint = `${baseUrl}/prayer`;
export const getMyPrayersEndpoint = `${baseUrl}/prayer/my`;
export const getPrayersEndpointWithFilter = `${baseUrl}/prayer/?excludeCurrentUser=true`;
export const getPrayerByIdEndpoint = `${baseUrl}/prayer/`;
export const deletePrayerByIdEndpoint = `${baseUrl}/prayer/`;