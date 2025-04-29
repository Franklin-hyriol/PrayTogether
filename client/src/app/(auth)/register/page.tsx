"use client";
import Image from "next/image";
import "./register.scss";
import Link from "next/link";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Icon from "@/components/Icomoon/Icomoon";
import usePost from "@/hook/usePost";
import { Data } from "@/Interface/Data";
import { LoginSignData } from "@/Interface/LoginSignData";
import { toast, ToastContainer } from "react-toastify";
import { googleAuthEndpoint, registerUserEndpoint } from "@/endpoint/User";


const signupSchema = z.object({
    username: z.string().trim().min(3, { message: "Username must be at least 3 characters long" }).nonempty({ message: "Username cannot be empty" }),
    email: z.string().trim().email({ message: "Please enter a valid email address" }).nonempty({ message: "Email cannot be empty" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).nonempty({ message: "Password cannot be empty" }),
    confirmPassword: z.string().min(8, { message: "Passwords do not match" }).nonempty({ message: "Password cannot be empty" }),
    provider: z.string(),
});

type ISignup = z.infer<typeof signupSchema>;

const defaultValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    provider: "local"
};

function Register() {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { isLoading, error, postData } = usePost<Data<LoginSignData>>(registerUserEndpoint);

    const router = useRouter();
    const { setUser, setAccessToken } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
        trigger
    } = useForm<ISignup>({
        resolver: zodResolver(signupSchema),
        defaultValues,
        mode: "onChange",
    });

    const onSubmit = async (data: ISignup) => {
        const result = await postData(data);

        if (result?.status === 201 && result.data?.accessToken) {

            setAccessToken(result.data?.accessToken);
            setUser(result.data?.user);

            toast.success("Registration successful!");

            reset();

            setTimeout(() => {
                router.push('/');
            }, 1000);
        }
    };

    const googleAuth = () => {
        const url = googleAuthEndpoint;
        window.open(url, "_self");
    };

    return (

        <section className="signup">
            <div className="signup-card">
                <div className="header-signup">
                    <h1>Create your account</h1>
                    <p>Sign up to join the community</p>
                </div>

                <form className="signup-form" id="signupForm" onSubmit={handleSubmit(onSubmit)}>
                    {/* Example server error message */}
                    <div className={`server-error ${error ? "visible" : ""}`}>
                        {error?.message}
                    </div>

                    <label className="input-group">
                        <input type="text" placeholder="Full Name" {...register("username")} onBlur={() => trigger("username")} className={errors.username?.message ? "error" : ""} maxLength={255} />
                        {errors.username?.message && <div className="error-message">{errors.username.message}</div>}
                    </label>

                    <label className="input-group">
                        <input type="email" placeholder="Email"  {...register("email")} onBlur={() => trigger("email")} className={errors.email?.message ? "error" : ""} maxLength={255} />
                        {errors.email?.message && <div className="error-message">{errors.email.message}</div>}
                    </label>

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

                    <button type="submit" className="signup-button" disabled={!isValid || isLoading}>
                        <span className="button-text">Sign up</span>
                        <div className="loader"></div>
                    </button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <button type="button" className="google-button" onClick={googleAuth}>
                        <Image src="/logo/google.ico" alt="Google" width={20} height={20} />
                        Sign up with Google
                    </button>

                    <div className="login-redirect">
                        <span>Already have an account?</span>
                        <Link href="/login">Log in</Link>
                    </div>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={1000} />
        </section>
    )
}

export default Register;