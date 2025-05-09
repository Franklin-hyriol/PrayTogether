import { useAuth } from '@/context/AuthContext';

export default function usePostFile(authentication = false) {
    const { accessToken } = useAuth();

    const postFile = async <T>(url: string, formData: FormData): Promise<T> => {
        const headers: HeadersInit = {};

        if (authentication && accessToken) {
            headers['Authorization'] = accessToken;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers, // ne pas définir Content-Type ici → laissé à FormData
            body: formData,
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

        return response.json() as Promise<T>;
    };

    return { postFile };
}
