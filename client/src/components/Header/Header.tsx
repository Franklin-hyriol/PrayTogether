"use client";

import Link from "next/link";
import Image from "next/image";
import "./Header.scss";
import { useEffect } from "react";
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
import { useSettingsContext } from "@/context/SettingsContext";

function Header() {
  const { user, accessToken } = useAuth();
  const { logout, isLoading } = useLogout();
  const { settings } = useSettingsContext();

  const pathname = usePathname();

  useEffect(() => {
    if (settings?.theme) {
      document.documentElement.setAttribute("data-theme", settings.theme);
    }
  }, [settings?.theme]);


  useEffect(() => {
    if (accessToken) {
      initSocket(accessToken);
    }
  }, [accessToken]);

  return (
    <header className="navbar bg-base-100 sticky top-0 z-50 shadow-sm">
      <div className="flex-1">
        <Link
          href="/"
          className="navbar-brand flex w-fit gap-2 text-2xl font-bold"
        >
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

      <div className="flex gap-4">
        {user ? (
          <div className="flex gap-4">
            {pathname !== "/" && pathname !== "/prayer-room" && (
              <Link
                className="btn btn-primary p-2 text-base font-normal"
                href="/prayer-room"
              >
                Back to Prayer Room
              </Link>
            )}

            <nav className="dropdown dropdown-end">
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
          </div>
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
