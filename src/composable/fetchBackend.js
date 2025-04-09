import { useTokenStore } from '../store/tokenStore';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useRouter } from 'vue-router';

/*
* Composable pour fetch apiCodeine
* exemple : fetchBackend('users', 'GET', {adresse_mail : '123@gmail.com', password : 'moi'}, {page: 1, limit: 10})
*/
export async function fetchBackend(endpoint, method = 'GET', body = null, params = {}) {
    const router = useRouter();

    try {
        const URI = import.meta.env.VITE_URI;
        const API_PORT = import.meta.env.VITE_API_PORT;
        const url = new URL(`http://${URI}:${API_PORT}/${endpoint}`);
        const tokenStore = useTokenStore();

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        // Use token from store if available
        if (tokenStore.isAuthenticated) {
            options.headers['Authorization'] = `Bearer ${tokenStore.getToken}`;
        }

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        // Check for 401 status
        if (response.status === 401) {
            toast.error("Session expirée. Veuillez vous reconnecter.", {
                "theme": "colored",
                "type": "error",
                "position": "top-center",
                onClick: () => router.push('/')
            });
        }

        const data = await response.json();

        return {
            data,
            status: response.status,
            headers: response.headers
        };
    } catch (error) {
        console.error('Error fetching data:', error);

        // Handle network errors that might be related to authentication
        if (error.message && error.message.includes('401')) {
            toast.error("Session expirée. Veuillez vous reconnecter.", {
                onClick: () => router.push('/connexion')
            });
        }

        return {
            data: null,
            status: 'error',
            headers: null,
            error: error.message
        };
    }
}