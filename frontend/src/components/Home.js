import React, { Component } from "react";
import axios from "axios";

import { API_URL } from "../constants";

class Home extends Component {

    state = {
        id: '',
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        about_myself: '',
        gender: '',
        status: '',
        year_of_birth: '',
    };

    JWT = {
        method: 'get',
        url: API_URL + 'user/',
    }

    gender () {
        switch (this.state.gender) {
            case '1':
                return 'Мужчина'
            case '2':
                return 'Женьшинв'        
            default:
                return ''
        }
    }

    status () {
        switch (this.state.status) {
            case '1':
                return 'Не женат'
            case '2':
                return 'Встречаюсь'   
            case '3':
                return 'Женат'
            case '4':
                return 'Влюблён' 
            case '5':
                return 'Всё сложно'
            case '6':
                return 'В активном поиске'      
            default:
                return ''
        }
    }

    componentDidMount() {
        if (localStorage.getItem('access_token')) {
            axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
            axios.get(API_URL + 'user/').then(res => {
                this.setState(res.data)
            })
        } else {
            document.location.replace('http://localhost:3000/login');
        }
    };

    render(h) {
        return (
            <div>
                <h2>Привет {this.state.username}</h2>
                <h4>Полное имя: {this.state.first_name} {this.state.last_name}</h4>
                <ul>
                    <li>Email: {this.state.email}</li>
                    <li>Пол: {this.gender()}</li>
                    <li>Семейное положение: {this.status()}</li>
                </ul>
                <h5>О себе:</h5>
                <p>{this.state.about_myself}</p>
            </div>
        )
    };
}

export default Home