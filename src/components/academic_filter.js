import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

import '../assets/Users.css';
import '../assets/Dashboard.css';


class Academic_Filter extends Component {

    filter_click = (category) => {
        console.log(category);
        this.props.filterSelect(category);
    }

    sort_click = (category) => {
        console.log(category);
        this.props.sortSelect(category);
    }


    render() {
        return (
            <div>
               
                <Row className='mb-3 mt-5'>
                    <Col>{this.props.t("utility.filter_by_category")}</Col>
                </Row>
                <Row className='mb-3'>
                    <Col>
                        {
                            this.props.state.articles_library.map((res, index) => 
                                <Button type="button" id='filter_btn' key={index} className={(res.filter_state) ? 'filter-active' : 'filter-deactive'}  variant="light" onClick={this.filter_click.bind(this, res.title)} >{res.title}</Button>
                            )
                        }
                    </Col>
                </Row>
                {/* <Row className='mb-3'>
                    <Col>{this.props.t("utility.sort_by")}</Col>
                </Row>
                <Row className='mb-3'>
                    <Col>
                        {
                            this.props.state.sort_array.map((res, index) => 
                                <Button type="button" id='filter_btn' key={index} className={(res.sort_state) ? 'filter-active' : 'filter-deactive'} variant="light" onClick={this.sort_click.bind(this, res.title)} >{res.title}</Button>
                            )
                        }
                    </Col>
                </Row> */}
                <Row className='mb-3'>
                    <Col>
                        <Button type="button" className='bg-orange done_btn pl-5 pr-5' variant="orange" onClick={ this.props.comonentChange } >{this.props.t("utility.done")}</Button>
                    </Col>
                </Row>
            </div>
        );
    }

}

export default Academic_Filter;
