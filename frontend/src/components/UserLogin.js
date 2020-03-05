import React from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";

import axios from "axios";

import { API_URL } from "../constants";
import { axiosInstance } from "../constants";

class UserLogin extends React.Component {
    state = {
        email: '',
        password: '',
        error: false,
    }

    componentDidMount() {
      if (localStorage.getItem('access_token')) {
          window.location.assign('http://localhost:3000/');
      }
        if (this.props.login) {
          const { email, password } = this.props.login;
          this.setState({ email, password, });
        }
      };

      onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
      };

      loginUser = e => {
        e.preventDefault();
        axios.post(API_URL + 'auth/jwt/create/', {
          email: this.state.email,
          password: this.state.password,
        }).then(res => {
            console.log(res.data)
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            window.location.assign('http://localhost:3000/');
        });
        // this.setState({ error: true })
      };

      defaultIfEmpty = value => {
        return value === "" ? "" : value;
      };

      render(h) {
        return (
          <>
          <Form onSubmit={this.loginUser}>
          <FormGroup>
            <Label for="email">Email:</Label>
            <Input
              type="email"
              name="email"
              onChange={this.onChange}
              value={this.defaultIfEmpty(this.state.email)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password:</Label>
            <Input
              type="password"
              name="password"
              onChange={this.onChange}
              value={this.defaultIfEmpty(this.state.password)}
            />
          </FormGroup>
          <Input 
          type="submit"
          name="doGo"
          />

        </Form>
          { this.state.error === true  &&
            <div class="alert alert-danger" role="alert">
              Вы не верно ввели Email или пароль
            </div> }
          </>
        )
    };
}

export default UserLogin;