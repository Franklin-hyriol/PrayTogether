import Link from "next/link";
import "./reset-password.scss";

function ResetPassword() {
    return (
        <section className="reset-password">
            <div className="reset-password-card">
                <div className="header-reset">
                    <h1>Create a new password</h1>
                    <p>Enter and confirm your new password</p>
                </div>

                <form className="reset-password-form" id="resetPasswordForm">
                    <div className="server-error visible">
                        Password reset failed. Please try again.
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New password"
                            required
                        />
                        <div className="error-message">
                            Password must be at least 8 characters long
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            required
                        />
                        <div className="error-message">
                            Passwords do not match
                        </div>
                    </div>

                    <button type="submit" className="reset-button">
                        <span className="button-text">Reset password</span>
                        <div className="loader"></div>
                    </button>

                    <div className="back-login">
                        <span>Remembered your password?</span>
                        <Link href="/login">Back to login</Link>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default ResetPassword;