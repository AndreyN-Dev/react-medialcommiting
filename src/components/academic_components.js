import React, { Component } from "react";
import Academic_Get from "./academic_get";
import Academic_Filter from "./academic_filter";

const components = {
  compA: Academic_Get,
  compB: Academic_Filter
};

class Academic_Component extends Component {
    render() {
        const SelectUser = components[this.props.state.compName];
        return <SelectUser state={this.props.state} sortDirectionChange={this.props.sortDirectionChange} click={this.props.click} openArticle={this.props.openArticle} t={this.props.t} filterSelect={this.props.filterSelect} sortSelect={this.props.sortSelect} changeFavourite={this.props.changeFavourite} comonentChange={ this.props.comonentChange } />;
    }
}

export default Academic_Component;