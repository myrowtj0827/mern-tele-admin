import React from 'react';
import {Link} from "react-router-dom";
import {login, resetMsg, } from "../redux/actions/register/login-register";

import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Config from "../config";

class AdminLogin extends React.Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            role: 'provider',
            email: '',
            password: '',
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_login && prevProps.msg_login !== this.props.msg_login) {
            toast(this.props.msg_login);
            const {
                resetMsg
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                resetMsg();
                this.tmr = null;
            }, 4000);
        }
    }

    login = () => {
        const {
            login
        } = this.props;

        login(this.state, this.props.history);
    };

    onInput = (code) => {
        if (code === 13) {
            if(document.activeElement.id === 'email' && this.state.email !== '') {
                document.getElementById("password").focus();
            } else if (document.activeElement.id === "password" && this.state.password !== '') {
                this.login();
            }
        }
    };
    render() {
        return (
            <>
                <div>
                    <ToastContainer/>
                </div>

                <div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>
                <div className="admin-login-bg">
                    <div className="login-body">
                        <div style={{paddingBottom: 20}}>
                            <a className="col-buttonAndLink" href={Config.FRONT_URL + '/home/'}>
                                <img className="logo-img mouse-cursor" src={require('../assets/img/app-logo.svg')} alt=""/>
                            </a>
                        </div>
                        <div className="align-center pb-10 col-heavyDark">
                            Login as provider
                        </div>
                        <span>{this.state.warning_email}</span>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            onChange={(event) => this.setState({email: event.target.value})}
                            onKeyUp={(e) => this.onInput(e.keyCode)}
                            required
                        />

                        <input
                            id="password"
                            type="password"
                            placeholder="****"
                            onChange={(event) => this.setState({password: event.target.value})}
                            onKeyUp={(e) => this.onInput(e.keyCode)}
                            required
                        />

                        <div className="btn-common txt-16 col-white justify-center mouse-cursor"
                             onClick={this.login}>
                            LOGIN
                        </div>

                        <Link to="/forgot-password">
                            <div className="txt-14 col-heavyDark align-center txt-forgot">Forgot password</div>
                        </Link>

                        <div className="flex-center txt-14 txt-forgot align-center">
                            New to here?
                            <Link to="/register-provider"><span
                                className="col-heavyDark join-pl"> Join now</span></Link>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        spinning: state.registers.spinning,
        msg_login: state.registers.msg_login,
    }
};

export default connect(
    mapStateToProps,
    {login, resetMsg, }
)(AdminLogin);
