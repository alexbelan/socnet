import React, { Component } from "react";
import axios from "axios";
import { API_URL, REACT_URL } from "../constants";
import {Card, Button} from "reactstrap";

class FriendsAll extends Component {

    state = {
        "id": null,
        "users": null,
    }

    getUser () {
        axios.get(API_URL + 'user/').then(res => {
            this.setState({'id': res.data.id})
        })
    }

    openChat = (id) => {
        axios.post(API_URL + "chat/new/", {
            "id_user1": this.state.id,
            "id_user2": id,
        }).then(res => {
            document.location.replace(REACT_URL + 'chat/' + res.data.response);
            console.log(res.data)
        })
    }

    deleteFriend = (id, key, e) => {
        axios.post(API_URL + "user/friends/delete/", {
            "id_user": id,
        }).then(res => {
            if (res.data) {
                this.setState(state => {
                    const users = state.users.splice(key, 1)
                    return users;
                })
            }
        })
    }

    componentDidMount() {
        if (localStorage.getItem('access_token')) {
            axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
            this.getUser()
            axios.get(API_URL + 'user/friends/').then(res => {
                this.setState({"users": res.data})
            })
        } else {
            document.location.replace('http://localhost:3000/login');
        }
    };

    render() {

        const Users = []

        for (const key in this.state.users) {
            let url = REACT_URL + "user/" + this.state.users[key].id + "/";
            Users.unshift(
            <>
               <Card body id={key}>
                    <h5><a href={url}>{this.state.users[key].username}</a></h5>
                    <hr/>
                    <div class="container">
                        <div class="row">
                            <Button color="primary" onClick={(e) => this.openChat(this.state.users[key].id)}>Send message</Button>
                            <Button outline onClick={(e) => this.deleteFriend(this.state.users[key].id, key, e)} color="danger">Delete</Button>
                        </div>
                    </div>
                </Card>
            </>)
        }


        return(
        <>
        <div className="container">
            <div className="row">
                <div className="content">
                    {Users}
                </div>
            </div>
        </div>
        </>
        )
    }   
}

export default FriendsAll