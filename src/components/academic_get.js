import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Button, Card } from 'react-bootstrap';
import Loader from 'react-loader-spinner'

import '../assets/Users.css';
import '../assets/Dashboard.css';
import favo_icon from '../assets/images/user_manage/stra_icon_org.png';
import unfavo_icon from '../assets/images/user_manage/star_icon_grey.png';
import academic_img from '../assets/images/dashboard/Academic_Library_icon.png';


class Academic_Get extends Component {

    showArray = (res) => {
        if(this.props.state.loadState === 1) {
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
            if(!res.articles.includes(null)){
                let sortDirection = this.props.state.sortDirection;
                let sortItem = this.props.state.sortItem;
                let sortCategory = this.props.state.sortCategory;
                let article_category = res.id;
                const article_result = res.articles.sort(function(a, b){
                    let dataA = '';
                    let dataB = '';
                    if(sortItem === "Current Data"){
                        dataA = a.file.created_at;
                        dataB = b.file.created_at;
                    }
                    else if(sortItem === "Title"){
                        dataA = a.Title;
                        dataB = b.Title;
                    }
                    else if(sortItem === "Update"){
                        dataA = a.file.updated_at;
                        dataB = b.file.updated_at;
                    }
                    if(dataA < dataB && sortCategory === article_category){
                        let result = (sortDirection === "desc") ? 1 : -1;
                        return result;
                    }
                    if(dataA > dataB && sortCategory === article_category){
                        let result = (sortDirection === "desc") ? -1 : 1;
                        return result;
                    }
                    return 0;
                }).map((res, index) => {
                    if(res && res !== null) {
                        let favo_icon_img = ((this.props.state.favourite_ids.length !== 0) && this.props.state.favourite_ids.articles.includes(res.id)) ? favo_icon : unfavo_icon;
                        return(
                            <Card className="mr-3 pl-2 mb-3 clickable" style={{ width: '47%' }} key={res.id}>
                                <Card.Body className="d-flex flex-row justify-content-between pl-2 pt-4">
                                    <Row className="ml-0 mr-0" style={{width: "100%"}}>
                                        <Col className="d-flex justify-content-center align-items-center academic_card_image pr-2" onClick={this.props.openArticle.bind(this, res.file.url)}>
                                            <img src={academic_img} width="60%" alt="academic library" />
                                        </Col>
                                        <Col className="academic_card_content">
                                            <div className="academic_div flex-flow-nowrap row ml-1 mr-1 justify-content-between d-flex align-items-center flex-row">
                                                <div className="col-md-10 ml-0 mr-0 pl-0" onClick={this.props.openArticle.bind(this, res.file.url)}>
                                                    <h6>{this.props.t("academic_library.table_title.article_name")}</h6>
                                                    <h5 style={{ flexBasis: 'unset', flexGrow: 'unset' }}>{res.Title}</h5>
                                                </div>
                                                <img src={favo_icon_img} width="30" alt='favorite' onClick={this.props.changeFavourite.bind(this, (this.props.state.favourite_ids.length !== 0) ? this.props.state.favourite_ids.articles.includes(res.id) : false, res.id)} />
                                            </div>
                                            <div className="academic_div row mt-2 ml-1 mr-1 justify-content-start d-flex flex-column" onClick={this.props.openArticle.bind(this, res.file.url)}>
                                                <h6>{this.props.t("academic_library.table_title.author_name")}</h6>
                                                <h5>{res.author}</h5>
                                            </div>
                                            <div className="academic_div row mt-2 ml-1 mr-1 justify-content-start d-flex flex-row">
                                                <div className="mt-2 ml-1 mr-4 justify-content-start d-flex flex-column" onClick={this.props.openArticle.bind(this, res.file.url)}>
                                                    <h6>{this.props.t("academic_library.table_title.published_year")}</h6>
                                                    <h5>{res.PubishedYear}</h5>
                                                </div>
                                                <div className="mt-2 ml-1 mr-1 justify-content-start d-flex flex-column" onClick={this.props.openArticle.bind(this, res.file.url)}>
                                                    <h6>{this.props.t("academic_library.table_title.number_of_page")}</h6>
                                                    <h5>{res.Pages}</h5>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        );
                    }
                    return '';
                });
                return article_result;
            }
        }
    }


    filterResultShow = () => {
        const filter_result = this.props.state.articles_library.map((res, index) => {
            if(res.filter_state){
                return (
                    <div key={res.id}>
                        <Row className="mt-3 mb-0 pl-3">
                        {/* onClick={this.props.sortDirectionChange.bind(this, res.id)} */}
                            <Col md={3} className="pl-0">
                                <p className="mt-3 text-green text-bold" >{res.title}</p>
                            </Col>
                        </Row>
                        <Row className="pl-3">
                        {
                            this.showArray(res)
                        }
                        </Row>
                    </div>
                );
            }
            return '';
        });
        return filter_result;
    }

    render() {
        return (
            <div>
                {
                   this.filterResultShow()
                }
            </div>
        );
    }

}

export default Academic_Get;
