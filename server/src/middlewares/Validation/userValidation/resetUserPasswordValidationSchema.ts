export const resetUserPasswordValidationSchema = {
    token: {
        notEmpty: {
            errorMessage: 'Old password cannot be empty.'
        },
    },
    password: {
        notEmpty: {
            errorMessage: 'Password cannot be empty.'
        },
    },
    confirm_password: {
        notEmpty: {
            errorMessage: 'Password cannot be empty.'
        },
    }
}
