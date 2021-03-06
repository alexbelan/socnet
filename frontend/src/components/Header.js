import React, { Component } from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import { REACT_URL } from "../constants"; 


class Header extends Component {

    logOut() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        document.location.replace(REACT_URL + '/login');
    }

    render() {
        return (
            <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    { localStorage.getItem('access_token') &&
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/chats">Chat</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/friends/all/">Friends</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/groups">Groups</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/news">News</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/setting/user/">Setting</Link>
                            </li>
                        </>
                    }
                </ul>
                { !localStorage.getItem('access_token') &&
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/registr">Registr</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li> 
                        
                    </ul> }
                    { localStorage.getItem('access_token') &&
                        <div>
                            <button type="button" className="btn btn-danger" onClick={this.logOut}>Log out</button>
                        </div> 
                    }
            </nav>
            
        </header> 
      
    );
  }
}

export default Header;