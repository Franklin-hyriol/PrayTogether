export const getResetPasswordTokenValidationSchema = {
    email: {
        isEmail: {
            errorMessage: 'Email must be valid.',
        },
        isLength: {
            options: { max: 255 },
            errorMessage: 'Email cannot exceed 255 characters.'
        },
        notEmpty: {
            errorMessage: 'Email cannot be empty.'
        },
    },
}