"use client";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Data } from "@/Interface/Data";
import usePost from "@/hook/usePost";
import { toast, ToastContainer } from "react-toastify";
import { getResetPasswordTokenEndpoint } from "@/endpoint/User";
import { useMutation } from "@tanstack/react-query";


// Icons
import { MdOutlineEmail } from "react-icons/md";


const forgotPasswordSchema = z.object({
    email: z.string().trim().email({ message: "Please enter a valid email address" }).nonempty({ message: "Email cannot be empty" }),
});

type IForgotPassword = z.infer<typeof forgotPasswordSchema>;

const defaultValues = {
    email: "",
};

function ForgotPassword() {

    const { postData } = usePost(false);

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


    const forgotPasswordMutation = useMutation({
        mutationFn: (data: IForgotPassword) => postData<Data<{ message: string }>>(getResetPasswordTokenEndpoint, data),
        onSuccess: (response) => {
            if (response.status === 200) {
                toast.success("Password reset link sent! Check your email.");
                reset();
            }
        }
    });


    const onSubmit = async (data: IForgotPassword) => {
        forgotPasswordMutation.mutate(data);
    };



    return (
        <section className="forgot-password h-[100%] flex justify-center items-center">


            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="p-10">


                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center">
                            <Image src="/logo/logo.png" alt="logo pray together" width={30} height={30} />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800 mt-8">Reset your password</h1>
                        <p className="text-sm text-gray-500 mt-1">Enter your email to receive a password reset link</p>
                    </div>


                    <div role="alert" className={`alert alert-error mb-6 ${forgotPasswordMutation.isError ? "flex" : "hidden"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{forgotPasswordMutation.error?.message}</span>
                    </div>


                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-5">
                            <div className="space-y-1">

                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdOutlineEmail />
                                    </div>
                                    <input type="email" autoComplete="email" {...register("email")} onBlur={() => trigger("email")} placeholder="example@gmail.com" className={`block w-full pl-10 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.email?.message ? "border-red-400" : "border-gray-300"}`} maxLength={250} />
                                </div>
                                {errors.email?.message && <div className="validator-hint visible text-red-400 block">{errors.email?.message}</div>}

                            </div>

                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={!isValid || forgotPasswordMutation.isPending}>Reset</button>
                    </form>

                    <div className="text-center mt-6"><span className="text-sm text-gray-500">Remember your password ?</span>
                        <Link href="/register" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 ml-1">Back to login</Link>
                    </div>
                </div>
            </div>


            <ToastContainer position="top-right" autoClose={5000} />
        </section>
    )
}

export default ForgotPassword