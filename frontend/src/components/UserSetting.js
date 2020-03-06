import React, { Component } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";

import {API_URL} from "../constants";

console.log(localStorage.getItem('access_token'))

class UserSetting extends Component {
   
    JWT = {
        method: 'get',
        url: API_URL + 'user/setting/',
        headers: {
            Authorization: 'JWT ' + localStorage.getItem('access_token')
        }
    }
      

    state = {
        first_name: '',
        last_name: '',
        about_myself: '',
        gender: '',
        status: '',
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    componentDidMount() {
        if (localStorage.getItem('access_token')) {
            axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
            axios.get(API_URL + 'user/setting/').then(res => {
                this.setState(res.data)
            })
        } else {
            document.location.replace('http://localhost:3000/login');
        }
    };

    settingUser = e => {
        e.preventDefault();
        axios.put(API_URL + 'user/setting/', this.state, {
            headers: {
                Authorization: 'JWT ' + localStorage.getItem('access_token')
            }
        })
        .then(res => {
            console.log(res.data)
        })
    };

    render (h) {
        return (
        <Form onSubmit={this.settingUser}>
            <FormGroup>
                <Label for="name">First name:</Label>
                <Input 
                value={this.state.first_name}
                type="text" name="first_name" 
                placeholder="First name"
                onChange={this.onChange}
                />
            </FormGroup>
            <FormGroup>
                <Label for="name">Last name:</Label>
                <Input 
                value={this.state.last_name} 
                type="text" 
                name="last_name" 
                placeholder="Last name" 
                onChange={this.onChange}
                />
            </FormGroup>
            <FormGroup> 
                <Label for="gender">Gender:</Label>
                <Input value={this.state.gender} type="select" name="gender" onChange={this.onChange}>
                    <option value='0'>Нет пола</option>
                    <option value='1'>Мужчина</option>
                    <option value='2'>Женьшина</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="status">Status:</Label>
                <Input value={this.state.status} type="select" name="status" id="exampleSelect" onChange={this.onChange}>
                    <option value='0'>Нет статуса</option>
                    <option value='1'>Не женат</option>
                    <option value='2'>Встречаюсь</option>
                    <option value='3'>Женат</option>
                    <option value='4'>Влюблён</option>
                    <option value='5'>Всё сложно</option>
                    <option value='6'>В активном поиске</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="about_myself">About myself</Label>
                <Input value={this.state.about_myself} type="textarea" name="about_myself" onChange={this.onChange} />
            </FormGroup>
            <Input type="submit" name="doGo" />
        </Form>
        )
    }
}

export default UserSetting