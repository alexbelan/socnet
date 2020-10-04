export const API_URL = "http://localhost:8000";
export const REACT_URL = "http://localhost:3000"

export const JWT = {
    method: 'get',
    url: API_URL + 'user/',
    headers: {
        Authorization: 'JWT ' + localStorage.getItem('access_token')
    }
}

export function replaceLogin () {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    document.location.replace(REACT_URL + '/login');
}