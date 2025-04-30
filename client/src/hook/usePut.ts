import { useAuth } from '@/context/AuthContext';

export default function usePut(authentication = false) {
    const { accessToken } = useAuth();

    const putData = async <T>(url: string, data: unknown): Promise<T> => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };

        if (authentication && accessToken) {
            headers['Authorization'] = accessToken;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw {
                status: response.status,
                message: errorData.message || 'Une erreur est survenue.',
                error: errorData.error || [],
            };
        }

        return response.json();
    };

    return { putData };
}