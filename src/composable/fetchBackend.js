const STATIC_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NDM2NjI5NjEsImV4cCI6MTc0MzY3MDE2MSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGhpYmF1bHQubmljb2xlQGphY3F1b3QuZnIifQ.I5wHP7NWW3WclYW-VVcMu0vAkMJWTDI53Ys0hs-0HpxWWPSxvLxk8e6BjEoT75yMo7L8zuiXGikARKtKq0NCOCaU89IPzEWQ_bFSPNB8i5n2X9LbJQdcEa-8eiWocqOXiKhtmWWpgprpEK_2A-Sh1amLl_p0LKizHiIU62TpFs4iNVA8H5ePVEZ4H42azeAREPkfq2dpZq30rhIdE8DQROuDYXSLE_vqZCEKOJi20GRy1gtVDywAamf8wf6GSWxPQAvjWA7XyiBA_EPj_NyjPe9J2J5WEpjOiNIfALYfNvXjjrzsDbSw-ghioxJ3qcf8H7lufNgM9_oOrKwSxdCSFUfF00dmZPdCxf8An-901eBiCNTZJ6ZxfOUtnzVQhHxRy5KMkUWaWI3WGz_hDFJ5XCVcYE79jkeeij_D-JkrjwLonCPz-wstkkLyueRUboiZy-U3ywpaYZtUP2bqCvc5r7fC_ccnpmVsnBYsb1qwrQDydttiMzldnwdSiNPCOwWqKaRLeVZCwQvI83rOGg_rrcdrKN00FHV82w23wOtXNKVi0Scw-S5z-BntnMSOBaJruYnwj5_bcrlbDWYCIGvnO8FCG7lMm6F62nydDYaAdVjxaBS8Mrg2CrMhSpkbr_7NpHgbrK9KVmdDkCO_UCQr21vFhqXHI9pjY8650KJIUOM';
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