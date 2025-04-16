'use client';
import "../../../assets/scss/global.scss";
import "./login.scss";

import Blob_1 from '../../../assets/images/blob_1.svg';
import Blob_2 from '../../../assets/images/blob_2.svg';

import LogoIncognito from '../../../assets/images/incognito.svg';
import LogoGoogle from '../../../assets/images/logo-google.svg';



import Icon from "@/components/Icomoon/Icomoon";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import usePost from "@/hook/usePost";
import { LoginResponse } from "@/Interface/LoginResponse";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";


function Page() {

    const [showPassword, setShowPassword] = useState(false);
    const { isLoading, error, postData } = usePost<LoginResponse>(process.env.NEXT_PUBLIC_ENDPOINT_BASE_URL + '/api/v1/users/login');
    const [rememberMe, setRememberMe] = useState(false);


    const router = useRouter();

    // Zob Objectorgot-password
    const LoginSchema = z.object({
        email: z.string()
            .trim()
            .min(1, { message: "L'email est requis" })
            .email({ message: "Adresse email non valide" }),
        password: z.string()
            .min(1, { message: "Mot de passe requis" }),
    });

    // Default Values
    const defaultValues = {
        email: "",
        password: ""
    }

    type LoginSchemaType = z.infer<typeof LoginSchema>;

    // Call UseForm Hook
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
        trigger,
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: defaultValues,
        mode: "onChange",
    });


    const submitData = async (data: LoginSchemaType) => {
        const result = await postData(data);

        if (result?.status === 200 && result.data?.accessToken) {

            Cookies.set('accessToken', result.data.accessToken, {
                expires: rememberMe ? 30 : 1,  // 30 jours si "rememberMe" est vrai, sinon 1 jour
                path: '/'
            });

            console.log(result.data.user);

            toast.success("Connexion réussie !");

            reset();

            setTimeout(() => {
                router.push('/');
            }, 1000);
        }
    };

    return (
        <>


            <main className="main">
                <section className="login">
                    <div className="container">
                        <div className="wrapper">
                            <div className="content">
                                <div className="loginFormContainer">
                                    <div className="greeting">Bonjour !</div>
                                    <h1 className="title-h1">Connectez-vous</h1>
                                    <span className="sub-title">À votre compte en un clic</span>

                                    <div className="error_container error-msg">
                                        {
                                            error?.status === 400 &&
                                            <>
                                                Erreur de validation coté serveur. Veuillez v&#xE9;rifier et réessayer.
                                            </>
                                        }
                                        {error?.status === 404 &&
                                            <>
                                                L&#x27;utilisateur {error?.error[0].value} n&#x27;a pas &#xE9;t&#xE9; trouv&#xE9;. Veuillez v&#xE9;rifier votre adresse e-mail.
                                            </>
                                        }
                                        {error?.status === 401 &&
                                            <>
                                                Les mots de passe ne correspondent pas. Veuillez vérifier et réessayer.
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

                                    <form action="#" className="loginForm" onSubmit={handleSubmit(submitData)}>
                                        <div className="formWrapper">
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
                                        </div>

                                        <div className="fromOptions">
                                            <div className="rememberMe">
                                                <label className="checkboxContainer" htmlFor="rememberMe">
                                                    Se souvenir de moi
                                                    <input type="checkbox" name="rememberMe" id="rememberMe" onChange={() => setRememberMe(!rememberMe)} />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>

                                            <Link href="/auth/forgot-password" className="forgotPassword" aria-label="Lien vers la récupération du mot de passe">Mot de passe oublé ?</Link>
                                        </div>

                                        <button aria-label="cliquer pour se connecter" className="btn btn-primary" type="submit" disabled={!isValid || isLoading}>Se connecter</button>

                                        <div className="socialLogin">
                                            <button type="button" aria-label="Se connecter avec Google" title="Se connecter avec Google" className="googleLogin">
                                                <LogoGoogle /> <span>Google</span>
                                            </button>
                                            <span>ou</span>
                                            <button type="button" aria-label="Se connecter avec Facebook" title="Se connecter avec Facebook" className="facebookLogin">
                                                <LogoIncognito />  <span>Anonyme</span>
                                            </button>
                                        </div>

                                        <div className="noAccount">Vous n&#39;avez pas de compte ? <Link className="link" href="/auth/register">Creer un compte</Link></div>
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