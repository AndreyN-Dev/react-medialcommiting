import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './i18n';
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import * as constant from "./components/constants";

import './assets/fonts/Quicksand-VariableFont_wght.ttf';
import './index.css';
import Login from './login/Login';
import ResetPassword from './login/ResetPassword';
import Welcome from './dashboard/Welcome';
import Profile from './user_manage/Profile';
import About from './user_manage/About';
import Help from './user_manage/Help';
import Contact from './user_manage/Contact';
import Notification from './user_manage/Notification';
import Favourite from './user_manage/Favourite';
import Survey from './user_manage/Survey';
import Risk from './user_manage/Risk';

import Academic from './dashboard/Academic';
import Speakers from './dashboard/Speakers';
import Sessions from './dashboard/Sessions';
import Train from './dashboard/Train';
import ClinicList from './dashboard/ClinicList';

// const Profile = resolve => { import(['./user_manage/Profile'], ()=>{ resolve(require('./user_manage/Profile')); }); };
firebase.initializeApp(constant.firebaseConfig);
firebase.analytics();

const hist = createBrowserHistory();
ReactDOM.render(
    <Router history={hist}>
        <Suspense fallback={(<div>Loading</div>)}>
        <Switch>
            <Route path="/login" render={props => <Login {...props} />} />
            <Route path="/home" render={props => <Welcome {...props} />} />
            <Route path="/about" render={props => <About {...props} />} />
            <Route path="/profile" render={props => <Profile {...props} />} />
            <Route path="/help" render={props => <Help {...props} />} />
            <Route path="/contact" render={props => <Contact {...props} />} />
            <Route path="/notify" render={props => <Notification {...props} />} />
            <Route path="/favourite" render={props => <Favourite {...props} />} />
            <Route path="/survey" render={props => <Survey {...props} />} />
            <Route path="/risk" render={props => <Risk {...props} />} />
            <Route path="/academic" render={props => <Academic {...props} />} />
            <Route path="/speakers" render={props => <Speakers {...props} />} />
            <Route path="/sessions" render={props => <Sessions {...props} />} />
            <Route path="/clinic/:visitID" render={props => <Train {...props} />} />
            <Route path="/cliniclist" render={props => <ClinicList {...props} />} />
            <Route path="/resetPassword" render={props => <ResetPassword {...props} />} />
            <Route path="/" render={props => <Login {...props} />} />
        </Switch>
        </Suspense>
    </Router>,
    document.getElementById('root')
);
