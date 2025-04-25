import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/Interface/Error';
import { useState, useCallback } from 'react';

interface UsePostResult<T> {
    isLoading: boolean;
    response: T | null;
    error: ApiError | null;
    postData: (data: unknown) => Promise<T | null>; // Modification ici pour retourner `T | null`
}

export default function usePost<T>(url: string, authentication?: boolean): UsePostResult<T> {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<T | null>(null);
    const [error, setError] = useState<ApiError | null>(null);
    const { accessToken } = useAuth();

    const postData = useCallback(async (data: unknown): Promise<T | null> => {
        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            // Prépare les en-têtes de la requête
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };

            // Si authentification est requise et qu'on a un accessToken
            if (authentication && accessToken) {
                headers['Authorization'] = accessToken;
            }

            // Effectuer la requête POST avec les en-têtes et les données
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
                credentials: 'include',
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
            console.log(err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [url, authentication, accessToken]);

    return { isLoading, response, error, postData };
}
