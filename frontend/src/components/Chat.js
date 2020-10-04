import '../style/Chat.css'
import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { API_URL, REACT_URL, replaceLogin } from "../constants";
import axios from "axios";
import { Card, CardTitle, CardText, ButtonToggle, Input } from "reactstrap";


class Chat extends React.Component {

    client = null
    
    slug = null

    state = { 
      "your_data_user": {},
      "user": {},
      "next_page": "",
      "msgs": {},
      "msgValue": "",
      "newMsgs": 0,
      "onMessage": {},
      "pegMessages": true,
      "scrollBottom": true,
    }

    pagination = {
      "limit": 25,
      "offset": 25,
    }

    scrollToBottom = () => {
      if (this.state.scrollBottom === true) {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }
    }

    scrollPagination = (e) => {
      if (this.state.pegMessages) {
        if (e.target.scrollTop === 0) {
          let query = API_URL + "/chat/listmsgs/" + this.slug + "/?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset;
          axios.get(query, {
            headers: {
              Authorization: 'JWT ' + localStorage.getItem('access_token')
            }
          }).then(res => {
            console.log(res.data.msgs.results.length)
            if (res.data.msgs.results.length !== 0) {
              this.addPegMessage(res.data.msgs.results)
              this.pagination.offset += 25;
            } else {
              this.setState({pegMessage: false});
            }
          })
        }
      }
      if (this.state.scrollBottom === true) {
        if (e.target.scrollTop < e.target.offsetHeight ) {
          this.setState({scrollBottom: false});
        }
      } else {
        if (e.target.scrollTop === e.target.scrollHeight ) {
          this.setState({scrollBottom: true});
        }
      }
    }

    getUserData() {
      axios.get(API_URL + '/user/', {
        headers: {
          Authorization: 'JWT ' + localStorage.getItem('access_token')
        }
      }).then(res => {
        this.setState({
          "your_data_user": {
            "id": res.data.id,
            "username": res.data.username,
            "photo_user": res.data.user_data.photo_user 
          }
        })
      }).catch(() => {
        replaceLogin()
      })
    }

    getMessages() {
      axios.get(API_URL + '/chat/listmsgs/' + this.slug, {
        headers: {
          Authorization: 'JWT ' + localStorage.getItem('access_token')
        }
      }).then(res => {
        this.setState({
          "user": res.data.user[0],
          "next_page": res.data.msgs.next,
          "msgs": res.data.msgs.results, 
        })
      })
    }
    
    addMessage(msg) {
      let message = JSON.parse(msg);
      this.pagination.offset++;
      this.setState(state => {
        let new_msg = [{"text": message.message, "user": message.id_user}]
        const msgs = new_msg.concat(state.msgs);
        return {msgs}
      })
    }

    addPegMessage(res) {
      this.setState(state => {
        const msgs = state.msgs.concat(res);
        return {msgs}
      })
    }

    sendMessage = e => {
      e.preventDefault();
      this.client.send(JSON.stringify(
        { 
          "id_user": this.state.your_data_user.id,
          "message": this.state.msgValue,
        }
      ));
    }

    startBottonChat = (e) => {
      e.target.scrollTop = e.target.offsetHeight
    }

    defaultIfEmpty = value => {
      return value === "" ? "" : value;
    };

    onChange = e => {
      this.setState({ [e.target.name]: e.target.value });
    };
    
    componentDidMount() {
      this.slug = this.props.match.params.slug;
      this.getUserData();
      this.getMessages();
      this.client = new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/' + this.slug + '/');
      
      this.client.onopen = () => {
          console.log('WebSocket Client Connected');
      };

      this.client.onmessage = (e) => {
        this.addMessage(e.data);
      }
    };

    componentDidUpdate() {
      this.scrollToBottom();
    }
  
    render(h) {

      const Messages = []

      for (const key in this.state.msgs) {
        let url = this.state.msgs[key].user
        let username = (this.state.msgs[key].user == this.state.user.id) ? this.state.user.username : this.state.your_data_user.username
        Messages.unshift(
        <>
        <Card body>
          <CardTitle tag="a" href={REACT_URL + "/user/" + url}>
            {username}
          </CardTitle>
          <CardText>{this.state.msgs[key].text}</CardText>
        </Card>
        </>)
      }

      return (  
        <div className="chat">
          <div className="msgs" name="msgs" id="chat" onScroll={this.scrollPagination} onCompositionStart={this.startBottonChat}>
            
            {/* <Messages msgs={this.state.msgs} yourUsername={this.state.your_data_user.username} userId={this.state.user.id} username={this.state.user.username} /> */}
            {Messages}
            <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
            </div>  
          </div>
          <div className="sendMsg row justify-content-between">
            <Input 
            type="text"
            name="msgValue" 
            className="col-xl-9 input-msg" 
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.msgValue)} />
            <ButtonToggle className="col-xl-2" color="primary" onClick={this.sendMessage}>Отправить</ButtonToggle>
          </div>
        </div>
      )
    };
  }
  
  export default Chat;