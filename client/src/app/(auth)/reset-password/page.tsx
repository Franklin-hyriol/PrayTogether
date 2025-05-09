"use client"
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import usePost from "@/hook/usePost";
import { Data } from "@/Interface/Data";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { resetUserPasswordEndpoint } from "@/endpoint/User";
import { useMutation } from "@tanstack/react-query";


// Icons
import { MdLockOutline } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";


const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).nonempty({ message: "Password cannot be empty" }),
    confirmPassword: z.string().min(8, { message: "Passwords do not match" }).nonempty({ message: "Password cannot be empty" }),
    token: z.string().nonempty({ message: "Token cannot be empty" }),
});

type IResetPassword = z.infer<typeof resetPasswordSchema>;


function ResetPassword() {

    const params = useSearchParams()

    const { postData } = usePost(false);

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


    const resetPasswordMutation = useMutation({
        mutationFn: (data: IResetPassword) => postData<Data<{ message: string }>>(resetUserPasswordEndpoint, data),
        onSuccess: (response) => {
            if (response.status === 200) {
                toast.success("Password update succesful");
                reset();
            }

            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }
    });

    const onSubmit = async (data: IResetPassword) => {
        resetPasswordMutation.mutate(data);
    };

    return (
        <section className="reset-password h-[100%] flex justify-center items-center">


            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="p-10">


                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center">
                            <Image src="/logo/logo.png" alt="logo pray together" width={30} height={30} className="w-auto h-auto" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800 mt-8">Reset Password</h1>
                        <p className="text-sm text-gray-500 mt-1">Please enter your new password</p>
                    </div>


                    <div role="alert" className={`alert alert-error mb-6 ${resetPasswordMutation.isError ? "flex" : "hidden"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{resetPasswordMutation.error?.message}</span>
                    </div>


                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-5">

                            {/*Password */}
                            <div className="space-y-1">

                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdLockOutline />
                                    </div>
                                    <input {...register("password")} onBlur={() => trigger("password")} autoComplete="new-password" type={showPassword ? "text" : "password"} placeholder="New password" className={`block w-full pl-10 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.password?.message ? "border-red-400" : "border-gray-300"}`} maxLength={250} />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaRegEye className="text-xl" /> : <FaRegEyeSlash className="text-xl" />}
                                        </button>
                                    </div>


                                </div>
                                {errors.password?.message && <div className="validator-hint visible text-red-400 block">{errors.password?.message}</div>}
                            </div>


                            {/*Confirm Password */}
                            <div className="space-y-1">

                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm new Password</label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdLockOutline />
                                    </div>
                                    <input {...register("confirmPassword")} onBlur={() => trigger("confirmPassword")} autoComplete="new-password" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm new Password" className={`block w-full pl-10 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.confirmPassword?.message ? "border-red-400" : "border-gray-300"}`} maxLength={250} />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <FaRegEye className="text-xl" /> : <FaRegEyeSlash className="text-xl" />}
                                        </button>
                                    </div>


                                </div>
                                {errors.confirmPassword?.message && <div className="validator-hint visible text-red-400 block">{errors.confirmPassword?.message}</div>}
                            </div>
                        </div>


                        <button type="submit" className="btn btn-primary w-full" disabled={!isValid || resetPasswordMutation.isPending}>Reset Password</button>
                    </form>

                    <div className="divider">
                        <div className="text-sm text-gray-500">Or</div>
                    </div>



                    <div className="text-center mt-6"><span className="text-sm text-gray-500">Remembered your password ?</span>
                        <Link href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 ml-1">Back to login</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResetPassword;