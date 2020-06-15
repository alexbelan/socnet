import React, { Component } from "react";
import axios from "axios";
import { API_URL, REACT_URL } from "../constants";
import {ListGroupItem, Button} from "reactstrap";

function ListGroups (props) {
    if (props.GroupId) {
      return (
        <ListGroupItem tag="a" href={REACT_URL + "/group/" + props.GroupId} action>{props.GroupName}</ListGroupItem>
      );
    }
    return ("Данных нет")
}

class SubView extends Component {

    state = {
        "groups": null,
    }

    componentDidMount() {
        if (localStorage.getItem('access_token')) {
            axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
            axios.get(API_URL + '/groups/subscriptions/').then(res => {
                this.setState({"groups": res.data})
            })
        } else {
            document.location.replace('http://localhost:3000/login');
        }
    };

    render() {

        const groups = []

        for (const key in this.state.groups) {
            groups.unshift(
            <>
               <ListGroups GroupId={this.state.groups[key].id} GroupName={this.state.groups[key].name} />
            </>)
        }


        return(
        <>
        <div className="container">
            <div className="row">
                <div className="content">
                    {groups}
                </div>
                <div>
                    <Button teg="a" href={REACT_URL + "create/group/"} color="primary">Create group</Button>
                </div>
            </div>
        </div>
        </>
        )
    }   

}

export default SubView