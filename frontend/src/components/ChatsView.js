import React, { Component } from 'react';
// import React from "react";
import { ListGroup, Card } from "reactstrap";
import axios from "axios";
import "../style/ChatsView.css"

import { API_URL, REACT_URL, replaceLogin } from "../constants";


class ChatView extends React.Component {

  state = {
    "chats": {}
  }

  componentDidMount() {
    axios.get(API_URL + "/chat/views/", {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('access_token')
      }
    }).then(res => {
      this.setState({"chats": res.data.response})
    }).catch(() => {
      replaceLogin()
    })
  };

  render(h) {


    const Chats = []

    for (const key in this.state.chats) {
      let url = REACT_URL + "/chat/" + key + "/";
      Chats.unshift(
      <>
         <Card tag="a" href={url} id={key}>
              <div class="container">
                  <div class="row data-chat">
                      <div className="block-chat">
                          <a href={url}>
                              <img className="photo-user" src={API_URL + this.state.chats[key].photo_user} />
                          </a>
                      </div>
                      <div className="block-chat">
                            <h5><a href={url}>{this.state.chats[key].username}</a></h5>
                      </div>
                  </div>
              </div>
          </Card>
      </>)
  }

    return (  
      <>
        <ListGroup>
          {Chats}
        </ListGroup>
      </>
    )
  };
}

export default ChatView;