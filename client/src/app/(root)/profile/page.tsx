"use client";
import "./profile.scss";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar";
import PersonalInfo from "@/components/PersonalInfo/PersonalInfo";
import ChangePassword from "@/components/ChangePassword/ChangePassword";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Data } from "@/Interface/Data";
import { User } from "@/Interface/User";
import usePatch from "@/hook/usePatch";
import { updateUserEndpoint } from "@/endpoint/User";
import { toast } from "react-toastify";
import { formatMemberSince } from "@/utils/formatDateTime";

const updateUserSchema = z.object({
    username: z.string().trim().min(3, { message: "Username must be at least 3 characters long" }).nonempty({ message: "Username cannot be empty" }),
});

type IUpdateUser = z.infer<typeof updateUserSchema>;


function Profile() {
    const { user, setUser } = useAuth()
    const [tab, setTab] = useState(1)

    const { patchData } = usePatch(true)

    const [isEditing, setIsEditing] = useState(false);


    const defaultValues = {
        username: user?.username,
    };


    const {
        register,
        formState: { errors, isValid },
        getValues,
        trigger
    } = useForm<IUpdateUser>({
        resolver: zodResolver(updateUserSchema),
        defaultValues,
        mode: "onChange",
    });


    const uploadMutation = useMutation({
        mutationFn: async (data: IUpdateUser) => patchData<Data<User>>(updateUserEndpoint(user?.id as string), data),

        onSuccess: (response) => {
            toast.success("Username update successful!");
            setUser(prev => prev ? { ...prev, username: response.data.username } : prev);
        },

        onError: () => {
            toast.error("Error uploading username")
        },
    })

    const handleBlur = () => {
        setIsEditing(false);
        trigger("username")

        if (isValid) {
            uploadMutation.mutate(getValues())
        }
    }

    return (
        <section className="max-w-[1200px] mx-auto bg-base-100 rounded-2xl shadow-md overflow-hidden p-4">
            <div className="relative sm:h-48 h-24">
                <div className="w-full h-full bg-gradient-to-r from-primary to-primary-content"></div>
                <ProfileAvatar />
            </div>

            <div className="sm:p-4 p-0 mt-14 flex flex-col items-center">

                <div className="flex items-center justify-center flex-col relative mb-12">
                    {isEditing ? (

                        <input
                            type="text"
                            className="text-3xl text-center font-bold border-b border-base-content focus:outline-none focus:border-primary"
                            autoFocus
                            autoComplete="family-name"
                            {...register("username")}
                            onBlur={handleBlur}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleBlur();
                            }}
                            maxLength={250}
                        />
                    ) : (
                        <>
                            <h1 className="font-bold text-3xl text-base-content">{user?.username}</h1>
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="text-neutral-content hover:text-primary absolute right-[-24px] top-0"
                                aria-label="Modifier le nom"
                            >
                                <FaEdit size={18} className="cursor-pointer" />
                            </button>
                            {errors.username?.message && <div className="text-xs visible text-red-400 block">{errors.username?.message}</div>}

                            <span className="block text-base-content text-sm mb-1">Member since {formatMemberSince(user?.createdAt as string)}</span>
                            <p className="text-primary font-medium">{user?.email}</p>
                        </>
                    )}
                </div>

                <div className="form-tabs flex justify-center gap-4 mb-8 pb-4 border-neutral-content border-b">
                    <button type="button" className={`tab-btn ${tab === 1 ? "active" : ""}`} data-tab="personal-info" onClick={() => setTab(1)}>Personal info</button>
                    <button type="button" className={`tab-btn ${tab === 2 ? "active" : ""}`} data-tab="password" onClick={() => setTab(2)}>Password</button>
                </div>

                <div className="w-full">
                    <PersonalInfo className={tab === 1 ? "active" : ""} />
                    <ChangePassword className={tab === 2 ? "active" : ""} />
                </div>
            </div>
        </section>
    )
}

export default Profile;