import Link from "next/link";
import "./forgot-password.scss";

function ForgotPassword() {
    return (
        <section className="forgot-password">
            <div className="forgot-password-card">
                <div className="header-forgot">
                    <h1>Reset your password</h1>
                    <p>Enter your email to receive a password reset link</p>
                </div>

                <form className="forgot-password-form" id="forgotPasswordForm">
                    {/* Example server feedback */}
                    <div className="server-error visible">
                        If this email exists, a reset link has been sent.
                    </div>

                    <div className="input-group">
                        <input type="email" name="email" placeholder="Email" required />
                        <div className="error-message">Please enter a valid email address</div>
                    </div>

                    <button type="submit" className="forgot-button">
                        <span className="button-text">Send reset link</span>
                        <div className="loader"></div>
                    </button>

                    <div className="back-login">
                        <span>Remember your password?</span>
                        <Link href="/login">Back to login</Link>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default ForgotPassword