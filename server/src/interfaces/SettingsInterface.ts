export interface ISettings {
    theme: string;
    accessibility: {
        textSize: string;
        highContrast: boolean;
        notificationSound: boolean;
        dyslexicFont: boolean;
    };
    language: string;
};