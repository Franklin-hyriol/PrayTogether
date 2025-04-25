"use client";

import Link from "next/link";
import Image from "next/image";
import "./Header.scss";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hook/useLogout";

function Header() {

    const { user } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { logout, isLoading } = useLogout();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showDropdown && !menuRef.current?.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <header className="header-container header">
            <Link href="/" className="header-image logo" aria-label="Retourner à l'accueil">
                <Image src="/logo/logo.png" alt="logo pray together" width={50} height={50} />
                <span>Pray Together</span>
            </Link>

            {user ? (
                <div className="user-profile" ref={menuRef}>
                    <div className="profile-img-container" onClick={() => setShowDropdown(!showDropdown)}>
                        <Image src={user.profilePhoto ? user.profilePhoto : "/images/default_user_profile.jpg"} width={40} height={40} alt="Profile" className="profile-img" />
                    </div>
                    <div className={`dropdown-menu ${showDropdown ? "show" : ""}`} id="profileDropdown">
                        <Link href="/profile" className="dropdown-item">
                            <span className="item-icon">👤</span>
                            Profile
                        </Link>
                        <Link href="/settings" className="dropdown-item">
                            <span className="item-icon">⚙️</span>
                            Settings
                        </Link>
                        <div className="dropdown-divider"></div>
                        <button onClick={() => logout()} disabled={isLoading} className="dropdown-item text-red">
                            <span className="item-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="nav-buttons">
                    <Link href="/login" className="btn btn-outline" aria-label="Login">Login</Link>
                    <Link href="/register" className="btn btn-solid" aria-label="Register">Register</Link>
                </div>
            )
            }


        </header>
    );
}

export default Header;