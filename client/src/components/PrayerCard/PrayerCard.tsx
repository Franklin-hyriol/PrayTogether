"use client";
import Image from "next/image";
import "./PrayerCard.scss";
import { useEffect, useRef, useState } from "react";
import { IPrayer } from "@/Interface/IPrayer";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

// Icons
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosHeart } from "react-icons/io";


export type PrayerCardProps = {
    currentUser?: boolean
    prayer: IPrayer,
    online?: boolean
    className?: string
    prayeringFor?: boolean
    onDelete?: () => void
}

function PrayerCard({ currentUser, prayer, className, online = false, prayeringFor, onDelete }: PrayerCardProps) {

    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);


    return (
        <>
            <div className={`prayer-card card w-96 bg-base-100 card-md shadow-sm card-border ${className ? className : ""}`}>
                <div className="card-body">
                    <div className="flex justify-between">


                        <div className="flex gap-2">
                            {prayer.authorId.profilePhoto ? (
                                <div className={`avatar ${online ? "avatar-online" : "avatar-offline"}`}>
                                    <div className="w-12 rounded-full">
                                        <Image src={prayer.authorId.profilePhoto} width={48} height={48} alt={prayer.authorId.username} />
                                    </div>
                                </div>
                            ) : (
                                <div className={`avatar avatar-placeholder ${online ? "avatar-online" : "avatar-offline"}`}>
                                    <div className="bg-neutral text-neutral-content w-12 rounded-full">
                                        <span className="font-bold text-lg">{prayer.authorId.username.slice(0, 2).toUpperCase()}</span>
                                    </div>
                                </div>
                            )}


                            <div className="flex flex-col">
                                <h2 className="card-title">{prayer.authorId.username}</h2>
                                <span className="text-xs text-gray-500">{formatRelativeTime(prayer.createdAt)}</span>
                            </div>
                        </div>


                        {currentUser &&
                            <div className="relative" ref={menuRef}>
                                <button
                                    className="flex flex-col gap-[3px] p-[5px] px-[10px] bg-transparent border-none rounded hover:bg-black/5 transition cursor-pointer"
                                    onClick={() => setShowMenu(!showMenu)}
                                >
                                    <span className="w-[5px] h-[5px] rounded-full bg-gray-500 transition group-hover:bg-blue-500" />
                                    <span className="w-[5px] h-[5px] rounded-full bg-gray-500 transition group-hover:bg-blue-500" />
                                    <span className="w-[5px] h-[5px] rounded-full bg-gray-500 transition group-hover:bg-blue-500" />
                                </button>

                                <div
                                    className={`absolute right-0 w-40 bg-white rounded-lg shadow-lg transition-all duration-300 z-10 ${showMenu ? "opacity-100 visible translate-y-1" : "opacity-0 invisible translate-y-2"
                                        }`}
                                >
                                    <button className="cursor-pointer flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-100 rounded-t-lg transition">
                                        <MdOutlineEdit /> Modifier
                                    </button>
                                    <button
                                        className="cursor-pointer flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 text-left hover:bg-gray-100 rounded-b-lg transition"
                                        onClick={onDelete}
                                    >
                                        <MdDeleteOutline /> Supprimer
                                    </button>
                                </div>
                            </div>
                        }



                    </div>

                    <p className="card-text text-base">{prayer.text}</p>


                    <div className=" card-actions">
                        {currentUser ? (
                            <div className="text-primary text-base flex justify-between w-full">
                                <span>{prayer.prayedBy.length} personnes prient pour vous</span>
                                <div className="flex items-center gap-1 text-red-500">
                                    <IoIosHeart className="text-xl" />
                                    <span>42</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full">
                                {prayeringFor ? (
                                    <div className="flex gap-2 items-center">
                                        <div className="flex grow-6 p-3 text-green-500 gap-2 items-center justify-center text-base bg-[#f0fdf4] font-medium rounded-lg">
                                            <span >You are praying for Thomas</span>
                                            <span >🙏</span>
                                        </div>
                                        <button className="p-1 text-gray-500 hover:text-red-500 transition-colors duration-200 focus:outline-none cursor-pointer">
                                            <IoIosHeart className="text-3xl" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 items-center">
                                        <button className="btn btn-primary grow-6">I pray for you</button>

                                        <button className="p-1 text-gray-500 hover:text-red-500 transition-colors duration-200 focus:outline-none cursor-pointer">
                                            <IoIosHeart className="text-3xl" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PrayerCard;