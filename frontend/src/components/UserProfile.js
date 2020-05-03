import React, { Component } from "react";
import axios from "axios";

import { API_URL } from "../constants";

class userProfile extends Component {

    slug = ''

    state = {
        "id": '',
        "email": '',
        "username": '',
        "user_data": {
            "first_name": '',
            "last_name": '',
            "about_myself": '',
            "gender": '',
            "status": ''
        }
    };

    JWT = {
        method: 'get',
        url: API_URL + 'user/',
    }

    gender () {
        switch (this.state.user_data.gender) {
            case '1':
                return 'Мужчина'
            case '2':
                return 'Женьшинв'        
            default:
                return ''
        }
    }

    status () {
        switch (this.state.user_data.status) {
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
        let slug  = this.props.match.params
        axios.get(API_URL + 'user/' + slug.slug + '/').then(res => {
            this.setState(res.data)
        })
    };

    render(h) {
        return (
            <div>
                <h2>{this.state.user_data.first_name} {this.state.user_data.last_name}</h2>
                <ul>
                    <li>Email: {this.state.email}</li>
                    <li>Пол: {this.gender()}</li>
                    <li>Семейное положение: {this.status()}</li>
                </ul>
                <h5>О себе:</h5>
                <p>{this.state.user_data.about_myself}</p>
            </div>
        )
    };
}

export default userProfile