import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import * as AxiosAPI from './components/AxiosAPI';
import axios from "axios";
import { API_URL } from "./constants";   
import {BrowserRouter as Router} from 'react-router-dom'




export default class App extends Component {

  authenticated () {
      axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
      AxiosAPI.refreshJWT()
      axios.get(API_URL + 'user/check/')
  }

  componentDidMount() {
      this.authenticated();
  };  

  render(h) {
    return (  
      <Router>
        <Header/>
        <Main/>
      </Router>
    )
  }
}

