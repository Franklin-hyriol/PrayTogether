export const updateSettingsValidationSchema = {
    theme: {
        optional: true,
        isString: {
            errorMessage: 'Theme must be a string.'
        },
        isIn: {
            options: [['light', 'dark']],
            errorMessage: 'Theme must be either "light" or "dark".'
        }
    },
    'accessibility.textSize': {
        optional: true,
        isString: {
            errorMessage: 'Text size must be a string.'
        },
        isIn: {
            options: [['small', 'medium', 'large']],
            errorMessage: 'Text size must be one of "small", "medium" or "large".'
        }
    },
    'accessibility.highContrast': {
        optional: true,
        isBoolean: {
            errorMessage: 'High contrast must be a boolean.'
        }
    },
    'accessibility.notificationSound': {
        optional: true,
        isBoolean: {
            errorMessage: 'Notification sound must be a boolean.'
        }
    },
    'accessibility.dyslexicFont': {
        optional: true,
        isBoolean: {
            errorMessage: 'Dyslexic font must be a boolean.'
        }
    },
    language: {
        optional: true,
        isString: {
            errorMessage: 'Language must be a string.'
        },
        isLength: {
            options: { min: 2, max: 5 },
            errorMessage: 'Language must be between 2 and 5 characters.'
        }
    }
};
