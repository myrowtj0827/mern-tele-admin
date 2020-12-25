import React, { Component } from 'react';
import "../assets/css/settings.css";
import AppointmentHeader from "./appointment-header";
import {connect} from "react-redux";
import {
    getAppointmentType,
    reset,
} from "../redux/actions/register/create-appointment";
import AppointmentTypeModal from "./appointment-type-modal";
class AppointmentType extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            appointmentTypeList: '',
            data: '',
            order: '',
        }
    }

    componentDidMount() {
        this.initialize();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.get_appointment_type && this.props.get_appointment_type !== prevProps.get_appointment_type) {
            this.setState({
                appointmentTypeList: this.props.get_appointment_type,
            });
        }
    }

    initialize = () => {
        const {
            getAppointmentType,
        } = this.props;

        if(getAppointmentType) {
            const data = {
                id: localStorage.provider_id,
            };
            getAppointmentType(data);
        }
    };

    showModal = () => {
        this.setState({
            show: true,
        });
    };

    showEditModal = (n) => {
        this.setState({
            show: true,
            order: n,
            data: this.state.appointmentTypeList[n],
        });
    };

    hideModal = () => {
        this.setState({
            show: false,
            data: '',
            order: '',
        });
        this.initialize();
    };

    render() {
        return (
            <>
                <div className="pt-30">
                    <AppointmentHeader />
                    <div className="pt-30 col-blue">
                        <div className="pb-30 flex-space people-profile">
                            <div className="btn-common txt-16 justify-center col-white mouse-cursor" onClick={this.showModal}>
                                Create Appointment Type
                            </div>
                        </div>

                        <div className="appointment-type align-l">
                            <div className="txt-16 col-blue">What are Appointment Types?</div>
                            <div className="pt-10 txt-12 col-blue">
                                Custom appointment types may be used to apply a default length to an appointment. Appointment types may also be used alongside the Client Scheduler feature. If your Scheduler is configured to use Appointment Types, your clients will pick an appointment type instead of being asked to pick the length themselves.
                            </div>
                        </div>

                        <div className="pt-20 pb-60">
                            <div className="type-list">
                                <div className="type-border txt-16 col-txt-title">
                                    Existing Appointment Types
                                </div>
                                {
                                    this.state.appointmentTypeList && this.state.appointmentTypeList.length === 0 && (
                                        <div className="pt-20 txt-12 col-darkBlue">
                                            You do not have any appointment types. Click the create button above and to the right to get started.
                                        </div>
                                    )
                                }

                                {
                                    this.state.appointmentTypeList && this.state.appointmentTypeList.length > 0 && (
                                        <table className="">
                                            <thead>
                                            <th>No</th>
                                            <th>Name and Description</th>
                                            <th>Default Length</th>
                                            <th>Action</th>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.appointmentTypeList.map((item, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{key + 1}</td>
                                                            <td>
                                                                <div>{item.name}</div>
                                                                <div className="txt-14 col-disabled">{item.description}</div>
                                                            </td>
                                                            <td>{item.length}</td>
                                                            <td>
                                                                <div className="btn-type col-white mouse-cursor justify-center" onClick={(e) => this.showEditModal(key)}>
                                                                    Edit
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                        </table>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                </div>

            {/* Modal */}
                <AppointmentTypeModal
                    order={this.state.order}
                    data={this.state.data}
                    show={this.state.show}
                    handleClose={this.hideModal}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        get_appointment_type: state.registers.get_appointment_type,
        spinning: state.registers.spinning,
    }
};

export default connect(
    mapStateToProps,
    {
        reset,
        getAppointmentType,
    }
)(AppointmentType);