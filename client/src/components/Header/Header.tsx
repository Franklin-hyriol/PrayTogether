import Link from "next/link";
import Image from "next/image";
import "./Header.scss";



function Header() {

    return (
        <header className="header-container header">
            <Link href="/" className="header-image logo" aria-label="Retourner à l'accueil">
                <Image src="/logo/logo.png" alt="logo pray together" width={50} height={50} />
                <span>Pray Together</span>
            </Link>

            <div className="user_container">

                <Link href="/auth/login" className="btn btn-primary" aria-label="Connexion">Connexion</Link>
                <Link href="/auth/register" className="btn btn-secondary" aria-label="Inscription">Inscription</Link>

            </div>
        </header>
    );
}

export default Header;