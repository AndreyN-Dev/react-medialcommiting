import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';

import axios from "axios";
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import * as constant from '../components/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Jumbotron, Button, Modal, Form, InputGroup, FormControl, Image} from 'react-bootstrap';
import login_phone from '../assets/images/login/login_phone.png';
import remember_chk from '../assets/images/login/remember_oval.png';
import remember_unchk from '../assets/images/login/remember_oval_unchk.png';
import app_store from '../assets/images/login/app_store.png';
import google_store from '../assets/images/login/google_store.png';
import icon_email from '../assets/images/login/icon_mail.png';
import Login_Component from '../components/login_components';

import '../assets/Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_email: '',
            user_password: '',
            user_name: '',
            user_speciality: '',
            user_workat: '',
            user_phone: '',
            user_country: 0,
            user_gender: 'Male',
            genderList: ['Male', 'Female'],
            countryList: [],
            chk_state_img: remember_unchk,
            chk_state: false,
            show_state: false,
            show_error_state: false,
            show_email_validation_state: false,
            show_password_validation_state: false,
            error_message: "",
            compName: "compA",
            forgotPasswordEmail: ""
        };
    }

    handleClose = () => {
        this.setState({show_state: false});
    }

    handleShow = () => {
        const {t} = this.props;
        let user_email = this.state.user_email;
        let user_password = this.state.user_password;
        if (user_email === '') {
            this.setState({
                show_email_validation_state: true,
            });
        } else {
            this.setState({
                show_email_validation_state: false,
            });
        }
        if (user_password === '') {
            this.setState({
                show_password_validation_state: true,
            });
        } else {
            this.setState({
                show_password_validation_state: false,
            });
        }
        if (user_email !== '' && user_password !== '') {

            this.setState({
                show_state: true,
            });
        }
    }

    errorhandleClose = () => {
        this.setState({show_error_state: false});
    }

    errorhandleShow = () => {
        this.setState({show_error_state: true});
    }

    componentDidMount() {
        axios.get(constant.baseURL + "countries")
            .then(res => {
                this.setState({
                    countryList: res.data,
                    user_country: res.data[0].id,
                });
            });
        const cookies = new Cookies();
        if (cookies.get('remember_login') && cookies.get('remember_login') !== null) {
            this.setState({
                chk_state: true,
                chk_state_img: remember_chk,
                user_email: cookies.get('user_name'),
                user_password: cookies.get('user_password')
            });
        } else {

        }
    }

    loginSubmit = (event) => {
        const {t} = this.props;
        event.preventDefault();

        let user_email = this.state.user_email;
        let user_password = this.state.user_password;
        // if(user_email === ''){
        //   this.setState({
        //     show_email_validation_state: true,
        //   });
        // }
        // else if(user_password === ''){
        //   this.setState({
        //     show_password_validation_state: true,
        //   });
        // }
        // else{
        this.setState({
            show_email_validation_state: false,
            show_password_validation_state: false
        });
        const cookies = new Cookies();
        let chk_state_temp = this.state.chk_state;
        let chk_state_image = remember_unchk;
        if (chk_state_temp) {
            cookies.set('remember_login', true);
            cookies.set('user_name', user_email);
            cookies.set('user_password', user_password);
            chk_state_image = remember_chk;
        } else {
            chk_state_image = remember_unchk;
            cookies.remove('remember_login');
            cookies.remove('user_name');
            cookies.remove('user_password');
        }
        this.userLogin();
        // }
    }

    userLogin = () => {
        const {t} = this.props;
        let data = {
            "identifier": this.state.user_email,
            "password": this.state.user_password
        }
        axios.post(constant.baseURL + "auth/local/", data)
            .then(res => {
                if (res && res.status === 200) {
                    this.handleClose();
                    localStorage.setItem('jwt', res.data.jwt);
                    let user_temp = res.data.user;
                    let user_data = Object.keys(user_temp).map((key) => {
                        if (key === "ProfilePic" && user_temp[key] !== null) {
                            localStorage.setItem("profilePhoto", user_temp[key].url);
                        }
                        localStorage.setItem(key, user_temp[key]);
                    });
                    return user_data;
                } else {
                    this.handleClose();
                    this.setState({
                        show_error_state: true,
                        error_message: t('login.login_failed')
                    });

                    // alert("Invalid username and password entered.");
                }
            }).then((res) => {
            if (localStorage.getItem('jwt') !== null) {
                this.props.history.push("/home");
            }
        }).catch((error) => {
            this.handleClose();
            this.setState({
                show_error_state: true,
                error_message: t('login.login_failed')
            });
        });

    }

    loginEnterdata = (event) => {
        let enter_name = event.target.name;
        let enter_value = event.target.value;
        if (enter_name === "user_email") {
            this.setState({
                show_email_validation_state: false
            });
        }
        if (enter_name === "user_password") {
            this.setState({
                show_password_validation_state: false
            });
        }
        this.setState({
            [enter_name]: enter_value
        });
    }

    rememberChange = () => {
        const cookies = new Cookies();
        let chk_state_temp = this.state.chk_state;
        let chk_state_image = remember_unchk;
        if (chk_state_temp) {
            chk_state_image = remember_unchk;
            cookies.remove('remember_login');
            cookies.remove('user_name');
            cookies.remove('user_password');
        } else {
            cookies.set('remember_login', true);
            cookies.set('user_name', this.state.user_email);
            cookies.set('user_password', this.state.user_password);
            chk_state_image = remember_chk;
        }
        this.setState({
            chk_state_img: chk_state_image,
            chk_state: !chk_state_temp
        });
    }

    signupHandleShow = () => {
        this.setState({
            compName: 'compB'
        });
    }

    getCountryData = (country_id) => {
        const list = this.state.countryList.filter((res) => res.id == country_id);
        this.setState({
            user_country: list[0].Name,
            user_countryID: list[0].id
        })
    }

    signupEnterdata = (event) => {
        let enter_name = event.target.name;
        let enter_value = event.target.value;
        this.setState({
            [enter_name]: enter_value
        });
    };

    signupSubmit = (event) => {
        event.preventDefault();
        const {t} = this.props;
        let data = {
            "email": this.state.user_email,
            "username": this.state.user_email,
            "password": this.state.user_password,
            "Name": this.state.user_name,
            "Gender": this.state.user_gender,
            "Speciality": this.state.user_speciality,
            "WorksAt": this.state.user_workat,
            "PhoneNumber": this.state.user_phone,
            "country": this.state.user_country
        };
        try {
            axios.post(constant.baseURL + "auth/local/register", data)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            compName: 'compA'
                        });
                    }
                }).catch((e) => {
                this.setState({
                    show_error_state: true,
                    error_message: t('login.signup_failed')
                });
                console.log("error", e);
            });
        } catch (e) {
            this.setState({
                show_error_state: true,
                error_message: t('login.signup_failed')
            });
            console.log("error", e);
        }
    }

    forgotPassword = () => {
        this.setState({
            show_forgot_password: true
        });
    }

    forgotPasswordhandleClose = () => {
        this.setState({
            show_forgot_password: false
        });
    }

    emailEnterData = (event) => {
        let forgotPasswordEmail = event.target.name;
        let emailValue = event.target.value;
        this.setState({
            [forgotPasswordEmail]: emailValue
        });
    }

    sendRequest = () => {
        let sendData = {
            "email": this.state.forgotPasswordEmail
        }
        axios.post(constant.baseURL + "auth/forgot-password", sendData)
            .then(res => {
                if (res.data.ok) {
                    this.forgotPasswordhandleClose();
                    this.setState({
                        error_message: "Please check your email.",
                        show_error_state: true
                    });
                }
            })
    }

    render() {
        const {t} = this.props;
        return (
            <div className="Login">
                <Container className="Login_container">
                    <Row>
                        <Col className="mt-1 login-dialog d-flex align-items-center" xs={12} md={{span: 5, offset: 1}}>
                            <Jumbotron>
                                {
                                    (this.state.compName === "compA") ? (
                                        <h1 className="welcome_title">{t("login.title1")}<br/>{t("login.title2")}<br/>{t("login.title3")}
                                        </h1>) : (<h1 className="welcome_title">{t("utility.signup")}</h1>)
                                }
                                <p className="mt-3">
                                    {t("login.content")}
                                </p>
                                <Login_Component loginSubmit={this.loginSubmit} forgotPassword={this.forgotPassword}
                                                 loginState={this.state} t={t} rememberChange={this.rememberChange}
                                                 handleShow={this.handleShow} signupHandleShow={this.signupHandleShow}
                                                 loginEnterdata={this.loginEnterdata}
                                                 signupEnterdata={this.signupEnterdata}
                                                 signupSubmit={this.signupSubmit}></Login_Component>
                            </Jumbotron>
                        </Col>
                        <Col md="6" className="login_phone_col text-center">
                            <img src={login_phone} width="70%" alt='login_phone'/>
                            <p className="text-center mt-5" style={{color: '#173A56', fontSize: '18px'}}>Or download our
                                Mobile App</p>
                            <div>
                                <Button href={'https://apps.apple.com/us/app/gdm/id1458921628'} target="_blank"
                                        className="app_store_btn" variant="light"><img src={app_store} width="129px"
                                                                                       height="38px"
                                                                                       alt="app_store"/></Button>
                                <Button href={'https://play.google.com/store/apps/details?id=com.gdmapp'}
                                        target="_blank" className="app_store_btn" variant="light"><img className="ml-2"
                                                                                                       src={google_store}
                                                                                                       width="129px"
                                                                                                       height="38px"
                                                                                                       alt="google_store"/></Button>
                            </div>
                        </Col>
                    </Row>
                    <Modal show={this.state.show_state} onHide={this.handleClose} className="login_modal">
                        <Modal.Header>
                            <Modal.Title> {t("login.modal_title")} </Modal.Title>
                        </Modal.Header>
                        <p className="pl-3 pr-3">
                            I confirm that I am a licensed Healthcare Professional and by logging-in I confirm my
                            participation to Gulf Cardio-metabolic Masterclass. I agree to the terms of usage of this
                            portal and app including the <a href="https://strapi-msd-be.s3-eu-west-1.amazonaws.com/otb_privacy.pdf" target="_blank" rel="noopener noreferrer">Digital Privacy Statement</a> on our website
                        </p>
                        <p className="pl-3 pr-3">
                            This material is provided by MSD upon approval by Dr Steven Hurel, UCLH London UK, through
                            OTB life science as a professional service to the medical community. The use of the UCLH logo
                            reflects Dr Hurel’s affiliation. Information related to any product(s) may not be consistent
                            with the prescribing information. Please consult the full prescribing information for
                            approved information on any products discussed in this material and before prescribing. MSD has no
                            influence on the content of this material. The medical information, views, opinions and
                            thoughts expressed in this material are those of the authors and do not necessarily reflect or
                            represent the views of MSD and should not be attributed to them.
                        </p>
                        <p className="pl-3 pr-3">
                            Copyright © 2020 Merck Sharp & Dohme Corp., a subsidiary of Merck & Co., Inc., Kenilworth,
                            NJ, USA. All rights reserved. AE-DIA-00030 EXP: 31-Dec-2020.<br/>
                            In case you need any update or you have an inquiry or need to report an adverse reaction,
                            you can contact<br/>
                            Tel: <a href="tel:+97144269100">+9714 4269100</a> Fax: <a href="fax:+97144269204">+9714
                            4269204</a> Email: <a href="mailto:DPOC.GULF@MERCK.COM">DPOC.GULF@MERCK.COM</a>
                        </p>
                        <Modal.Footer>
                            <Button variant="success" onClick={this.loginSubmit} className="pl-5 pr-5 pt-3 pb-3">
                                {t("utility.agree")}
                            </Button>
                            <Button variant="warning" onClick={this.handleClose} className="pl-5 pr-5 pt-3 pb-3">
                                {t("utility.disagree")}
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.show_error_state} onHide={this.errorhandleClose}
                           className="login_error_modal">
                        <Modal.Header>
                            <Modal.Title> {this.state.error_message}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body> {'Please make sure that you have entered your email and password correctly, or you can click forget password at any time to reset your password.'} </Modal.Body>
                    </Modal>

                    <Modal show={this.state.show_forgot_password} onHide={this.forgotPasswordhandleClose}
                           className="forgot_password_modal">
                        <Modal.Header>
                            <Modal.Title>{t("login.forgotPassword")}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form className="forgot_password_form mt-3">
                                <Form.Group>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="email">
                                                <Image src={icon_email} className="addon_icon"/>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control type="text" placeholder="Email" name="forgotPasswordEmail"
                                                      required onChange={this.emailEnterData}/>
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="success" onClick={this.sendRequest} className="pl-5 pr-5 pt-1 pb-1">
                                {t("utility.send")}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </div>
        );
    }
}

export default withTranslation()(Login);
