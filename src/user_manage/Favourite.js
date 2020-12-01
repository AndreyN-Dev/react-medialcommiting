import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import axios from "axios";
import { Player, ControlBar, BigPlayButton } from 'video-react';
import "video-react/dist/video-react.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from 'react-loader-spinner'
import * as constant from '../components/constants';

import {Container, Row, Col, Modal} from 'react-bootstrap';
import Navbars from '../templates/Navbars';
import Sidebar from '../templates/Sidebar';

import '../assets/Users.css';


class Favourite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jwt: localStorage.getItem('jwt'),
            articles: [],
            videos: [],
            article_id: 0,
            article_title: '',
            article_content: '',
            video_id: 0,
            video_title: '',
            video_content: '',
            notify_seen: false,
            countNum: 0,
            countIndex: 0,
            show_state: false,
            isOpen: false,
            selectedVideoID: '',
            selectedVideoTumbnail: '',
            videoSortDirection: "desc",
            articleSortDirection: "asc",
            loadState: 1
        }
    }
    componentDidMount() {
        axios.get(constant.baseURL + "favourites/me",{
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then(res => {
            this.setState({
                articles: res.data.articles,
                videos: res.data.sessions
            }, function() {
                this.setState({
                    loadState: 2
                })
            });
        }, [] );
    }

    // for youtube video player popup
    openModal = (videoID, thumbnail) => {
        if(videoID !== null){
            this.setState({
                selectedVideoID: videoID,
                selectedVideoTumbnail: thumbnail
            }, function(){
                this.setState({
                    isOpen: true,
                });
            })
        }
    }

    videoSortDirectionChange = () => {
        if(this.state.videoSortDirection === 'desc'){
            this.setState({
                videoSortDirection: "asc"
            })
        }
        else{
            this.setState({
                videoSortDirection: "desc"
            })
        }
    }

    articleSortDirectionChange = () => {
        if(this.state.articleSortDirection === 'desc'){
            this.setState({
                articleSortDirection: "asc"
            })
        }
        else{
            this.setState({
                articleSortDirection: "desc"
            })
        }
    }

    showVideoList = () => {
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
            let videoSortDirection = this.state.videoSortDirection;
            let videoList = this.state.videos.sort(function(a, b){
                let dateA = a.video.Thumbnail.created_at;
                let dateB = b.video.Thumbnail.created_at;
                if(dateA < dateB){
                    let result = (videoSortDirection === "desc") ? 1 : -1;
                    return result;
                }
                if(dateA > dateB){
                    let result = (videoSortDirection === "desc") ? -1 : 1;
                    return result;
                }
                return 0;
            }).map((res, index) => {
                let video_url = (res.video.videoURL !== null) ? res.video.videoURL : "";
                return(
                    <Row className="table_row mt-1 mb-1 p-2 d-flex align-items-center" key={res.id} onClick={this.openModal.bind(this, video_url, res.video.Thumbnail.url)} >
                        <Col style={{ width: "25%", flexBasis: 'unset', flexGrow: 'unset' }} className="pl-1 pr-1 d-flex align-items-center"><div className=" d-flex align-items-center justify-content-center" style={{ backgroundImage: `url(${res.video.Thumbnail.url})`, width: '80%', height: '80px', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}><i style={{ fontSize: '35px' }} className="fa fa-play"/></div></Col>
                        <Col style={{ width: "33%", flexBasis: 'unset', flexGrow: 'unset' }} className="pl-1 pr-1">{res.Title}</Col>
                        <Col style={{ width: "26%", flexBasis: 'unset', flexGrow: 'unset' }} className="pl-1 pr-1">{res.Speaker}</Col>
                        <Col style={{ width: "16%", flexBasis: 'unset', flexGrow: 'unset' }} className="pl-1 pr-1">{res.video.Duration}</Col>
                    </Row>
                );
            })
            return videoList;
        }
    }

    showArticleList = () => {
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
            let articleSortDirection = this.state.articleSortDirection;
            let articleList = this.state.articles.sort(function(a, b){
                let dateA = a.file.created_at;
                let dateB = b.file.created_at;
                if(dateA < dateB){
                    let result = (articleSortDirection === "desc") ? 1 : -1;
                    return result;
                }
                if(dateA > dateB){
                    let result = (articleSortDirection === "desc") ? -1 : 1;
                    return result;
                }
                return 0;
            }).map((res, index) => (
                <Row className="table_row mt-1 mb-1 p-2" key={res.id}>
                    <Col md={4} className="pl-1 pr-1"><a href={res.file.url} target="_blank" rel="noopener noreferrer" style={{color: '#212529'}} >{res.Title}</a></Col>
                    <Col md={3} className="pl-1 pr-2">{res.author}</Col>
                    <Col md={3} className="pl-2 pr-1">{res.PubishedYear}</Col>
                    <Col md={2} className="pl-1 pr-1">{res.Pages}</Col>
                </Row>
            ))
            return articleList;
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
                        <Sidebar active_class="favo"></Sidebar>
                        </Col>
                        <Col md={10} className="about_body">
                            <Row className="mb-2">
                                <Col>
                                    <h1 className="mt-3 text-bold">{t("favourite.title")}</h1>
                                    <div className="profile_info pl-5 pr-5 pb-4">
                                        <Row className="mt-3 mb-1">
                                            <Col md={3} className="pl-0">
                                                <p className="mt-3 text-green text-bold">{t("favourite.video_table_title.title")}</p>
                                            </Col>
                                        </Row>
                                        <Row className="table_header mt-1 mb-1 p-2 pt-3">
                                            <Col md={3} className="pl-1 pr-1 text-bold" onClick={this.videoSortDirectionChange} style={{cursor: "pointer"}}>{t("favourite.video_table_title.lates_video")} <i className="fa fa-sort ml-4"></i></Col>
                                            <Col md={4} className="pl-1 pr-1 text-bold">{t("favourite.video_table_title.name")}</Col>
                                            <Col md={3} className="pl-1 pr-1 text-bold">{t("favourite.video_table_title.present_by")}</Col>
                                            <Col md={2} className="pl-1 pr-1 text-bold">{t("favourite.video_table_title.time")}</Col>
                                        </Row>
                                        {
                                            this.showVideoList()
                                        }
                                        <Row className="mt-3 mb-1">
                                            <Col md={3} className="pl-0">
                                                <p className="mt-3 text-green text-bold">{t("favourite.article_table_title.title")}</p>
                                            </Col>
                                        </Row>
                                        <Row className="table_header mt-1 mb-1 p-2 pt-3">
                                            <Col md={4} className="pl-1 pr-1 text-bold" onClick={this.articleSortDirectionChange} style={{cursor: "pointer"}} >{t("favourite.article_table_title.article_name")} <i className="fa fa-sort ml-4"></i></Col>
                                            <Col md={3} className="pl-1 pr-1 text-bold">{t("favourite.article_table_title.author_name")}</Col>
                                            <Col md={3} className="pl-1 pr-1 text-bold">{t("favourite.article_table_title.published_year")}</Col>
                                            <Col md={2} className="pl-1 pr-1 text-bold">{t("favourite.article_table_title.number_of_page")}</Col>
                                        </Row>
                                        {
                                            
                                            this.showArticleList()
                                        }

                                    </div>
                                </Col>
                            </Row>
                            {/*<p className="text-left pb-3">*/}
                            {/*    {t("footer")} */}
                            {/*</p>*/}
                        </Col>
                    </Row>
                    <div>
                        <Modal show={this.state.isOpen} onHide={() => this.setState({isOpen: false})} className="video_modal">
                            <Modal.Header closeButton>
                            </Modal.Header>
                            <Modal.Body>
                                <Player
                                playsInline
                                autoPlay={false}
                                width='500px'
                                poster={this.state.selectedVideoTumbnail}
                                src={this.state.selectedVideoID}>
                                     <ControlBar autoHide={true} className="my-class" />
                                     <BigPlayButton position="center" />
                                </Player>
                            </Modal.Body>
                            <Modal.Footer>
                            </Modal.Footer>
                        </Modal>

                        {/* <ModalVideo  isOpen={this.state.isOpen} videoId={this.state.selectedVideoID} onClose={() => this.setState({isOpen: false})} youtube={{modestbranding: 1, cc_load_policy: 0, fs:0, rel: 1, iv_load_policy: 3, showinfo: 0, color: 'white'}} /> */}
                    </div>
                </Container>
            </div>
        );
    }
}

export default withTranslation()(Favourite);
