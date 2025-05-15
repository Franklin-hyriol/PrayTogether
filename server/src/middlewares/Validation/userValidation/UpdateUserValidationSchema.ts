export const UpdateUserValidationSchema = {
    username: {
        optional: true,
        isLength: {
            options: { min: 3, max: 255 },
            errorMessage: 'Username must be between 3 and 255 characters long.',
        },
        isString: {
            errorMessage: 'Username must be a string.',
        },
    },

    password: {
        optional: true,
        isString: {
            errorMessage: 'Password must be a string.',
        },
        notEmpty: {
            errorMessage: 'Current password cannot be empty.',
        },
    },

    newPassword: {
        optional: true,
        isString: {
            errorMessage: 'New password must be a string.',
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'New password must be at least 8 characters long.',
        },
    },

    confirmPassword: {
        optional: true,
        custom: {
            options: (value: string, { req }: any) => {
                if (req.body.newPassword && value !== req.body.newPassword) {
                    throw new Error('Password confirmation does not match new password.');
                }
                return true;
            },
        },
    },

    isBenefactor: {
        optional: true,
        isBoolean: {
            errorMessage: 'isBenefactor must be a boolean.',
        },
    },
};