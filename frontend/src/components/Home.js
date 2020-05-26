import React, { Component } from "react";
import axios from "axios";
import { Card,CardText, Button } from "reactstrap";
import { API_URL, REACT_URL } from "../constants";

class Home extends Component {

    state = {
        "peg_next": true,
        "reposts": null,
        "id": '',
        "username": '',
        "email": '',
        "first_name": '',
        "last_name": '',
        "about_myself": '',
        "gender": '',
        "status": '',
        "year_of_birth": '',
    };

    JWT = {
        "method": 'get',
        "url": API_URL + 'user/',
    }

    pagination = {
        "limit": 5,
        "offset": 5,
    }

    gender () {
        switch (this.state.gender) {
            case '1':
                return 'Мужчина'
            case '2':
                return 'Женьшинв'        
            default:
                return ''
        }
    }

    status () {
        switch (this.state.status) {
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

    removeRepost = (id, e) => {
        axios.post(API_URL + 'groups/post/removerepost/', {
            'id_post': e.target.name
        }).then(res => {
            if (res.data === true) {
                this.setState(state => {
                    const reposts = state.reposts.splice(id, 1)
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
                let query = API_URL + "groups/post/reposts/"+ this.state.id +"/?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset;
                axios.get(query).then(res => {
                    this.pegPosts(res.data.results)
                })
            }
        }
    }

    componentDidMount() {
        if (localStorage.getItem('access_token')) {
            axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
            axios.get(API_URL + 'user/').then(res => {
                this.setState(res.data)
                axios.get(API_URL + "groups/post/reposts/" + res.data.id + "/").then(res => {
                    this.setState({
                        "reposts": res.data.results,
                        "peg_next": (res.data.next) ? true : false,
                    })
                })
            })
        } else {
            document.location.replace(REACT_URL + 'login');
        }
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
                    <h2>Привет {this.state.username}</h2>
                    <h4>Полное имя: {this.state.first_name} {this.state.last_name}</h4>
                    <ul>
                        <li>Email: {this.state.email}</li>
                        <li>Пол: {this.gender()}</li>
                        <li>Семейное положение: {this.status()}</li>
                    </ul>
                    <h5>О себе:</h5>
                    <p>{this.state.about_myself}</p>
                </div>
                <div className="reposts">
                    {Posts}
                </div>
            </>
        )
    };
}

export default Home