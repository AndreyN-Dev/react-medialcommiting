import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from "axios";
import * as constant from '../components/constants';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import logo from '../assets/images/web_logo.png';
import male_photo from '../assets/images/user_manage/Profile-doctor-boy.png';
import female_photo from '../assets/images/user_manage/Profile-doctor-girl.png';
import chat_icon from '../assets/images/user_manage/chat_icon.png';
import notify_icon from '../assets/images/user_manage/Notification_icon.png';
import notify_icon_seen from '../assets/images/user_manage/Notification_icon_seen.png';

import '../assets/Users.css';

var notify_alert_mark = false;
class Navbars extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jwt: localStorage.getItem('jwt'),
            login_state: true,
            user_name: localStorage.getItem('Name'),
            user_picture: localStorage.getItem('profilePhoto'),
            user_email: localStorage.getItem('email'),
            user_confirmed: localStorage.getItem('confirmed'),
            user_gender: localStorage.getItem('Gender'),
            user_photo: male_photo,
            notify_alert: false,
            navigation_url: ''
        }
    }

    componentDidMount(){
        console.log("profile photo", this.state.user_picture);
        axios.get(constant.baseURL + "notifications/me",{
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then(res => {
            const list = res.data.find(item => {
                if(!item.seen){
                    this.setState({
                        notify_alert: true
                    });
                    return item;
                }
            });
        }, [] );

        if(this.state.user_picture !== null && this.state.user_picture !== undefined){
            this.setState({
                user_photo: this.state.user_picture
            });
        }
        else{
            if(this.state.user_gender === 'Male'){
                this.setState({
                    user_photo: male_photo
                });
            }
            else{
                this.setState({
                    user_photo: female_photo
                });
            }
        }
    }

    navigation = (url) => {
        this.setState({
            navigation_url: url
        });
    }

    render(){
        if(this.props.notify_alert !== undefined){
            notify_alert_mark = this.props.notify_alert;
        }
        else{
            notify_alert_mark = this.state.notify_alert;
        }
        if(this.state.jwt === null || this.state.jwt === undefined){
            return <Redirect to='/' /> 
        }
           
        return (
            <Row style={{borderBottom: '1px solid #ebeef6'}}>
            <Col md={2} className="px-0 d-flex bg-white logo_div">
              <img src={logo} width="100%" className="my-0 fit_image" alt="logo" />
            </Col>
            <Col md={6} className="d-flex align-items-center bg-white">
                <h2 className="text-left text-light-green text-bold" style={{fontSize: "2.5vw"}}>Gulf Cardio-metabolic Masterclass</h2>
            </Col>

            <Col md={4} className="d-flex justify-content-end align-items-center bg-white pt-0 pb-0">
                <a href={'/notify'} className="notification_icon d-flex justify-content-center align-items-center pl-3 pr-3"><img src={(notify_alert_mark) ? notify_icon : notify_icon_seen} width="30vw" alt="" /></a>
                <a href={'/speakers'} className="chat_icon d-flex justify-content-center align-items-center pl-3 pr-3"><img src={chat_icon} width="30vw" alt="" /></a>
                <a href={'/profile'}>
                    <div className="profile_area d-flex justify-content-start align-items-center pl-3 pr-3 pt-1 pb-1" >
                    <img className="rounded-circle fit_image" src={this.state.user_photo} alt="" width="45vw" height="45vw" style={{ borderRadius: '50%' }} />
                    <div className="online_badge"></div>
                    <span className="ml-2 text-light-green text-bold">{this.state.user_name}</span>
                </div>
                </a>
            </Col>
          </Row>
        );
    }
}
    
export default Navbars;
    