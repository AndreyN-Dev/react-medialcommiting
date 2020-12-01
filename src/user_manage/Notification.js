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
import seen_bell from '../assets/images/user_manage/bell_icon.png';
import unseen_bell from '../assets/images/user_manage/bell2_icon.png';

import '../assets/Users.css';


class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jwt: localStorage.getItem('jwt'),
            notifies: [],
            notify_id: 0,
            notify_title: '',
            notify_content: '',
            notify_link: '',
            notify_seen: false,
            countNum: 0,
            countIndex: 0,
            notify_getState: false,
            show_state: false,
            notify_alert: false,
            sortDirection: 'desc',
            loadState: 1
        }
    }
    componentDidMount() {
        axios.get(constant.baseURL + "notifications/me",{
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then(res => {
            this.setState({
                notifies: res.data
            });
            this.setState({
                notify_getState: true
            }, function(){
                const list = this.state.notifies.find(item => {
                    if(!item.seen){
                        this.setState({
                            notify_alert: true
                        });
                        return item;
                    }
                });
                this.setState({
                    loadState: 2
                })
            });
        }, [] );
    }
    
    handleClose = () => {
        this.setState({show_state: false});
    }

    handleShow = () => {
        this.setState({show_state: true});
    }

    viewModal = (countNum) => {
        this.setState({
            countIndex: countNum,
            notify_id: this.state.notifies[countNum].id,
            notify_title: this.state.notifies[countNum].Title,
            notify_content: this.state.notifies[countNum].content,
            notify_link: this.state.notifies[countNum].link,
        });
        this.handleShow();
    }

    viewNotify = () => {
        let data = {
            notificationID: this.state.notify_id
        }
        axios.post(constant.baseURL + "notifications/markSeen", data, {
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then(res => {
            if(res.data.status === "Success"){
                this.setState(state => {
                    const notifies = state.notifies.map((item, index) => {
                        if(index === this.state.countIndex){
                            item.seen = true;
                            return item;
                        }
                        else{
                            return item;
                        }
                    });
                    return {
                        notifies,
                    };
                }, function(){
                    const list = this.state.notifies.find(item => {
                        this.setState({
                            notify_alert: false
                        });
                        if(!item.seen){
                            this.setState({
                                notify_alert: true
                            });
                            return item;
                        }
                    });
                });
                this.handleClose();
            }
        });
    }

    deleteNotify = (id) => {
        let data = {
            notificationID: id
        }

        axios.post(constant.baseURL + "notifications/markDelete", data, {
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then(res => {
            if(res.data.status === "Success"){
                this.setState(state => {
                    const notifies = state.notifies.filter(item => item.id !== id);
                    return {
                        notifies,
                    };
                });
                // alert("Notification is deleted successfully.");
            }
        });
    }

    sortDirectionChange = () => {
        if(this.state.sortDirection === 'desc'){
            this.setState({
                sortDirection: "asc"
            })
        }
        else{
            this.setState({
                sortDirection: "desc"
            })
        }
    }
    showNotifylist = () => {
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
            if(this.state.sortDirection === 'desc'){
                const sortResult = this.state.notifies.sort(function(a, b){
                    if(a.created_at > b.created_at){
                        return -1;
                    } 
                    if(a.created_at < b.created_at) {
                        return 1;
                    }
                    return 0;
                }).map((res, index) => (
                    <Row className="table_row mt-1 mb-1 p-2" key={res.id} onClick={this.viewModal.bind(this, index)} >
                        <Col md={1} className="pl-1 pr-0"><img src={(res.seen)?seen_bell:unseen_bell} width="25px" alt='bell' /></Col>
                        <Col md={3} className="pl-0 pr-0">{res.Title}</Col>
                        <Col md={2} className="pl-0 pr-0">{res.created_at.split('T')[0]}</Col>
                        <Col md={5} className="pl-0 pr-0">{res.link}</Col>
                        <Col md={1} className="text-right pl-0 pr-1"><button style={{ background: 'none', border: 'none' }} className="notify_remove" onClick={this.deleteNotify.bind(this, res.id)} type='button' ><i className="fa fa-trash"></i></button></Col>
                    </Row>
                ))
                return sortResult;
            }
            else{
                const sortResult = this.state.notifies.sort(function(a, b){
                    if(a.created_at > b.created_at){
                        return 1;
                    } 
                    if(a.created_at < b.created_at) {
                        return -1;
                    }
                    return 0;
                }).map((res, index) => (
                    <Row className="table_row mt-1 mb-1 p-2" key={res.id} onClick={this.viewModal.bind(this, index)} >
                        <Col md={1} className="pl-1 pr-0"><img src={(res.seen)?seen_bell:unseen_bell} width="25px" alt='bell' /></Col>
                        <Col md={3} className="pl-0 pr-0">{res.Title}</Col>
                        <Col md={2} className="pl-0 pr-0">{res.created_at.split('T')[0]}</Col>
                        <Col md={5} className="pl-0 pr-0">{res.link}</Col>
                        <Col md={1} className="text-right pl-0 pr-1"><button style={{ background: 'none', border: 'none' }} className="notify_remove" onClick={this.deleteNotify.bind(this, res.id)} type='button' ><i className="fa fa-trash"></i></button></Col>
                    </Row>
                ));
                return sortResult;
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
                        <Sidebar active_class="notify"></Sidebar>
                        </Col>
                        <Col md={10} className="about_body">
                            <Row className="mb-2">
                                <Col>
                                    <h1 className="mt-3 text-bold">{t("notification.title")}</h1>
                                    <div className="profile_info pl-5 pr-5 pb-4">
                                        <Row className="mt-3 mb-1">
                                            <Col md={3} className="pl-0">
                                                <p className="mt-3 text-green text-bold">{t("notification.table_title.title")}</p>
                                            </Col>
                                        </Row>
                                        <Row className="table_header mt-1 mb-1 p-2 pt-3">
                                            <Col md={1} className="pl-1 pr-0">#</Col>
                                            <Col md={3} className="pl-0 pr-0" style={{cursor:'pointer'}} onClick={this.sortDirectionChange}>{ t("notification.table_title.latest_notification") } <i className="fa fa-sort ml-4"></i></Col>
                                            <Col md={2} className="pl-0 pr-0">{ t("notification.table_title.time") }</Col>
                                            <Col md={5} className="pl-0 pr-0">{ t("notification.table_title.link") }</Col>
                                            <Col md={1} className="pl-0 pr-1"></Col>
                                        </Row>
                                        {
                                            
                                            this.showNotifylist()
                                        }
                                    </div>
                                </Col>
                            </Row>
                            {/*<p className="text-left pb-2">*/}
                            {/*    {t("footer")}*/}
                            {/*</p>*/}
                        </Col>
                    </Row>
                    <Modal show={this.state.show_state} onHide={this.handleClose} className="notify_modal">
                        <Modal.Header>
                            <Modal.Title className="text-bold">{this.state.notify_title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.notify_content}
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="warning" onClick={this.viewNotify} className="bg-warning pl-5 pr-5 pt-1 pb-1">
                            { t("utility.close") }
                        </Button>
                        <a href={this.state.notify_link} target="_blank" rel="noopener noreferrer" className={(this.state.notify_link !== '' && this.state.notify_link !== null) ? "btn-warning pl-5 pr-5 pt-1 pb-1" : "btn-none"}>
                            { t("utility.more") }
                        </a>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </div>
        );
    }
}

export default withTranslation()(Notification);
