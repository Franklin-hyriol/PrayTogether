"use client";
import { useMutation } from "@tanstack/react-query";
import "./ProfileAvatar.scss";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoCameraOutline } from "react-icons/io5";
import usePostFile from "@/hook/usePostFile";
import { updateProfileEndpoint } from "@/endpoint/User";
import { Data } from "@/Interface/Data";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { FaRegUserCircle } from "react-icons/fa";
import { User } from "@/Interface/User";


type FormData = {
    image: FileList
}

function ProfileAvatar() {
    const { register, watch, resetField } = useForm<FormData>()
    const imageFile = watch('image')
    const { user, setUser } = useAuth();

    const { postFile } = usePostFile(true);


    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData()
            formData.append('image', file)

            const response = await postFile<Data<User>>(updateProfileEndpoint, formData)
            return response
        },
        onSuccess: (response) => {
            toast.success("Avatar updated")
            setUser(response.data);
            resetField('image')
        },
        onError: () => {
            toast.error("Error uploading avatar")
        },
    })


    useEffect(() => {
        const file = imageFile?.[0]
        if (!file) return

        const validTypes = ['image/jpeg', 'image/png', 'image/webp']
        const maxSize = 5 * 1024 * 1024 // 5Mo

        if (!validTypes.includes(file.type)) {
            toast.error('Unsupported file type (jpg, png, webp only)')
            resetField('image')
            return
        }

        if (file.size > maxSize) {
            toast.error('File too large (max 5 MB)')
            resetField('image')
            return
        }


        uploadMutation.mutate(file)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageFile])


    return (
        <>
            <div className="avatar absolute bottom-[-60px] left-1/2 transform -translate-x-1/2">
                <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">

                    {user?.profilePhoto ? (
                        <Image src={user.profilePhoto} width={120} height={120} alt={user.username} className="profile-img" />
                    ) : (
                        <FaRegUserCircle className="w-full h-full" />
                    )}

                    <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-primary flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-primary hover:text-white">
                        <IoCameraOutline />
                        <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" {...register('image')} />
                    </label>
                </div>
            </div>
        </>
    )
}

export default ProfileAvatar;