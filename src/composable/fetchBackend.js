const STATIC_TOKEN = 'your-static-token-here';
/*
* Composable pour fetch apiCodeine
* exemple : fetchBackend('users', 'GET', {adresse_mail : '123@gmail.com', pseudo : 'moi'}, {page: 1, limit: 10})
*/
export async function fetchBackend(endpoint, method = 'GET', body = null, params = {}) {
    try {
        const url = new URL(`http://localhost:8050/${endpoint}`);

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STATIC_TOKEN}`
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        return {
            data,
            status: response.status,
            headers: response.headers
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            data: null,
            status: 'error',
            headers: null,
            error: error.message
        };
    }
}