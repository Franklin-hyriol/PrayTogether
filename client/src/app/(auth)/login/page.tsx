'use client'
import Image from "next/image";
import "./login.scss";
import Link from "next/link";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import Icon from "@/components/Icomoon/Icomoon";
import { useState } from "react";
import { LoginSignData } from "@/Interface/LoginSignData";
import usePost from "@/hook/usePost";
import { Data } from "@/Interface/Data";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
    email: z.string().trim().email({ message: "Please enter a valid email address" }).nonempty({ message: "Email cannot be empty" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).nonempty({ message: "Password cannot be empty" }),
    rememberMe: z.boolean(),
});

type ILogin = z.infer<typeof loginSchema>;

const defaultValues = {
    email: "",
    password: "",
    rememberMe: false
};

function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const { isLoading, error, postData } = usePost<Data<LoginSignData>>(process.env.NEXT_PUBLIC_ENDPOINT_BASE_URL + '/api/v1/users/login');


    const router = useRouter();
    const { setUser, setAccessToken } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
        trigger
    } = useForm<ILogin>({
        resolver: zodResolver(loginSchema),
        defaultValues,
        mode: "onChange",
    });

    const onSubmit = async (data: ILogin) => {
        const result = await postData(data);

        if (result?.status === 200 && result.data?.accessToken) {

            setAccessToken(result.data?.accessToken);
            setUser(result.data?.user);

            toast.success("Login successful!");

            reset();

            setTimeout(() => {
                router.push('/');
            }, 1000);
        }
    };


    const googleAuth = () => {
        const url = `${process.env.NEXT_PUBLIC_ENDPOINT_BASE_URL}/api/v1/users/google`;
        window.open(url, "_self");
    };

    return (
        <section className="login">
            <div className="login-card">
                <div className="header-login">
                    <h1>Welcome</h1>
                    <p>Log in to continue</p>
                </div>

                <form className="login-form" id="loginForm" onSubmit={handleSubmit(onSubmit)}>
                    {/* <!-- Example server error message --> */}
                    <div className={`server-error ${error ? "visible" : ""}`}>
                        {error?.message}
                    </div>

                    <label className="input-group">
                        <input type="email" placeholder="Email" autoComplete="email" {...register("email")} onBlur={() => trigger("email")} className={errors.email?.message ? "error" : ""} maxLength={255} />
                        {errors.email?.message && <div className="error-message">{errors.email?.message}</div>}
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

                    <div className="remember-forgot">
                        <label className="remember">
                            <input type="checkbox" id="remember" {...register("rememberMe")} />
                            <span>Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="forgot">Forgot password?</Link>
                    </div>

                    <button type="submit" className="login-button" disabled={!isValid || isLoading}>
                        <span className="button-text">Log in</span>
                        <div className="loader"></div>
                    </button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <button type="button" className="google-button" onClick={googleAuth}>
                        <Image src="/logo/google.ico" alt="Google" width={20} height={20} />
                        Continue with Google
                    </button>
                </form>

                <div className="signup">
                    <span>Don&apos;t have an account?</span>
                    <Link href="/register">Sign up</Link>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={1000} />
        </section>

    )
}

export default Login;