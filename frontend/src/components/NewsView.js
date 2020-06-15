import React, { Component } from "react";
import axios from "axios";
import { API_URL, REACT_URL } from "../constants";
import { Card, Button, CardText, FormGroup, Input, CardTitle } from "reactstrap";

class NewsView extends Component {

    state = {
        "peg_next": true,
        "news": null,
    }

    pagination = {
        "limit": 5,
        "offset": 5,
    }

    slug = null

    liked = (id, e) => {
        axios.post(API_URL + '/groups/post/addlike/', {
            'id_post': e.target.name
        }).then(res => {
            if (res.data === true) {
                this.setState(state => {
                    let news = state.news[id].is_like = true
                    news = state.news[id].num_likes++
                    return news
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
                    let news = state.news[id].is_like = false
                    news = state.news[id].num_likes--
                    return news
                })
            }
        })
    }

    repost = (id, e) => {
        axios.post(API_URL + '/groups/post/addrepost/', {
            'id_post': e.target.name
        }).then(res => {
            if (res.data === true) {
                this.setState(state => {
                    const news = state.news[id].is_repost = true
                    return news
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
                    const news = state.news[id].is_repost = false
                    return news
                })
            }
        })
    }

    pegPosts (arr) {
        if (arr.length !== 0) {
            this.setState(state => {
                const news = state.news.concat(arr)
                return {news}
            })
            this.pagination.offset += 5;
        } else {
            this.setState({"peg_next": false})
        }
    }

    scrollPegPosts = () => {
        if (this.state.peg_next) {
            if (Math.round(document.body.getBoundingClientRect().bottom) ===  window.innerHeight) {
                let query = API_URL + "/groups/news/?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset;
                axios.get(query).then(res => {
                    this.pegPosts(res.data.results)
                })
            }
        }
    }

    componentDidMount() {
        this.slug = this.props.match.params.slug;
        axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
        document.addEventListener("scroll", this.scrollPegPosts)
        axios.get(API_URL + "/groups/news/").then(res => {
            this.setState({
                "news": res.data.results,
                "peg_next": (res.data.next) ? true : false,
            })
        })
        axios.get(API_URL + '/groups/' + this.slug + '/').then(res => {
            this.setState({"group_data": res.data})
        })
    };


    render() {

        const Posts = []

        for (const key in this.state.news) {
            let url = REACT_URL + "/group/" + this.state.news[key].group.id + "/"
            Posts.push(
            <>
                <Card body id={key}>
                    <h5><a href={url}>{this.state.news[key].group.name}</a></h5>
                    <hr/>
                    <CardText>{this.state.news[key].text}</CardText>
                    <div class="container">
                        <div class="row">
                            { !this.state.news[key].is_like && 
                                <Button outline onClick={(e) => this.liked(key, e)} color="primary" name={this.state.news[key].id}>Like {this.state.news[key].num_likes}</Button>
                            }
                            { this.state.news[key].is_like && 
                                <Button onClick={(e) => this.deliked(key, e)} color="primary" name={this.state.news[key].id}>Like {this.state.news[key].num_likes}</Button>
                            }
                            { !this.state.news[key].is_repost && 
                                <Button outline onClick={(e) => this.repost(key, e)} color="secondary" name={this.state.news[key].id}>repost</Button>
                            }
                            { this.state.news[key].is_repost && 
                                <Button onClick={(e) => this.removeRepost(key, e)} color="secondary" name={this.state.news[key].id}>repost</Button>
                            }
                        </div>
                    </div>
                </Card>
            </>)
        }

        return(
            <>
                <div className="posts">
                    {Posts}
                </div>
            </>
        )
    }   

}

export default NewsView