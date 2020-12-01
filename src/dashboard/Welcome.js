import React, {Component} from 'react';
import axios from "axios";
import {Redirect} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import * as constant from '../components/constants';

import 'bootstrap/dist/css/bootstrap.min.css';

import {Container, Row, Col, Card} from 'react-bootstrap';
import Navbars from '../templates/Navbars';
import Sidebar from '../templates/Sidebar';
import Footer from '../templates/footer'

import academic_img from '../assets/images/dashboard/Academic_Library_icon.png';
import clinic_img from '../assets/images/dashboard/clinic_icon.png';
import session_img from '../assets/images/dashboard/Program_Sessions_icon.png';
import speakers_img from '../assets/images/dashboard/Speakers_icon.png';
import welcome_img from '../assets/images/dashboard/welcome.png';
import uniLogo from '../assets/images/home_illustration.png';

import '../assets/Users.css';
import '../assets/Dashboard.css';


class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jwt: localStorage.getItem('jwt'),
            webinarName: '',
            webinarDate: ''
        }
    }

    componentDidMount() {
        axios.get(constant.baseURL + "timers", {
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
            .then(res => {
                console.log(res);
                this.setState({
                    webinarName: res.data.Webinars[0].Title,
                    webinarDate: res.data.Webinars[0].StartDate
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    loadPage = (page_index) => {
        this.props.history.push(page_index);
    }


    render() {
        let webinarDate = new Date(this.state.webinarDate);
        let currentDate = new Date();
        let dateDiff = constant.datesDiff(currentDate, webinarDate).split("&&&");
        let webinarContent = '';
        if (dateDiff[0] === 0) {
            webinarContent = dateDiff[1] + 'Hours ' + dateDiff[2] + 'Minutes ' + dateDiff[3] + 'Seconds';
        } else {
            webinarContent = dateDiff[0] + 'Days ' + dateDiff[1] + 'Hours';
        }
        const {t} = this.props;

        return (
            <div className="">
                <Container className="">
                    <Navbars></Navbars>
                    <Row>
                        <Col md={2} className="pl-0 pr-0">
                            <Sidebar active_class="home"></Sidebar>
                        </Col>
                        <Col md={10}
                             className="about_body d-flex flex-column justify-content-between align-content-between">
                            <h1 className="mt-3 text-bold ml-3">{t("dashboard.title")} {localStorage.getItem('Name')}</h1>

                            <Row className="mb-2" style={{flexWrap: 'nowrap', boxSizing: 'border-box'}}>
                                <Col md={9}>
                                    <Row className='d-flex justify-content-around align-items-center mt-3 ml-2'>
                                        <Card className="welcome_card clickable" style={{width: '48%'}}
                                              onClick={this.loadPage.bind(this, '/academic')}>
                                            <Card.Header>
                                                <Card.Img variant="top" src={academic_img} width='80px' height='80px'
                                                          style={{minWidth: '80px', maxWidth: '80px'}}/>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Title
                                                    className='text-bold'>{t("dashboard.academic_library.title")}</Card.Title>
                                                <Card.Text>
                                                    {t("dashboard.academic_library.content")}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                        <Card className="welcome_card clickable" style={{width: '48%'}}
                                              onClick={this.loadPage.bind(this, '/sessions')}>
                                            <Card.Header>
                                                <Card.Img variant="top" src={session_img} width='40px' height='80px'
                                                          style={{minWidth: '40px', maxWidth: '40px'}}/>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Title
                                                    className='text-bold'>{t("dashboard.program_session.title")}</Card.Title>
                                                <Card.Text>
                                                    {t("dashboard.program_session.content")}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Row>
                                    <Row className='d-flex justify-content-around align-items-center mt-4 ml-1'>
                                        <Card className="welcome_card clickable" style={{width: '48%'}}
                                              onClick={this.loadPage.bind(this, '/speakers')}>
                                            <Card.Header>
                                                <Card.Img variant="top" src={speakers_img} width='80px' height='80px'
                                                          style={{minWidth: '80px', maxWidth: '80px'}}/>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Title
                                                    className='text-bold'>{t("dashboard.speakers.title")}</Card.Title>
                                                <Card.Text>
                                                    {t("dashboard.speakers.content")}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                        <Card className="welcome_card clickable" style={{width: '48%'}}
                                              onClick={this.loadPage.bind(this, '/cliniclist')}>
                                            <Card.Header>
                                                <Card.Img variant="top" src={clinic_img} width='80px' height='80px'
                                                          style={{minWidth: '80px', maxWidth: '80px'}}/>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Title
                                                    className='text-bold'>{t("dashboard.clinic.title")}</Card.Title>
                                                <Card.Text>
                                                    {t("dashboard.clinic.content")}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Row>
                                </Col>
                                <Card md={3} className="mr-3 ml-2 mr-2 mt-3">

                                    <div className="pl-0 pr-0 pt-0 mt-0 justify-content-center d-flex">
                                        <img src={uniLogo} style={{width: "100%"}} alt="welcome"/>
                                    </div>
                                    {/*<div className="pl-0 pr-0 pt-3 mt-3 justify-content-center d-flex">*/}
                                    {/*    <img src={welcome_img} style={{width: "55%"}} alt="welcome"/>*/}
                                    {/*</div>*/}
                                    <div className=" pl-3 pr-3 mt-5 justify-content-center text-center d-flex colorGreen text-bold">
                                        {this.state.webinarName}
                                    </div>
                                    {/*<div className="pl-3 pr-3 mt-3 align-items-center justify-content-center d-flex colorGreen">*/}
                                    {/*    <h3 className="text-bold text-center">{webinarContent}</h3>*/}
                                    {/*</div>*/}
                                    {/*<div className=" pl-3 pr-3 mt-3 justify-content-center text-center d-flex text-bold">*/}
                                    {/*    We look forward to meeting you!*/}
                                    {/*</div>*/}
                                </Card>
                            </Row>
                            <Footer />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withTranslation()(Welcome);
