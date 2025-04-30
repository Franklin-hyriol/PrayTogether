import { useState, useEffect } from 'react';
import { ApiError } from '@/Interface/Error';
import { useAuth } from '@/context/AuthContext';

interface UseFetchResult<T> {
    isLoading: boolean;
    response: T | null;
    error: ApiError | null;
}

export default function useFetch<T>(url: string, authentication?: boolean): UseFetchResult<T> {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<T | null>(null);
    const [error, setError] = useState<ApiError | null>(null);
    const { accessToken } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            setResponse(null);

            try {
                const headers: HeadersInit = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                };


                if (authentication && accessToken) {
                    headers['Authorization'] = `${accessToken}`;
                }

                const res = await fetch(url, {
                    method: 'GET',
                    headers,
                    credentials: 'include',
                });

                if (!res.ok) {
                    const errorData: ApiError = await res.json();
                    setError({
                        status: res.status,
                        message: errorData.message || 'Une erreur est survenue.',
                        error: errorData.error || [],
                    });
                    return;
                }

                const responseData: T = await res.json();
                setResponse(responseData);

            } catch (err) {
                setError({
                    status: 500,
                    message: 'Erreur réseau ou problème inattendu.',
                    error: [],
                });
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url, authentication, accessToken]); // Ajout de `accessToken` dans les dépendances

    return { isLoading, response, error };
}