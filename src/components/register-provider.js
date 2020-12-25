import React from 'react';
import {connect} from "react-redux";
import '../assets/css/dashboard.css';
import {registers, resetMsg} from "../redux/actions/register/login-register";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Config from "../config";

class RegisterProvider extends React.Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            practice_name: '',
            name: '',
            email: '',
            password: '',
            confirm_password: '',
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.registerProvider && prevProps.registerProvider !== this.props.registerProvider) {
            toast(this.props.registerProvider);
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

    register = () => {
        const {
            registers
        } = this.props;

        registers(this.state);
    };
    onInput = (code) => {
        if (code === 13) {
            if (document.activeElement.id === 'practice_name' && this.state.practice_name !== '') {
                document.getElementById("name").focus();
            } else if (document.activeElement.id === 'name' && this.state.name !== '') {
                document.getElementById("email").focus();
            } else if (document.activeElement.id === 'email' && this.state.email !== '') {
                document.getElementById("password").focus();
            } else if (document.activeElement.id === 'password' && this.state.password !== '') {
                document.getElementById("confirm_password").focus();
            } else if (document.activeElement.id === 'confirm_password' && this.state.confirm_password !== '') {
                this.register();
            }
        }
    };
    render() {
        return (
            <>
                <div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>
                <div className="admin-login-bg">
                    <ToastContainer/>
                    <div className="register-body">
                        <div className="align-center" style={{paddingBottom: 20}}>
                            <a className="col-buttonAndLink" href={Config.FRONT_URL + '/home/'}>
                                <img className="logo-img mouse-cursor" src={require('../assets/img/app-logo.svg')} alt=""/>
                            </a>
                        </div>
                        <div className="pb-20 txt-16 col-heavyDark">
                            This registration form is for providers. If you are a client of a provider, please contact
                            your provider for an invitation to their practice.
                        </div>
                        <input
                            id="practice_name"
                            type="text"
                            placeholder="Practice Name"
                            onChange={(event) => this.setState({practice_name: event.target.value})}
                            onKeyUp={e => this.onInput(e.keyCode)}
                            required
                        />

                        <input
                            id="name"
                            type="text"
                            placeholder="Name"
                            onChange={(event) => this.setState({name: event.target.value})}
                            onKeyUp={e => this.onInput(e.keyCode)}
                            required
                        />

                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            onChange={(event) => this.setState({email: event.target.value})}
                            onKeyUp={e => this.onInput(e.keyCode)}
                            required
                        />

                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            onChange={(event) => this.setState({password: event.target.value})}
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
                            <div className="btn-common txt-16 col-white justify-center mouse-cursor"
                                 onClick={this.props.history.goBack}>
                                Back
                            </div>
                            <div className="btn-common txt-16 col-white justify-center mouse-cursor"
                                 onClick={this.register}>
                                Send
                            </div>
                        </div>
                    </div>

                    <div className="pt-30 justify-center col-darkBlue">{this.state.msg}</div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        registerProvider: state.registers.registerProvider,
        spinning: state.registers.spinning,
    }
};

export default connect(
    mapStateToProps,
    {registers, resetMsg, }
)(RegisterProvider);
