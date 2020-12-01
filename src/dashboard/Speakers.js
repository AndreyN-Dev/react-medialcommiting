import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Icon from 'react-bootstrap-icons';
import * as constant from '../components/constants';

import { Container, Row, Col, Form, FormControl, InputGroup, Button, Modal } from 'react-bootstrap';
import Navbars from '../templates/Navbars';
import Sidebar from '../templates/Sidebar';
import male_photo from '../assets/images/user_manage/Profile-doctor-boy.png';
import female_photo from '../assets/images/user_manage/Profile-doctor-girl.png';


import '../assets/Users.css';
import '../assets/Dashboard.css';


class Speakers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jwt: localStorage.getItem('jwt'),
            experts: [],
            searchExpert: [],
            expert_id: 0,
            subject: '',
            question: '',
            speakerDirection: 'desc',
            speakerIndex: 0,
            showDetailFlag: true,
            show_detail_state: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions.bind(this));
        axios.get(constant.baseURL + "experts",{
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then(res => {
            if(res.status === 200){
                this.setState({
                    experts: res.data,
                    searchExpert: res.data
                }, function(){
                    this.setState({
                        expert_id: this.state.experts[0].id
                    });
                });
            }
            else{
                return false;
            }
        }, [] );

    }


    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    }

    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth, height: window.innerHeight
        }, function(){
            if((this.state.width <= 1024 && this.state.width < this.state.height) || (this.state.width <= 1024 && this.state.height < 910)){
                this.setState({
                    showDetailFlag: false
                });
            }
            else{
                this.setState({
                    showDetailFlag: true
                });
            }
        });

    }

    handleClose = () => {
        this.setState({show_state: false});
    }

    handleDetailClose = () => {
        this.setState({show_detail_state: false});
    }

    handleShow = (expert_id) => {
        this.setState({
            show_state: true,
            expert_id: expert_id
        });
    }

    contactEnterData = (event) => {
        event.preventDefault();
        let enter_name = event.target.name;
        let enter_value = event.target.value;
        this.setState({
            [enter_name]: enter_value
        });
    }

    sendQuestion = () => {
        let data = {
            "Subject": this.state.subject,
            "Content": this.state.question,
            "expert": this.state.expert_id
        }
        axios.post(constant.baseURL + "expert-questions", data,
        {
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        }).then(res => {
            this.handleClose();
        })
    }

    speakerSort = () => {
        if(this.state.speakerDirection === 'desc'){
            this.setState({
                speakerDirection: "asc"
            })
        }
        else{
            this.setState({
                speakerDirection: "desc"
            })
        }
    }

    loadSpeakers = () => {
        const { t } = this.props;
        let speakerDirection = this.state.speakerDirection;
        if(this.state.experts && !this.state.experts.includes(null)){
            const speakersList = this.state.experts
            //     .sort(function(a, b){
            //     let dataA = a.Name.toLowerCase();
            //     let dataB = b.Name.toLowerCase();
            //     if(dataA < dataB){
            //         let result = (speakerDirection === "desc") ? 1 : -1;
            //         return result;
            //     }
            //     if(dataA > dataB){
            //         let result = (speakerDirection === "desc") ? -1 : 1;
            //         return result;
            //     }
            //     return 0;
            // })
                .map((res, index) => {
                return (
                    <Row className="table_row mt-1 mb-1 p-2 d-flex justify-content-center align-items-center" key={res.id} onClick={this.speakerSelect.bind(this, index)} >
                        <Col md={1} className="pl-1 pr-2"> <img className="rounded-circle fit_image" style={{width:"50px", height: "50px"}} src={ this.speakerPhoto(this.state.experts[index]) } alt='avatar' /> </Col>
                        <Col md={3} className="pl-1 pr-1">{res.Name}</Col>
                        <Col md={8} className="pl-2 pr-2">{res.Title}</Col>
                    </Row>
                )
            });
            return speakersList;
        }
        return "";
    }

    speakerSelect = (index = 0) => {
        this.setState({
            speakerIndex: index
        });
        if((this.state.width <= 1024 && this.state.width < this.state.height) || (this.state.width <= 1024 && this.state.height < 910)){
            this.setState({
                show_detail_state: true
            });
        }
    }

    speakerPhoto = (speaker) => {
        if(speaker.Photo != null) {
            return speaker.Photo.url
        } else if (speaker.Gender === "Male"){
            return male_photo
        } else {
            return female_photo
        }
    }

    showSpeakerInfo = () => {
        const { t } = this.props;
        let index = this.state.speakerIndex;
        if(this.state.experts[index] && this.state.experts[index] !== null){
            return (
                <div className="pl-2 pr-2 pb-4 d-flex flex-column justify-content-between" style={{height: "100%"}}>
                    <div>
                        <Row className='pt-4'>
                            <Col className='d-flex justify-content-center align-items-center m-2'><h4 className="text-center text-bold">{ t("speakers.expert_profile.title") }</h4></Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center align-items-center m-2 '>
                                <img className='rounded-circle fit_image' src={this.speakerPhoto(this.state.experts[index])} alt='expert avatar' height='110px' width='110px'/>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center align-items-center flex-column p-0'>
                                <h6 className="text-green text-bold" style={{ fontSize: '20px' }}>{ this.state.experts[index].Name }</h6>
                                <h6 className="text-grey text-center ">{ this.state.experts[index].Title }</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='pt-3'>
                                <p className="text-bold text-left">{ (this.state.experts[index].Bio !== null && this.state.experts[index].Bio !== "") ? t("speakers.expert_profile.information") : "" }</p>
                                <p className="pt-0 mt-0" style={{ fontSize: '14px' }}>{ this.state.experts[index].Bio }</p>
                                <p className="text-bold text-left">{ (this.state.experts[index].Publications !== null &&  this.state.experts[index].Publications !== "") ? t("speakers.expert_profile.publication") : "" }</p>
                                <p style={{ fontSize: '14px' }}>{ (this.state.experts[index].Publications !== null &&  this.state.experts[index].Publications !== "") ? this.state.experts[index].Publications : "" }</p>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className='p-0'>
                            <Button type='button' className='bg-orange pt-1 pb-1 btn-expand' variant='orange' onClick={ this.handleShow.bind(this, this.state.experts[index].id) } >{t("speakers.ask_doctor")}</Button>
                        </Col>
                    </Row>
                </div>
            );
        }
        return '';
    }

    searchExpert = (event) => {
        let searchContent = event.target.value;
        this.setState(state => {
            const experts = state.searchExpert.filter(res => {
                if(res.Name.toLowerCase().includes(searchContent.toLowerCase())){
                    return res;
                }
            });
            return {
                experts,
            };
        });
    }

    render() {
        const { t } = this.props;
        return (
            <div className="">
                <Container className="">
                    <Navbars></Navbars>
                    <Row>
                        <Col md={2} className="pl-0 pr-0">
                        <Sidebar active_class="home"></Sidebar>
                        </Col>
                        <Col md={10} className="about_body d-flex flex-column justify-content-between align-content-between">
                            <Row className="m-2">
                                <Row style={{ width: '100%' }}>
                                    <Col>
                                        <h1 className="mt-3 text-bold">{ t("speakers.title") }</h1>
                                    </Col>
                                </Row>
                                <Row className="mb-2 pr-4 mt-3" style={{ width: '100%', flexWrap: 'nowrap', boxSizing: 'border-box' }}>
                                    <Col md={(this.state.showDetailFlag) ? 9 : 12} className="profile_info ml-3" style={{ boxSizing: 'border-box' }}>
                                        <div className="pl-4 pr-4 pb-4">
                                            <Row className='mb-3 mt-3'>
                                                <Col md={8} className="pl-0">
                                                    <Form className="mt-3 search_form">
                                                        <Form.Group controlId="formSearch" className="mb-1 mt-1">
                                                            <InputGroup className="search_box">
                                                            <InputGroup.Prepend>
                                                                <InputGroup.Text id="search">
                                                                <Icon.Search size="25" />
                                                                </InputGroup.Text>
                                                            </InputGroup.Prepend>
                                                            <FormControl
                                                                type="text"
                                                                name="search"
                                                                placeholder="Search"
                                                                aria-label="Search"
                                                                aria-describedby="search"
                                                                onChange={ this.searchExpert }
                                                            />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form>
                                                </Col>
                                            </Row>
                                            <Row className="table_header mt-1 mb-1 p-2 pt-3 pb-3 d-flex justify-content-center align-items-center">
                                                <Col md={1} className="pl-1 pr-1 text-bold">{t("speakers.table_title.avatar")}</Col>
                                                <Col md={3} className="pl-1 pr-1 text-bold" onClick={this.speakerSort} style={{cursor: 'pointer'}} >{t("speakers.table_title.speaker_name")} <i className="fa fa-sort ml-4"></i></Col>
                                                <Col md={8} className="pl-1 pr-2 text-bold">{t("speakers.table_title.position")}</Col>
                                            </Row>
                                            {
                                                this.loadSpeakers()
                                            }
                                        </div>
                                    </Col>
                                    {
                                        (this.state.showDetailFlag) ? ( 
                                            <Col md={3} className="profile_info ml-4 mr-5" style={{ boxSizing: 'border-box' }}>
                                                {
                                                    this.showSpeakerInfo()
                                                }
                                            </Col>
                                        ) : ""
                                    }
                                   
                                </Row>
                            </Row>
                            {/*<p className="text-left pb-2">*/}
                            {/*    {t("footer")}*/}
                            {/*</p>*/}
                        </Col>
                    </Row>
                    <Modal show={this.state.show_state} onHide={this.handleClose} className="change_pwd_modal">
                        <Modal.Header>
                                <Modal.Title>{ t("speakers.ask_doctor") }</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form className="change_pwd_form mt-3">
                                <Form.Group>
                                    <Form.Control type="text" className="mb-2" placeholder="Subject" name="subject" required onChange={this.contactEnterData}/>
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Control as="textarea" rows="3" placeholder="Question details" name="question" required  onChange={this.contactEnterData} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="success" onClick={this.sendQuestion} className="pl-5 pr-5 pt-1 pb-1">
                            {t("utility.send")}
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.show_detail_state} onHide={this.handleDetailClose} className="showSpeakerDetail">
                        <Modal.Body>
                            {
                                this.showSpeakerInfo()
                            }
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="success bg-green" onClick={this.handleDetailClose} className="pl-5 pr-5 pt-1 pb-1">
                            {t("utility.close")}
                        </Button>
                        </Modal.Footer>
                    </Modal>

                </Container>
            </div>
        );
    }
}

export default withTranslation()(Speakers);
