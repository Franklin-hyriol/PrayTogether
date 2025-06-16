import { useEffect, useRef } from "react";

export function useNotificationSound() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('/song/notification.mp3');
        audioRef.current.preload = 'auto';
    }, []);

    const playNotification = async () => {
        try {
            setTimeout(() => {
                const raw = localStorage.getItem("user-settings");
                const parsed = raw ? JSON.parse(raw) : null;
                const soundEnabled = parsed?.accessibility?.notificationSound;

                if (soundEnabled && audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch((err) => {
                        console.warn("Error playing notification sound:", err);
                    });
                }
            }, 100)
        } catch (err) {
            console.warn("Could not read user-settings:", err);
        }
    };

    return playNotification;
}
