"use client";
import Image from "next/image";
import "./PrayerCard.scss";
import { useEffect, useRef, useState } from "react";

export type PrayerCardProps = {
    currentUser?: boolean
    name: string
    image: string
    timestamp: string
    prayer: string
    prayerStats?: number
    className?: string
    urgent?: boolean
    online?: boolean
    prayeringFor?: boolean
}

function PrayerCard({ currentUser, name, image, timestamp, prayer, prayerStats, className, urgent, online = false, prayeringFor }: PrayerCardProps) {

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
        <div className={`prayer-card ${className ? className : ""}`}>
            <div className="prayer-card-header">


                <div className="user-info">


                    <div className="user-avatar-container">
                        <Image src={image} width={48} height={48} alt="Marie" className="user-avatar" />
                        <span className={`online-indicator ${online ? "online" : "offline"}`}></span>
                    </div>

                    <div className="user-details">
                        <h3 className="user-name">{name}</h3>
                        <span className="timestamp">{timestamp}</span>
                    </div>


                </div>

                {urgent && <div className="prayer-tag urgent">Urgent</div>}

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
                            <button className="menu-item delete">
                                <span className="menu-icon">🗑️</span> Supprimer
                            </button>
                        </div>
                    </div>
                }
            </div>
            <div className="prayer-content">
                <p>{prayer}</p>
            </div>

            {currentUser ? (
                <div className="prayer-stats">
                    <span className="prayer-count">{prayerStats} personnes prient pour vous</span>
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
    )
}

export default PrayerCard;