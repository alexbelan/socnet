import React, { Component } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import "../style/UserSettings.css"

import {API_URL, replaceLogin} from "../constants";

class UserSettingPhoto extends Component {
   
    state = {
        "image": '',
        "image_preview": '',
    }

    formData = new FormData();

    handleImageChange(e) {
        e.preventDefault();
    
        let reader = new FileReader();
        let file = e.target.files[0];
    
        reader.onloadend = () => {
            this.setState({
                "image": file,
                "image_preview": reader.result
            });
        }
    
        reader.readAsDataURL(file)
    }

    submitPhoto = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("photo_user", e.target.img.files[0])

        axios.put(API_URL + '/user/setting/photo/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            console.log(res.data);
        })
        console.log(e.target.img.files[0])
    }
 
    componentDidMount() {
        if (localStorage.getItem('access_token')) {
            axios.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
            axios.get(API_URL + '/user/setting/photo/').then(res => {
                console.log(res);
                this.setState({
                    "image_preview": API_URL + res.data.photo_user,
                })
            }).catch(() => {
                replaceLogin()
            })
        }
    };

    render (h) {
        return (
        <>
            <Form onSubmit={this.submitPhoto}>
                <FormGroup>
                    <img src={ this.state.image_preview } className="image-preview"/>
                    <div>
                        <Label for="img">File</Label>
                        <Input type="file" name="img" id="img" onChange={(e)=>this.handleImageChange(e)} />
                    </div>       
                </FormGroup>
                <Input type="submit" name="doGo" />
            </Form>
        </>
        )
    }
}

export default UserSettingPhoto