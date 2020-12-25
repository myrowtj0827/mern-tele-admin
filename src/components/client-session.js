import React, {Component} from 'react';
import {Link} from "react-router-dom";
import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import {
    appointmentById,
} from "../redux/actions/register/create-appointment";

class ClientSession extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointment: '',
        }
    }

    componentDidMount() {
        const {
            appointmentById
        } = this.props;

        const data = {
            id: this.props.match.params && this.props.match.params.id,
            role: 'provider',
        };

        if(appointmentById) {
            appointmentById(data)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.getAppointment && prevProps.getAppointment !== this.props.getAppointment) {
            this.setState({
                appointment: this.props.getAppointment,
            });

            this.currentTimeCalc(this.props.getAppointment[0].start_time, this.props.getAppointment[0].end_time);
        }
    }

    currentTimeCalc = (sTime, eTime) => {
        let appointmentStartTime = Math.floor((new Date(sTime)).getTime());
        let appointmentEndTime = Math.floor((new Date(eTime)).getTime());
        let currentTime = Math.floor((new Date()).getTime());
        let path = "/room/" + this.props.match.params.id;

        let time1 = appointmentStartTime - currentTime;
        let time2 = appointmentEndTime - currentTime;

        if(time1 >= 0) {
            setTimeout(function () {
                window.location.href = path;
            },  time1);
        } else if(time2 >= 0) {
            window.location.href = path;
        }
    };

    render() {

        return (
            <>
                <div className="spinning-curtain" style={{display: 'flex'}}>
                    <div className="lds-dual-ring"/>
                </div>

                <div className="admin-login-bg">
                    <div className="login-body">
                        <div style={{paddingBottom: 20}}>
                            <img className="logo-img mouse-cursor" src={require('../assets/img/app-logo.svg')} alt=""/>
                        </div>

                        <div className="pb-20 txt-22 col-heavyDark align-center">
                            Please wait until your meeting time
                        </div>

                        <div className="pt-30 txt-14 col-heavyDark">
                            Start Time:
                            {
                                this.state.appointment && (
                                    <span style={{paddingLeft: 20}}>
                                        {new Date(this.state.appointment[0].start_time).toLocaleString()}
                                    </span>
                                )
                            }
                        </div>

                        <div className="pt-20 txt-14 col-heavyDark">
                            End Time:
                            {
                                this.state.appointment && (
                                    <span style={{paddingLeft: 20}}>
                                        {new Date(this.state.appointment[0].end_time).toLocaleString()}
                                    </span>
                                )
                            }
                        </div>

                        <div className="pt-45 flex-space">
                            <Link to="/dashboard">
                                <div className="btn-common txt-16 col-white justify-center mouse-cursor">
                                    Back
                                </div>
                            </Link>

                            <Link to="/dashboard">
                                <div className="btn-common txt-16 col-white justify-center mouse-cursor">
                                    Waiting
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        getAppointment: state.registers.getAppointment,
        spinning: state.registers.spinning,
    }
};

export default connect(
    mapStateToProps,
    {
        appointmentById,
    }
)(ClientSession);