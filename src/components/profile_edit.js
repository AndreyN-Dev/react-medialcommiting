import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Button} from 'react-bootstrap';
import '../assets/Users.css';


class Profile_Edit extends Component {
    render() {

        return (
            <div>
                <p className="text-center mb-0 mt-3">
                    <img className="mt-3 mb-2 profile_img" src={this.props.personState.userPicture} width="150vw" height="150vw" style={{ borderRadius: '50%' }} alt="user_picture" />
                </p>
                <h6 className="text-center user_name_title">{this.props.personState.userName}</h6>
                <Button className="mb-2 change_pwd_btn mb-4 mt-4" variant="success" onClick={this.props.openModal}>{ this.props.t("utility.change_password") }</Button>
                <Form className="profile_form">
                    <Form.Group>
                        <Form.Control type="text" placeholder="Speciality:" name="userSpeciality" value={this.props.personState.userSpeciality} onChange={this.props.change}/>
                        <br />
                        <Form.Control type="text" placeholder="Work At:" name="userWorkat" value={this.props.personState.userWorkat} onChange={this.props.change} />
                        <br />
                        <Form.Control as="select" name="userCountryId" placeholder="Location:" value={this.props.personState.userCountryId} onChange={this.props.change}>
                            {
                                this.props.personState.countryList.map(res => {
                                    return(<option value={res.id} key={res.id}>{res.Name}</option>);
                                })
                            }
                        </Form.Control>
                        <br />
                        <Form.Control type="text" placeholder="Phone:" name="userPhone" value={this.props.personState.userPhone} onChange={this.props.change} />
                    </Form.Group>
                </Form>
            </div>
        );
    }

}

export default React.memo(Profile_Edit);
