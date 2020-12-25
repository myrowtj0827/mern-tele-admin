
import React, { Component } from 'react';
import '../assets/css/practice.css';
import SettingsHeader from "./settings-header"
import {
    reset,
    updateReminderRequests,
    getSettings,
} from "../redux/actions/register/create-appointment";
import {connect} from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class PracticeScheduling extends Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            reminders: false,
            allow_requests: false,
            reminders_value: '1',
        }
    }

    componentDidMount() {
        const {
            getSettings
        } = this.props;

        const data = {
            id: localStorage.provider_id,
        };
        if(getSettings) {
            getSettings(data);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if((this.state.reminders !== prevState.reminders) || (this.state.allow_requests !== prevState.allow_requests) || (this.state.reminders_value !== prevState.reminders_value)) {
            const data = {
                id: localStorage.provider_id,
                reminders: this.state.reminders,
                allow_requests: this.state.allow_requests,
                reminders_value: this.state.reminders? this.state.reminders_value: '1',
            };

            this.setState({
                reminders_value: this.state.reminders? this.state.reminders_value: '1',
            });

            const {
                updateReminderRequests,
            } = this.props;
            if(updateReminderRequests) {
                updateReminderRequests(data);
            }
            console.log(data);
        }

        if(this.props.msg_setting && prevProps.msg_setting !== this.props.msg_setting) {
            toast(this.props.msg_setting);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 4000);
        }

        if(this.props.get_reminder_allow && this.props.get_reminder_allow !== prevProps.get_reminder_allow) {
            this.setState({
                reminders: this.props.get_reminder_allow.reminders? this.props.get_reminder_allow.reminders : false,
                allow_requests: this.props.get_reminder_allow.allow_requests? this.props.get_reminder_allow.allow_requests: false,
                reminders_value: this.props.get_reminder_allow.reminders_value? this.props.get_reminder_allow.reminders_value: '1',
            });

        }
    }

    onCheckChange = (e) => {
        this.setState({
            [e.target.id]: e.target.checked,
        });
    };

    onChange = (e) => {
        this.setState({
            reminders_value: e.target.value,
        });
    };

    render() {
        return (
            <>
                <ToastContainer />
                <SettingsHeader/>
                <div className="scheduling-body">
                    <div className="payment-card txt-14 col-heavyDark">
                        <div className="flex-space">
                            <div className="txt-18 col-darkBlue">ALLOW APPOINTMENT REQUESTS</div>
                            <span className="">
                            <label className="switchBtn">
                                <input
                                    id="allow_requests"
                                    type="checkbox"
                                    checked={this.state.allow_requests}
                                    onChange={(e) => this.onCheckChange(e)}
                                />
                                <div className="slide round"></div>
                            </label>
                        </span>
                        </div>

                        <div className="flex-space mt-50">
                            <div className="txt-18 col-darkBlue">ENABLE APPOINTMENT REMINDERS</div>
                            <span className="">
                                <label className="switchBtn">
                                    <input
                                        id="reminders"
                                        type="checkbox"
                                        checked={this.state.reminders}
                                        onChange={(e) => this.onCheckChange(e)}
                                    />
                                    <div className="slide round"></div>
                                </label>
                            </span>
                        </div>
                        {
                            this.state.reminders && (
                                <div className="flex-space mt-50">
                                    <div className="txt-18 col-darkBlue">ENABLE APPOINTMENT REMINDERS</div>
                                    <select
                                        defaultValue={this.state.reminders_value}
                                        onChange={(e) => this.onChange(e)}
                                        className="scheduling"
                                    >
                                        <option value={'1'} selected={this.state.reminders_value === "1"}>24 Hours</option>
                                        <option value={'2'} selected={this.state.reminders_value === "2"}>48 Hours</option>
                                        <option value={'3'} selected={this.state.reminders_value === "3"}>72 Hours</option>
                                    </select>
                                </div>
                            )
                        }
                    </div>
                </div>

            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        msg_setting: state.registers.msg_setting,
        get_reminder_allow: state.registers.get_reminder_allow,
    }
};

export default connect(
    mapStateToProps,
    {
        updateReminderRequests,
        getSettings,
        reset,
    }
)(PracticeScheduling);