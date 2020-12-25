import React from 'react';
import '../src/assets/css/index.css';
import {Route, Switch, Redirect, BrowserRouter as Router} from "react-router-dom";

import AdminLogin from "./components/admin-login";
import Body from "./components/body";
import SettingsWaitingRoom from "./components/settings-waiting-room";
import RegisterProvider from "./components/register-provider";
import PrivateRoute from "./components/private-route";
import ClientVideoSession from "./components/client-video-session";
import ProviderForgotPassword from "./components/forgot-password";
import ProviderResetPassword from "./components/reset-password";
import SuccessTxt from "./components/success-txt";
import ClientSession from "./components/client-session";
import InvitedVideoSession from "./components/invited-video-session";

function App() {
    return (
        <Router>
            <Switch>
                <Route
                    path='/login'
                    component={AdminLogin}
                />

                <Route
                    path='/forgot-password'
                    component={ProviderForgotPassword}
                />

                <Route
                    path='/reset-password/:id'
                    component={ProviderResetPassword}
                />

                <Route
                    path='/register-provider/'
                    component={RegisterProvider}
                />

                <Route
                    path='/success-verification/:id'
                    component={SuccessTxt}
                />

                <PrivateRoute
                    path='/settings-waiting'
                    component={SettingsWaitingRoom}
                />

                <PrivateRoute
                    path='/room/:id'
                    component={ClientVideoSession}
                />
                <PrivateRoute
                    path='/client-session/:id'
                    component={ClientSession}
                />

                <Route
                    path='/invited-room/:id'
                    component={InvitedVideoSession}
                />

                <PrivateRoute
                    path=''
                    component={Body}
                />

                <Redirect
                    to='/'
                />
            </Switch>
        </Router>
    );
}

export default App;
