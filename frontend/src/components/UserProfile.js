import React, { Component } from "react";
import { Button } from "reactstrap";
import axios from "axios";

import { API_URL, REACT_URL } from "../constants";

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
        },
        "id_user": '',
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

    openChat = () => {
        axios.post(API_URL + "chat/new/", {
            "id_user1": this.state.id_user,
            "id_user2": this.state.id,
        }).then(res => {
            document.location.replace(REACT_URL + 'chat/' + res.data.response);
            console.log(res.data)
        })
    }

    getUser () {
        axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
        axios.get(API_URL + 'user/').then(res => {
            this.setState({'id_user': res.data.id})
        })
    }

    getUserPage () {
        axios.get(API_URL + 'user/' + this.slug + '/').then(res => {
            this.setState(res.data)
        })
    }

    componentDidMount() {
        this.slug  = this.props.match.params.slug
        this.getUserPage()
        this.getUser()
    };

    render(h) {
        return (
            <>
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
                <Button color="primary" size="lg" onClick={this.openChat}>Написать сообщение</Button>
            </>
        )
    };
}

export default userProfile