"use client";
import Image from "next/image";
import "./PrayerCard.scss";
import { useEffect, useRef, useState } from "react";
import { Iauthor, IPrayer } from "@/Interface/IPrayer";
import { formatRelativeTime } from "@/utils/formatDateTime";

// Icons
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosHeart } from "react-icons/io";
import { PiHandsPraying } from "react-icons/pi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Data } from "@/Interface/Data";
import usePost from "@/hook/usePost";
import { likePrayerEndpoint, prayForPrayerEndpoint } from "@/endpoint/Prayer";
import { toast } from "react-toastify";


export type PrayerCardProps = {
    currentUser?: boolean
    prayer: IPrayer,
    className?: string
    prayeringFor?: boolean
    likedBy?: boolean
    onDelete?: () => void
    onEdit?: () => void
    onShowPeoplePraying?: () => void
}

function PrayerCard({ currentUser, prayer, className, prayeringFor, likedBy, onDelete, onEdit, onShowPeoplePraying }: PrayerCardProps) {

    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const [animationText, setAnimationText] = useState<"+1" | "-1" | null>(null);

    const { postData } = usePost(true);
    const queryClient = useQueryClient();


    // Pray for Someone
    const PrayforYouMutation = useMutation({
        mutationFn: () => postData<Data<IPrayer[]>>(prayForPrayerEndpoint(prayer._id), {}),
        onSuccess: (response) => {
            if (response?.status === 200) {
                queryClient.invalidateQueries({ queryKey: ['allPrayers'] });
                queryClient.invalidateQueries({ queryKey: ['AllBadges'] });
            }
        },

        onError: (error) => {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    });

    // Like Prayer
    const LikePrayerMutation = useMutation({
        mutationFn: () => postData<Data<IPrayer[]>>(likePrayerEndpoint(prayer._id), {}),
        onSuccess: (response) => {
            if (response?.status === 200) {
                queryClient.invalidateQueries({ queryKey: ['allPrayers'] });
                queryClient.invalidateQueries({ queryKey: ['AllBadges'] });
            }
        },

        onError: (error) => {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    });



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


    const handleClick = () => {
        const wasLiked = likedBy; 
        LikePrayerMutation.mutate();

        setAnimationText(wasLiked ? "-1" : "+1");

        setTimeout(() => {
            setAnimationText(null);
        }, 1000);
    };

    return (
        <>
            <div className={`prayer-card card w-94 bg-base-300 card-md shadow-sm card-border ${className ? className : ""}`}>
                <div className="card-body">
                    <div className="flex justify-between">


                        <div className="flex gap-2">
                            {(prayer.authorId as Iauthor).profilePhoto ? (
                                <div className="avatar">
                                    <div className="w-12 rounded-full">
                                        <Image src={(prayer.authorId as Iauthor).profilePhoto} width={48} height={48} alt={(prayer.authorId as Iauthor).username} />
                                    </div>
                                </div>
                            ) : (
                                <div className="avatar avatar-placeholder">
                                    <div className="bg-neutral text-neutral-content w-12 rounded-full">
                                        <span className="font-bold text-lg">{(prayer.authorId as Iauthor).username.slice(0, 2).toUpperCase()}</span>
                                    </div>
                                </div>
                            )}


                            <div className="flex flex-col">
                                <h2 className="card-title">{(prayer.authorId as Iauthor).username}</h2>
                                <span className="text-xs text-base-content">{formatRelativeTime(prayer.createdAt)}</span>
                            </div>
                        </div>

                        {prayer.isUrgent && (
                            <span className="text-[#ef4444] bg-[#fee2e2] h-fit rounded-[10px] p-[6px] text-[12px]">Urgent</span>
                        )}


                        {currentUser &&
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    className="flex flex-col gap-[3px] p-[5px] px-[10px] bg-transparent border-none rounded hover:bg-black/5 transition cursor-pointer"
                                    onClick={() => setShowMenu(!showMenu)}
                                >
                                    <span className="w-[5px] h-[5px] rounded-full bg-gray-500 transition group-hover:bg-blue-500" />
                                    <span className="w-[5px] h-[5px] rounded-full bg-gray-500 transition group-hover:bg-blue-500" />
                                    <span className="w-[5px] h-[5px] rounded-full bg-gray-500 transition group-hover:bg-blue-500" />
                                </button>

                                <div
                                    className={`absolute right-0 w-40 bg-base-100 rounded-lg shadow-lg transition-all duration-300 z-10 ${showMenu ? "opacity-100 visible translate-y-1" : "opacity-0 invisible translate-y-2"
                                        }`}
                                >
                                    <button type="button" className="cursor-pointer flex items-center gap-2 w-full px-4 py-2 text-sm text-base-content text-left hover:bg-base-300 rounded-t-lg transition"
                                        onClick={onEdit}
                                    >
                                        <MdOutlineEdit /> Editer
                                    </button>
                                    <button
                                        type="button"
                                        className="cursor-pointer flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 text-left hover:bg-base-300 rounded-b-lg transition"
                                        onClick={onDelete}
                                    >
                                        <MdDeleteOutline /> Delete
                                    </button>
                                </div>
                            </div>
                        }
                    </div>

                    <p className="card-text text-base break-word">{prayer.text}</p>


                    <div className=" card-actions">
                        {currentUser ? (
                            <div className="text-primary text-base flex justify-between w-full cursor-pointer" onClick={onShowPeoplePraying}>
                                <span>{prayer.prayersCount} {prayer.prayersCount === 1 ? "person" : "people"} are praying for you</span>
                                <div className="flex items-center gap-1 text-red-500">
                                    <IoIosHeart className="text-xl" />
                                    <span>{prayer.likesCount}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="flex gap-2 items-center">
                                    {prayeringFor ? (

                                        <div className="flex grow-6 p-3 text-green-500 gap-2 items-center justify-center text-base bg-[#f0fdf4] font-medium rounded-lg">
                                            <span>
                                                You are praying for {(prayer.authorId as Iauthor).username.split(" ")[0]}
                                            </span>
                                            <PiHandsPraying className="text-green-500" />
                                        </div>
                                    ) : (
                                        <button type="button" className="btn btn-primary grow-6" onClick={() => PrayforYouMutation.mutate()}>I pray for you</button>
                                    )}
                                    <div className="relative inline-block">
                                        <button
                                            type="button"
                                            className={`p-1 text-gray-500 hover:text-red-500 transition-colors duration-200 focus:outline-none cursor-pointer ${likedBy ? "text-red-500" : ""}`}
                                            onClick={handleClick}
                                        >
                                            <IoIosHeart className="text-3xl" />
                                        </button>

                                        {animationText && (
                                            <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 text-red-500 font-bold pointer-events-none animate-like-float">
                                                {animationText}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PrayerCard;
