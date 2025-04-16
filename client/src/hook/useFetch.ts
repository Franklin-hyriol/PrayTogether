import { useCallback, useState } from "react";
import Cookies from "js-cookie";
import { ApiError } from "@/Interface/Error";

export interface UseFetchResult<T> {
    isLoading: boolean;
    response: T | null;
    error: ApiError | null;
    fetchData: () => Promise<T | null>;
}

export default function useFetch<T>(url: string, authentication?: boolean): UseFetchResult<T> {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<T | null>(null);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchData = useCallback(async (): Promise<T | null> => {
        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            const headers: HeadersInit = {
                'Accept': 'application/json',
            };

            if (authentication) {
                const accessToken = Cookies.get('accessToken');
                headers['Authorization'] = accessToken ? `${accessToken}` : '';
            }

            const res = await fetch(url, {
                method: 'GET',
                headers,
            });

            if (!res.ok) {
                const errorData: ApiError = await res.json();
                setError({
                    status: res.status,
                    message: errorData.message || "Une erreur est survenue.",
                    error: errorData.error || [],
                });
                return null;
            } else {
                const responseData: T = await res.json();
                setResponse(responseData);
                return responseData;
            }
        } catch (err) {
            setError({
                status: 500,
                message: "Erreur réseau ou problème inattendu.",
                error: [],
            });
            console.error(err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [url, authentication]);

    return { isLoading, response, error, fetchData };
}
