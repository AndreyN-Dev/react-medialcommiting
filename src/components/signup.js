import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, InputGroup, FormControl, Image } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import icon_user from '../assets/images/login/icon_user.png';
import icon_password from '../assets/images/login/icon_password.png';
import icon_email from '../assets/images/login/icon_mail.png';
import icon_phone from '../assets/images/login/icon_phone.png';
import icon_speciality from '../assets/images/login/icon_speciality.png';
import icon_workat from '../assets/images/login/icon_workat.png';
import icon_country from '../assets/images/login/icon_country.png';

import '../assets/Login.css';

class Signup_Section extends Component{
// onSubmit={this.props.signupSubmit}
  render() {
    return (
        <Form className="mt-3 signup_form" onSubmit={this.props.signupSubmit} >
            <Form.Group controlId="formBasicName">
                <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="name">
                    <Image src={ icon_user } className="addon_icon" />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    type="text"
                    name="user_name"
                    placeholder="Name"
                    value={this.props.loginState.user_name}
                    required
                    onChange={this.props.signupEnterdata}
                />
                </InputGroup>
            </Form.Group>

            <Form.Group controlId="formBasicPasswords">
                <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="passwords">
                    <Image src={ icon_password } className="addon_icon" />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    type="password"
                    name="user_password"
                    value={this.props.loginState.user_password}
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="password"
                    required
                    onChange={this.props.signupEnterdata}
                />
                </InputGroup>
            </Form.Group>
            <Form.Group controlId="formBasicEmails">
                <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="email">
                    <Image src={ icon_email } className="addon_icon" />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    type="email"
                    name="user_email"
                    placeholder="Email"
                    value={this.props.loginState.user_emails}
                    aria-label="Email"
                    aria-describedby="email"
                    required
                    onChange={this.props.signupEnterdata}
                />
                </InputGroup>
            </Form.Group>
            <Form.Group controlId="formBasicCountry">
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="country">
                            <Image src={ icon_country } className="addon_icon" />
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control as="select" name="user_country" placeholder="Country" value={this.props.loginState.user_country} onChange={this.props.signupEnterdata}>
                        {
                            this.props.loginState.countryList.map(res => {
                                return(<option value={res.id} key={res.id}>{res.Name}</option>);
                            })
                        }
                    </Form.Control>
                </InputGroup>
            </Form.Group>
            <Form.Group controlId="formBasicPhone">
                <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="phone">
                    <Image src={ icon_phone } className="addon_icon" />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    type="text"
                    name="user_phone"
                    placeholder="Phone"
                    value={this.props.loginState.user_phone}
                    aria-label="Phone"
                    aria-describedby="phone"
                    required
                    onChange={this.props.signupEnterdata}
                />
                </InputGroup>
            </Form.Group>
            <Form.Group controlId="formBasicCountry">
                <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="gender">
                    <Image src={ icon_user } className="addon_icon" />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="select" name="user_gender" placeholder="Male" value={this.props.loginState.user_gender} onChange={this.props.signupEnterdata}>
                    {
                        this.props.loginState.genderList.map(res => {
                            return(<option value={res} key={res}>{res}</option>);
                        })
                    }
                </Form.Control>
                </InputGroup>
            </Form.Group>

            <Form.Group controlId="formBasicSpeciality">
                <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="speciality">
                    <Image src={ icon_speciality } className="addon_icon" />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    type="text"
                    name="user_speciality"
                    placeholder="Speciality"
                    value={this.props.loginState.user_speciality}
                    aria-label="Speciality"
                    aria-describedby="speciality"
                    required
                    onChange={this.props.signupEnterdata}
                />
                </InputGroup>
            </Form.Group>
            <Form.Group controlId="formBasicWorkat">
                <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="workat">
                    <Image src={ icon_workat } className="addon_icon" />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    type="text"
                    name="user_workat"
                    placeholder="Work at"
                    value={this.props.loginState.user_workat}
                    aria-label="Work at"
                    aria-describedby="workat"
                    required
                    onChange={this.props.signupEnterdata}
                />
                </InputGroup>
            </Form.Group>

            <Form.Group controlId="formBasicCheckbox" className="mt-4">
                <Form.Check type="checkbox" label={ this.props.t("login.remember_me") } className="remember_chk" onChange={this.props.rememberChange} />
                <img src={this.props.loginState.chk_state_img} className="remember_chk_img" onClick={this.props.rememberChange} alt='remember' />
            </Form.Group>

            <Button variant="warning" type="submit" className="btn_login pt-1 pb-1 pl-5 pr-5 mt-3">
                {this.props.t('utility.signup')}
            </Button>

        </Form>
    );
  }
}

export default withTranslation()(Signup_Section);
