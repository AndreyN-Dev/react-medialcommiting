import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from 'react-loader-spinner'
import * as constant from '../components/constants';

import {Container, Row, Col, Button, Modal, Card} from 'react-bootstrap';
import Navbars from '../templates/Navbars';
import Sidebar from '../templates/Sidebar';
import FRS from '../assets/images/user_manage/FRS.png';

import '../assets/Users.css';
import academic_img from "../assets/images/dashboard/Academic_Library_icon.png";
import session_img from "../assets/images/dashboard/Program_Sessions_icon.png";


class Risk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jwt: localStorage.getItem('jwt'),
            surveyData: [],
            answerList: [],
            answerSelectedList: [],
            answerSubmitData: {}, 
            loadState: 1,
            show_state: false
        }
    }
    
    
    render() {
        const { t } = this.props;
        return (
            <div className="">
                <Container className="">
                    <Navbars notify_alert={this.state.notify_alert}></Navbars>
                    <Row>
                        <Col md={2} className="pl-0 pr-0">
                        <Sidebar active_class="risk"></Sidebar>
                        </Col>
                        <Col md={10} className="about_body justify-content-between d-flex flex-column">
                            <Row className="mb-2">
                                <Col>
                                    <h1 className="mt-3 text-bold">{ t("risk.title") }</h1>

                                    {/*<img src={ FRS } className="risk_img" alt="FRS" />*/}
                                    {/*<p className="mt-3">*/}
                                    {/*    <a href={ constant.riskCalculatorURL } target="_blank" className="text-bold bg-orange riskBtn mt-5" name="frsBtn" >{ t("utility.risk") }</a>*/}
                                    {/*</p>*/}

                                    <Row className='pt-5 d-flex justify-content-around align-items-center mt-5 ml-3 mr-3' >
                                        <Card className="clickable" style={{ width: '30%', height: '250px'}} onClick={()=> window.open("http://tools.acc.org/ASCVD-Risk-Estimator-Plus/#!/calculate/estimate/", "_blank")}>
                                            <Card.Header>
                                                <Card.Title className='text-bold text-center'><h1 className='text-bold text-green'>ACC</h1></Card.Title>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Text className='text-center'>
                                                    <h4>ASCVD Risk Score Estimator</h4>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                        <Card className="clickable" style={{ width: '30%', height: '250px'}} onClick={()=> window.open("https://www.escardio.org/Education/Practice-Tools/CVD-prevention-toolbox/SCORE-Risk-Charts", "_blank")}>
                                            <Card.Header>
                                                <Card.Title className='text-bold text-center'><h1 className='text-bold text-green'>ESC</h1></Card.Title>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Text className='text-center'>
                                                    <h4>Risk Assessment Model</h4>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                        <Card className="clickable" style={{ width: '30%', height: '250px'}} onClick={()=> window.open("https://www.escardio.org/Education/ESC-Prevention-of-CVD-Programme/Risk-assessment/SMART-Risk-Score", "_blank")}>
                                            <Card.Header>
                                                <Card.Title className='text-bold text-center'><h1 className='text-bold text-green'>ESC</h1></Card.Title>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Text className='text-center'>
                                                    <h4>The SMART Risk Score</h4>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Row>
                                </Col>
                            </Row>
                            {/*<p className="text-left pb-2">*/}
                            {/*    {t("footer")}*/}
                            {/*</p>*/}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withTranslation()(Risk);
