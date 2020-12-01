import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import Navbars from '../templates/Navbars';
import Sidebar from '../templates/Sidebar';
import male_profile from '../assets/images/user_manage/Profile-doctor-boy.png';
import female_profile from '../assets/images/user_manage/Profile-doctor-girl.png';
import * as constant from '../components/constants';

import Profile_Component from '../components/profile_components';

import '../assets/Users.css';


class Profile extends Component {
    constructor(props) {
        super(props);
        const { t } = props; 
        this.state = {
            jwt: localStorage.getItem('jwt'),
            userName: '',
            userEmail: '',
            userConfirmed: '',
            userPicture: '',
            userPhone: '',
            userCountry: '',
            userCountryId: '',
            userCountryCode: '',
            userSpeciality: '',
            userWorkat: '',
            userBlocked: '',
            userPractitioner: '',
            countryList: [],
            compName: "compA",
            btnTitle: t("utility.change_profile"),
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            show_state: false,
            loadState: 1,
        }
    }

    componentDidMount() {
        axios.get(constant.baseURL + "users/profile",{
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then(res => {
            let persons = res.data;
            let pic_temp = '';
            if(persons.ProfilePic == null){
                if(persons.Gender === 'Male'){
                    pic_temp = male_profile;
                }
                else{
                    pic_temp = female_profile;
                }    
            }
            else{
                pic_temp = persons.ProfilePic.url;
            }

            return this.setState({
                jwt: localStorage.getItem('jwt'),
                userName: persons.Name,
                userEmail: persons.email,
                userSpeciality: persons.Speciality,
                userWorkat: persons.WorksAt,
                userCountry: persons.country.Name,
                userCountryId: persons.country.id,
                userCountryCode: persons.country.Code,
                userConfirmed: persons.confirmed,
                userBlocked: persons.blocked,
                userPhone: persons.PhoneNumber,
                userPicture: pic_temp,
            }, function(){
                this.setState({
                    loadState: 2
                });
            });
        }, [] );
        axios.get(constant.baseURL + "countries",{
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        }).then(res => {
            this.setState({
                countryList: res.data
            });
        })
    }

    getCountryData = (country_id) => {
        const list = this.state.countryList.filter((res) => res.id == country_id);
        this.setState({
            userCountry: list[0].Name,
            userCountryCode: list[0].Code,
        }, function() {
            console.log(this.state.userPhone);
        });
    }

    profileEnterData = (event) => {
        event.preventDefault();
        let enter_name = event.target.name;
        let enter_value = event.target.value;
        if(enter_name === 'userCountryId'){
            this.getCountryData(enter_value);
            // alert('Please enter Phone Number again.');
        }
        this.setState({
            [enter_name]: enter_value
        });
    }


    component_change = () => {
        const { t } = this.props;
        let compName = this.state.compName;
        if(compName === "compA"){
            this.setState({
                btnTitle: t("utility.save"),            
                compName: "compB",
                loadState: 1
            });
        }
        else{
            let data = {
                "Speciality": this.state.userSpeciality,
                "WorksAt": this.state.userWorkat,
                "PhoneNumber": this.state.userPhone,
                "country": this.state.userCountryId
            }
            axios.put(constant.baseURL + "users/profile", data, 
            {
                headers: {
                    'Authorization': `Bearer ${this.state.jwt}`
                }
            }).then(res => {
                this.setState({
                    btnTitle: t("utility.change_profile"),                
                    compName: "compA",
                    loadState: 2
                });
            })
        }
    }

    handleClose = () => {
        this.setState({show_state: false});
    }

    handleShow = () => {
        this.setState({show_state: true});
    }

    changePassword = () => {
        let currentPassword = this.state.currentPassword;
        let newPassword = this.state.newPassword;
        let confirmPassword = this.state.confirmPassword;
        if(newPassword !== confirmPassword){
            alert("Enter valid password, please!");
        }
        else{
            let data = {
                "currentPassword": currentPassword,
                "newPassword": newPassword,
                "confirmNewPassword": confirmPassword
            }
            axios.put(constant.baseURL + "users/changeMyPassword", data, 
            {
                headers: {
                    'Authorization': `Bearer ${this.state.jwt}`
                }
            }).then(res => {
                this.setState({show_state: false});
            })
        }
    }

    render() {
        const { t } = this.props;
        return (
            <div className="">
                <Container className="">
                    <Navbars></Navbars>
                    <Row>
                        <Col md={2} className="pl-0 pr-0">
                        <Sidebar active_class="profile"></Sidebar>
                        </Col>
                        <Col md={10} className="about_body">
                            <Row className="mb-2">
                                <Col md={9}>
                                    <h1 className="mt-3 text-bold">{t("profile.title")}</h1>
                                    <div className="profile_info pl-5 pr-5 pb-1 justify-content-between d-flex flex-column">
                                        <Profile_Component user={this.state.compName} t={t} personState={this.state} openModal={this.handleShow} change={this.profileEnterData}></Profile_Component>
                                        <p className="mb-4">
                                            <Button variant="warning" className="change_profile_btn" onClick={this.component_change}>{this.state.btnTitle} </Button>
                                        </p>
                                    </div>
                                </Col>
                                <Col md={3}>
                                </Col>
                            </Row>
                            {/*<p className="text-left pb-2">*/}
                            {/*    {t("footer")} */}
                            {/*</p>*/}
                        </Col>
                    </Row>
                    <Modal show={this.state.show_state} onHide={this.handleClose} className="change_pwd_modal">
                        <Modal.Header>
                        <Modal.Title>{t("utility.change_password")}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form className="change_pwd_form mt-3">
                                <Form.Group>
                                    <Form.Control type="text" className="mb-3" placeholder="Current Password" name="currentPassword" required onChange={this.profileEnterData}/>
                                    <Form.Control type="text" className="mb-3" placeholder="New Password" name="newPassword" required  onChange={this.profileEnterData}/>
                                    <Form.Control type="text" placeholder="Confirm Password" name="confirmPassword" required onChange={this.profileEnterData} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="warning" onClick={this.changePassword} className="pl-5 pr-5 pt-1 pb-1">
                            {t("utility.save")}
                        </Button>
                        </Modal.Footer>
                    </Modal>

                </Container>
            </div>
        );
    }
}

export default withTranslation()(Profile);
