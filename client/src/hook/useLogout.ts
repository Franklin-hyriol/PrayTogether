import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import usePost from "./usePost";
import { Data } from "@/Interface/Data";
import { logoutUserEndpoint } from "@/endpoint/User";

export const useLogout = () => {
    const { setUser, setAccessToken } = useAuth();
    const router = useRouter();

    const { isLoading, error, postData } = usePost<Data<{ message: string }>>(
        logoutUserEndpoint,
        true
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
