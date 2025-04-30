import { useAuth } from "@/context/AuthContext";
import usePost from "./usePost";
import { Data } from "@/Interface/Data";
import { logoutUserEndpoint } from "@/endpoint/User";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
    const { setUser, setAccessToken } = useAuth();


    const { postData } = usePost(true);
    const router = useRouter();

    const logoutMutation = useMutation({
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        mutationFn: (data: {}) => postData<Data<{ message: string }>>(logoutUserEndpoint, data),
        onSuccess: (response) => {
            if (response.status === 200) {
                setUser(null);
                setAccessToken(null);
                router.push('/');
            }
        }
    });

    const logout = async () => {
        logoutMutation.mutate({});
    };

    return {
        logout,
        isLoading: logoutMutation.isPending,
        error: logoutMutation.error,
    };
};
