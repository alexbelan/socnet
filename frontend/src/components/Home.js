import '../style/UserProfile.css'
import React, { Component } from "react";
import axios from "axios";
import { Card,CardText, Button } from "reactstrap";
import { API_URL, REACT_URL, replaceLogin } from "../constants";

class Home extends Component {

    state = {
        "peg_next": true,
        "reposts": null,
        "id": '',
        "username": '',
        "email": '',
        "user_data": {
            "first_name": '',
            "last_name": '',
            "photo_user": '',
            "about_myself": '',
            "gender": '',
            "status": '',
            "year_of_birth": '',
        },
        "friends": {
            "friends": 0,
            "request_friends": 0,
        }
        
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
        switch (this.state.user_data.gender) {
            case '1':
                return 'Man'
            case '2':
                return 'Women'        
            default:
                return 'No gender'
        }
    }

    status () {
        switch (this.state.user_data.status) {
            case '1':
                return 'Not married'
            case '2':
                return 'Dating'   
            case '3':
                return 'Married'
            case '4':
                return 'In love' 
            case '5':
                return "It's Complicated"
            case '6':
                return 'Actively looking'      
            default:
                return 'No status'
        }
    }

    liked = (id, e) => {
        axios.post(API_URL + '/groups/post/addlike/', {
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
        axios.post(API_URL + '/groups/post/removelike/', {
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
        axios.post(API_URL + '/groups/post/removerepost/', {
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
                let query = API_URL + "/groups/post/reposts/"+ this.state.id +"/?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset;
                axios.get(query).then(res => {
                    this.pegPosts(res.data.results)
                })
            }
        }
    }

    componentDidMount() {
        if (localStorage.getItem('access_token')) {
            axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
            axios.get(API_URL + '/user/').then(res => {
                this.setState(res.data)
                axios.get(API_URL + "/groups/post/reposts/" + res.data.id + "/").then(res => {
                    this.setState({
                        "reposts": res.data.results,
                        "peg_next": (res.data.next) ? true : false,
                    })
                })
            }).catch(() => {
                replaceLogin()
            })
        } else {
            document.location.replace(REACT_URL + '/login');
        }
        document.addEventListener("scroll", this.scrollPegPosts)
    };

    render(h) {

        const Posts = []
        const AboutMyself = [
            <h5>About myself:</h5>,
            <p>{this.state.user_data.about_myself}</p>
        ]

        for (const key in this.state.reposts) {
            let url = REACT_URL + "/group/" + this.state.reposts[key].group.id + "/"
            Posts.push(
            <>
                <Card body id={key}>
                    <h5><a href={url}>{this.state.reposts[key].group.name}</a></h5>
                    <hr/>
                    <CardText>{this.state.reposts[key].text}</CardText>
                    { this.state.reposts[key].image !== null && 
                        <img className="img-post" src={API_URL + this.state.reposts[key].image }/>
                    }
                    <div className="container">
                        <div className="row">
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
                <div className="container user-data" >
                    <div className="row">
                        <div className="block-user-data">
                            <img src={API_URL + this.state.user_data.photo_user} className="photo-user profile"/>
                        </div>
                        <div className="block-user-data">
                            <h2>Hello {this.state.username}</h2>
                            <h4>{this.state.user_data.first_name} {this.state.user_data.last_name}</h4>
                            <ul>
                                <li>Email: {this.state.email}</li>
                                <li>Gender: {this.gender()}</li>
                                <li>Family status: {this.status()}</li>
                                <li>Friends: {this.state.friends.friends}</li>
                            </ul>
                            {this.state.user_data.about_myself !== "" &&
                                AboutMyself
                            }
                        </div>
                        <div className="block-user-data">
                            {this.state.friends.request_friends === 0 &&
                                <Button outline tag="a" href={REACT_URL + "/request/all/"} color="primary">New Friends {this.state.request_freands}</Button>
                            }
                            {this.state.friends.request_friends !== 0 &&
                                <Button tag="a" href={REACT_URL + "/request/all/"} color="primary">New Friends {this.state.request_freands}</Button>
                            }
                        </div>
                    </div>
                    
                </div>
                <div className="reposts posts content">
                    {Posts}
                </div>
            </>
        )
    };
}

export default Home