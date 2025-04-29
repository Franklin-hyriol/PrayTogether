export const createPrayerValidationSchema = {
    text: {
        notEmpty: {
            errorMessage: 'Prayer text cannot be empty.'
        },
        isLength: {
            options: { min: 5, max: 1000 },
            errorMessage: 'Prayer text must be between 5 and 1000 characters.'
        }
    },
    isUrgent: {
        optional: true,
        isBoolean: {
            errorMessage: 'Urgency flag must be a boolean value.'
        }
    }
}