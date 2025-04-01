const STATIC_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NDM1MTc5NjIsImV4cCI6MTc0MzUyNTE2Miwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiZGVuaXNlMTBAc2ZyLmZyIn0.B_-yERUK731jv3HIQ5pPmPJEIKRE67dGn3MfbSzde6Q8V3UVLtlIf5uC0VGjWDUOXoPyPmmAyGquRYBv4oTGmYJhsivsxJNp912O5djCkMxDaGYQ_jJgrA5rYNnvpyW-CjkIo9G4lCiJaeOkKNb69brVEsRVpVGxYKtD3nwuTPu_zLQprN29yAPc8evAfeP22wR6TLfyhH3BK4yTO3tKYjZL-LuW1xHXvwDlkxFi25LFVpkZP300VT7_vBCZWrB8EhDxt2jKuD6VxQ2n5FcvXtrS1Z4sUD0vilOFTgPCQYRQ0amxcAyARLTmhOaVv2cA1NBDzQLIRaN4CbwA4ERJlb4ePFAlNfJc8y7J6LLGZGsBVUJ61QhnHXz_Z80mRKSIxctoJvVOX7nf354PKALVxWM_BuWHdO6K2UgUOBuOPm0pYrsfCumha2UeZ-3M6o2AC4qV_gRwFraQ9CGGQVpeciWIVTfwB-1E5yREsKtx4OFVlZBG-t4wyEINvwaBTCsheqQjUA5gTxUgCDgT7o7CVMVNd0WZBe3yLULcYIFE68YWcv7K8vAbt6RZ8jZTH8cVt8MoI7l6CWMqMcwK3vltZaqJaVYXnyIw0ij7B2VKBlYLqeWyjtK-7y80q97UWg6xtGXB6Rw8jGBKkB4o4zOHpytjDye-OzvEMS0c4pTTm7Q';
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