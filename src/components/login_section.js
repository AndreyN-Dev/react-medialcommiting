import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, InputGroup, FormControl, Image } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import icon_password from '../assets/images/login/icon_password.png';
import icon_email from '../assets/images/login/icon_mail.png';

import '../assets/Login.css';

class Login_Section extends Component{

  render() {
    console.log(this.props.loginState.user_email);
    return (
        <Form className="mt-5" onSubmit={this.props.loginSubmit}>

            {/*<Button variant="warning" type="button" onClick={this.props.signupHandleShow} className="btn_signup pt-1 pb-1 pl-5 pr-5 mt-0 mb-4">*/}
            {/*    { this.props.t("utility.signup") }*/}
            {/*</Button>*/}

            {/*<div className="division_block mb-4">*/}
            {/*    <div className="division_line"></div>*/}
            {/*    <div className="division_text">Or</div>*/}
            {/*    <div className="division_line"></div>                      */}
            {/*</div>*/}
            {
                (this.props.loginState.show_email_validation_state || this.props.loginState.show_password_validation_state) ? (
                    <div className="validation_text mb-2">
                        { this.props.t("login.validation_text") }
                    </div>
                ) : ""
            }
            <Form.Group controlId="formBasicEmail">
                <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="email">
                    <Image src={ icon_email } className="addon_icon" />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    type="text"
                    name="user_email"
                    placeholder="Email"
                    value={this.props.loginState.user_email}
                    aria-label="Email"
                    aria-describedby="email"
                    required
                    autoComplete="email"
                    onChange={this.props.loginEnterdata}
                />
                </InputGroup>
            </Form.Group>
            {
                (this.props.loginState.show_email_validation_state) ? <div className="validation_badge"></div> : ""
            }
            
            <Form.Group controlId="formBasicPassword">
                <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="password">
                    <Image src={ icon_password } className="addon_icon" />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    type="password"
                    name="user_password"
                    value={this.props.loginState.user_password}
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="password"
                    required
                    autoComplete="false"
                    onChange={this.props.loginEnterdata}
                />
                </InputGroup>
            </Form.Group>
            {
                (this.props.loginState.show_password_validation_state) ? <div className="validation_badge"></div> : ""
            }

            <Form.Group controlId="formBasicCheckbox" className="mt-4">
                <Form.Check type="checkbox" label={ this.props.t("login.remember_me") } className="remember_chk" onChange={this.props.rememberChange} />
                <img src={this.props.loginState.chk_state_img} className="remember_chk_img" onClick={this.props.rememberChange} alt='remember' />
            </Form.Group>

            <Button variant="warning" type="button" onClick={this.props.handleShow} className="btn_login pt-1 pb-1 pl-5 pr-5 mt-3">
                {this.props.t('utility.login')}
            </Button>

            <Form.Group className="mt-3" controlId="formBasicForgot">
                <button style={{ backgroundColor: 'transparent', border: 'none', opacity: '0.8' }} className="forgot_pwd" type="button" onClick={ this.props.forgotPassword } >{ this.props.t("login.forgot_password") }</button>
            </Form.Group>
        </Form>
    );
  }
}

export default withTranslation()(Login_Section);
