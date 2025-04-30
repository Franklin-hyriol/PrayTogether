"use client"
import Link from "next/link";
import "./reset-password.scss";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import usePost from "@/hook/usePost";
import { Data } from "@/Interface/Data";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Icon from "@/components/Icomoon/Icomoon";
import { resetUserPasswordEndpoint } from "@/endpoint/User";


const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).nonempty({ message: "Password cannot be empty" }),
    confirmPassword: z.string().min(8, { message: "Passwords do not match" }).nonempty({ message: "Password cannot be empty" }),
    token: z.string().nonempty({ message: "Token cannot be empty" }),
});

type IResetPassword = z.infer<typeof resetPasswordSchema>;


function ResetPassword() {

    const params = useSearchParams()
    const { isLoading, error, postData } = usePost<Data<{ message: string }>>(resetUserPasswordEndpoint);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const defaultValues = {
        password: "",
        confirmPassword: "",
        token: params.get("token") || ""
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
        trigger
    } = useForm<IResetPassword>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues,
        mode: "onChange",
    });

    const onSubmit = async (data: IResetPassword) => {
        const result = await postData(data);

        if (result?.status === 200) {
            toast.success("Password update succesful");
            reset();
        }

        setTimeout(() => {
            router.push('/login');
        }, 2000);
    };

    return (
        <section className="reset-password">
            <div className="reset-password-card">
                <div className="header-reset">
                    <h1>Create a new password</h1>
                    <p>Enter and confirm your new password</p>
                </div>

                <form className="reset-password-form" id="resetPasswordForm" onSubmit={handleSubmit(onSubmit)}>
                    <div className={`server-error ${error ? "visible" : ""}`}>
                        {error?.message}
                    </div>

                    <label className="input-group">
                        <div className="passwordContainer">
                            <input type={showPassword ? "text" : "password"} placeholder="Password" {...register("password")} onBlur={() => trigger("password")} className={errors.password?.message ? "error" : ""} maxLength={255} />
                            <button type="button" className="eyeButton" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <Icon className="eye" aria-label="afficher le mot de passe" icon='eye-open' size={22} color='var(--primary-color)' /> : <Icon className="eye" aria-label="cacher le mot de passe" icon='eye-closed' size={22} color='var(--primary-color)' />}
                            </button>
                        </div>
                        {errors.password?.message && <div className="error-message">{errors.password?.message}</div>}
                    </label>


                    <label className="input-group">
                        <div className="passwordContainer">
                            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" {...register("confirmPassword")} onBlur={() => trigger("confirmPassword")} className={errors.confirmPassword?.message ? "error" : ""} maxLength={255} />
                            <button type="button" className="eyeButton" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <Icon className="eye" aria-label="afficher le mot de passe" icon='eye-open' size={22} color='var(--primary-color)' /> : <Icon className="eye" aria-label="cacher le mot de passe" icon='eye-closed' size={22} color='var(--primary-color)' />}
                            </button>
                        </div>
                        {errors.confirmPassword?.message && <div className="error-message">{errors.confirmPassword?.message}</div>}
                    </label>

                    <button type="submit" className="reset-button" disabled={!isValid || isLoading}>
                        <span className="button-text">Reset password</span>
                        <div className="loader"></div>
                    </button>

                    <div className="back-login">
                        <span>Remembered your password?</span>
                        <Link href="/login">Back to login</Link>
                    </div>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </section>
    )
}

export default ResetPassword;