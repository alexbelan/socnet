import React from "react";
import { Switch, Route } from 'react-router-dom'
import UserRegistr from './UserRegistr';
import Home from './Home';
import UserLogin from './UserLogin';
import UserSetting from './UserSetting';
import UserProfile from './UserProfile';

const Main = () => (
      <main>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/registr' component={UserRegistr}/>
        <Route path='/login' component={UserLogin}/>
        <Route path='/setting' component={UserSetting}/>
        <Route path='/user/:slug/' component={UserProfile}/>
      </Switch>
      </main>
  )

  export default Main;