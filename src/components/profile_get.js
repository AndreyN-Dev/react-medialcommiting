import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from 'react-loader-spinner'

import '../assets/Users.css';


class Profile_Get extends Component {
    render() {
        // const { t } = this.props
        if(this.props.personState.loadState === 1){
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
            return (
                <div>
                    <p className="text-center mb-0 mt-3">
                        <img className="mt-3 mb-2 profile_img fit_image" src={this.props.personState.userPicture} width="120vw" height="120vw" style={{ borderRadius: '50%' }} alt="user_picture" />
                    </p>
                    <h4 className="text-center user_name_title">{this.props.personState.userName}</h4>
                    <p className="text-grey pb-0 mb-1">
                        {this.props.t("profile.speciality")}
                    </p>
                    <p className="text-bold">
                        {this.props.personState.userSpeciality}
                    </p>
                    <p className="text-grey pb-0 mb-1">
                        {this.props.t("profile.work_at")}
                    </p>
                    <p className="text-bold">
                        {this.props.personState.userWorkat}
                    </p>
                    <p className="text-grey pb-0 mb-1">
                        {this.props.t("profile.location")}
                    </p>
                    <p className="text-bold">
                        {this.props.personState.userCountry}
                    </p>
                    <p className="text-grey pb-0 mb-1">
                        {this.props.t("profile.email")}
                    </p>
                    <p className="text-bold">
                        {this.props.personState.userEmail}
                    </p>
                    <p className="text-grey pb-0 mb-1">
                        {this.props.t("profile.phone")}
                    </p>
                    <p className="text-bold">
                        {this.props.personState.userPhone}
                    </p>
                </div>
            );
        }
    }

}

export default Profile_Get;
