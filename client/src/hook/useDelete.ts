import { useAuth } from '@/context/AuthContext';

export default function useDelete(authentication = false) {
    const { accessToken } = useAuth();

    const deleteData = async <T>(url: string): Promise<T> => {
        const headers: HeadersInit = {
            Accept: 'application/json',
        };

        if (authentication && accessToken) {
            headers['Authorization'] = accessToken;
        }

        const response = await fetch(url, {
            method: 'DELETE',
            headers,
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

    return { deleteData };
}