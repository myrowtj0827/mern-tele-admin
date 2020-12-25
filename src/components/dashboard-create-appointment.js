import React, {Component} from 'react';
import {
    createAppointment,
    reset,
} from "../redux/actions/register/create-appointment";
import {
    getSimpleClients,
    getProviderByIdRole,
} from "../redux/actions/register/login-register";
import PeopleAddProfile from "./people-add-profile";
import '../assets/css/dashboard.css';
import {connect} from "react-redux";

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Multiselect } from 'multiselect-react-dropdown';

class DashboardCreateAppointment extends Component {
    constructor(props) {
        super(props);

        this.tmr = null;
        this.state = {
            all_day: false,
            recurring: false,
            online: true,

            title: '',
            notes: '',
            provider_name: '',
            time_distance: '',

            invitees_ids: '',
            invitees_names: '',

            recurrence_frequency: '',
            startDate: '',
            endDate: '',
            repeat_until: '',

            payer_name: '',
            payment: '',

            modalVisible: false,
            send_data: '',
            selectedValue: '',
            options: [],
            type_list: [],
            type: '',
            default_length: 20,
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);

        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.handleRepeatDate = this.handleRepeatDate.bind(this);

        this.onCheckChange = this.onCheckChange.bind(this);
        this.onChange = this.onChange.bind(this);

        this.calcRepeatTime = this.calcRepeatTime.bind(this);
        this.calcFromStartDate = this.calcFromStartDate.bind(this);
        this.calcFromEndDate = this.calcFromEndDate.bind(this);
        this.calcEndTimeFromAllDay = this.calcEndTimeFromAllDay.bind(this);
    }

    componentDidMount() {
        this.initial();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_appointment && prevProps.msg_appointment !== this.props.msg_appointment) {
            toast(this.props.msg_appointment);

            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
                window.location.href = "/appointment";
            }, 1500);
        }

        if (prevProps.clientsIdList !== this.props.clientsIdList || prevState.modalVisible !== this.state.modalVisible) {
            let arrayIds = [];
            let data = {name: 'Add New', id: 0};
            arrayIds.push(data);
            this.props.clientsIdList.map((item, key) => {
                if(item._id !== localStorage.provider_id) {
                    data = {name: item.name, id: item._id};
                    arrayIds.push(data);
                }
                return null;
            });

            this.setState({
                options: arrayIds,
            })
        }

        if (this.props.clientsIdList && Array.isArray(this.props.clientsIdList) && (this.state.invitees_name === '')) {
            this.props.clientsIdList.map((item, key) => {
                if (item._id !== localStorage.provider_id) {
                    this.setState({
                        invitees_name: item.name,
                        invitees_id: item._id,
                    });
                }
                return null;
            });
        }

        if(this.state.recurring !== prevState.recurring) {
            this.calcRepeatTime(this.state.startDate);
        }
        if(this.state.all_day !== prevState.all_day) {
            this.calcEndTimeFromAllDay();
        }

        if(this.state.startDate !== prevState.startDate) {
            let start = new Date(this.state.startDate).getTime();
            let end = this.state.endDate;
            if(this.state.all_day === false) {
                if(start >= end) {
                    this.calcFromStartDate(this.state.default_length, this.state.startDate);
                } else {
                    let microMinutes = this.state.default_length * (1000 * 60); // 20 mins
                    this.calcRepeatTime(Math.floor(new Date(this.state.startDate).getTime()/microMinutes + 1) * microMinutes);
                }
            }
        }
        if(this.state.endDate !== prevState.endDate) {
            let start = this.state.startDate;
            let end = new Date(this.state.endDate).getTime();
            if(start >= end) {
                this.calcFromEndDate(this.state.endDate);
            }
        }

        if (this.props.accountSimpleInfo && prevProps.accountSimpleInfo !== this.props.accountSimpleInfo) {
            this.setState({
                type_list: this.props.accountSimpleInfo.appointment_type,
            });
        }

        if(this.state.type !== prevState.type) {
            let list = this.state.type_list;
            for (let k = 0; k < list.length; k ++) {
                if(list[k].name === this.state.type) {
                    this.setState({
                        default_length: list[k].length,
                    });
                    console.log(list[k].length);
                    this.calcFromStartDate(list[k].length, new Date(this.state.startDate));
                }
            }
        }
    }

    initial = () => {
        const {
            getSimpleClients,
            getProviderByIdRole,
        } = this.props;

        if (getSimpleClients) {
            getSimpleClients({
                id: localStorage.provider_id,
                role: 'client',
            });
        }
        if(getProviderByIdRole) {
            getProviderByIdRole({
                id: localStorage.provider_id,
                role: 'provider',
            });
        }
        let microMinutes = 20 * (1000 * 60); // 20 mins
        let startDate, endDate;
        startDate = Math.floor(new Date().getTime()/microMinutes + 1) * microMinutes;
        endDate = startDate + microMinutes;

        this.setState({
            startDate: startDate,
            endDate: endDate,
        });

        this.calcRepeatTime(startDate);

    	this.setState({
    		all_day: false,
    		recurring: false,
    		online: true,

    		title: 'Meeting with ' + localStorage.provider_name,
    		provider_name: localStorage.provider_name,
    		time_distance: 20,

    		invitees_id: '',
    		invitees_name: '',

    		payer_name: '',
    		payment: 0,
            type: '',
            default_length: 20,
    	})
    };

    // Getting End Date from Start Date
    calcFromStartDate = (len, date) => {
        let microMinutes = len * (1000 * 60); // 40 mins
    	let startDate, endDate;
        startDate = Math.floor(new Date(date).getTime()/microMinutes + 1) * microMinutes;
        endDate = startDate + microMinutes;

        if(this.state.all_day === false) {
            startDate = new Date(date).getTime();
            endDate = startDate + microMinutes;

            this.setState({
                startDate: startDate,
                endDate: endDate,
            });
        } else {
            this.setState({
                startDate: startDate,
            });
        }

        this.calcRepeatTime(startDate);
    };

    // Getting Start Date from End Date
    calcFromEndDate = (date) => {
        let microMinutes = this.state.default_length * (1000 * 60); // 40 mins
        let startDate, endDate;
        endDate = date.getTime();
        startDate = endDate - microMinutes;

        this.setState({
            startDate: startDate,
            endDate: endDate,
        });

        this.calcRepeatTime(startDate);
    };

    //Repeat Date according to recurring
    calcRepeatTime = (date) => {
        let repeat_until = new Date(date);
        repeat_until.setDate(repeat_until.getDate() + 14); // Repeating 2 times for 2 weeks
        if(this.state.recurring === true) {
            this.setState({
                repeat_until: repeat_until,
                recurrence_frequency: 7,
            })
        } else {
            this.setState({
                repeat_until: '',
                recurrence_frequency: '',
            })
        }
    };

    //End Date according to all day
    calcEndTimeFromAllDay = () => {
        if(this.state.all_day === false) {
            this.calcFromStartDate(this.state.default_length, new Date(this.state.startDate));
        } else {
            this.setState({
                endDate: '',
            })
        }
    };

    Cancel = () => {
        const {
            handleClose
        } = this.props;
        this.initial();
        this.calcRepeatTime(this.state.startDate);
        handleClose();
    };

    onCheckChange = (e) => {
        this.setState({
            [e.target.id]: e.target.checked,
        });
        //    Recurring
        this.calcRepeatTime(this.state.startDate);
    };

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value || '',
        })
    };

    handleStartDate(date) {
        this.setState({
            startDate: date,
        });
    };
    handleEndDate(date) {
        this.setState({
            endDate: date,
        });
    };
    handleRepeatDate(date) {
        this.setState({
            repeat_until: date,
        });
    };

    onFormSubmit(e) {
        e.preventDefault();
    };

    createApp = () => {
        const {
            createAppointment,
        } = this.props;

        const data = {
            all_day: this.state.all_day,
            recurring: this.state.recurring,
            online: this.state.online,
            title: this.state.title,
            notes: this.state.notes,
            provider_name: localStorage.getItem('provider_name'),
            provider_id: localStorage.getItem('provider_id'),
            time_distance: this.state.all_day ? 0 : (this.state.endDate - this.state.startDate) / (1000 * 60),
            start_time: this.state.startDate,
            end_time: this.state.endDate,
            repeat_until: this.state.repeat_until && this.state.repeat_until,
            invitees_id: this.state.invitees_ids,
            invitees_name: this.state.invitees_names,
            recurrence_frequency: this.state.recurrence_frequency,
            payment: this.state.payment,
            type: this.state.type,
        };
        console.log("type = ", data.type);
        createAppointment(data);
    };

    showAddClientModal = () => {
        this.setState({
            send_data: {
                add_role: 'client',
                provider_id: localStorage.provider_id,
                provider_name: localStorage.provider_name,
                provider_email: localStorage.provider_email,
            },
        })
    };

    hideAddClientModal = () => {
        this.setState({
            modalVisible: false,
        });

        const {
            getSimpleClients,
        } = this.props;

        if (getSimpleClients) {
            getSimpleClients({
                id: localStorage.provider_id,
                role: 'client',
            });
        }
    };

    onSelect = (selectedList, selectedItem) => {
        let idArray = [];
        for (let k = 0; k < selectedList.length; k ++) {
            if(selectedList[k].id === 0) {
                this.setState({
                    invitees_name: '',
                    modalVisible: true,
                });

                selectedList.splice(k, 1);
                for (let k = 0; k < selectedList.length; k ++) {
                    if(selectedList[k].id !== 0) idArray.push(selectedList[k].id);
                }
                this.setState({
                    invitees_ids: idArray,
                    invitees_names: selectedList,
                });

                this.showAddClientModal();
                return;
            } else {
                this.setState({
                    modalVisible: false,
                })
            }
        }

        for (let k = 0; k < selectedList.length; k ++) {
            if(selectedList[k].id !== 0) idArray.push(selectedList[k].id);
        }
        this.setState({
            invitees_ids: idArray,
            invitees_names: selectedList,
        });
    };

    onRemove = (selectedList, removedItem) => {
        let idArray = [];
        for (let k = 0; k < selectedList.length; k ++) {
            idArray.push(selectedList[k].id);
        }
        this.setState({
            invitees_ids: idArray,
            invitees_names: selectedList,
        });
    };

    onSelectType = (e) => {
        let str;
        if(e.target.value === "None") {
            str = '';
        } else {
            str = e.target.value;
        }

        this.setState({
            type: str,
        });
    };

    render() {
        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName}>
                <div className="spinning-curtain" style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>
                <ToastContainer/>
                <section className="modal-main">
                    <div className="create-header txt-18 justify-left col-white">Create Appointment</div>
                    <div className="modal-body txt-16 txt-medium col-darkBlue">
                        <div className="flex-space">
                            <div>
                                <label className="container-event align-l">
                                    <span className="">All Day</span>
                                    <input
                                        id="all_day"
                                        type="checkbox"
                                        checked={this.state.all_day}
                                        onChange={this.onCheckChange}
                                    />
                                    <span className="checkMark"/>
                                </label>
                            </div>

                            <div>
                                <label className="container-event align-l">
                                    <span className="">Recurring</span>
                                    <input
                                        id="recurring"
                                        type="checkbox"
                                        checked={this.state.recurring}
                                        onChange={this.onCheckChange}
                                    />
                                    <span className="checkMark"/>
                                </label>
                            </div>
                            <div>
                                <label className="container-event align-l">
                                    <span className="">Online</span>
                                    <input
                                        id="online"
                                        type="checkbox"
                                        checked={this.state.online}
                                        onChange={this.onCheckChange}
                                    />
                                    <span className="checkMark"/>
                                </label>
                            </div>
                        </div>

                        <div>
                            <div className="modal-txt-p">Title</div>
                            <input
                                id="title"
                                type="text"
                                className="appointment-title"
                                placeholder="Appointment"
                                value={this.state.title}
                                onChange={(e) => this.onChange(e)}
                            />
                        </div>

                        <div>
                            <div className="modal-txt-p">Type</div>
                            <select value={this.state.type} onChange={(e) => this.onSelectType(e)}>
                                <option key={0}>None</option>
                                {
                                    this.state.type_list && this.state.type_list.map((item, key) => {
                                        return (
                                            <option key={key + 1} value={item.name}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>


                        <div className="modal-txt-p">Notes</div>
                        <textarea
                            id="notes"
                            className="notes"
                            placeholder="Add a note about this appointment(optional) ..."
                            value={this.state.notes}
                            onChange={(e) => this.onChange(e)}
                            required
                        />

                        <div className="flex-space pt-10">
                            <form onSubmit={this.onFormSubmit}>
                                <label>Start Date</label>
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={this.handleStartDate}
                                    minDate={new Date()}
                                    dateFormat="MMMM d, yyyy"
                                />
                            </form>
                            {
                                !this.state.all_day && (
                                    <>
                                        <img className="justify-center" style={{marginTop: 30}}
                                             src={require('../assets/img/line-icon.svg')} alt=""/>
                                        <form onSubmit={this.onFormSubmit}>
                                            <label>End Date</label>
                                            <DatePicker
                                                selected={this.state.endDate}
                                                onChange={this.handleEndDate}
                                                minDate={new Date()}
                                                dateFormat="MMMM d, yyyy"
                                                disabled={this.state.all_day}
                                            />
                                        </form>
                                    </>
                                )
                            }
                        </div>

                        <div className="flex-space pt-10">
                            <form onSubmit={this.onFormSubmit}>
                                <label>Start Time</label>
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={this.handleStartDate}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeCaption="Time"
                                    minDate={new Date().getTime()}
                                    dateFormat="h:mm aa"
                                    timeIntervals={this.state.default_length}
                                    showPopperArrow={false}
                                    disabled={this.state.all_day}
                                />
                            </form>

                            {
                                !this.state.all_day && (
                                    <>
                                        <img className="justify-center" style={{marginTop: 30}}
                                             src={require('../assets/img/line-icon.svg')} alt=""/>

                                        <form onSubmit={this.onFormSubmit}>
                                            <label className="">End Time</label>
                                            <DatePicker
                                                selected={this.state.endDate}
                                                onChange={this.handleEndDate}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeCaption="Time"
                                                minDate={new Date().getTime()}
                                                dateFormat="h:mm aa"
                                                timeIntervals={this.state.default_length}
                                                showPopperArrow={false}
                                                disabled={this.state.all_day}
                                            />
                                        </form>
                                    </>
                                )
                            }
                        </div>

                        <div className="flex-grid2 modal-grid2-gaps">
                            {
                                this.state.recurring && (
                                    <div>
                                        <div className="modal-txt-p">Repeat Until</div>
                                        <form className="repeat-until" onSubmit={this.onFormSubmit}>
                                            <div className="">
                                                <DatePicker
                                                    selected={this.state.repeat_until}
                                                    onChange={this.handleRepeatDate}
                                                    dateFormat="MMMM d, yyyy"
                                                    minDate={this.state.endDate}
                                                    disabled={!this.state.recurring}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                )
                            }

                            {
                                this.state.recurring && (
                                    <div>
                                        <div className="modal-txt-p">Recurrence Frequency (Days)</div>
                                        <input
                                            id="recurrence_frequency"
                                            className="until"
                                            type="number"
                                            value={this.state.recurrence_frequency}
                                            onChange={(event) => this.onChange(event)}
                                            disabled={!this.state.recurring}
                                        />
                                    </div>
                                )
                            }
                        </div>

                        <div className="flex-grid2 modal-grid2-gaps">
                            <div>
                                <div className="modal-txt-p">Provider</div>
                                <input
                                    id="provider_name"
                                    className="provider"
                                    type="text"
                                    value={localStorage.getItem("provider_name")}
                                    disabled={true}
                                    onChange={(event) => this.onChange(event)}
                                />

                                <div className="modal-txt-p">Payment Amount (Usd)</div>
                                <input
                                    id="payment"
                                    className="until"
                                    type="number"
                                    placeholder={this.state.payment}
                                    onChange={(event) => this.onChange(event)}
                                    value={this.state.payment}
                                />
                            </div>
                            <div>
                                <div className="modal-txt-p">Invitees</div>
                                <Multiselect
                                    options={this.state.options && this.state.options} // Options to display in the dropdown
                                    selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                    onSelect={this.onSelect} // Function will trigger on select event
                                    onRemove={this.onRemove} // Function will trigger on remove event
                                    displayValue="name" // Property name to display in the dropdown options
                                />
                            </div>
                        </div>

                        <div className="flex-grid2 modal-grid2-gaps cancel-create-p">
                            <div className="btn-common mouse-cursor cancel justify-center"
                                 onClick={this.Cancel}>Cancel
                            </div>
                            <div className="btn-common mouse-cursor create justify-center col-white"
                                 onClick={this.createApp}>Create
                            </div>
                        </div>
                    </div>
                </section>

                <PeopleAddProfile show={this.state.modalVisible} data={this.state.send_data}
                                  handleClose={this.hideAddClientModal}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        clientsIdList: state.registers.clientsIdList,
        msg_appointment: state.registers.msg_appointment,
        spinning: state.registers.spinning,
        accountSimpleInfo: state.registers.accountSimpleInfo,
    }
};

export default connect(
    mapStateToProps,
    {
        getProviderByIdRole,
        createAppointment,
        getSimpleClients,
        reset,
    }
)(DashboardCreateAppointment);

