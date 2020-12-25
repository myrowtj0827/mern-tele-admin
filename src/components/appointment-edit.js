import React, {Component} from 'react';
import {
    createAppointment,
    resetEdit,
    editAppointment,
    deleteAppointment,
} from "../redux/actions/register/create-appointment";

import {
    getProviderByIdRole,
    getSimpleClients,
} from "../redux/actions/register/login-register";

import PeopleAddProfile from "./people-add-profile";
import '../assets/css/dashboard.css';
import {connect} from "react-redux";

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Multiselect } from 'multiselect-react-dropdown';

class EditAppointment extends Component {
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

            payment: '',

            modalVisible: false,
            send_data: '',
            selectedValue: '',
            options: [],

            flag_start: true,
            type_list: [],
            type: '',
            default_length: 20,
            flag_end: false,
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
        if(this.props.itemAppt && this.props.itemAppt !== prevProps.itemAppt && this.state.flag_start === true) {
            this.initial();
            this.setState({
                flag_start: false,
            })
        }
        if(this.props.msg_editAppointment && prevProps.msg_editAppointment !== this.props.msg_editAppointment) {
            toast(this.props.msg_editAppointment);

            const {
                resetEdit
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                resetEdit();
                this.tmr = null;
            }, 4000);
        }

        if(this.props.msg_deleteAppointment && prevProps.msg_deleteAppointment !== this.props.msg_deleteAppointment) {
            toast(this.props.msg_deleteAppointment);

            const {
                resetEdit
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                resetEdit();
                this.tmr = null;
            }, 4000);
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

        if (this.props.clientsIdList && Array.isArray(this.props.clientsIdList) && (this.state.invitees_names === '')) {
            this.props.clientsIdList.map((item, key) => {
                if (item._id !== localStorage.provider_id) {
                    this.setState({
                        invitees_names: item.name,
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
            if (this.state.flag_start === false) {
                this.calcEndTimeFromAllDay();
            }
        }

        if(this.state.startDate !== prevState.startDate && this.state.flag_start === false && (this.state.endDate !== '' && this.state.endDate !== 0)) {
            let start = new Date(this.state.startDate).getTime();
            let end = this.state.endDate;

            if(this.state.all_day === false) {
                if(start >= end) {
                    this.setState({
                        flag_end: true,
                    });
                    //if(this.state.endDate !== null && this.state.endDate !== '' && this.state.endDate !== 0) {
                        this.calcFromStartDate(this.state.default_length, this.state.startDate);
                    //}
                } else {
                    let microMinutes = this.state.default_length * (1000 * 60); // 20 mins
                    this.calcRepeatTime(Math.floor(new Date(this.state.startDate).getTime()/microMinutes + 1) * microMinutes);
                }
            }
        }
        if(this.state.endDate !== prevState.endDate && (this.state.endDate !== '' && this.state.endDate !== 0)) {
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
            this.setState({
                type: this.props.itemAppt.appointment_type,
            })
        }
        if(this.state.type_list && this.state.type !== prevState.type) {
            let list = this.state.type_list;
            for (let k = 0; k < list.length; k ++) {
                if(list[k].name === this.state.type) {
                    this.setState({
                        default_length: list[k].length,
                    });
                    this.calcFromStartDate(list[k].length, new Date(this.state.startDate));
                }
            }
        }
    }

    initial = () => {
        const {
            getProviderByIdRole,
            getSimpleClients,
            itemAppt,
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

        let clientArray = [];
        clientArray = this.props.client_list.split(', ');

        let temp = [];
        for(let k = 0; k < clientArray.length; k ++) {
            let data = {
                name: clientArray[k],
                id: itemAppt.invitees_id && itemAppt.invitees_id[k],
            };
            temp.push(data);
        }

        this.setState({
            all_day: itemAppt.all_day,
            recurring: itemAppt.recurring,
            online: itemAppt.online,

            title: itemAppt.title,
            notes: itemAppt.notes,
            provider_name: localStorage.provider_name,
            time_distance: 20,
            invitees_ids: itemAppt.invitees_id,
            invitees_names: temp,
            selectedValue: temp,

            payment: itemAppt.payment,
            startDate: new Date(itemAppt.start_time).getTime(),
            endDate: itemAppt.end_time !== null ? new Date(itemAppt.end_time).getTime(): '',
            repeat_until: itemAppt.repeat_until !== null ? new Date(itemAppt.repeat_until).getTime(): '',
            recurrence_frequency: itemAppt.recurrence_frequency? itemAppt.recurrence_frequency : '',
        })
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
    // Getting End Date from Start Date
    calcFromStartDate = (len, date) => {
        if(this.state.flag_end === true) {
            let microMinutes = len * (1000 * 60); // 40 mins
            let startDate, endDate;
            startDate = Math.floor(new Date(date).getTime()/microMinutes + 1) * microMinutes;
            endDate = startDate + microMinutes;

            if(this.state.all_day === false) {
                startDate = new Date(date).getTime();
                endDate = startDate + microMinutes;

                this.setState({
                    startDate: startDate,
                });

                if(this.state.flag_end === true) {
                    this.setState({
                        endDate: endDate,
                    })
                }
            } else {
                this.setState({
                    startDate: startDate,
                    flag_end: true,
                });
            }

            this.calcRepeatTime(startDate);
        }
    };

    // Getting Start Date from End Date
    calcFromEndDate = (date) => {
        if(this.state.flag_end === true) {
            let microMinutes = this.state.default_length * (1000 * 60); // 40 mins
            let startDate, endDate;
            endDate = date.getTime();
            startDate = endDate - microMinutes;

            this.setState({
                startDate: startDate,
                endDate: endDate,
            });

            this.calcRepeatTime(startDate);
        }
    };

    //Repeat Date according to recurring
    calcRepeatTime = (date) => {
        if(this.state.flag_end === true) {
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
        }
    };

    //End Date according to all day
    calcEndTimeFromAllDay = () => {
        if(this.state.flag_end === true) {
            if(this.state.all_day === false) {
                this.calcFromStartDate(this.state.default_length, new Date(this.state.startDate));
            } else {
                this.setState({
                    endDate: '',
                })
            }
        }
    };

    Cancel = () => {
        const {
            handleClose
        } = this.props;
        this.calcRepeatTime(this.state.startDate);

        this.setState({
            all_day: '',
            recurring: '',
            online: '',

            title: '',
            notes: '',
            provider_name: localStorage.provider_name,
            time_distance: 20,
            invitees_ids: '',
            invitees_names: '',
            selectedValue: '',

            payment: '',
            startDate: '',
            endDate: '',
            repeat_until: '',
            recurrence_frequency: '',
            flag_start: true,
            type: '',
            type_list: [],
            default_length: 20,
            flag_end: false,
        });

        handleClose();
    };

    onCheckChange = (e) => {
        this.setState({
            [e.target.id]: e.target.checked,
            flag_end: true,
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

    onUpdate = () => {
        const {
            createAppointment,
        } = this.props;

        console.log(this.state.endDate, "**********")
        const data = {
            _id: this.props.itemAppt._id,
            all_day: this.state.all_day,
            recurring: this.state.recurring,
            online: this.state.online,
            title: this.state.title,
            notes: this.state.notes,
            provider_name: localStorage.getItem('provider_name'),
            provider_id: localStorage.getItem('provider_id'),
            time_distance: this.state.all_day ? 0 : (this.state.endDate - this.state.startDate) / (1000 * 60),
            start_time: this.state.startDate,
            end_time: this.state.endDate !== ''? this.state.endDate: '',
            repeat_until: this.state.repeat_until && this.state.repeat_until,
            invitees_id: this.state.invitees_ids,
            invitees_name: this.state.invitees_names,
            recurrence_frequency: this.state.recurrence_frequency,
            payment: this.state.payment,
            update_flag: true,
            type: this.state.type,
        };
        createAppointment(data);
    };

    onDelete = () => {
        const {
            deleteAppointment
        } = this.props;

        const data = {
            id: this.props.itemAppt._id,
        };
        if(deleteAppointment) {
            deleteAppointment(data);
        }
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
                    invitees_names: '',
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

    render() {
        const showHideClassName = this.props.edit_show ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName}>
                <div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>
                <ToastContainer/>
                <section className="modal-main">
                    <div className="create-header txt-18 justify-left col-white">
                        {
                            this.props.itemAppt.editable_state === 1?
                                "Edit Appointment"
                                :
                                "View Appointment"
                        }
                    </div>
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
                                        disabled={this.props.itemAppt.editable_state === 0 && true}
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
                                        disabled={this.props.itemAppt.editable_state === 0 && true}
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
                                        disabled={this.props.itemAppt.editable_state === 0 && true}
                                    />
                                    <span className="checkMark"/>
                                </label>
                            </div>
                        </div>

                        <div className="modal-txt-p">Title</div>
                        <input
                            id="title"
                            type="text"
                            placeholder="Appointment"
                            value={this.state.title}
                            onChange={(e) => this.onChange(e)}
                            disabled={this.props.itemAppt.editable_state === 0 && true}
                        />
                        <div>
                            <div className="modal-txt-p">Type</div>
                            <select value={this.state.type&& this.state.type} onChange={(e) => this.onSelectType(e)} disabled={this.props.itemAppt.editable_state !== 1}>
                                <option key={0}>None</option>
                                {
                                    this.state.type_list && this.state.type_list.map((item, key) => {
                                        return (
                                            <option key={key + 1} value={item.name} selected={this.state.type && this.state.type === item.name && true}>{item.name}</option>
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
                            disabled={this.props.itemAppt.editable_state === 0 && true}
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
                                    disabled={this.props.itemAppt.editable_state === 0 && true}
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
                                                disabled={(this.state.all_day || this.props.itemAppt.editable_state === 0) && true}
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
                                    disabled={(this.state.all_day || this.props.itemAppt.editable_state === 0) && true}
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
                                                disabled={(this.state.all_day || this.props.itemAppt.editable_state === 0) && true}
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
                                                    disabled={(!this.state.recurring || this.props.itemAppt.editable_state === 0) && true}
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
                                            disabled={(!this.state.recurring || this.props.itemAppt.editable_state === 0) && true}
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

                                <div className="">Payment Amount (Usd)</div>
                                <input
                                    id="payment"
                                    className="until"
                                    type="number"
                                    placeholder={this.state.payment}
                                    onChange={(event) => this.onChange(event)}
                                    value={this.state.payment}
                                    disabled={this.props.itemAppt.editable_state === 0 && true}
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
                                    disabled={this.props.itemAppt.editable_state === 0 && true}
                                />
                            </div>
                        </div>

                        <div className="modal-pt flex-space edit-appt">
                            <div className="btn-deletes mouse-cursor justify-center" onClick={this.onDelete}>Delete</div>

                            <div className="flex-space edit-appt">
                                <div className="btn-cancel mouse-cursor justify-center" onClick={this.Cancel}>Cancel</div>
                                {
                                    this.props.itemAppt.editable_state === 1 && (
                                        <div className="btn-payment mouse-cursor justify-center col-white" onClick={this.onUpdate}>Update</div>
                                    )
                                }
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

        msg_editAppointment: state.registers.msg_editAppointment,
        msg_deleteAppointment: state.registers.msg_deleteAppointment,
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
        resetEdit,
        editAppointment,
        deleteAppointment,
    }
)(EditAppointment);

