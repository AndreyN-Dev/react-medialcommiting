import React, { Component } from "react";
import Login_Section from "./login_section";
import Signup from "./signup";

const components = {
  compA: Login_Section,
  compB: Signup
};

class Login_Component extends Component {
    render() {
        const SelectUser = components[this.props.loginState.compName];
        return <SelectUser loginState={this.props.loginState} forgotPassword={ this.props.forgotPassword } rememberChange={ this.props.rememberChange } signupHandleShow={ this.props.signupHandleShow } loginEnterdata={ this.props.loginEnterdata } loginSubmit={this.props.loginSubmit} handleShow={ this.props.handleShow } t={this.props.t} signupEnterdata={this.props.signupEnterdata} signupSubmit={ this.props.signupSubmit } />;
    }
}

export default Login_Component;