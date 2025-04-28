export default interface GoogleProfile {
    id: string;
    displayName: string;
    name: {
        familyName: string;
        givenName: string;
    };
    photos: {
        value: string;
    }[];
    emails: {
        value: string;
        verified?: boolean;
    }[];
    provider: string;
};