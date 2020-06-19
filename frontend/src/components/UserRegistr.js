import React from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";

import axios from "axios";

import { API_URL, REACT_URL } from "../constants";

class UserRegistr extends React.Component {
    state = {
        email: '',
        username: '',
        password: '',
        password2: '', 
    }

    componentDidMount() {
        if (localStorage.getItem('access_token')) {
            window.location.assign(REACT_URL);
        }
        if (this.props.registr) {
          const { email, username, password, password2 } = this.props.registr;
          this.setState({ email, username, password, password2 });
        }
      }

      onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
      };

      response () {
          if (this.state.res.response === true) {
                    return (
                <div className="alert alert-success" role="alert">
                    Ркгистрация прошла успешна
                </div>
              );
          } else {
              return (
                <div className="alert alert-danger" role="alert">
                    Что то пошло не так
                </div>
              )
          }
      }

      createUser = e => {
        e.preventDefault();
        axios.post(API_URL + '/user/registr/', this.state).then(res => {
          this.state.res = res.data;
        });
      };

      defaultIfEmpty = value => {
        return value === "" ? "" : value;
      };

      render(h) {
          return (
            <Form className="container" onSubmit={this.createUser}>
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
              <Label for="username">Login:</Label>
              <Input
                type="text"
                name="username"
                onChange={this.onChange}
                value={this.defaultIfEmpty(this.state.username)}
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
            <FormGroup>
              <Label for="password2">Password2:</Label>
              <Input
                type="password"
                name="password2"
                onChange={this.onChange}
                value={this.defaultIfEmpty(this.state.password2)}
              />
            </FormGroup>
            <Input 
            type="submit"
            name="doGo"
            value="Registr"
            />
          </Form>
          )
      }
}

export default UserRegistr;

