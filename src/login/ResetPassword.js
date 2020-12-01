import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import queryString from 'query-string';

import axios from "axios";
import { Redirect } from 'react-router-dom';
import * as constant from '../components/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Jumbotron, Button, Modal, Form, InputGroup, FormControl, Image } from 'react-bootstrap';
import login_phone from '../assets/images/login/login_phone.png';
import app_store from '../assets/images/login/app_store.png';
import google_store from '../assets/images/login/google_store.png';
import icon_password from '../assets/images/login/icon_password.png';

import '../assets/Login.css';

class ResetPassword extends Component{
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      newPasswordConfirm: "",
      redirect_state: false
    }
  }

  enterPassword = (event) => {
    let newPasswordName = event.target.name;
    let newPasswordValue = event.target.value;
    this.setState({
      [newPasswordName]: newPasswordValue
    });
  }
  
  sendRequest = () => {
    let currentURL = queryString.parse(this.props.location.search);
    // console.log("currentUrl", currentURL);
    // this.props.location.query.__firebase_request_key
    let sendData = {
      "code": currentURL.code,
      "password": this.state.newPassword,
      "passwordConfirmation": this.state.newPasswordConfirm
    }
    console.log(sendData);
    axios.post(constant.baseURL + "auth/reset-password", sendData)
    .then(res => {
      if(res.status === 200){
        this.setState({
          redirect_state: true
        });
      }
    });

  }
  
  render() {
    const { t } = this.props;
    if(this.state.redirect_state){
      return <Redirect to='/login' />
    }
    return (
      <div className="Login">
          <Container className="Login_container">
              <Row>
                <Col className="mt-5 login-dialog d-flex align-items-center" xs={12} md={{span: 5, offset: 1}}>
                  <Jumbotron>
                    <h1 className="welcome_title">{ t("login.title1") }<br />{ t("login.title2") }<br />{ t("login.title3") }</h1>
                    <p className="mt-3">
                      { t("login.content") }
                    </p>
                    <Form className="mt-5" onSubmit={this.props.loginSubmit}>
                      <Form.Group controlId="formNewPassword">
                          <InputGroup>
                          <InputGroup.Prepend>
                              <InputGroup.Text id="newPassword">
                              <Image src={ icon_password } className="addon_icon" />
                              </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                              type="password"
                              name="newPassword"
                              placeholder="New Password"
                              value={ this.state.newPassword }
                              aria-label="New Password"
                              aria-describedby="newPassword"
                              required
                              autoComplete="false"
                              onChange={this.enterPassword}
                          />
                          </InputGroup>
                      </Form.Group>
                      <Form.Group controlId="formNewPasswordConfirm">
                          <InputGroup>
                          <InputGroup.Prepend>
                              <InputGroup.Text id="newPasswordConfirm">
                              <Image src={ icon_password } className="addon_icon" />
                              </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                              type="password"
                              name="newPasswordConfirm"
                              value={ this.state.newPasswordConfirm }
                              placeholder="New Password Confirm"
                              aria-label="New Password Confirm"
                              aria-describedby="newPasswordConfirm"
                              required
                              autoComplete="false"
                              onChange={this.enterPassword}
                          />
                          </InputGroup>
                      </Form.Group>
                      <Button variant="warning" type="button" onClick={ this.sendRequest } className="btn_login pt-1 pb-1 pl-5 pr-5 mt-3">
                          {this.props.t('utility.send')}
                      </Button>
                    </Form>
                  </Jumbotron>
                </Col>
                <Col md="6" className="login_phone_col text-center">
                  <img src={login_phone} width="70%" alt='login_phone' />
                  <p className="text-center mt-5" style={{ color: '#173A56', fontSize: '18px' }}>Or download our Mobile App</p>
                  <div>
                    <Button className="app_store_btn" variant="light"><img src={app_store} width="129px" height="38px" alt="app_store" /></Button>
                    <Button className="app_store_btn" variant="light"><img className="ml-2" src={google_store} width="129px" height="38px" alt="google_store" /></Button>
                  </div>
                </Col>
              </Row>
          </Container>
      </div>
    );
  }
}

export default withTranslation()(ResetPassword);
