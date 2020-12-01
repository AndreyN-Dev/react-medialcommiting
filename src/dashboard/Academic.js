import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Icon from 'react-bootstrap-icons';

import { Container, Row, Col, Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import Navbars from '../templates/Navbars';
import Sidebar from '../templates/Sidebar';
import * as constant from '../components/constants';
import filter_icon from '../assets/images/user_manage/Filter_icon.png';

import Academic_Component from '../components/academic_components';

import '../assets/Users.css';
import '../assets/Dashboard.css';

var searchArticles = [];

class Academic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jwt: localStorage.getItem('jwt'),
            categories: [],
            articles_library: [],
            compName: 'compA',
            btnClass: 'mt-3 d-flex justify-content-between flex-row align-items-center filter_btn bg-white',
            sort_array: [
                {'title': 'Current Data', 'sort_state': true},
                {'title': 'Title', 'sort_state': false},
                {'title': 'Update', 'sort_state': false},
            ],
            sortItem: "Current Data",
            sortDirection: "desc",
            sortCategory: 0,
            favourite_ids: [],
            loadState: 1
        }
    }
    componentDidMount() {
        // getting category list
        axios.get(constant.baseURL + "article-categories",{
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then(res => {
            if(res.status === 200){
                // this.setState({
                //     articles_library: res.data
                // }, function(){
                //     console.log('articles_library:', this.state.articles_library);
                // });
                res.data.forEach(category => {
                    category.filter_state = true;
                    this.setState(state => {
                        const articles_library = [...state.articles_library, category];
                        return {
                            articles_library,
                        }
                    })

                });
                localStorage.setItem("articleList", JSON.stringify(this.state.articles_library));
                this.setState({
                    loadState: 2
                })
            }
            else{
                return false;
            }
        }, [] );
        // getting favourite ids
        axios.get(constant.baseURL + "favourites/me/ids",{
            headers: {
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then(res => {
            if(res.status === 200){
                this.setState({
                    favourite_ids: res.data
                })
            }
        });


    }

    component_change = () => {
        let compName = this.state.compName;
        if(compName === "compA"){
            this.setState({
                compName: "compB",
                btnClass: "mt-3 d-flex justify-content-between flex-row align-items-center filter_btn bg-green"
            });
        }
        else{
            this.setState({
                compName: "compA",
                btnClass: "mt-3 d-flex justify-content-between flex-row align-items-center filter_btn bg-white"
            });
        }

    }

    filterItemChange = (category) => {
        this.setState(state => {
            const articles_library = state.articles_library.map(res => {
                if(res.title === category){
                    let state_temp = res.filter_state;
                    res.filter_state = !state_temp;
                }
                return res;
            });
            return {
                articles_library,
            }
        })
    }

    sortItemChange = (category) => {
        this.setState(state => {
            const sort_array = state.sort_array.map(res => {
                if(res.title === category){
                    res.sort_state = true;
                }
                else{
                    res.sort_state = false;
                }
                return res;
            });
            return {
                sort_array,
            }
        });
        this.setState({
            sortItem: category
        });
    }

    sortDirectionChange = (category) => {
        if(this.state.sortDirection === 'desc'){
            this.setState({
                sortDirection: "asc",
                sortCategory: category
            })
        }
        else{
            this.setState({
                sortDirection: "desc",
                sortCategory: category
            })
        }
    }


    changeFavourite = (index, id) => {
        if(index){
            let data = {
                "articleID": id
            }
            axios.put(constant.baseURL +  "favourites/me/removeArticle", data,{
                headers: {
                    'Authorization': `Bearer ${this.state.jwt}`
                }
            })
            .then(res => {
                if(res.status === 200){
                    axios.get(constant.baseURL +  "favourites/me/ids", {
                        headers: {
                            'Authorization': `Bearer ${this.state.jwt}`
                        }
                    })
                    .then(item => {
                        this.setState({
                            favourite_ids: item.data
                        })
                    });
                }
            });
        }
        else{
            let data = {
                "articleID": id
            }
            axios.put(constant.baseURL +  "favourites/me/addArticle", data,{
                headers: {
                    'Authorization': `Bearer ${this.state.jwt}`
                }
            })
            .then(res => {
                if(res.status === 200){
                    axios.get(constant.baseURL + "favourites/me/ids", {
                        headers: {
                            'Authorization': `Bearer ${this.state.jwt}`
                        }
                    })
                    .then(item => {
                        this.setState({
                            favourite_ids: item.data
                        })
                    });
                }
            });
        }
    }

    searchArticle = (event) => {
        let searchValue = event.target.value;
        searchArticles = JSON.parse(localStorage.getItem("articleList"));
        this.setState(state => {
            const articles_library = searchArticles.filter(item => {
                const sub_article = item.articles.filter(res => {
                    if(res !== null && (res.Title.toLowerCase().includes(searchValue.toLowerCase()))){
                        return res;
                    }
                });
                if(sub_article.length !== 0){
                    item.articles = sub_article;
                    return item;
                }
            });
            return {
                articles_library
            };
        });
    }

    openArticle = (articleURL) => {
        window.open(articleURL);
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
                            <Row className="mb-2">
                                <Col className="ml-2 mr-2">
                                    <h1 className="mt-3 text-bold">{t("academic_library.title")}</h1>
                                    <div className="pl-0 pr-5 pb-4">
                                        <Row className="d-flex justify-content-between">
                                            <Col md={{span: 5}} className="text-right pr-0">
                                                <Form className="search_form mt-3">
                                                    <Form.Group controlId="formSearch" className="mb-1 mt-0" style={{backgroundColor: "white"}}>
                                                        <InputGroup className="search_box academic_search">
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
                                                            onChange={ this.searchArticle }                                                           
                                                        />
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Form>
                                            </Col>

                                            <Col md={{span: 2}} className="text-right pr-0">
                                                <Button className={ this.state.btnClass } onClick={this.component_change} variant="outline-light" ><span>{t("utility.filter")}</span> 
                                                <img src={filter_icon} width="15px" alt="filter" />
                                                </Button>
                                            </Col>

                                        </Row>
                                        <Academic_Component state={this.state} t={t} sortDirectionChange={this.sortDirectionChange} filterSelect={ this.filterItemChange } changeFavourite={this.changeFavourite} sortSelect={ this.sortItemChange } comonentChange= { this.component_change } openArticle={this.openArticle } ></Academic_Component>
                                    </div>
                                </Col>
                            </Row>
                            {/*<p className="text-left pb-2">*/}
                            {/*    {t("footer")} */}
                            {/*</p>*/}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withTranslation()(Academic);
