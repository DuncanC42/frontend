import { useTokenStore } from '../store/tokenStore';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useRouter } from 'vue-router';

export async function fetchBackend(endpoint, method = 'GET', body = null, params = {}) {
    const router = useRouter();
    const tokenStore = useTokenStore();

    try {
        const url = new URL(`http://localhost:8050/${endpoint}`);
        //const tokenStore = useTokenStore();

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'omit'
        };
        
        if (tokenStore.isAuthenticated) {
            options.headers['Authorization'] = `Bearer ${tokenStore.getToken}`;
        }

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        try {
            const data = await response.json();
            return { data, status: response.status, headers: response.headers };
        } catch {
            return { data: null, status: response.status, headers: response.headers };
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);

        toast.error(error.message || "Erreur de connexion", {
            onClick: () => router.push('/')
        });

        return {
            data: null,
            status: 'error',
            headers: null,
            error: error.message
        };
    }
}