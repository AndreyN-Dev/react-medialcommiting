import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from 'react-router-dom';
import { Nav, Modal, Button} from 'react-bootstrap';

import home_icon from '../assets/images/sidebar/home_icon.png';
import fav_icon from '../assets/images/sidebar/fav_icon.png';
import survey_icon from '../assets/images/sidebar/survey_icon.png';
import risk_icon from '../assets/images/sidebar/risk_icon.png';
import notify_icon from '../assets/images/sidebar/notif_icon.png';
import user_icon from '../assets/images/sidebar/user_icon.png';
import about_icon from '../assets/images/sidebar/about_icon.png';
import help_icon from '../assets/images/sidebar/help_icon.png';
import contact_icon from '../assets/images/sidebar/contact_icon.png';
import logout_icon from '../assets/images/sidebar/logout_icon.png';
import home_orange_icon from '../assets/images/sidebar/home_icon_org.png';
import fav_orange_icon from '../assets/images/sidebar/fav_icon_org.png';
import survey_orange_icon from '../assets/images/sidebar/survey_icon_org.png';
import risk_orange_icon from '../assets/images/sidebar/risk_icon_org.png';
import notify_orange_icon from '../assets/images/sidebar/notif_icon_org.png';
import user_orange_icon from '../assets/images/sidebar/user_icon_org.png';
import about_orange_icon from '../assets/images/sidebar/about_icon_org.png';
import help_orange_icon from '../assets/images/sidebar/help_icon_org.png';
import contact_orange_icon from '../assets/images/sidebar/contact_icon_org.png';
import logout_orange_icon from '../assets/images/sidebar/logout_icon_org.png';

import '../assets/Users.css';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_state: false,
            toLogout: false
        }
    }
    handleClose = () => {
        this.setState({show_state: false});
    }

    handleShow = () => {
        this.setState({show_state: true});
    }

    logout = () => {
        this.setState({
            toLogout: true
        })
    }

    render() {
        const active_class = this.props.active_class;
        const { t } = this.props;

        if(this.state.toLogout){
            localStorage.clear();
            return <Redirect to='/' />
        }

        return (
            <Nav className="flex-column sidebar">
                <Nav.Link eventKey="link-1" href="/home" className={active_class === 'home'? 'active':''}><img src={active_class === 'home'? home_orange_icon : home_icon} alt='home' /><span>{t("side_menu.dashboard")}</span></Nav.Link>
                <Nav.Link eventKey="link-9" href="/risk" className={active_class === 'risk'? 'active':''}><img src={active_class === 'risk'? risk_orange_icon : risk_icon} alt='risk' /><span>{t("side_menu.risk")}</span></Nav.Link>
                <Nav.Link eventKey="link-2" href='/favourite' className={active_class === 'favo'? 'active':''}><img src={active_class === 'favo'? fav_orange_icon : fav_icon} alt='fav' /><span>{t("side_menu.favourite")}</span></Nav.Link>
                <Nav.Link eventKey="link-3" href='/survey' className={active_class === 'survey'? 'active':''}><img src={active_class === 'survey'? survey_orange_icon : survey_icon} alt='survey' /><span>{t("side_menu.survey")}</span></Nav.Link>
                <Nav.Link eventKey="link-4" href='/notify' className={active_class === 'notify'? 'active':''}><img src={active_class === 'notify'? notify_orange_icon : notify_icon} alt='notify' /><span>{t("side_menu.notification")}</span></Nav.Link>
                <Nav.Link eventKey="link-5" href="/profile" className={active_class === 'profile'? 'active':''}><img src={active_class === 'profile'? user_orange_icon : user_icon} alt='profile' /><span>{t("side_menu.profile")}</span></Nav.Link>
                <Nav.Link eventKey="link-6" href="/about" className={active_class === 'about'? 'active':''}><img src={active_class === 'about'? about_orange_icon : about_icon} alt='about' /><span>{t("side_menu.about")}</span></Nav.Link>
                <Nav.Link eventKey="link-7" href="/help" className={active_class === 'help'? 'active':''}><img src={active_class === 'help'? help_orange_icon : help_icon} alt='help' /><span>{t("side_menu.help")}</span></Nav.Link>
                <Nav.Link eventKey="link-8" href="/contact" className={active_class === 'contact'? 'active':''}><img src={active_class === 'contact'? contact_orange_icon : contact_icon} alt='contact' /><span>{t("side_menu.contact")}</span></Nav.Link>
                <Nav.Link eventKey="link-10" onClick={this.handleShow} className={active_class === 'logout'? 'active':''}><img src={active_class === 'logout'? logout_orange_icon : logout_icon} alt='logout' /><span>{t("side_menu.logout")}</span></Nav.Link>
                <Modal show={this.state.show_state} onHide={this.handleClose} className="change_pwd_modal">
                    <Modal.Header>
                    <Modal.Title>{t("logout.title")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pr-5">
                        {t("logout.content")}
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="success" onClick={this.logout} className="pl-5 pr-5 pt-1 pb-1">
                        {t("utility.logout")}
                    </Button>
                    <Button variant="warning" onClick={this.handleClose} className="pl-5 pr-5 pt-1 pb-1">
                        {t("utility.cancel")}
                    </Button>
                    </Modal.Footer>
                </Modal>

            </Nav> 
        );
    }
}
    
export default withTranslation()(Sidebar);
    