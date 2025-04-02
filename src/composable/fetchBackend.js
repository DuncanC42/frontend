const STATIC_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NDM2MDMzMTcsImV4cCI6MTc0MzYxMDUxNywicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiZGVuaXNlMTBAc2ZyLmZyIn0.tuj9iTb8xqV8vpRapMlAhHs14fCwIXc-OKyKGLya_IYbpI-j4WHnTU6GveW3Iv_qU8JSW2dXs_FTf879CjSk-9l9qLyAVRh-CzsQuUFgGdUroEGWkOzPW0RIHwc7MA_0MTmxFksMZg3uEY_FoR8dyW7i6nO4RB1_R1KRif7SXRX21fhhCss6MJWNbZjPebugmu34d1bHK_88RVI8lYIc30FR8BC_wKVG58SCdnfkyyC-cFgNsArWacKhBb17ED11PcBvlVtTPrhMUdbBkXTws6VDhXW9qOZ7vPqBuQixT_ImZXUirE_EA8PwH8Nb1GpCJziywQTA4VslFdvyW6RoL7Zy8U7dv84yEVNh0o_YvaC0iHbk7TTw4yBWywuOXiVLFRHbiaTsUwR-xyM6Q1HvqMCMn9g3yFvfP0-vfgudJBDflO6SeFXSXD1oQZPhlqcplhK4Hg3TzH5wY-zYeRmHZpK5gJuQCbqtw5HQCWZPp7h72RqrPWkEcfjgqbHfZ_AaWy79_J3HwJSO28xwjUb87U4z4HJMLWt8IcFsBnRVls6SOF6dvD8ENekcuUnWv5Ee5PssDNkz_WJ9FWDveo6jLstK5om_yL4NhdKopn1q9D7mxwKdw2g8DBIsp_FQpkVSdxN6kHedo3MTB5iVqdQ2BrvpMS5Lmtv8AT7Aa1khV_8'
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