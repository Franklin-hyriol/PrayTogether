"use client";
import Link from "next/link";
import "./forgot-password.scss";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Data } from "@/Interface/Data";
import usePost from "@/hook/usePost";
import { toast, ToastContainer } from "react-toastify";


const forgotPasswordSchema = z.object({
    email: z.string().trim().email({ message: "Please enter a valid email address" }).nonempty({ message: "Email cannot be empty" }),
});

type IForgotPassword = z.infer<typeof forgotPasswordSchema>;

const defaultValues = {
    email: "",
};

function ForgotPassword() {

    const { isLoading, error, postData } = usePost<Data<{ message: string }>>(process.env.NEXT_PUBLIC_ENDPOINT_BASE_URL + '/api/v1/users/reset-password-token');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
        trigger
    } = useForm<IForgotPassword>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues,
        mode: "onChange",
    });


    const onSubmit = async (data: IForgotPassword) => {
        const result = await postData(data);

        if (result?.status === 200) {
            toast.success("Password reset link sent! Check your email.");
            reset();
        }
    };



    return (
        <section className="forgot-password">
            <div className="forgot-password-card">
                <div className="header-forgot">
                    <h1>Reset your password</h1>
                    <p>Enter your email to receive a password reset link</p>
                </div>

                <form className="forgot-password-form" id="forgotPasswordForm" onSubmit={handleSubmit(onSubmit)}>
                    {/* Example server feedback */}
                    <div className={`server-error ${error ? "visible" : ""}`}>
                        {error?.message}
                    </div>

                    <label className="input-group">
                        <input type="email" placeholder="Email" autoComplete="email" {...register("email")} onBlur={() => trigger("email")} className={errors.email?.message ? "error" : ""} maxLength={255} />
                        {errors.email?.message && <div className="error-message">{errors.email?.message}</div>}
                    </label>

                    <button type="submit" className="forgot-button" disabled={!isValid || isLoading}>
                        <span className="button-text">Send reset link</span>
                        <div className="loader"></div>
                    </button>

                    <div className="back-login">
                        <span>Remember your password?</span>
                        <Link href="/login">Back to login</Link>
                    </div>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </section>
    )
}

export default ForgotPassword