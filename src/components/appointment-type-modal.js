import React, {Component} from 'react';
import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    reset,
    createAppointmentType,
    deleteAppointmentType,
} from "../redux/actions/register/create-appointment";

class AppointmentTypeModal extends Component {
    constructor(props) {
        super(props);

        this.tmr = null;
        this.state = {
            name: '',
            description: '',
            default_length: '',
            order: '',
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_appointment_type && this.props.msg_appointment_type !== prevProps.msg_appointment_type) {
            toast(this.props.msg_appointment_type);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
                window.location.href = "/appointment-type";
            }, 3000);
        }
        if(prevProps.data !== this.props.data) {
            this.setState({
                name: this.props.data.name,
                description: this.props.data.description,
                default_length: this.props.data.length,
            })
        }
        if(prevProps.order !== this.props.order) {
            this.setState({
                order: this.props.order,
            });
            console.log(this.props.order);
        }
    }

    onCancel = () => {
        const {
            handleClose
        } = this.props;
        this.setState({
            name: '',
            description: '',
            default_length: '',
        });
        handleClose();
    };

    onSave = () => {
        const data = {
            id: localStorage.provider_id,
            name: this.state.name,
            description: this.state.description,
            length: this.state.default_length,
            role: this.props.data? "update": "create",
            order: this.props.data? this.state.order: '',
        };
        const {
            createAppointmentType,
        } = this.props;
        if(createAppointmentType) {
            createAppointmentType(data);
        }
    };

    onDelete = () => {
        const {
            deleteAppointmentType,
        } = this.props;
        if(deleteAppointmentType) {
            deleteAppointmentType({id: localStorage.provider_id, order: this.state.order});
        }
    };

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value || '',
        })
    };
    onChangeLength = (e) => {
        this.setState({
            default_length: e.target.value,
        })
    };
    render() {
        console.log(this.props.data);
        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName}>
                <ToastContainer />
                <div
                    className={"spinning-curtain"}
                    style={{display: this.props.spinning ? "flex" : "none"}}
                >
                    <div className="lds-dual-ring"/>
                </div>

                <section className="profile-modal-main invite">
                    <div className="profile-header txt-18 justify-left col-white">
                        {
                            this.props.data? "Edit Appointment Type": "Create Appointment Type"
                        }
                    </div>
                    <div className="modal-body txt-16 txt-medium col-darkBlue profile">

                        <div className="pt-10 pb-10">Name</div>
                        <input
                            id="name"
                            type="text"
                            placeholder="Appointment"
                            value={this.state.name}
                            onChange={(e) => this.onChange(e)}
                            required
                        />
                        <div className="pt-10 pb-10">Description</div>
                        <input
                            id="description"
                            type="tel"
                            placeholder="Description of the appointment type."
                            value={this.state.description}
                            onChange={(e) => this.onChange(e)}
                            required
                        />
                        <div className="pt-10 pb-10">Default Length</div>
                        <input
                            id="default_length"
                            type="Number"
                            placeholder="60 (mins)"
                            value={this.state.default_length}
                            onChange={(e) => this.onChangeLength(e)}
                        />

                        <div className="pt-30">
                            <div
                                className="btn-common mouse-cursor create save-cancel justify-center col-white"
                                onClick={this.onSave}
                            >
                                {
                                    this.props.data? "Update": "Save"
                                }
                            </div>

                            {
                                this.props.data && (
                                    <div
                                        className="btn-common mouse-cursor create save-cancel justify-center col-white"
                                        onClick={this.onDelete}
                                    >
                                        Delete
                                    </div>
                                )
                            }
                            <div className="btn-common mouse-cursor cancel justify-center" onClick={this.onCancel}>Cancel</div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        msg_appointment_type: state.registers.msg_appointment_type,
        spinning: state.registers.spinning,
    }
};

export default connect(
    mapStateToProps,
    {
        reset,
        createAppointmentType,
        deleteAppointmentType,
    }
)(AppointmentTypeModal);
