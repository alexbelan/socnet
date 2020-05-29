import "../style/GroupView.css"
import React, { Component } from "react";
import axios from "axios";
import { API_URL, REACT_URL } from "../constants";
import { Card, Button, CardText, FormGroup, Input, CardTitle } from "reactstrap";

class GroupView extends Component {

    state = {
        "peg_next": true,
        "group_data": {
            "id": null,
            "name": null,
            "subscribe": null,
            "is_admin": false
        },
        "group_posts": null,
        "new_post": {
            "value": "",
        }
    }

    pagination = {
        "limit": 5,
        "offset": 5,
    }

    slug = null

    liked = (id, e) => {
        axios.post(API_URL + 'groups/post/addlike/', {
            'id_post': e.target.name
        }).then(res => {
            if (res.data === true) {
                this.setState(state => {
                    let group_posts = state.group_posts[id].is_like = true
                    group_posts = state.group_posts[id].num_likes++
                    return group_posts
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
                    let group_posts = state.group_posts[id].is_like = false
                    group_posts = state.group_posts[id].num_likes--
                    return group_posts
                })
            }
        })
    }

    repost = (id, e) => {
        axios.post(API_URL + 'groups/post/addrepost/', {
            'id_post': e.target.name
        }).then(res => {
            if (res.data === true) {
                this.setState(state => {
                    const group_posts = state.group_posts[id].is_repost = true
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
                    const group_posts = state.group_posts[id].is_repost = false
                    return group_posts
                })
            }
        })
    }

    deletePost = (id, e) => {
        axios.post(API_URL + 'groups/post/remove/', {
            "id_post": e.target.name
        }).then(res => {
            if(res.data === true) {
                this.setState(state => {
                    const group_posts = state.group_posts.splice(id, 1)
                    return group_posts
                })
            }
        })
    }

    defaultIfEmpty = value => {
        return value === "" ? "" : value;
    };

    onChangeText = e => {
        this.setState({"new_post": {
            "value": e.target.value
        }});
    };

    submitNewPost = e => {
        axios.post(API_URL + 'groups/post/new/', {
            "id_group": this.state.group_data.id,
            "text": this.state.new_post.value,
        }).then(res => {
            this.pagination.offset++;
            this.setState(state => {
                let new_post = [res.data]
                const group_posts = new_post.concat(state.group_posts)
                return {group_posts}
            })
        })
    }

    pegPosts (arr) {
        if (arr.length !== 0) {
            this.setState(state => {
                const group_posts = state.group_posts.concat(arr)
                return {group_posts}
            })
            this.pagination.offset += 5;
        } else {
            this.setState({"peg_next": false})
        }
    }

    scrollPegPosts = () => {
        if (this.state.peg_next) {
            if (Math.round(document.body.getBoundingClientRect().bottom) ===  window.innerHeight) {
                let query = API_URL + "groups/" + this.slug + "/posts/?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset;
                axios.get(query).then(res => {
                    this.pegPosts(res.data.results)
                })
            }
        }
    }

    subscribe = () => {
        axios.post(API_URL + "groups/subscribe/", {
            "id_group": this.state.group_data.id,
        }).then(res => {
            if (res.data){
                this.setState(state => {
                    let group_data = state.group_data.subscribe++
                    group_data = state.group_data.is_subscriber = true
                    return group_data
                })
            }
        })
    }

    unsubscribe = () => {
        axios.post(API_URL + "groups/unsubscribe/", {
            "id_group": this.state.group_data.id,
        }).then(res => {
            if (res.data){
                this.setState(state => {
                    let group_data = state.group_data.subscribe--
                    group_data = state.group_data.is_subscriber = false
                    return group_data
                })
            }
        })
    }

    componentDidMount() {
        this.slug = this.props.match.params.slug;
        axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
        document.addEventListener("scroll", this.scrollPegPosts)
        axios.get(API_URL + "groups/" + this.slug + "/posts/").then(res => {
            this.setState({
                "group_posts": res.data.results,
                "peg_next": (res.data.next) ? true : false,
            })
        })
        axios.get(API_URL + 'groups/' + this.slug + '/').then(res => {
            this.setState({"group_data": res.data})
        })
    };


    render() {

        const Posts = []

        for (const key in this.state.group_posts) {
            let url = REACT_URL + "group/" + this.state.group_posts[key].group.id + "/"
            Posts.push(
            <>
                <Card body id={key}>
                    <h5><a href={url}>{this.state.group_posts[key].group.name}</a></h5>
                    <hr/>
                    <CardText>{this.state.group_posts[key].text}</CardText>
                    <div class="container">
                        <div class="row">
                            { !this.state.group_posts[key].is_like && 
                                <Button outline onClick={(e) => this.liked(key, e)} color="primary" name={this.state.group_posts[key].id}>Like {this.state.group_posts[key].num_likes}</Button>
                            }
                            { this.state.group_posts[key].is_like && 
                                <Button onClick={(e) => this.deliked(key, e)} color="primary" name={this.state.group_posts[key].id}>Like {this.state.group_posts[key].num_likes}</Button>
                            }
                            { !this.state.group_posts[key].is_repost && 
                                <Button outline onClick={(e) => this.repost(key, e)} color="secondary" name={this.state.group_posts[key].id}>repost</Button>
                            }
                            { this.state.group_posts[key].is_repost && 
                                <Button onClick={(e) => this.removeRepost(key, e)} color="secondary" name={this.state.group_posts[key].id}>repost</Button>
                            }
                        </div>
                    </div>
                    { this.state.group_data.is_admin && 
                        <Button className="btn-delete" outline onClick={(e) => this.deletePost(key, e)} color="danger" name={this.state.group_posts[key].id}>delete</Button>
                    }
                </Card>
            </>)
        }

        return(
            <>
            <div className="container">
                <div className="row">
                    <div className="group-block">
                        <h1>{this.state.group_data.name}</h1>
                        <h4>Подписчики: {this.state.group_data.subscribe}</h4>
                    </div>
                    <div className="group-block">
                    { !this.state.group_data.is_subscriber && 
                        <Button onClick={this.subscribe} color="primary">subscribe</Button>
                    }
                    { this.state.group_data.is_subscriber && 
                        <Button outline onClick={this.unsubscribe} color="primary">unsubscribe</Button>
                    }
                    </div>
                    
                </div>
            </div>

            <div className="content">
                { this.state.group_data.is_admin && 
                <div>
                    <Card body>
                            <FormGroup>
                                <Input
                                type="text" 
                                name="text" 
                                placeholder="Текст для поста" 
                                value={this.defaultIfEmpty(this.state.new_post.text)}
                                onChange={this.onChangeText}
                                />
                            </FormGroup>
                            <Input 
                            type="submit"
                            name="doGo"
                            value="Отправить"
                            onClick={this.submitNewPost}
                            />
                    </Card>
                </div>
                }

                <div className="posts">
                    {Posts}
                </div>
            </div>
            </>
        )
    }   

}

export default GroupView