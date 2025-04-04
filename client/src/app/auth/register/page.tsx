'use client';
import "../../../assets/scss/global.scss";
import "./register.scss";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Blob_1 from '../../../assets/images/blob_1.svg';
import Blob_2 from '../../../assets/images/blob_2.svg';
import LogoGoogle from '../../../assets/images/logo-google.svg';
import Cookies from 'js-cookie';

import { useForm } from "react-hook-form";
import { useState } from "react";
import usePost from "@/hook/usePost";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Icon from "@/components/Icomoon/Icomoon";
import { RegisterResponse } from "@/Interface/RegisterResponse";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Page() {

    const [showPassword, setShowPassword] = useState(false);
    const { isLoading, error, postData } = usePost<RegisterResponse>(process.env.NEXT_PUBLIC_ENDPOINT_BASE_URL + '/api/v1/users/register');


    const router = useRouter();


    // Zob Objectorgot-password
    const RegisterSchema = z
        .object({
            username: z
                .string()
                .trim()
                .min(1, { message: "Nom d'utilisateur requis" })
                .max(20, { message: "Nom d'utilisateur trop long" }),
            email: z
                .string()
                .trim()
                .min(1, { message: "L'email est requis" })
                .email({ message: "Adresse email non valide" }),
            password: z
                .string()
                .min(1, { message: "Mot de passe requis" }),
            confirmPassword: z
                .string()
                .min(1, { message: "Le mot de passe de confirmation est requis" }),
            provider: z.string().default("local"),
        })
        .superRefine((data, ctx) => {
            if (data.password !== data.confirmPassword) {
                ctx.addIssue({
                    code: "custom",
                    path: ["password_hash_valid"],
                    message: "Le mot de passe de confirmation ne correspond pas",
                });
            }
        });


    // Default Values
    const defaultValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    }

    type RegisterSchemaType = z.infer<typeof RegisterSchema>;

    // Call UseForm Hook
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
        trigger,
    } = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: defaultValues,
        mode: "onChange",
    });


    const submitData = async (data: unknown) => {
        const result = await postData(data);

        console.log(result);


        if (result?.status === 201 && result.data?.accessToken) {

            Cookies.set('accessToken', result.data.accessToken, {
                expires: 1,
                path: '/'
            });

            toast.success("Inscription réussie !");

            reset();

            setTimeout(() => {
                router.push('/');
            }, 1000);
        }
    };

    return (
        <>
            <main className="main">
                <section className="register">
                    <div className="container">
                        <div className="wrapper">
                            <div className="content">
                                <div className="registerFormContainer">
                                    <h1 className="title-h1">Inscrivez-vous</h1>
                                    <span className="sub-title">Créez votre compte individuel</span>

                                    <div className="error_container error-msg">
                                        {
                                            error?.status === 400 &&
                                            <>
                                                Errer validation du server
                                            </>
                                        }
                                        {error?.status === 409 &&
                                            <>
                                                Un compte existe d&#xE9;j&#xE0; avec cette adresse email.
                                            </>
                                        }
                                        {
                                            error?.status === 500 &&
                                            <>
                                                Une erreur serveur est survenue, veuillez recommencer.
                                                Contacter l&#x27;administrateur du site Si le probl&#xE8;me persiste,
                                            </>
                                        }
                                    </div>

                                    <form action="#" className="registerForm" onSubmit={handleSubmit(submitData)}>
                                        <div className="formWrapper">

                                            <label className="label" htmlFor="username">
                                                <span className="label_text require">Nom d&#x27;utilisateur</span>
                                                <input type="text" id="username" placeholder="Entrez votre nom d&#x27;utilisateur" autoComplete="true" {...register("username")} onBlur={() => { trigger("username") }} />
                                                <small className="error-msg">{errors.username?.message}</small>
                                            </label>

                                            <label className="label" htmlFor="email">
                                                <span className="label_text require">Email</span>
                                                <input type="email" id="email" placeholder="Entrez votre email" autoComplete="true" {...register("email")} onBlur={() => { trigger("email") }} />
                                                <small className="error-msg">{errors.email?.message}</small>
                                            </label>


                                            <label className="label" htmlFor="password_hash">
                                                <span className="label_text require">Mot de passe</span>
                                                <div className="passwordContainer">
                                                    <input type={showPassword ? "text" : "password"} id="password_hash" placeholder="Entrez votre mot de passe" autoComplete="true" {...register("password")} onBlur={() => { trigger("password") }} />
                                                    <button type="button" className="eyeButton" onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ? <Icon className="eye" aria-label="afficher le mot de passe" icon='eye-open' size={22} color='var(--primary-color)' /> : <Icon className="eye" aria-label="cacher le mot de passe" icon='eye-closed' size={22} color='var(--primary-color)' />}
                                                    </button>
                                                </div>
                                                <small className="error-msg">{errors.password?.message}</small>
                                            </label>

                                            <label className="label" htmlFor="password_hash_valid">
                                                <span className="label_text require">Confirmer le mot de passe</span>
                                                <div className="passwordContainer">
                                                    <input type="password" id="password_hash_valid" placeholder="Confirmez votre mot de passe" autoComplete="true" {...register("confirmPassword")} onBlur={() => { trigger("confirmPassword") }} />
                                                </div>
                                                <small className="error-msg">{errors.confirmPassword?.message}</small>
                                            </label>

                                        </div>

                                        <button aria-label="cliquer pour se connecter" className="btn btn-primary" type="submit" disabled={!isValid || isLoading}>s&apos;inscrire</button>

                                        <div className="socialLogin">
                                            <button type="button" aria-label="Se connecter avec Google" title="Se connecter avec Google" className="googleLogin">
                                                <LogoGoogle /> <span>S&apos;inscrire avec Google</span>
                                            </button>
                                        </div>

                                        <div className="account">Vous avez deja un compte ? <Link className="link" href="/auth/login">Se connecter</Link></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="decoration">
                    <picture className="blob_1">
                        <Blob_1 />
                    </picture>

                    <picture className="blob_2">
                        <Blob_2 />
                    </picture>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={1000} />
        </>

    )
}

export default Page;