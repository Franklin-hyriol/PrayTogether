"use client";

import "./forgot-password.scss";
import "../../../assets/scss/global.scss";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordTokenResponse } from "@/Interface/PasswordTokenResponse";
import { useForm } from "react-hook-form";
import usePost from "@/hook/usePost";
import { useRouter } from 'next/navigation';

import Blob_1 from '../../../assets/images/blob_1.svg';
import Blob_2 from '../../../assets/images/blob_2.svg';

// Toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

function Page() {

    const { isLoading, error, postData } = usePost<PasswordTokenResponse>('http://localhost:5000/api/v1/users/reset-password-token');
    const router = useRouter();


    // const router = useRouter();

    // Zob Object
    const ForgotSchema = z.object({
        email: z.string()
            .trim()
            .min(1, { message: "L'email est requis" })
            .email({ message: "Adresse email non valide" }),
    });

    // Default Values
    const defaultValues = {
        email: "",
    }

    type ForgotSchemaType = z.infer<typeof ForgotSchema>;

    // Call UseForm Hook
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
        trigger,
    } = useForm<ForgotSchemaType>({
        resolver: zodResolver(ForgotSchema),
        defaultValues: defaultValues,
        mode: "onChange",
    });


    const submitData = async (data: ForgotSchemaType) => {
        const result = await postData(data);

        if (result?.status === 200) {


            toast.success("email envoyé !");

            reset();

            setTimeout(() => {
                router.push('/auth/email');
            }, 2000);
        }
    };


    if (error?.status === 409) {
        if (!toast.isActive("error409")) {  // Empêche les doublons
            toast.info(error?.message, { toastId: "error409" });

            setTimeout(() => {
                router.push('/auth/email');
            }, 2000);
        }
    }

    return (
        <>
            <main className="main">
                <section className="forgot-password">
                    <div className="container">
                        <div className="wrapper">
                            <div className="content">
                                <h1 className="title-h1">Mot de passe oublié</h1>
                                <p className="paragraph">Veuillez saisir votre adresse email pour recevoir un lien de réinitialisation de votre mot de passe.</p>


                                <div className="error_container error-msg">
                                    {error?.status === 404 &&
                                        <>
                                            L&#x27;utilisateur {error?.error[0].value} n&#x27;a pas &#xE9;t&#xE9; trouv&#xE9;. Veuillez v&#xE9;rifier votre adresse e-mail.
                                        </>
                                    }
                                    {
                                        error?.status === 409 &&
                                        <>
                                            Un jeton de réinitialisation de mot de passe a déjà été généré et est toujours valide. <a href="#">Cliquez ici</a> pour renvoyer l&#x27;email si vous ne l&#x27;avez pas encore reçu.
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

                                <form className="form" onSubmit={handleSubmit(submitData)}>
                                    <div className="form-group">
                                        <label htmlFor="email" className="label">Email</label>
                                        <input type="email" id="email" placeholder="Entrez votre email" autoComplete="true" {...register("email")} onBlur={() => { trigger("email") }} />
                                        <small className="error-msg">{errors.email?.message}</small>
                                    </div>
                                    <button aria-label="Cliquer pour envoyer l'email" type="submit" className="btn btn-primary" disabled={!isValid || isLoading}>Envoyer</button>
                                </form>

                                <div className="account">Je me souviens maintenant <Link className="link" href="/auth/login">Se connecter</Link></div>
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
            <ToastContainer position="top-right" autoClose={2000} />
        </>
    )
}

export default Page;