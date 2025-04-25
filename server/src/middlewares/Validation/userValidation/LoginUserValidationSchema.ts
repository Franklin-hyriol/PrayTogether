export const LoginUserValidationSchema = {
    email: {
        isEmail: {
            errorMessage: 'Email must be valid.'
        },
        isLength: {
            options: { max: 255 },
            errorMessage: 'Email cannot exceed 255 characters.'
        },
    },
    password: {
        notEmpty: {
            errorMessage: 'Password cannot be empty.'
        },
    },
    rememberMe: {
        optional: true,
        isBoolean: {
            errorMessage: 'Remember me must be a boolean value.'
        }
    }
}
