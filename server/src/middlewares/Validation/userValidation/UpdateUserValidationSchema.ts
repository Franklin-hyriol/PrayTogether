export const UpdateUserValidationSchema = {
    username: {
        optional: true,
        isLength: {
            options: { min: 3, max: 255 },
            errorMessage: 'Username must be between 3 and 255 characters long.'
        },
        notEmpty: {
            errorMessage: 'Username cannot be empty.'
        },
        isString: {
            errorMessage: 'Username must be a string.'
        }
    },
    email: {
        optional: true,
        isEmail: {
            errorMessage: 'Email must be valid.'
        },
        isLength: {
            options: { max: 255 },
            errorMessage: 'Email cannot exceed 255 characters.'
        }
    },
    role: {
        optional: true,
        isIn: {
            options: [['user', 'moderator', 'admin']],
            errorMessage: 'Role must be one of: user, moderator, admin.'
        },
        notEmpty: {
            errorMessage: 'Role cannot be empty.'
        }
    },
    profile_picture: {
        optional: true,
        isString: {
            errorMessage: 'Profile picture must be a string.'
        },
        isLength: {
            options: { max: 255 },
            errorMessage: 'Profile picture URL cannot exceed 255 characters.'
        }
    },
    bio: {
        optional: true,
        isString: {
            errorMessage: 'Bio must be a string.'
        }
    },
    badge_id: {
        optional: true,
        isInt: {
            errorMessage: 'Badge ID must be an integer.'
        }
    },
    moderator_threshold: {
        optional: true,
        isInt: {
            options: { min: 0 },
            errorMessage: 'Moderator threshold must be a non-negative integer.'
        }
    },
    email_verified: {
        optional: true,
        isBoolean: {
            errorMessage: 'Email verified must be a boolean value.'
        }
    }
}