export const updateUserPasswordValidationSchema = {
    oldPassword: {
        notEmpty: {
            errorMessage: 'Old password cannot be empty.'
        },
    },
    password_hash: {
        notEmpty: {
            errorMessage: 'Password cannot be empty.'
        },
    },
    password_hash_valid: {
        notEmpty: {
            errorMessage: 'Password cannot be empty.'
        },
    }
}
