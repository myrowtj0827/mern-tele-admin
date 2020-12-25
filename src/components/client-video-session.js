import React, {Component} from 'react';
import '../assets/css/dashboard.css';
import config from '../config';
import {
    joinAppointment,
    outAppointment,
    allowAppointment,
    sendAllowAppointment,
    reset,
} from "../redux/actions/register/create-appointment";
import {connect} from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ClientVideoSession extends Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            appointment: '',
            flag: false,
        };
    }

    componentDidMount() {
        const {
            joinAppointment
        } = this.props;

        const data = {
            id: this.props.match.params && this.props.match.params.id,
            role: 'provider',
        };

        if(joinAppointment) {
            joinAppointment(data)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.get_appointment_allow !== prevProps.get_appointment_allow) {
            this.setState({
                flag: this.props.get_appointment_allow,
            });

            this.onSendAllow(this.props.get_appointment_allow);
            if(this.props.get_appointment_allow === false) {
                this.onClose();
            }
        }

        if(this.props.msg_allow_state && this.props.msg_allow_state !== prevProps.msg_allow_state) {
            toast(this.props.msg_allow_state);
            if(this.props.msg_allow_state === "The meeting time is already passed") {
                let state = "The meeting time is already passed";
                this.onSendAllow(state);
                this.onClose();
            }
            this.setState({
                flag: false,
            });

            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 2500);
        }
    }

    onAllow = (flag) => {
        const {
            allowAppointment,
        } = this.props;
        const data = {
            id: this.props.match.params && this.props.match.params.id,
            allow: flag,
        };
        if(allowAppointment) {
            allowAppointment(data);
        }
    };

    onSendAllow = (flag) => {
        const {
            sendAllowAppointment,
        } = this.props;
        const data = {
            id: this.props.match.params && this.props.match.params.id,
            allow: flag,
        };
        if(sendAllowAppointment) {
            sendAllowAppointment(data);
        }
    };
    onClose = () => {
        const {
            outAppointment,
        } = this.props;
        const data = {
            id: this.props.match.params && this.props.match.params.id,
            role: "provider",
            start_session: true,
        };
        if(outAppointment) {
            outAppointment(data);
        }
    };
    onOut = () => {
        this.onAllow(false);
        this.onClose();
        setTimeout(() => {
            this.props.history.push('/dashboard');
        }, 500);
    };

    render() {
        return (
            <>
                <ToastContainer/>
                <div className="flex-space bg-position">
                    <iframe id={"video-frame"} className={"video-frame"} title='tele-therapy video room'
                            allow={'camera; microphone; display-capture;'}
                            src={`${config.WEBRTC_HOST}/TeleTherapistVideoRoom-${this.props.match.params.id}#interfaceConfig.langDetection=true&config.defaultLanguage=%22es%22&config.prejoinPageEnabled=false&userInfo.email=%22${localStorage.provider_email}%22&userInfo.displayName=%22${localStorage.provider_name}%22`}
                            allowFullScreen={true}/>
                </div>
                {/*src={`${config.WEBRTC_HOST}/TeleTherapistVideoRoom-${this.props.match.params.id}#interfaceConfig.langDetection=true&config.defaultLanguage=%22en%22&userInfo.email=%22${localStorage.provider_email}%22&userInfo.displayName=%22${localStorage.provider_name}%22`}*/}

                <div className="session-logo">
                    <div className="flex-space">
                        <div className="hidden-logo"></div>
                        <div>
                            <img className="session-logo-img" src={require('../assets/img/session-logo.svg')} alt=""/>
                        </div>
                    </div>
                </div>
                <div>
                    {
                        !this.state.flag && (
                            <div className="btn-allow" onClick={() => this.onAllow(true)}>Allow</div>
                        )
                    }

                    {
                        this.state.flag && (
                            <div className="btn-allow allowed" onClick={() => this.onAllow(false)}>Allowed</div>
                        )
                    }
                </div>
                <div className="btn-on-off" onClick={this.onOut}></div>
            </>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        msg_join: state.registers.msg_join,
        get_appointment_allow: state.registers.get_appointment_allow,
        msg_allow_state: state.registers.msg_allow_state,
        spinning: state.registers.spinning,
        get_allow: state.registers.get_allow,
        msg_appointment_out: state.registers.msg_appointment_out,
    }
};

export default connect(
    mapStateToProps,
    {
        joinAppointment,
        outAppointment,
        allowAppointment,
        sendAllowAppointment,
        reset,
    }
)(ClientVideoSession);
