
export interface IAccessibility {
    textSize: 'small' | 'medium' | 'large' | string;
    highContrast: boolean;
    notificationSound: boolean;
    dyslexicFont: boolean;
}

export interface ISettings {
    theme: 'light' | 'dark' | string;
    accessibility: IAccessibility;
    language: 'en' | 'fr' | string;
};
