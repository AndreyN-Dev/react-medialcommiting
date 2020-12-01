import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap';
import Navbars from '../templates/Navbars';
import Sidebar from '../templates/Sidebar';
import otb_logo from '../assets/images/otb_logo.png';
import uclh_logo from '../assets/images/uclh_logo.png';

import '../assets/Users.css';


class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        }
    }

    render() {
        const {t} = this.props;
        return (
            <div className="">
                <Container className="">
                    <Navbars></Navbars>
                    <Row>
                        <Col md={2} className="pl-0 pr-0">
                            <Sidebar active_class="about"></Sidebar>
                        </Col>
                        <Col md={10} className="about_body">
                            <h1 className="mt-3 text-bold">{t("about.title")}</h1>
                            <p>
                                <img src={uclh_logo} alt="logo"/>
                            </p>
                            <p>
                                University College London Hospitals NHS Foundation Trust has existed since 1994, but its origins date back over 250 years and lie in the history of various individual hospitals, some of which now form part of the Trust and some of which have since closed down. On these pages you can learn all about these hospitals. You can also find out about the collections of archives and artefacts at UCL Hospitals, which provide a unique glimpse into the past.
                                <br/><br/>
                                The archives, dating back to 1747, are made up of the records of the some of the hospitals that currently or have in the past been part of the Trust:
                                <br/>
                                <ul>
                                    <li>The Middlesex Hospital</li>
                                    <li>The Hospital for Women, Soho</li>
                                    <li>St Peter’s Group</li>
                                    <li>The Eastman Dental Hospital</li>
                                    <li>The Hospital for Tropical Diseases</li>
                                    <li>The National Temperance Hospital.</li>
                                </ul>
                                The archives also include records and artefacts relating to nursing both at The Middlesex and University College Hospitals.
                                <br/><br/>
                                Our Board of Directors comprises 16 statutory members including the chairman and chief executive of the trust. The Board sets the overall policy and strategic direction for the Trust, approves and monitors University College London Hospitals NHS Foundation Trust (UCLH)’s business plans, budgets and major capital expenditure, and monitors performance against objectives. Board members also sit on committees such as the remuneration committee and audit committee.
                            </p>
                            <br/>
                            <h4 className="text-bold">About App:</h4>
                            <p>
                                Gulf Cardio-metabolic Masterclass is intended to support the continuous medical
                                education of healthcare professionals around the topics of Diabetes, Cardiovascular
                                diseases, Dyslipidemia, and other related Cardio-metabolic syndrome. Highly interactive
                                and intuitive to help you quickly access the latest updates in management guidelines and
                                protocols provided from top notch medical faculty.
                            </p>
                            <br/>
                            <h4 className="text-bold">Privacy Policy:</h4>
                            <p>
                                This program is created and delivered by OTB Life Science & Technology Consultancy FZ
                                LLC, in collaboration with various international Academic Institutes and speakers.
                                Neither OTB Life Science nor the sponsor are responsible and have no influence on the
                                scientific content of the program. For Privacy related topics, please refer to the
                                <a href="https://strapi-msd-be.s3-eu-west-1.amazonaws.com/otb_privacy.pdf" target="_blank" rel="noopener noreferrer"> Privacy Policy</a> section.
                            </p>
                            <h6 className="text-bold">Powered by:</h6>
                            <img className="pb-3" src={otb_logo} height="150px" alt="logo"/>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withTranslation()(About);
