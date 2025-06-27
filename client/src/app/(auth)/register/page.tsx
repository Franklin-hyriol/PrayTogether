"use client";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import usePost from "@/hook/usePost";
import { Data } from "@/Interface/Data";
import { LoginSignData } from "@/Interface/LoginSignData";
import { toast, ToastContainer } from "react-toastify";
import { googleAuthEndpoint, registerUserEndpoint } from "@/endpoint/User";
import { useMutation } from "@tanstack/react-query";


// Icons
import { MdOutlineEmail } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import ComponentsLoader from "@/components/ComponentsLoader/ComponentsLoader";


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
    const { postData } = usePost(false);




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


    const signUpMutation = useMutation({
        mutationFn: (data: ISignup) => postData<Data<LoginSignData>>(registerUserEndpoint, data),
        onSuccess: (response) => {
            if (response.status === 201 && response.data?.accessToken) {
                setAccessToken(response.data?.accessToken);
                setUser(response.data?.user);

                toast.success("Login successful!");

                reset();

                setTimeout(() => {
                    router.push('/prayer-room');
                }, 1000);
            }
        }
    });


    const onSubmit = async (data: ISignup) => {
        signUpMutation.mutate(data);
    };

    const googleAuth = () => {
        const url = googleAuthEndpoint;
        window.open(url, "_self");
    };

    return (

        <section className="signup h-[100%] flex justify-center items-center">


            <div className="w-full max-w-md bg-base-100 rounded-3xl shadow-lg overflow-hidden">
                <div className="sm:p-10 p-4">


                    <div className="flex flex-col items-center sm:mb-8 mb-4">
                        <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center">
                            <Image src="/logo/logo.png" alt="logo pray together" width={30} height={30} className="w-auto h-auto" />
                        </div>
                        <h1 className="text-xl font-semibold text-base-content sm:mt-8 mt-4">Welcome</h1>
                        <p className="text-sm text-base-content mt-1">Please register to continue</p>
                    </div>


                    <div role="alert" className={`alert alert-error mb-6 ${signUpMutation.isError ? "flex" : "hidden"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{signUpMutation.error?.message}</span>
                    </div>


                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-5">
                            {/* Username */}
                            <div className="space-y-1">

                                <label htmlFor="username" className="block text-sm font-medium text-base-content">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaRegUser />
                                    </div>
                                    <input id="username" type="text" autoComplete="family-name" {...register("username")} onBlur={() => trigger("username")} placeholder="Enter your username" className={`block w-full pl-10 py-3 border rounded-lg text-base-content focus:outline-none focus:ring-primary sm:text-sm ${errors.username?.message ? "border-red-400" : "border-gray-300"}`} maxLength={250} />
                                </div>
                                {errors.username?.message && <div className="validator-hint visible text-red-400 block">{errors.username?.message}</div>}

                            </div>

                            {/* Email */}
                            <div className="space-y-1">

                                <label htmlFor="email" className="block text-sm font-medium text-base-content">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdOutlineEmail />
                                    </div>
                                    <input id="email" type="email" autoComplete="email" {...register("email")} onBlur={() => trigger("email")} placeholder="example@gmail.com" className={`block w-full pl-10 py-3 border rounded-lg text-base-content focus:outline-none focus:ring-primary sm:text-sm ${errors.email?.message ? "border-red-400" : "border-gray-300"}`} maxLength={250} />
                                </div>
                                {errors.email?.message && <div className="validator-hint visible text-red-400 block">{errors.email?.message}</div>}

                            </div>

                            {/*Password */}
                            <div className="space-y-1">

                                <label htmlFor="password" className="block text-sm font-medium text-base-content">Password</label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdLockOutline />
                                    </div>
                                    <input id="password" {...register("password")} onBlur={() => trigger("password")} autoComplete="new-password" type={showPassword ? "text" : "password"} placeholder="Password" className={`block w-full pl-10 py-3 border rounded-lg text-base-content focus:outline-none focus:ring-primary sm:text-sm ${errors.password?.message ? "border-red-400" : "border-gray-300"}`} maxLength={250} />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button type="button" className="text-base-content hover:text-base-400 focus:outline-none cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaRegEye className="text-xl" /> : <FaRegEyeSlash className="text-xl" />}
                                        </button>
                                    </div>


                                </div>
                                {errors.password?.message && <div className="validator-hint visible text-red-400 block">{errors.password?.message}</div>}
                            </div>


                            {/*Confirm Password */}
                            <div className="space-y-1">

                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-base-content">Confirm Password</label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdLockOutline />
                                    </div>
                                    <input id="confirmPassword" {...register("confirmPassword")} onBlur={() => trigger("confirmPassword")} autoComplete="new-password" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" className={`block w-full pl-10 py-3 border rounded-lg text-base-content focus:outline-none focus:ring-primary sm:text-sm ${errors.confirmPassword?.message ? "border-red-400" : "border-gray-300"}`} maxLength={250} />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button type="button" className="text-base-content hover:text-base-400 focus:outline-none cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <FaRegEye className="text-xl" /> : <FaRegEyeSlash className="text-xl" />}
                                        </button>
                                    </div>


                                </div>
                                {errors.confirmPassword?.message && <div className="validator-hint visible text-red-400 block">{errors.confirmPassword?.message}</div>}
                            </div>
                        </div>


                        <button type="submit" className="btn btn-primary w-full" disabled={!isValid || signUpMutation.isPending}>{signUpMutation.isPending ? <ComponentsLoader /> : "Sign Up"}</button>
                    </form>

                    <div className="divider">
                        <div className="text-sm text-base-content">Or</div>
                    </div>

                    <button type="button" className="btn bg-white text-black border-[#e5e5e5] space-y-3 w-full" onClick={googleAuth}>
                        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Continue with Google
                    </button>



                    <div className="text-center mt-6"><span className="text-sm text-base-content">Already have an account?</span>
                        <Link href="/login" className="text-sm font-medium text-primary hover:underline ml-1">Login</Link>
                    </div>
                </div>
            </div>


            <ToastContainer position="top-right" autoClose={1000} />
        </section>
    )
}

export default Register;