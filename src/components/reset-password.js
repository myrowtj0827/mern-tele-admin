import React from 'react';
import { resetPassword, resetMsg } from "../redux/actions/register/login-register";

import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Config from "../config";

class ProviderResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            role: 'provider',
            new_password: '',
            confirm_password: '',
            id: '',
        }
    }

    componentDidMount() {
        let path = window.location.href;
        let arrayLink = path.split('/');

        this.setState({
            id: arrayLink[arrayLink.length - 1],
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_reset_password && prevProps.msg_reset_password !== this.props.msg_reset_password) {
            toast(this.props.msg_reset_password);
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

    reset = () => {
        const {
            resetPassword
        } = this.props;

        if(resetPassword) {
            resetPassword(this.state, this.props.history);
        }
    };

    back = () => {
        this.props.history.push('/forgot-password');
    };
    onInput = (code) => {
        if (code === 13) {
            if (document.activeElement.id === 'password' && this.state.password !== '') {
                document.getElementById("confirm_password").focus();
            } else if (document.activeElement.id === 'confirm_password' && this.state.confirm_password !== '') {
                this.reset();
            }
        }
    };
    render() {
        return (
            <>
                <div>
                    <ToastContainer/>
                </div>

                <div className="admin-login-bg">
                    <div className="">
                        <div className="login-body">
                            <div className="pb-20">
                                <a className="col-buttonAndLink" href={Config.FRONT_URL + '/home/'}>
                                    <img className="logo-img mouse-cursor" src={require('../assets/img/app-logo.svg')} alt=""/>
                                </a>
                            </div>

                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                onChange={(event) => this.setState({new_password: event.target.value})}
                                onKeyUp={e => this.onInput(e.keyCode)}
                                required
                            />

                            <input
                                id="confirm_password"
                                type="password"
                                placeholder="Confirm Password"
                                onChange={(event) => this.setState({confirm_password: event.target.value})}
                                onKeyUp={e => this.onInput(e.keyCode)}
                                required
                            />

                            <div className="flex-space">
                                <div className="btn-common txt-16 col-white justify-center mouse-cursor" onClick={this.back}>
                                    BACK
                                </div>
                                <div className="btn-common txt-16 col-white justify-center mouse-cursor" onClick={this.reset}>
                                    CHANGE
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        msg_reset_password: state.registers.msg_reset_password,
    }
};

export default connect(
    mapStateToProps,
    { resetPassword, resetMsg, }
)(ProviderResetPassword);
