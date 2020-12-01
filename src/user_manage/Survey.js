import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import axios from "axios";
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from 'react-loader-spinner'
import * as constant from '../components/constants';

import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Navbars from '../templates/Navbars';
import Sidebar from '../templates/Sidebar';

import '../assets/Users.css';


class Survey extends Component {
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
    componentDidMount() {
        axios.get(constant.baseURL + "surveys",{
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then(res => {
            if(res.status === 200) {
                this.setState({
                    surveyData: res.data,
                    loadState: 2
                }, function(){
                    let answerSelectedList = [ ...this.state.answerSelectedList ];
                    let answerSubmitData = { ...this.state.answerSubmitData };
                    if(this.state.surveyData.length !== 0) {
                        this.state.surveyData[0].Questions.forEach((survey_res, index) => {
                            if(survey_res.Type === "mcq"){
                                let answerTemp = [];
                                survey_res.options.forEach((elm, elm_index) => {
                                    if(elm_index === 0){
                                        answerTemp.push(1);
                                    }
                                    else{
                                        answerTemp.push(0);
                                    }
                                });
                                answerSelectedList.push({"answer": answerTemp});
                                answerSubmitData = {
                                    ...answerSubmitData,
                                    [survey_res.id]: 0
                                }
                            }
                            else{
                                answerSelectedList.push({"answer": []});
                                answerSubmitData = {
                                    ...answerSubmitData,
                                    [survey_res.id]: ""
                                }
    
                            }
                        });
                    }
                    this.setState({
                        answerSelectedList: answerSelectedList,
                        answerSubmitData: answerSubmitData
                    });
                });
            }
            else{
                console.log("survey_error");
            }
        });
    }
    
    handleClose = () => {
        this.setState({show_state: false});
    }


    answerSelect = (question_id, questions_index, answer_index) => {
        let answerSubmitData = { ...this.state.answerSubmitData };
        answerSubmitData[question_id] = answer_index;

        const answerList = this.state.answerSelectedList.map((res, index) => {
            if(index === questions_index){
                const answerNewList = res.answer.map((elm, elm_index) => {
                    if(elm_index === answer_index){
                        return 1;
                    }
                    else
                        return 0;
                });
                return {"answer": answerNewList};
            }
            else{
                return res;
            }
        });
        this.setState({
            answerSelectedList: answerList,
            answerSubmitData: answerSubmitData
        });
    }

    surveyOpenAnswer = (event) => {
        let answerSubmitData = { ...this.state.answerSubmitData };
        let answerText = event.target.value;
        let answerName = event.target.name;
        let question_id = answerName.split("_")[2];
        answerSubmitData[question_id] = answerText;
        this.setState({
            answerSubmitData: answerSubmitData
        });
    }

    answerSubmit = () => {
        let sendData = {
            "survey": this.state.surveyData[0].id,
            "answers": this.state.answerSubmitData
        };
        axios.post(constant.baseURL + "survey-answers", sendData, {
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then(res => {
            if(res.status === 200){
                this.setState({
                    show_state: true
                })
            }
        });
    }

    showSurveyList = () => {
        if(this.state.loadState === 1) {
            return(
                <div className="pl-2 pr-2 pt-5 mt-5 row d-flex justify-content-center align-items-center">
                    <Loader
                    type="ThreeDots"
                    color="#09a3a1"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                    />
                </div>
            )
        }
        else {
            let surveyData = this.state.surveyData[0];
            console.log(this.state.surveyData.length);
            if(this.state.surveyData.length !== 0){
                const surveyList = surveyData.Questions.map((res, index) => {
                    if(res.Type === "open"){
                        return (
                            <div className="survey_div pl-5 pr-5 pb-4" key={res.id}>
                                <Row className="mt-3 mb-1">
                                    <Col className="pl-0">
                                        <p className="mt-3">{ "Question # " + (Number(index) + 1) }</p>
                                        <p className="mt-3">{ res.Question }</p>
                                    </Col>
                                </Row>
                                <Row className="mt-1 mb-1 p-0 pt-0">
                                    <textarea name={ "survey_open_" + res.id } className={ "surveyAnserTextarea" } rows="3" onChange={ this.surveyOpenAnswer }></textarea>
                                </Row>
                            </div>
                        )
                    }
                    else if(res.Type === "mcq"){
                        return (
                            <div className="survey_div pl-5 pr-5 pb-4" key={res.id}>
                                <Row className="mt-3 mb-1">
                                    <Col className="pl-0">
                                        <p className="mt-3">{ "Question # " + (Number(index) + 1) }</p>
                                        <p className="mt-3">{ res.Question }</p>
                                    </Col>
                                </Row>
                                <Row className="mt-1 mb-1 p-0 pt-0">
                                    {
                                        res.options.map((elm, elm_index) => {
                                            return (
                                                <Button type="button" key={elm_index} className={ ((this.state.answerSelectedList[index] !== undefined) && (this.state.answerSelectedList[index].answer[elm_index] === 1)) ? "answerBtn active" : "answerBtn" } onClick={ this.answerSelect.bind(this, res.id, index, elm_index) } >{ elm.Title }</Button>
                                            );
                                        })
                                    }
                                </Row>
                            </div>
                        )
                    }
                });
                return surveyList;
            }
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
                        <Sidebar active_class="survey"></Sidebar>
                        </Col>
                        <Col md={10} className="about_body justify-content-between d-flex flex-column">
                            <Row className="mb-2">
                                <Col>
                                    <h1 className="mt-3 text-bold">{ (this.state.surveyData[0] !== undefined) ? this.state.surveyData[0].Title : "Survey Title" }</h1>
                                    {
                                        this.showSurveyList()
                                    }
                                    <Button type="button" className="bg-orange answerSubmitBtn mt-3" name="answerSubmit" onClick={ this.answerSubmit }>{ t("utility.submitAnswer") }</Button>

                                </Col>
                            </Row>
                            {/*<p className="text-left pb-2">*/}
                            {/*    {t("footer")}*/}
                            {/*</p>*/}
                        </Col>
                    </Row>
                    <Modal show={this.state.show_state} onHide={this.handleClose} className="notify_modal">
                        <Modal.Header>
                            <Modal.Title> { t('utility.thanks') }</Modal.Title>
                        </Modal.Header>
                        <Modal.Body> { t('login.content') } </Modal.Body>
                    </Modal>
                </Container>
            </div>
        );
    }
}

export default withTranslation()(Survey);
