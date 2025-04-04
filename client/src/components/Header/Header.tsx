"use client"

import Link from "next/link";
import Image from "next/image";
import "./Header.scss";
import { useUser } from "@/context/UserContext";

function Header() {

    const { user, isLoading, error } = useUser();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }


    console.log(user);


    return (
        <header className="header-container header">
            <Link href="/" className="header-image logo" aria-label="Retourner à l'accueil">
                <Image src={"/logo/logo.png"} alt="logo pray together" width={50} height={50} />
                <span>Pray Together</span>
            </Link>


            <div className="user_container">
                <Link href="/auth/login" className="btn btn-primary" aria-label="Connexion">Connexion</Link>
                <Link href="/auth/register" className="btn btn-secondary" aria-label="Inscription">Inscription</Link>
            </div>
        </header>
    )
}

export default Header;