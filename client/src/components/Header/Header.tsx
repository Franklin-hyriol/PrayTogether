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
import { getSocket, initSocket } from "@/services/socket";
import { usePathname } from "next/navigation";
import { useSettingsContext } from "@/context/SettingsContext";
import { useNotificationSound } from "@/hook/useNotificationSound";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


function Header() {
  const { user, accessToken } = useAuth();
  const { logout, isLoading } = useLogout();
  const { settings } = useSettingsContext();


  const playNotification = useNotificationSound();
  const queryClient = useQueryClient();

  const pathname = usePathname();

  useEffect(() => {
    if (settings?.theme) {
      document.documentElement.setAttribute("data-theme", settings.theme);
    }
  }, [settings?.theme]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const htmlElement = document.documentElement;
      const toggleClass = (className: string, condition: boolean) => {
        if (condition) {
          htmlElement.classList.add(className);
        } else {
          htmlElement.classList.remove(className);
        }
      };

      document.documentElement.setAttribute(
        "data-textSize",
        settings?.accessibility.textSize ?? "small",
      );
      toggleClass(
        "high-contrast",
        settings?.accessibility.highContrast ?? false,
      );
      toggleClass(
        "notification-sound",
        settings?.accessibility.notificationSound ?? false,
      );
      toggleClass(
        "dyslexic-font",
        settings?.accessibility.dyslexicFont ?? false,
      );
    }
  }, [
    settings?.accessibility.textSize,
    settings?.accessibility.highContrast,
    settings?.accessibility.notificationSound,
    settings?.accessibility.dyslexicFont,
  ]);

  useEffect(() => {
    if (accessToken) {
      initSocket(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      socket.on("prayedForNotification", (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ["myPrayers"] });
          toast.success("Someone prayed for you 🙏");
          playNotification();
        }
      });
      ["likeNotification", "likeRemovedNotification"].forEach((event) => {
        socket.on(event, (data) => {
          if (data) {
            queryClient.invalidateQueries({ queryKey: ["myPrayers"] });
          }
        });
      });
    }

    return () => {
      // Nettoyer l'écouteur lors de la déconnexion du composant
      const socket = getSocket();
      if (socket) {
        socket.off("prayedForNotification");
        socket.off("likeNotification");
      }
    };
  }, [queryClient, playNotification]);

  return (
    <header className="navbar bg-base-300 sticky top-0 z-50 shadow-sm">
      <div className="flex-1">
        <Link
          href="/"
          className="navbar-brand flex w-fit items-center gap-2 text-xl font-bold sm:text-2xl"
        >
          <Image
            src="/logo/logo.png"
            alt="logo pray together"
            width={30}
            height={30}
            className="h-[32px] flex-none basis-[32px]"
          />
          <span>Pray Together</span>
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
                <div className="border-base-content border-opacity-50 w-10 rounded-full border-1">
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
                    type="button"
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
