export const createPrayerValidationSchema = {
    text: {
        notEmpty: {
            errorMessage: 'Prayer text cannot be empty.'
        },
        isLength: {
            options: { min: 1, max: 250 },
            errorMessage: 'Prayer text must be between 5 and 300 characters.'
        }
    },
    isUrgent: {
        optional: true,
        isBoolean: {
            errorMessage: 'Urgency flag must be a boolean value.'
        }
    }
}