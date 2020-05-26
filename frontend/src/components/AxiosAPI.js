import axios from "axios";
import { API_URL, REACT_URL } from "../constants";   



export function refreshJWT() {
    setInterval(function() {
        if(localStorage.getItem('refresh_token')) {
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
                // if (window.location.href !== REACT_URL + "login" || window.location.href !== REACT_URL + "registr" ) {
                //     document.location.replace(REACT_URL + 'login');
                // }
            });
        } 
    }, (1000 * 60 * 2.5) - 10)
}

export function replaceLogin () {
    document.location.replace(REACT_URL + 'login');
}