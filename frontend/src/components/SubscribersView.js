import React, { Component } from "react";
import axios from "axios";
import { API_URL, REACT_URL, replaceLogin } from "../constants";
import {Card, Button} from "reactstrap";

class SubscribersView extends Component {

    state = {
        "id": null,
        "users": null,
    }

    slug = null;

    getUser () {
        axios.get(API_URL + '/user/').then(res => {
            this.setState({'id': res.data.id})
        }).catch(() => {
            replaceLogin()
        })
    }

    openChat = (id) => {
        axios.post(API_URL + "/chat/new/", {
            "id_user1": this.state.id,
            "id_user2": id,
        }).then(res => {
            document.location.replace(REACT_URL + '/chat/' + res.data.response);
            console.log(res.data)
        })
    }

    componentDidMount() {
        this.slug = this.props.match.params.slug;
        if (localStorage.getItem('access_token')) {
            axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
            this.getUser()
            axios.get(API_URL + '/groups/' + this.slug + "/subscribers/").then(res => {
                this.setState({"users": res.data})
            })
        } else {
            document.location.replace(REACT_URL + '/login');
        }
    };

    render() {

        const Users = []

        for (const key in this.state.users) {
            let url = REACT_URL + "/user/" + this.state.users[key].id + "/";
            const IsSendMsgs = [
                <hr/>,
                <Button color="primary" onClick={(e) => this.openChat(this.state.users[key].id)}>Send message</Button>
            ]
            Users.unshift(
            <>
               <Card body id={key}>
                    <h5><a href={url}>{this.state.users[key].username}</a></h5>
                    {this.state.users[key].id !== this.state.id &&
                        IsSendMsgs
                    }   
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

export default SubscribersView