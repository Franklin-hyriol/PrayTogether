"use client";

import Link from "next/link";
import Image from "next/image";
import "./Header.scss";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hook/useLogout";

// Icons
import { FaUser } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { IoMdLogIn } from "react-icons/io";
import { FaUserCheck } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { initSocket } from "@/services/socket";
import { usePathname } from "next/navigation";

function Header() {
  const { user, accessToken } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { logout, isLoading } = useLogout();

  const pathname = usePathname();

  console.log(pathname);

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

  useEffect(() => {
    if (accessToken) {
      initSocket(accessToken);
    }
  }, [accessToken]);

  return (
    <header className="navbar bg-base-100 sticky top-0 z-50 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="navbar-brand flex gap-2 text-2xl font-bold w-fit">
          <Image
            src="/logo/logo.png"
            alt="logo pray together"
            width={30}
            height={30}
            className="h-auto w-auto"
          />
          Pray Together
        </Link>
      </div>

      <div className="flex gap-2">
        {user ? (
          <nav className="dropdown dropdown-end">
            <div className="flex gap-4">
              {(pathname !== "/" && pathname !== "/prayer-room") && (
                <Link
                  className="btn btn-primary p-2 text-base font-normal"
                  href="/prayer-room"
                >
                  Back to Prayer Room
                </Link>
              )}

              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  {user.profilePhoto ? (
                    <Image
                      src={user.profilePhoto}
                      width={40}
                      height={40}
                      alt="Profile"
                      className="profile-img"
                    />
                  ) : (
                    <FaRegUserCircle className="h-full w-full" />
                  )}
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/profile" className="text-lg">
                  <FaUser />
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-lg">
                  <IoSettingsSharp />
                  Settings
                </Link>
              </li>

              <li>
                <button
                  onClick={() => logout()}
                  disabled={isLoading}
                  className="logout-btn text-lg"
                >
                  <IoLogOut />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        ) : (
          <>
            <Link href="/login" className="btn" aria-label="Login">
              <IoMdLogIn /> Login
            </Link>
            <Link
              href="/register"
              className="btn btn-primary"
              aria-label="Register"
            >
              <FaUserCheck /> Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
