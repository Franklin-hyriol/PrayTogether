export const createBadgeValidationSchema = {
    code: {
        notEmpty: {
            errorMessage: 'Badge code is required.'
        },
        isString: {
            errorMessage: 'Badge code must be a string.'
        }
    },
    name: {
        notEmpty: {
            errorMessage: 'Badge name is required.'
        },
        isString: {
            errorMessage: 'Badge name must be a string.'
        }
    },
    description: {
        notEmpty: {
            errorMessage: 'Badge description is required.'
        },
        isString: {
            errorMessage: 'Badge description must be a string.'
        }
    },
    icon: {
        notEmpty: {
            errorMessage: 'Badge icon is required.'
        },
        isString: {
            errorMessage: 'Badge icon must be a string (URL or icon name).'
        }
    },
    isSecret: {
        optional: true,
        isBoolean: {
            errorMessage: 'isSecret must be a boolean value.'
        }
    },
    'condition.type': {
        notEmpty: {
            errorMessage: 'Condition type is required.'
        },
        isIn: {
            options: [['totalPrayersCreated', 'totalPrayersMade', 'totalPrayersReceived', 'totalHeartsGiven', 'totalHeartsReceived', 'isBenefactor']],
            errorMessage: 'Invalid condition type.'
        }
    },
    'condition.value': {
        notEmpty: {
            errorMessage: 'Condition value is required.'
        }
    }
};