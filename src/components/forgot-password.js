import React from 'react';
import {forgot, resetMsg} from "../redux/actions/register/login-register";

import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Config from "../config";

class ProviderForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            email: '',
            msg: '',
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_forgot_password && prevProps.msg_forgot_password !== this.props.msg_forgot_password) {
            toast(this.props.msg_forgot_password);
            const {
                resetMsg
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                resetMsg();
                this.tmr = null;
            }, 4000);
        }
    };

    send = () => {
        const {
            forgot
        } = this.props;

        const data = {
            email: this.state.email,
            role: 'provider',
        };
        forgot(data);
    };

    back = () => {
        this.props.history.push('/login');
    };
    onInput = (code) => {
        if (code === 13) {
            if (document.activeElement.id === 'email' && this.state.email !== '') {
               this.send();
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
                        <div className="pb-20">
                            <a className="col-buttonAndLink" href={Config.FRONT_URL + '/home/'}>
                                <img className="logo-img mouse-cursor" src={require('../assets/img/app-logo.svg')} alt=""/>
                            </a>
                        </div>
                        <div className="pt-10 pb-20 justify-center col-darkBlue">{this.state.msg}</div>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            onChange={(event) => this.setState({email: event.target.value})}
                            onKeyUp={(e) => this.onInput(e.keyCode)}
                            required
                        />

                        <div className="flex-space">
                            <div className="btn-common txt-16 col-white justify-center mouse-cursor" onClick={this.back}>
                                BACK
                            </div>
                            <div className="btn-common txt-16 col-white justify-center mouse-cursor" onClick={this.send}>
                                SEND
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
        spinning: state.registers.spinning,
        msg_forgot_password: state.registers.msg_forgot_password,
    }
};

export default connect(
    mapStateToProps,
    { forgot, resetMsg }
)(ProviderForgotPassword);
