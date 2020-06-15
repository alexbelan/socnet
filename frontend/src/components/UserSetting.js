import React, { Component } from "react";
import { Nav, NavItem } from "reactstrap";
import { Link } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom'
import UserSettingData from "./UserSettingData"
import UserSettingPhoto from "./UserSettingPhoto"


class UserSetting extends Component {

    render (h) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-2">
                        <Nav vertical>
                            <NavItem>
                                <Link to="/setting/user/">User Data</Link>
                            </NavItem>
                            <NavItem>
                                <Link to="/setting/photo/">Photo</Link>
                            </NavItem>
                        </Nav>
                    </div>
                    <div className="col-7">
                        <Switch>
                            <Route path='/setting/user/' component={ UserSettingData }/>
                            <Route path='/setting/photo/' component={ UserSettingPhoto }/>
                        </Switch>  
                    </div>
                </div>
            </div>
        )
    }
}

export default UserSetting