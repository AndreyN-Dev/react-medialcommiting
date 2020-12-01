import React, { Component } from "react";
import Profile_Get from "./profile_get";
import Profile_Edit from "./profile_edit";

const components = {
  compA: Profile_Get,
  compB: Profile_Edit
};

class Profile_Component extends Component {
    render() {
        const SelectUser = components[this.props.user];
        return <SelectUser personState={this.props.personState} change={this.props.change} t={this.props.t} openModal={this.props.openModal} />;
    }
}

export default Profile_Component;