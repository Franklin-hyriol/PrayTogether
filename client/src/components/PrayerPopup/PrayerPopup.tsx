"use client";

import { useEffect, useRef, useState } from "react";
import "./PrayerPopup.scss";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import usePost from "@/hook/usePost";
import { Data } from "@/Interface/Data";
import { IPrayer } from "@/Interface/IPrayer";
import { toast, ToastContainer } from "react-toastify";
import { createPrayersEndpoint } from "@/endpoint/Prayer";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PrayerPopupProps {
    makeRequest: boolean
    setMakeRequest: React.Dispatch<React.SetStateAction<boolean>>
}

const PrayerRequestSchema = z.object({
    text: z.string().trim().min(1, { message: "Prayer text cannot be empty" }).max(240, { message: "Prayer text cannot exceed 280 characters" }),
    isUrgent: z.boolean().optional(),
});

type IPrayerRequest = z.infer<typeof PrayerRequestSchema>;
const defaultValues = {
    text: "",
    isUrgent: false,
};

function PrayerPopup({ makeRequest, setMakeRequest }: PrayerPopupProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    const { postData } = usePost(true);
    const queryClient = useQueryClient();


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
        watch,
        trigger
    } = useForm<IPrayerRequest>({
        resolver: zodResolver(PrayerRequestSchema),
        defaultValues,
        mode: "onChange",
    });

    const watchedText = watch("text");


    const CreatePrayerMutation = useMutation({
        mutationFn: (data: IPrayerRequest) => postData<Data<IPrayer[]>>(createPrayersEndpoint, data),
        onSuccess: (response) => {
            if (response?.status === 201) {
                toast.success("Prayer request successful!");

                reset();
                queryClient.invalidateQueries({ queryKey: ['myPrayers'] });

                setTimeout(() => {
                    setMakeRequest(false);
                }, 1000);
            }
        },

        onError: (error) => {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    });

    const onSubmit = async (data: IPrayerRequest) => {
        CreatePrayerMutation.mutate(data);
    };


    useEffect(() => {
        if (makeRequest) {
            setVisible(true);
        } else {
            const timeout = setTimeout(() => setVisible(false), 300); // délai = durée transition
            return () => clearTimeout(timeout);
        }
    }, [makeRequest]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const overlay = overlayRef.current;
            const content = contentRef.current;

            if (
                overlay?.classList.contains("active") &&
                content &&
                !content.contains(event.target as Node)
            ) {
                setMakeRequest(false);
            }
        };

        if (makeRequest) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [makeRequest, setMakeRequest]);

    if (!visible) return null;

    return (
        <>
            <div
                id="prayerRequestPopup"
                ref={overlayRef}
                className={`popup-overlay ${makeRequest ? "active" : ""}`}
            >
                <div className="popup-content" ref={contentRef}>
                    <h2>Votre demande de prière</h2>
                    <form className="prayer-form" onSubmit={handleSubmit(onSubmit)}>

                        <div className="prayer-input-container">
                            <textarea
                                placeholder="Partagez votre demande de prière ici..."
                                className="prayer-input"
                                rows={5}
                                maxLength={240}
                                {...register("text")}
                                onBlur={() => trigger("text")}
                            />
                            {errors.text && <span className="error">{errors.text.message}</span>}
                            <span>{watchedText?.length ?? 0}/240</span>
                        </div>


                        <div className="popup-buttons">
                            <button type="button" className="btn btn-cancel" onClick={() => setMakeRequest(false)}>
                                Annuler
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={!isValid || CreatePrayerMutation.isPending}>
                                Envoyer
                            </button>
                        </div>
                    </form>
                </div>
                <ToastContainer position="top-right" autoClose={2000} style={{ zIndex: 2000 }} />
            </div>
        </>
    );
}

export default PrayerPopup;