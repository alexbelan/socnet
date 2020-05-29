import React from "react";
import { Switch, Route } from 'react-router-dom'
import UserRegistr from './UserRegistr';
import Home from './Home';
import UserLogin from './UserLogin';
import UserSetting from './UserSetting';
import UserProfile from './UserProfile';
import ChatsView from './ChatsView';
import Chat from './Chat';
import SubView from './SubView';
import GroupView from './GroupView';
import NewsView from './NewsView';
import CreateGroupView from './CreateGroupView';

const Main = () => (
      <main>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/registr' component={UserRegistr}/>
        <Route path='/login' component={UserLogin}/>
        <Route path='/setting' component={UserSetting}/>
        <Route path='/user/:slug/' component={UserProfile}/>
        <Route path='/chats' component={ChatsView}/>
        <Route path='/chat/:slug/' component={Chat}/>
        <Route path='/groups/' component={SubView}/>
        <Route path='/group/:slug/' component={GroupView}/>
        <Route path='/news/' component={NewsView}/>
        <Route path='/create/group/' component={CreateGroupView}/>
      </Switch>
      </main>
  )

  export default Main;