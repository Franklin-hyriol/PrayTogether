import { useAuth } from '@/context/AuthContext';

export default function usePatch(authentication = false) {
    const { accessToken } = useAuth();

    const patchData = async <T>(url: string, data: unknown): Promise<T> => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };

        if (authentication && accessToken) {
            headers['Authorization'] = accessToken;
        }

        const response = await fetch(url, {
            method: 'PATCH',
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

    return { patchData };
}