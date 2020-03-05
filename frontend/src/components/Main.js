import React from "react";
import { Switch, Route } from 'react-router-dom'
import UserRegistr from './UserRegistr';
import Home from './Home';
import UserLogin from './UserLogin';
import UserSetting from './UserSetting';

const Main = () => (
      <main>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/registr' component={UserRegistr} username='Игорь'/>
        <Route path='/login' component={UserLogin}/>
        <Route path='/setting' component={UserSetting}/>
      </Switch>
      </main>
  )

  export default Main;