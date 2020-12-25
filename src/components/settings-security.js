import React, { Component } from 'react';
import { resetPassword, resetMsg, } from '../redux/actions/register/login-register';

import SettingsHeader from "./settings-header";
import '../assets/css/settings.css';
import {connect} from "react-redux";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class SettingsSecurity extends Component {

    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            current_password: '',
            new_password: '',
            confirm_password: '',
            flag: 'profile',
        }
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

    onChange = e => {
        this.setState({[e.target.id]: e.target.value || ''});
    };

    update = () => {
        const data = {
            id: localStorage.provider_id,
            password: this.state.current_password,
            new_password: this.state.new_password,
            confirm_password: this.state.confirm_password,
            role: 'provider',
            flag: 'profile',
        };

        const {
            resetPassword
        } = this.props;

        if(resetPassword) {
            resetPassword(data, this.props.history);
        }
    };

    render() {

        return (
            <>
                <div className="setting-body-p">
                    <SettingsHeader/>
                    <div>
                        <ToastContainer />
                    </div>
                    <div className="change-password-position">
                        <div className="card-common txt-16 txt-medium">
                            <div className="pt-30 col-darkBlue">Change Password</div>
                            <div className="pt-20 col-heavyDark">Current Password</div>
                            <input
                                type="text"
                                id={"current_password"}
                                placeholder="********************"
                                value={this.state.current_password}
                                onChange={this.onChange}
                                maxLength={8}
                                required
                            />

                            <div className="pt-20 col-heavyDark">New Password</div>
                            <input
                                type="password"
                                id={"new_password"}
                                placeholder="********************"
                                value={this.state.new_password}
                                onChange={this.onChange}
                                maxLength={8}
                                required
                            />

                            <div className="pt-20 col-heavyDark">Confirm</div>
                            <input
                                type="password"
                                id={"confirm_password"}
                                placeholder="********************"
                                value={this.state.confirm_password}
                                onChange={this.onChange}
                                maxLength={8}
                                required
                            />

                            <div className="change-btn-p btn-common col-white align-center mouse-cursor" onClick={this.update}>Update</div>
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
)(SettingsSecurity);