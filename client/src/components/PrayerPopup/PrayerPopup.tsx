"use client";

import { useEffect, useRef, useState } from "react";
import "./PrayerPopup.scss";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import usePost from "@/hook/usePost";
import { Data } from "@/Interface/Data";
import { IPrayer } from "@/Interface/IPrayer";
import { toast } from "react-toastify";
import { createPrayersEndpoint } from "@/endpoint/Prayer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ComponentsLoader from "../ComponentsLoader/ComponentsLoader";

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

                <div className="card w-96 bg-base-100 card-md shadow-sm" ref={contentRef}>
                    <div className="card-body text-center">



                        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>

                            <fieldset className="fieldset relative">
                                <legend className="fieldset-legend text-lg">Your Prayer Request</legend>
                                <textarea className={`textarea h-30 w-full ${errors.text ? "textarea-error" : ""}`} placeholder="Share your prayer request here..." {...register("text")} onBlur={() => trigger("text")} maxLength={240} rows={5}></textarea>
                                <div className="label min-h-[18px]">
                                    {errors.text && <span className="text-error">{errors.text.message}</span>}
                                </div>
                                <span className="absolute bottom-2 right-0">{watchedText?.length ?? 0} / 240</span>
                            </fieldset>

                            <label htmlFor="isUrgent" className="flex items-center justify-center gap-2 mb-4 self-start cursor-pointer">
                                <input id="isUrgent" type="checkbox" {...register("isUrgent")} className="checkbox checkbox-primary checkbox-xs" />
                                <span>Mark as urgent</span>
                            </label>

                            <div className="justify-center gap-4 card-actions">
                                <button type="button" className="btn btn-cancel" onClick={() => setMakeRequest(false)}>Cancel</button>
                                <button type="submit" className="text-white btn btn-primary" disabled={!isValid || CreatePrayerMutation.isPending}>{CreatePrayerMutation.isPending ? <ComponentsLoader /> : "Send"}</button>
                            </div>


                        </form>




                    </div>
                </div>

            </div>
        </>
    );
}

export default PrayerPopup;