import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap';
import Navbars from '../templates/Navbars';
import Sidebar from '../templates/Sidebar';

import '../assets/Users.css';


class Help extends Component {

    render() {
        const { t } = this.props;
        return (
            <div className="">
                <Container className="">
                    <Navbars></Navbars>
                    <Row>
                        <Col md={2} className="pl-0 pr-0">
                        <Sidebar active_class="help"></Sidebar>
                        </Col>
                        <Col md={10} className="about_body d-flex flex-column justify-content-between align-content-between">
                            <Row className="d-flex flex-column pl-3 pr-3">
                                <h1 className="mt-3 text-bold">{t("help.title")}</h1>
                                <h3 className="mt-5 text-bold">
                                    {t("help.content_first.title")}
                                </h3>
                                <p>
                                    {t("help.content_first.content")}
                                </p>
                                <br />
                                <h3 className="text-bold">
                                    {t("help.content_second.title")}
                                </h3>
                                <p>
                                    {t("help.content_second.content")}
                                </p>
                                <br />
                                <h3 className="text-bold">
                                    {t("help.content_third.title")}
                                </h3>
                                <p>
                                    {t("help.content_third.content")}
                                </p>
                                <br />
                                <h3 className="text-bold">
                                    {t("help.content_forth.title")}
                                </h3>
                                <p>
                                    {t("help.content_forth.content")}
                                </p>
                                <br />
                                <h3 className="text-bold">
                                    {t("help.content_fifth.title")}
                                </h3>
                                <p>
                                    {t("help.content_fifth.content")}
                                </p>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withTranslation()(Help);
