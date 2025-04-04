export const CreateUserValidationSchema = {
    email: {
        isEmail: {
            errorMessage: 'Email must be valid.'
        },
        isLength: {
            options: { max: 255 },
            errorMessage: 'Email cannot exceed 255 characters.'
        }
    },
    username: {
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
    password: {
        custom: {
            options: (value: string, { req }: any) => {
                if (!value || value.length < 8) {
                    throw new Error('Password must be at least 8 characters long.');
                }
                return true;
            },
            errorMessage: 'Password must be at least 8 characters long.'
        }
    },
    confirmPassword: {
        custom: {
            options: (value: string, { req }: any) => {
                // Vérifie que confirmPassword correspond à password
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match password.');
                }
                return true;
            },
            errorMessage: 'Password confirmation must match password.'
        }
    }
};
