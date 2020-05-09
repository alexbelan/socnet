import React, { Component } from 'react';
// import React from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import axios from "axios";

import { API_URL, REACT_URL } from "../constants";

function ChatsList(props) {
  if (props.chats) {
    const chats = props.chats;
    const listItems = []
    for(let key in chats) {
      listItems.push(<ListGroupItem tag="a" href={REACT_URL + "chat/" + key} action>{chats[key].username}</ListGroupItem>)
    }
    return (
      <>{listItems}</>
    );
  }
  return ("Данных нет")
}


class ChatView extends React.Component {

  state = {
    "chats": {}
  }

  componentDidMount() {
    axios.get(API_URL + "chat/views/", {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('access_token')
      }
    }).then(res => {
      this.setState({"chats": res.data.response})
    })
  };

  render(h) {
    return (  
      <>
        <ListGroup>
          <ChatsList chats={this.state.chats} />
        </ListGroup>
      </>
    )
  };
}

export default ChatView;