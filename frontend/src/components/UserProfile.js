import React, { Component } from "react";
import { Button, Card,CardText } from "reactstrap";
import axios from "axios";

import { API_URL, REACT_URL } from "../constants";

class userProfile extends Component {

    slug = ''

    state = {
        "peg_next": true,
        "reposts": null,
        "id": '',
        "email": '',
        "username": '',
        "user_data": {
            "first_name": '',
            "last_name": '',
            "about_myself": '',
            "gender": '',
            "status": ''
        },
        "id_user": '',
    };

    JWT = {
        method: 'get',
        url: API_URL + 'user/',
    }

    pagination = {
        "limit": 5,
        "offset": 5,
    }

    gender () {
        switch (this.state.user_data.gender) {
            case '1':
                return 'Мужчина'
            case '2':
                return 'Женьшинв'        
            default:
                return ''
        }
    }

    status () {
        switch (this.state.user_data.status) {
            case '1':
                return 'Не женат'
            case '2':
                return 'Встречаюсь'   
            case '3':
                return 'Женат'
            case '4':
                return 'Влюблён' 
            case '5':
                return 'Всё сложно'
            case '6':
                return 'В активном поиске'      
            default:
                return ''
        }
    }

    openChat = () => {
        axios.post(API_URL + "chat/new/", {
            "id_user1": this.state.id_user,
            "id_user2": this.state.id,
        }).then(res => {
            document.location.replace(REACT_URL + 'chat/' + res.data.response);
            console.log(res.data)
        })
    }

    getUser () {
        axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
        axios.get(API_URL + 'user/').then(res => {
            console.log(this.slug + " " + res.data.id)
            if (this.slug == res.data.id) {
                document.location.replace(REACT_URL);
            } else {
                this.setState({'id_user': res.data.id})
            }
            
        })
    }

    getUserPage () {
        axios.get(API_URL + 'user/' + this.slug + '/').then(res => {
            this.setState(res.data)
        })
    }

    repost = (id, e) => {
        axios.post(API_URL + 'groups/post/addrepost/', {
            'id_post': e.target.name
        }).then(res => {
            if (res.data === true) {
                this.setState(state => {
                    const group_posts = state.reposts[id].is_repost = true
                    return group_posts
                })
            }
        })
    }

    removeRepost = (id, e) => {
        axios.post(API_URL + 'groups/post/removerepost/', {
            'id_post': e.target.name
        }).then(res => {
            if (res.data === true) {
                this.setState(state => {
                    const group_posts = state.reposts[id].is_repost = false
                    return group_posts
                })
            }
        })
    }

    liked = (id, e) => {
        axios.post(API_URL + 'groups/post/addlike/', {
            'id_post': e.target.name
        }).then(res => {
            if (res.data === true) {
                this.setState(state => {
                    let reposts = state.reposts[id].is_like = true
                    return reposts
                })
            }
        })
    }

    deliked = (id, e) => {
        axios.post(API_URL + 'groups/post/removelike/', {
            'id_post': e.target.name
        }).then(res => {
            if (res.data === true) {
                this.setState(state => {
                    let reposts = state.reposts[id].is_like = false
                    return reposts
                })
            }
        })
    }

    pegPosts (arr) {
        if (arr.length !== 0) {
            this.setState(state => {
                const reposts = state.reposts.concat(arr)
                return {reposts}
            })
            this.pagination.offset += 5;
        } else {
            this.setState({"peg_next": false})
        }
    }

    scrollPegPosts = () => {
        if (this.state.peg_next) {
            if (Math.round(document.body.getBoundingClientRect().bottom) ===  window.innerHeight) {
                let query = API_URL + "groups/post/reposts/"+ this.slug +"/?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset;
                axios.get(query).then(res => {
                    this.pegPosts(res.data.results)
                })
            }
        }
    }

    componentDidMount() {
        this.slug  = this.props.match.params.slug
        this.getUserPage()
        this.getUser()
        axios.get(API_URL + "groups/post/reposts/" + this.slug + "/").then(res => {
            this.setState({"reposts": res.data.results})
        })
        document.addEventListener("scroll", this.scrollPegPosts)
    };

    render(h) {

        const Posts = []

        for (const key in this.state.reposts) {
            let url = REACT_URL + "group/" + this.state.reposts[key].group.id + "/"
            Posts.push(
            <>
                <Card body id={key}>
                    <h5><a href={url}>{this.state.reposts[key].group.name}</a></h5>
                    <hr/>
                    <CardText>{this.state.reposts[key].text}</CardText>
                    <div class="container">
                        <div class="row">
                            { !this.state.reposts[key].is_like && 
                                <Button outline onClick={(e) => this.liked(key, e)} color="primary" name={this.state.reposts[key].id}>Like</Button>
                            }
                            { this.state.reposts[key].is_like && 
                                <Button onClick={(e) => this.deliked(key, e)} color="primary" name={this.state.reposts[key].id}>Like</Button>
                            }
                            { !this.state.reposts[key].is_repost && 
                                <Button outline onClick={(e) => this.repost(key, e)} color="secondary" name={this.state.reposts[key].id}>repost</Button>
                            }
                            { this.state.reposts[key].is_repost && 
                                <Button onClick={(e) => this.removeRepost(key, e)} color="secondary" name={this.state.reposts[key].id}>repost</Button>
                            }
                        </div>
                    </div>
                </Card>
            </>)
        }



        return (
            <>
                <div>
                    <h2>{this.state.user_data.first_name} {this.state.user_data.last_name}</h2>
                    <ul>
                        <li>Email: {this.state.email}</li>
                        <li>Пол: {this.gender()}</li>
                        <li>Семейное положение: {this.status()}</li>
                    </ul>
                    <h5>О себе:</h5>
                    <p>{this.state.user_data.about_myself}</p>
                </div>
                <Button color="primary" size="lg" onClick={this.openChat}>Написать сообщение</Button>
                <hr/>
                <div className="reposts">
                    {Posts}
                </div>
            </>
        )
    };
}

export default userProfile