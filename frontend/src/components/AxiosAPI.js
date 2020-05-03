import axios from "axios";
import { API_URL } from "../constants";   



export function refreshJWT() {
    setInterval(function() {
        axios({
            method: 'post',
            url: API_URL + 'auth/jwt/refresh/',
            data: {
                refresh: localStorage.getItem('refresh_token')
            }
        }).then(res => {
            localStorage.setItem('access_token', res.data.access);
        }).catch( res => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        });
    }, (1000 * 60 * 2.5) - 10)
}