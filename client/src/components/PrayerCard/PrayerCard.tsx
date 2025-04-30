"use client";
import Image from "next/image";
import "./PrayerCard.scss";
import { useEffect, useRef, useState } from "react";
import { IPrayer } from "@/Interface/IPrayer";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

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
            <div className={`prayer-card ${className ? className : ""}`}>
                <div className="prayer-card-header">


                    <div className="user-info">


                        <div className="user-avatar-container">
                            <Image src={prayer.authorId.profilePhoto ? prayer.authorId.profilePhoto : "/images/default_user_profile.jpg"} width={48} height={48} alt="Marie" className="user-avatar" />
                            <span className={`online-indicator ${online ? "online" : "offline"}`}></span>
                        </div>

                        <div className="user-details">
                            <h3 className="user-name">{prayer.authorId.username}</h3>
                            <span className="timestamp">{formatRelativeTime(prayer.createdAt)}</span>
                        </div>

                    </div>

                    {prayer.isUrgent && <div className="prayer-tag urgent">Urgent</div>}

                    {/* <!-- Add three-dot menu --> */}
                    {currentUser &&
                        <div className="card-menu" ref={menuRef}>
                            <button className="menu-dots" onClick={() => setShowMenu(!showMenu)}>
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </button>

                            <div className={`menu-dropdown ${showMenu ? "active" : ""}`}>
                                <button className="menu-item">
                                    <span className="menu-icon">✏️</span> Modifier
                                </button>
                                <button className="menu-item delete" onClick={onDelete}>
                                    <span className="menu-icon">🗑️</span> Supprimer
                                </button>
                            </div>
                        </div>
                    }
                </div>
                <div className="prayer-content">
                    <p>{prayer.text}</p>
                </div>

                {currentUser ? (
                    <div className="prayer-stats">
                        <span className="prayer-count">{prayer.prayedBy.length} personnes prient pour vous</span>
                    </div>
                ) : (
                    <div className="prayer-actions">
                        {prayeringFor ? (
                            <div className="praying-indicator hidden">
                                <span className="praying-text">Vous priez pour Thomas</span>
                                <span className="praying-icon">🙏</span>
                            </div>
                        ) : (
                            <button className="prayer-btn pray-btn">Je prie pour toi</button>
                        )}
                    </div>
                )}

            </div>
        </>
    )
}

export default PrayerCard;