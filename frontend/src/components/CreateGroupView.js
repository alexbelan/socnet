import React from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";

import axios from "axios";

import { API_URL } from "../constants";

class CreateGroupView extends React.Component {
    state = {
        "name": "",
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    createGroup = e => {
        e.preventDefault();
        axios.post(API_URL + 'groups/new/', this.state).then(res => {
            if (res.data.res) {
                window.location.assign('http://localhost:3000/group/' + res.data.res + '/');
            }
        });
    };

    defaultIfEmpty = value => {
        return value === "" ? "" : value;
    };

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
    }

    render(h) {
        return (
        <Form onSubmit={this.createGroup}>
        <FormGroup>
            <Label for="name">Name group:</Label>
            <Input
            type="text"
            name="name"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.name)}
            />
        </FormGroup>
        <Input 
        type="submit"
        name="doGo"
        value="Create Group"
        />
        </Form>
        )
    }
}

export default CreateGroupView;