import { useState, useCallback } from 'react';
import { ApiError } from '@/Interface/Error';
import Cookies from 'js-cookie';

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

            if (authentication) {
                const accessToken = Cookies.get('accessToken');  // Récupère le token du cookie
                headers['Authorization'] = accessToken ? `${accessToken}` : '';
            }

            // Effectuer la requête POST avec les en-têtes et les données
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData: ApiError = await res.json();
                setError({
                    status: res.status,
                    message: errorData.message || "Une erreur est survenue.",
                    error: errorData.error || [],
                });
                return null; // Retourne `null` en cas d'erreur

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
    }, [url, authentication]);

    return { isLoading, response, error, postData };
}
