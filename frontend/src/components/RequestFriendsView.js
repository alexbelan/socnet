import React, { Component } from "react";
import axios from "axios";
import { API_URL, REACT_URL, replaceLogin } from "../constants";
import {Card, Button} from "reactstrap";

class RequestFriendsView extends Component {

    state = {
        "users": null,
    }

    addFriend = (id, key, e) => {
        axios.post(API_URL + "/user/friends/accept/", {
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

    deleteFriend = (id, key, e) => {
        axios.post(API_URL + "/user/friends/reject/", {
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
            axios.get(API_URL + '/user/friends/requestall/').then(res => {
                this.setState({"users": res.data})
            }).catch(() => {
                replaceLogin()
            })
        } else {
            document.location.replace(REACT_URL + '/login');
        }
    };

    render() {

        const Users = []

        for (const key in this.state.users) {
            let url = REACT_URL + "/user/" + this.state.users[key].id + "/";
            Users.unshift(
            <>
               <Card body id={key}>
                    <h5><a href={url}>{this.state.users[key].username}</a></h5>
                    <hr/>
                    <div class="container">
                        <div class="row">
                            <Button onClick={(e) => this.addFriend(this.state.users[key].id, key,  e)} color="primary">Add</Button>
                            <Button outline onClick={(e) => this.addFriend(this.state.users[key].id, key,  e)} color="danger">Delete</Button>
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

export default RequestFriendsView