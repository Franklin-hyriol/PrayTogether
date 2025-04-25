import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import usePost from "./usePost";
import { Data } from "@/Interface/Data";

export const useLogout = () => {
    const { setUser, setAccessToken } = useAuth();
    const router = useRouter();

    const { isLoading, error, postData } = usePost<Data<{ message: string }>>(
        `${process.env.NEXT_PUBLIC_ENDPOINT_BASE_URL}/api/v1/users/logout`,
        true // Authentification requise
    );

    const logout = async () => {
        const response = await postData({}); // ou {} si ton backend attend un body vide non-null
        if (response) {
            setUser(null);
            setAccessToken(null);
            router.push('/'); // redirige vers la page de connexion
        }
    };

    return {
        logout,
        isLoading,
        error,
    };
};
