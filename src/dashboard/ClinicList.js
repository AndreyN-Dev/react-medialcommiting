import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import axios from "axios";
import Navbars from "../templates/Navbars";
import Sidebar from "../templates/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "react-loader-spinner";
import * as constant from "../components/constants";

import { Container, Row, Col, Button, Modal } from "react-bootstrap";

import "../assets/Users.css";
import "../assets/Dashboard.css";

class ClinicList extends Component {
    constructor(props){
        super(props);
        this.state = {
            jwt: localStorage.getItem("jwt"),
            clinic_list: [],
            visitID: 0,
            visitIndex: 1,
            clinicFlag: 0,
            answeredCount: 0,
            totalCount: -1,
            answeredCasesIDs: [],
        }
    }

    componentDidMount() {
        this.loadClinicList();
        this.loadProgress();
    }

    loadProgress = () => {
        axios
            .get(constant.baseURL + "case-answers/myProgress", {
                headers: {
                    Authorization: `Bearer ${this.state.jwt}`
                }
            })
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        answeredCount: res.data.answered,
                        totalCount: res.data.total,
                        answeredCasesIDs: res.data.answeredIDs,
                    });
                }
            });
    }

    loadClinicList = () => {
        axios
        .get(constant.baseURL + "clinic-cases", {
            headers: {
            Authorization: `Bearer ${this.state.jwt}`
            }
        })
        .then(res => {
            if (res.status === 200) {
            this.setState({
                clinic_list: res.data
            });
            }
        });
    }
       
    clinicScreenChange = (visitID, visitIndex) => {
        this.props.history.push('clinic/' + visitID);
    }
    
    render() {
        const { t } = this.props;

        return (
            <div className="">
            <Container className="">
              <Navbars />
              <Row>
                <Col md={2} className="pl-0 pr-0">
                  <Sidebar active_class="home" />
                </Col>
                <Col
                  md={10}
                  className="about_body d-flex flex-column justify-content-between align-content-between"
                >
                  <Row className="ml-3">
                    <Row style={{ width: "95%" }}>
                      <Col>
                        <h1 className="mt-3 text-bold">{t("clinic.title")}</h1>
                          {/*{this.state.totalCount > 0 ?<h5 className="mt-3">Your have treated <strong>{this.state.answeredCount}</strong> out*/}
                          {/*    of <strong>{this.state.totalCount}</strong> visits</h5> : <div/>}*/}
                      </Col>
                    </Row>
                    <Row className="mt-1 mb-1 p-0 pt-3" style={{ width: "100%" }}>
                        {
                            this.state.clinic_list.map((res, index) => {
                                return (
                                    <div className="listDiv" key={index}>
                                        <Col>
                                            <span className="leftSpan text-bold">{res.Name}</span>
                                            <br/>
                                            <span className="text-grey">You have completed <strong>{
                                                (res.firstVisitID && this.state.answeredCasesIDs.includes(res.firstVisitID) ? 1 : 0) +
                                                (res.secondVisitID && this.state.answeredCasesIDs.includes(res.secondVisitID) ? 1 : 0) +
                                                (res.thirdVisitID && this.state.answeredCasesIDs.includes(res.thirdVisitID) ? 1 : 0) }</strong> out of <strong>{
                                                    (res.firstVisitID ? 1 : 0) + (res.secondVisitID ? 1 : 0) + (res.thirdVisitID ? 1 : 0)
                                                }</strong> visits
                                            </span>
                                        </Col>

                                        <span className="rightSpan">
                                            {
                                                res.firstVisitID != null ? (
                                                    <Button className={this.state.answeredCasesIDs.includes(res.firstVisitID) ? "text-bold bg-green" : "text-bold bg-orange"} variant="orange" onClick={this.clinicScreenChange.bind(this, res.firstVisitID, 1)}>Visit 1</Button>
                                                ) : ""
                                            }
                                            {
                                                res.secondVisitID != null ? (
                                                    <Button className={this.state.answeredCasesIDs.includes(res.secondVisitID) ? "text-bold bg-green" : "text-bold bg-orange"} variant="orange" onClick={this.clinicScreenChange.bind(this, res.secondVisitID, 2)}>Visit 2</Button>
                                                ) : ""
                                            }
                                            {
                                                res.thirdVisitID != null ? (
                                                    <Button className={this.state.answeredCasesIDs.includes(res.thirdVisitID) ? "text-bold bg-green" : "text-bold bg-orange"} variant="orange" onClick={this.clinicScreenChange.bind(this, res.thirdVisitID, 3)}>Visit 3</Button>
                                                ) : ""
                                            }
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </Row>
                  </Row>
                </Col>
              </Row>
            </Container>
          </div>
        );
    } 

}

export default withTranslation()(ClinicList);

