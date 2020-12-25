import React, {Component} from 'react';
import '../assets/css/scheduling.css';
import DashboardCreateAppointment from "./dashboard-create-appointment";
import {
    appointmentClients,
    appointmentMonth,
} from "../redux/actions/register/create-appointment";
import {connect} from "react-redux";
import EditAppointment from "./appointment-edit";
import DeleteInvite from "./invite-delete-modal";
import AppointmentHeader from "./appointment-header";

const current = new Date().getDate();
const first = new Date().getDate() - new Date().getDay();
class Appointment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            edit_show: false,
            arrayAppt: [],
            itemAppt: '',
            clientArray: '',
            /**
             * Appointment List
             */
            flag: 0,
            appointment_page_num: '',
            appointment_current_page: 1,
            appointment_page_neighbours: 1,
            appointment_pagination: 10,
            /**
             * Appointment Invite
             */
            deleteInvite_show: false,
            delete_id: '',

            /**
             * calc the date
             */
            dayArray: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            monthArray: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            cYear: new Date().getFullYear(),
            cMonth: new Date().getMonth(),

            cDay: current,
            first_of_week: first,
            first_day: new Date((new Date).setDate(first)),

            prevY: '',
            prevM: '',
            nextY: '',
            nextM: '',
            prevDates: '', // the prev month dates
            nextDatesReminders: '', // the next month dates

            showMonthArray: [],
            monthList: '',
            sendMonthArray: [], // utc time array
        };
        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.calcMonth = this.calcMonth.bind(this);
    }

    componentDidMount() {
        this.initial();
        this.onInitial();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.appointmentClientList !== this.props.appointmentClientList || this.state.flag !== prevState.flag){
            this.setState({
                arrayAppt: this.props.appointmentClientList.list,
                appointment_page_num: this.props.appointmentClientList.page_num,
            })
        }
        /**
         * Full calendar making
         */
        if(this.props.get_month && this.props.get_month !== prevProps.get_month) {
            this.setState({
                monthList: this.props.get_month,
            });
        }
    }

    showModal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        })
    };
    hideModal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    };
    showEditModal = (item, client_list) => {
        if (localStorage.getItem('provider') === 'true') {
            this.setState({
                edit_show: true,
                itemAppt: item,
                clientArray: client_list,
            });
        }
    };
    hideEditModal = () => {
        this.setState({
            edit_show: false,
            itemAppt: '',
            clientArray: '',
        });
    };

    initial = () => {
        const {
            appointmentClients,
        } = this.props;

        if(appointmentClients){
            const data = {
                role: 'provider',
                id: localStorage.provider_id,
                flag: this.state.flag,
                appointment_current_page: 1,
                appointment_page_neighbours: 1,
                appointment_pagination: 10,
            };
            appointmentClients(data);
        }
    };
    onAppointmentPageClick = (item) => {
        this.setState({
            appointment_current_page: item,
        });

        const {
            appointmentClients
        } = this.props;

        const data = {
            role: 'provider',
            id: localStorage.provider_id,
            flag: this.state.flag,
            appointment_current_page: item,
            appointment_page_neighbours: this.state.appointment_page_neighbours,
            appointment_pagination: this.state.appointment_pagination,
        };

        if(appointmentClients) {
            appointmentClients(data);
        }
    };
    onDay = () => {
        const {
            appointmentClients
        } = this.props;
        this.setState({
            appointment_current_page: 1,
            flag: 1,
        });
        if(appointmentClients){
            const data = {
                role: 'provider',
                id: localStorage.provider_id,
                flag: 1,
                appointment_current_page: 1,
                appointment_page_neighbours: this.state.appointment_page_neighbours,
                appointment_pagination: this.state.appointment_pagination,
            };
            appointmentClients(data);
        }
    };
    onWeek = () => {
        const {
            appointmentClients
        } = this.props;
        this.setState({
            appointment_current_page: 1,
            flag: 2,
        });
        if(appointmentClients){
            const data = {
                role: 'provider',
                id: localStorage.provider_id,
                flag: 2,
                appointment_current_page: 1,
                appointment_page_neighbours: this.state.appointment_page_neighbours,
                appointment_pagination: this.state.appointment_pagination,
            };
            appointmentClients(data);
        }
    };
    onMonth = () => {
        const {
            appointmentClients
        } = this.props;
        this.setState({
            appointment_current_page: 1,
            flag: 3,
        });

        if(appointmentClients){
            const data = {
                role: 'provider',
                id: localStorage.provider_id,
                flag: 3,
                appointment_current_page: 1,
                appointment_page_neighbours: this.state.appointment_page_neighbours,
                appointment_pagination: this.state.appointment_pagination,
            };
            appointmentClients(data);
        }
    };
    onSession = (id) => {
        this.props.history.push("/room/" + id);
    };
    onShowDelete = (id) => {
        this.setState({
            deleteInvite_show: true,
            delete_id: id,
        });
    };
    hideShowDelete = () => {
        this.setState({
            deleteInvite_show: false,
            delete_id: '',
        });
    };
    join = (url) => {
        window.location.href = url;
    };
    onGetAppointment = (flag) => {
        const {
            appointmentClients
        } = this.props;
        this.setState({
            appointment_current_page: 1,
            flag: flag,
            arrayAppt: '',
            appointment_page_num: '',
        });

        if (appointmentClients) {
            const data = {
                role: 'provider',
                id: localStorage.provider_id,
                flag: flag,
                appointment_current_page: 1,
                appointment_page_neighbours: this.state.appointment_page_neighbours,
                appointment_pagination: this.state.appointment_pagination,
            };
            appointmentClients(data);
        }
    };
    onInitial = () => {
        this.calcMonth(
            this.state.cYear,
            this.state.cMonth,
            this.state.cDay,
            this.state.first_day,
            this.state.flag,
            );
    };
    onSelected = (e) => {
        let c = this.state.cDay;
        if (Number(e.target.value) === 0 || Number(e.target.value) === 1) {
            c = 1;
        }
        this.setState({
            flag: Number(e.target.value),
            cDay: c,
        });
        this.calcMonth(
            this.state.cYear,
            this.state.cMonth,
            c,
            this.state.first_day,
            Number(e.target.value)
        );
    };

    onCalendar = () => {
        let y = this.state.cYear;
        let m = this.state.cMonth;
        let c = 1;

        const first = 1 - new Date(y, m, c).getDay();
        let first_day = new Date(y, m, first);
        this.setState({
            flag: 0,
            cDay: c,
            first_day: first_day,
        });
        this.calcMonth(y, m, c, first_day,0);
    };

    onNext = () => {
        let y = this.state.cYear, m = this.state.cMonth, c = this.state.cDay;
        let first_day = this.state.first_day;
        /**
         * Month count
         */
        if(this.state.flag === 0 || this.state.flag === 1) {
            if(this.state.cMonth === 11) {
                y = this.state.cYear + 1;
                m = 0;
            } else {
                m = this.state.cMonth + 1;
            }
            c = 1;
            const first = 1 - new Date(y, m, c).getDay();
            first_day = new Date(y, m, first);
        } else if (this.state.flag === 2) {
            /**
             * First date of the week
             */
            let yTemp = new Date(first_day).getFullYear();
            let mTemp = new Date(first_day).getMonth();
            let cTemp = new Date(first_day).getDate();

            first_day = new Date(yTemp, mTemp, cTemp + 7);
            y = new Date(first_day).getFullYear();
            m = new Date(first_day).getMonth();
            c = new Date(first_day).getDate();
        } else if(this.state.flag === 3) {
            let next_day = new Date(y, m, c + 1).toLocaleString();
            y = new Date(next_day).getFullYear();
            m = new Date(next_day).getMonth();
            c = new Date(next_day).getDate();
            const first = c - new Date(y, m, c).getDay();
            first_day = new Date(y, m, first);
        }
        this.setState({
            cYear: y,
            cMonth: m,
            cDay: c,
            first_day: first_day,
        });
        this.calcMonth(y, m, c, first_day, this.state.flag);
    };

    onPrev = () => {
        let y = this.state.cYear, m = this.state.cMonth, c = this.state.cDay;
        let first_day = this.state.first_day;
        /**
         * Month count
         */
        if(this.state.flag === 0 || this.state.flag === 1) {
            if(this.state.cMonth === 0) {
                y = this.state.cYear - 1;
                m = 11;
            } else {
                m = this.state.cMonth - 1;
            }
            c = 1;
            const first = 1 - new Date(y, m, c).getDay();
            first_day = new Date(y, m, first);
        } else if (this.state.flag === 2) {
            /**
             * First date of the week
             */
            let yTemp = new Date(first_day).getFullYear();
            let mTemp = new Date(first_day).getMonth();
            let cTemp = new Date(first_day).getDate();

            first_day = new Date(yTemp, mTemp, cTemp - 7);
            y = new Date(first_day).getFullYear();
            m = new Date(first_day).getMonth();
            c = new Date(first_day).getDate();
        } else if (this.state.flag === 3) {
            /**
             * Date count
             */
            let next_day = new Date(y, m, c - 1).toLocaleString();
            y = new Date(next_day).getFullYear();
            m = new Date(next_day).getMonth();
            c = new Date(next_day).getDate();
            const first = c - new Date(y, m, c).getDay();
            first_day = new Date(y, m, first);
        }

        this.setState({
            cYear: y,
            cMonth: m,
            cDay: c,
            first_day: first_day,
        });
        this.calcMonth(y, m, c, first_day, this.state.flag);
    };

    onInitialDate = () => {
        this.setState({
            cYear: new Date().getFullYear(),
            cMonth: new Date().getMonth(),
            cDay: new Date().getDate(),
            first_day: new Date((new Date).setDate(first)),
        });

        this.calcMonth(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            new Date((new Date).setDate(first)),
            this.state.flag,
        );
    };

    calcMonth = (y, m, c, w, flag) => {
        let prevY, prevM, nextY, nextM, cDates, prevDates, cDay;
        let showMonthArray = [], sendMonthArray = [];

        if (flag === 0 || flag === 1) {
            if(m !== 0 && m !== 11) {
                prevY = y;
                nextY = y;
                prevM = m -1;
                nextM = m + 1;
            } else if (m === 0) {
                prevY = y - 1;
                nextY = y;
                prevM = 11;
                nextM = m + 1;
            } else if (m === 11) {
                prevY = y;
                nextY = y + 1;
                prevM = m -1;
                nextM = 0;
            }
            cDates = new Date(y, m + 1, 0).getDate();
            prevDates = new Date(prevY, prevM + 1, 0).getDate();
            cDay = new Date(y, m, 1).getDay();

            for (let k = prevDates - cDay + 1; k <= prevDates; k ++) {
                showMonthArray.push({year: prevY, month: prevM, date: k});
                sendMonthArray.push(new Date(prevY, prevM,  k).toUTCString());
            }
            for (let k = 1; k <= cDates; k ++) {
                showMonthArray.push({year: y, month: m, date: k});
                sendMonthArray.push(new Date(y, m,  k).toUTCString());
            }
            for (let k = 1; k <= 42 - cDates - cDay; k ++) {
                showMonthArray.push({year: nextY, month: nextM, date: k});
                sendMonthArray.push(new Date(nextY, nextM,  k).toUTCString());
            }
            this.setState({
                prevY: prevY,
                nextY: nextY,
                prevM: prevM,
                nextM: nextM,
                prevDates: prevDates,
            });
        } else if (flag === 2) {
            let _yTemp = new Date(w).getFullYear(), yTemp;
            let _mTemp = new Date(w).getMonth(), mTemp;
            let _cTemp = new Date(w).getDate(), cTemp;

            for (let i = 0; i <= 6; i ++) {
                let t = new Date(_yTemp, _mTemp, _cTemp + i);
                yTemp = new Date(t).getFullYear();
                mTemp = new Date(t).getMonth();
                cTemp = new Date(t).getDate();
                showMonthArray.push({year: yTemp, month: mTemp, date: cTemp});
                sendMonthArray.push(new Date(yTemp, mTemp, cTemp).toUTCString());
            }
        } else if (flag === 3) {
            showMonthArray.push({year: y, month: m, date: c});
            sendMonthArray.push(new Date(y, m, c).toUTCString());
        }

        this.setState({
            showMonthArray: showMonthArray,
            sendMonthArray: sendMonthArray,
        });

        /**
         * Api calling
         */
        const {
            appointmentMonth,
        } = this.props;

        if(appointmentMonth){
            const data = {
                id: localStorage.provider_id,
                dateArray: sendMonthArray,
            };
            appointmentMonth(data);
        }
    };

    render() {
        const appointmentPageArray = [];
        if(this.state.appointment_page_num) {
            for (let k = this.state.appointment_page_num.start_page; k <= this.state.appointment_page_num.end_page; k ++) {
                appointmentPageArray.push(k);
            }
        }
        return (
            <>
                <div className="pt-30">
                    <AppointmentHeader />
                    <div className="pt-30 flex-space people-profile">
                        <div className="btn-common txt-16 justify-center col-white mouse-cursor" onClick={this.showModal}>Create Appointment
                        </div>
                    </div>
                    <div className="table-common appointment-p">
                        <div className="scheduler-header justify-center col-white">
                            Appointment
                        </div>

                        {/*<div className="table-p">*/}
                        {/*    <div className="pb-20 justify-left col-white txt-14">*/}
                        {/*        <div*/}
                        {/*            className={this.state.flag === 1? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"}*/}
                        {/*            onClick={this.onDay}*/}
                        {/*        >*/}
                        {/*            Day*/}
                        {/*        </div>*/}
                        {/*        <div*/}
                        {/*            className={this.state.flag === 2? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"} onClick={this.onWeek}*/}
                        {/*        >*/}
                        {/*            Week*/}
                        {/*        </div>*/}
                        {/*        <div*/}
                        {/*            className={this.state.flag === 3? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"} onClick={this.onMonth}*/}
                        {/*        >*/}
                        {/*            Month*/}
                        {/*        </div>*/}
                        {/*        <div*/}
                        {/*            className={this.state.flag === 4 ? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"}*/}
                        {/*            onClick={this.onInvite}>*/}
                        {/*            Invite List*/}
                        {/*        </div>*/}
                        {/*    </div>*/}

                        {/*    <div className="appointment-list">*/}
                        {/*        {*/}
                        {/*            this.state.flag !== 4 && this.state.arrayAppt && this.state.arrayAppt.map((item, key) => {*/}
                        {/*                        const path = '/client-session/' + item._id;*/}
                        {/*                        const pathRoom = '/room/' + item._id;*/}
                        {/*                        let client_list = '';*/}
                        {/*                        let len = item.clientInfo && item.clientInfo.length;*/}
                        {/*                        for (let k = 0; k < len; k++) {*/}
                        {/*                            if(item.clientInfo[k] && item.clientInfo[k].name) client_list += item.clientInfo[k].name + ", ";*/}
                        {/*                        }*/}
                        {/*                        client_list = client_list.slice(0, client_list.length - 2);*/}

                        {/*                        return (*/}
                        {/*                            <div*/}
                        {/*                                className={*/}
                        {/*                                    item.state === 6?*/}
                        {/*                                        "expiration list-p flex-space txt-14"*/}
                        {/*                                        :*/}
                        {/*                                        key % 2 === 0? "even-bg list-p flex-space txt-14" : "list-p flex-space txt-14"*/}

                        {/*                                }*/}
                        {/*                                key={key}*/}
                        {/*                            >*/}
                        {/*                                <div className="justify-left col-darkBlue mouse-cursor" onClick={() => this.showEditModal(item, client_list)}>*/}
                        {/*                                    <div className="time-p justify-center">*/}
                        {/*                                        {*/}
                        {/*                                            item.state === 1 && (*/}
                        {/*                                                <img src={require('../assets/img/appointment-creating.svg')} alt="" />*/}
                        {/*                                            )*/}
                        {/*                                        }*/}

                        {/*                                        {*/}
                        {/*                                            item.state === 2 && (*/}
                        {/*                                                <img src={require('../assets/img/appointment-accepting.svg')} alt="" />*/}
                        {/*                                            )*/}
                        {/*                                        }*/}

                        {/*                                        {*/}
                        {/*                                            (item.state === 3 || item.state === 31 || item.state === 32 || item.state === 4) && (*/}
                        {/*                                                <img src={require('../assets/img/appointment-paying.svg')} alt="" />*/}
                        {/*                                            )*/}
                        {/*                                        }*/}

                        {/*                                        {*/}
                        {/*                                            item.state === 5 && (*/}
                        {/*                                                <img src={require('../assets/img/appointment-finishing.svg')} alt="" />*/}
                        {/*                                            )*/}
                        {/*                                        }*/}

                        {/*                                        {*/}
                        {/*                                            item.state === 6 && (*/}
                        {/*                                                <img src={require('../assets/img/appointment-expiration.svg')} alt="" />*/}
                        {/*                                            )*/}
                        {/*                                        }*/}
                        {/*                                    </div>*/}
                        {/*                                    <div>*/}
                        {/*                                        {*/}
                        {/*                                            item.start_time && (*/}
                        {/*                                                new Date(item.start_time).toLocaleString([], {*/}
                        {/*                                                    year: 'numeric',*/}
                        {/*                                                    month: 'long',*/}
                        {/*                                                    day: '2-digit',*/}
                        {/*                                                    hour: '2-digit',*/}
                        {/*                                                    minute: '2-digit',*/}
                        {/*                                                })*/}
                        {/*                                            )*/}
                        {/*                                        }*/}
                        {/*                                    </div>*/}
                        {/*                                    <div className="time-p col-disabled">*/}
                        {/*                                        {*/}
                        {/*                                            Number(item.time_distance) === 0*/}
                        {/*                                                ?*/}
                        {/*                                                'All Day'*/}
                        {/*                                                :*/}
                        {/*                                                (Number(item.time_distance) >= 60*/}
                        {/*                                                        ?*/}
                        {/*                                                        Math.floor(Number(item.time_distance) / 60) + ' hours ' + Number(item.time_distance) % 60*/}
                        {/*                                                        :*/}
                        {/*                                                        Number(item.time_distance) % 60*/}
                        {/*                                                ) + ' minutes'*/}
                        {/*                                        }*/}
                        {/*                                        {*/}
                        {/*                                            item.online ? ", online" : ""*/}
                        {/*                                        }*/}
                        {/*                                    </div>*/}
                        {/*                                    <div className="time-p">{item.payment} USD</div>*/}
                        {/*                                    <div className="col-blue">*/}
                        {/*                                        {*/}
                        {/*                                            client_list*/}
                        {/*                                        }*/}
                        {/*                                    </div>*/}
                        {/*                                    <div className="col-paragraphBg" style={{paddingLeft: 20}}>*/}
                        {/*                                        {*/}
                        {/*                                            item.invite_client === true && 'Requested'*/}
                        {/*                                        }*/}
                        {/*                                    </div>*/}
                        {/*                                </div>*/}

                        {/*                                <div>*/}
                        {/*                                    {*/}
                        {/*                                        item.state === 1 && (*/}
                        {/*                                            <div*/}
                        {/*                                                className="hover-wait btn-join col-white align-center mouse-cursor">*/}
                        {/*                                                Created*/}
                        {/*                                            </div>*/}
                        {/*                                        )*/}
                        {/*                                    }*/}
                        {/*                                    {*/}
                        {/*                                        item.state === 2 && (*/}
                        {/*                                            <div*/}
                        {/*                                                className="hover-wait btn-join col-white align-center mouse-cursor"*/}
                        {/*                                                onClick={() => this.join(item.start_time, item.end_time, path)}>*/}
                        {/*                                                Accepted*/}
                        {/*                                            </div>*/}
                        {/*                                        )*/}
                        {/*                                    }*/}

                        {/*                                    {*/}
                        {/*                                        item.state === 31 && (*/}
                        {/*                                            <div className="btn-join col-white align-center mouse-cursor" onClick={() => this.join(path)}>*/}
                        {/*                                                Join*/}
                        {/*                                            </div>*/}
                        {/*                                        )*/}
                        {/*                                    }*/}
                        {/*                                    {*/}
                        {/*                                        item.state === 32 && (*/}
                        {/*                                            <div className="btn-join col-white align-center mouse-cursor" onClick={() => this.join(path)}>*/}
                        {/*                                                Start*/}
                        {/*                                            </div>*/}
                        {/*                                        )*/}
                        {/*                                    }*/}
                        {/*                                    {*/}
                        {/*                                        item.state === 3 && (*/}
                        {/*                                            <div className="hover-wait btn-join col-white align-center mouse-cursor"*/}
                        {/*                                                 onClick={() => this.join(pathRoom)}>*/}
                        {/*                                                Wait*/}
                        {/*                                            </div>*/}
                        {/*                                        )*/}
                        {/*                                    }*/}
                        {/*                                    {*/}
                        {/*                                        item.state === 4 && (*/}
                        {/*                                            <div className="btn-join col-white align-center mouse-cursor" onClick={() => this.join(pathRoom)}>*/}
                        {/*                                                Progressing*/}
                        {/*                                            </div>*/}
                        {/*                                        )*/}
                        {/*                                    }*/}
                        {/*                                    {*/}
                        {/*                                        item.state === 5 && (*/}
                        {/*                                            <div className="btn-expiration">Finished</div>*/}
                        {/*                                        )*/}
                        {/*                                    }*/}
                        {/*                                    {*/}
                        {/*                                        item.state === 6 && (*/}
                        {/*                                            <div className="btn-expiration">Expiration</div>*/}
                        {/*                                        )*/}
                        {/*                                    }*/}
                        {/*                                </div>*/}
                        {/*                            </div>*/}
                        {/*                        )*/}
                        {/*                    })*/}

                        {/*        }*/}

                        {/*        {*/}
                        {/*            this.state.flag === 4 && this.state.arrayAppt && this.state.arrayAppt.map((item, key) => {*/}
                        {/*                return (*/}
                        {/*                    <div*/}
                        {/*                        className={key % 2 === 0? "even-bg list-p flex-space txt-14" : "list-p flex-space txt-14"}*/}
                        {/*                        key={key}*/}
                        {/*                    >*/}
                        {/*                        <div className="justify-left col-darkBlue mouse-cursor">*/}
                        {/*                            <div className="invite_text" style={{paddingLeft: 20}} onClick={() => this.onSession(item._id)}>*/}
                        {/*                                {*/}
                        {/*                                    new Date(item.requested_date).toLocaleString([], {*/}
                        {/*                                        year: 'numeric',*/}
                        {/*                                        month: 'long',*/}
                        {/*                                        day: '2-digit',*/}
                        {/*                                        hour: '2-digit',*/}
                        {/*                                        minute: '2-digit',*/}
                        {/*                                    })*/}
                        {/*                                }*/}
                        {/*                            </div>*/}
                        {/*                            <div*/}
                        {/*                                className="time-p col-disabled invite_text"*/}
                        {/*                                onClick={() => this.onSession(item._id)}*/}
                        {/*                            >*/}
                        {/*                                {*/}
                        {/*                                    item.invite_email && item.invite_email*/}
                        {/*                                }*/}
                        {/*                                {*/}
                        {/*                                    item.invite_phone && item.invite_phone*/}
                        {/*                                }*/}
                        {/*                            </div>*/}
                        {/*                        </div>*/}
                        {/*                        <div*/}
                        {/*                            className="btn-deleting invite justify-center col-paragraphBg txt-12 mouse-cursor"*/}
                        {/*                            onClick={() => this.onShowDelete(item._id)}*/}
                        {/*                        >*/}
                        {/*                            Delete*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                )*/}
                        {/*            })*/}
                        {/*        }*/}

                        {/*    </div>*/}

                        {/*    <div className="pt-30 justify-center">*/}
                        {/*        <div className="product-btn table justify-center" onClick={() => this.onAppointmentPageClick(1)}>*/}
                        {/*            <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                        {/*                <path d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z" fill="black" fillOpacity="0.65"/>*/}
                        {/*            </svg>*/}
                        {/*        </div>*/}

                        {/*        {*/}
                        {/*            this.state.appointment_page_num && appointmentPageArray && appointmentPageArray.map((item, key) => {*/}
                        {/*                return (*/}
                        {/*                    <div*/}
                        {/*                        className={this.state.appointment_current_page && this.state.appointment_current_page === item? "product-btn table justify-center btn-search": "product-btn table justify-center col-darkBlue"}*/}
                        {/*                        key={key}*/}
                        {/*                        onClick={() => this.onAppointmentPageClick(item)}*/}
                        {/*                    >*/}
                        {/*                        {item}*/}
                        {/*                    </div>*/}
                        {/*                )*/}
                        {/*            })*/}
                        {/*        }*/}

                        {/*        <div className="product-btn table justify-center" onClick={() => this.onAppointmentPageClick(this.state.appointment_page_num.total_page)}>*/}
                        {/*            <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                        {/*                <path d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z" fill="black" fillOpacity="0.65"/>*/}
                        {/*            </svg>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div className="pt-30 flex-space schedule">
                            <div className="flex-calendar">
                                <div
                                    className={
                                        this.state.flag === 0?
                                            "btn-calendar calendars col-white mouse-cursor justify-center btn-invite-selected"
                                            :
                                            "btn-calendar calendars col-white mouse-cursor justify-center"
                                    }
                                    onClick={this.onCalendar}
                                >
                                    Calendar Views
                                </div>

                                <div className="flex-space">
                                    <select
                                        className="select-common col-white justify-center"
                                        defaultValue={this.state.flag}
                                        onChange={(e) => this.onSelected(e)}
                                    >
                                        <option
                                            value={0}
                                            style={{color: '#ccc'}}
                                            selected={(this.state.flag === 0 || this.state.flag === 4) && true}
                                        >
                                            List Views
                                        </option>
                                        <option value={1} selected={this.state.flag === 1 && true}>Month</option>
                                        <option value={2} selected={this.state.flag === 2 && true}>Week</option>
                                        <option value={3} selected={this.state.flag === 3 && true}>Day</option>
                                    </select>

                                    <div className="flex-space btn-today">
                                        <div
                                            className="mouse-cursor justify-center icon-hover icon-hover-left"
                                            onClick={this.onPrev}
                                        >
                                            <img className="day-next-icon" src={require('../assets/img/pair-arrow-left.svg')} alt="" />
                                        </div>
                                        <div
                                            className="today-p col-white mouse-cursor justify-center"
                                            onClick={this.onInitialDate}
                                        >
                                            Today
                                        </div>
                                        <div
                                            className="mouse-cursor justify-center icon-hover icon-hover-right"
                                            onClick={this.onNext}
                                        >
                                            <img className="day-next-icon" src={require('../assets/img/pair-arrow-right.svg')} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <div
                                    className={
                                        this.state.flag === 4?
                                            "btn-invite-view col-white mouse-cursor justify-center btn-invite-selected"
                                            :
                                            "btn-invite-view col-white mouse-cursor justify-center"
                                    }
                                    onClick={(e) => this.onGetAppointment(4)}
                                >
                                    Invited
                                </div>
                                <div
                                    className={this.state.flag === 5 ?
                                        "btn-invite-view col-white mouse-cursor justify-center btn-invite-selected"
                                        :
                                        "btn-invite-view col-white mouse-cursor justify-center"
                                    }
                                    onClick={(e) => this.onGetAppointment(5)}
                                >
                                    Requested
                                </div>
                            </div>
                        </div>
                        {/* Month Calendar*/}
                        {
                            this.state.flag === 0 && (
                                <div className="grid-p">
                                    <div className="pt-20 pb-10 col-darkBlue txt-26 txt-bold">
                                        {
                                            this.state.monthArray[this.state.cMonth] + " " + this.state.cYear
                                        }
                                    </div>

                                    <div className="appointment-grid7">
                                        <div className="grid7-day txt-bold">SUN</div>
                                        <div className="grid7-day txt-bold">MON</div>
                                        <div className="grid7-day txt-bold">TUE</div>
                                        <div className="grid7-day txt-bold">WED</div>
                                        <div className="grid7-day txt-bold">THU</div>
                                        <div className="grid7-day txt-bold">FRI</div>
                                        <div className="grid7-day txt-bold">SAT</div>
                                    </div>
                                    <div className="appointment-grid7">
                                        {
                                            this.state.showMonthArray && this.state.showMonthArray.map((item, key) => {
                                                return (
                                                    <div
                                                        key={key}
                                                        className={
                                                            item.month === this.state.cMonth?
                                                                item.date === new Date().getDate() && item.month === new Date().getMonth() && item.year === new Date().getFullYear()?
                                                                    "grid7-item bg-color"
                                                                    :
                                                                    "grid7-item"
                                                                :
                                                                "grid7-item col-black-light"
                                                        }
                                                    >
                                                        <div>{item.date}</div>
                                                        <div>
                                                            {
                                                                this.state.monthList && this.state.monthList[key] && this.state.monthList[key].map((temp, index) => {
                                                                    let client_list = '';
                                                                    let len = temp.clientInfo && temp.clientInfo.length;
                                                                    for (let k = 0; k < len; k++) {
                                                                        if(temp.clientInfo[k] && temp.clientInfo[k].name) client_list += temp.clientInfo[k].name + ", ";
                                                                    }
                                                                    client_list = client_list.slice(0, client_list.length - 2);
                                                                    return (
                                                                        <div key={index} className="appointment-item mouse-cursor txt-12" onClick={() => this.showEditModal(temp, client_list)}>
                                                                            {
                                                                                new Date(temp.start_time).toLocaleString([], {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                })
                                                                            }
                                                                            {
                                                                                temp.title.length > 20?
                                                                                    ", " + temp.title.slice(0, 20) + '..'
                                                                                    :
                                                                                    ", " + temp.title
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        }

                        {/*Month List*/}
                        {
                            this.state.flag === 1 && (
                                <div className="grid-p">
                                    <div className="pt-20 pb-10 col-darkBlue txt-26 txt-bold">
                                        {
                                            this.state.monthArray[this.state.cMonth] + " " + this.state.cYear
                                        }
                                    </div>
                                    <div className="">
                                        {
                                            this.state.showMonthArray && this.state.showMonthArray.map((item, key) => {
                                                if(item.month === this.state.cMonth && this.state.monthList && this.state.monthList[key] && this.state.monthList[key].length > 0) {
                                                    return (
                                                        <div key={key}>
                                                            <div className="justify-rl appointment-title">
                                                                <div>
                                                                    {
                                                                        this.state.monthArray[this.state.cMonth] + " " + item.date + ", " + this.state.cYear
                                                                    }
                                                                </div>

                                                                <div>
                                                                    {
                                                                        this.state.dayArray[new Date(item.year, item.month, item.date).getDay()]
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div>
                                                                {
                                                                    this.state.monthList && this.state.monthList[key].map((temp, index) => {
                                                                        let client_list = '';
                                                                        let len = temp.clientInfo && temp.clientInfo.length;
                                                                        for (let k = 0; k < len; k++) {
                                                                            if(temp.clientInfo[k] && temp.clientInfo[k].name) client_list += temp.clientInfo[k].name + ", ";
                                                                        }
                                                                        client_list = client_list.slice(0, client_list.length - 2);
                                                                        return (
                                                                            <div className="appointment-month mouse-cursor txt-16" onClick={() => this.showEditModal(temp, client_list)}>
                                                                                {
                                                                                    new Date(temp.start_time).toLocaleString([], {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                    })
                                                                                    +
                                                                                    " - "
                                                                                    +
                                                                                    new Date(temp.end_time).toLocaleString([], {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                    })
                                                                                }
                                                                                {
                                                                                    ",     " + temp.title
                                                                                }
                                                                                <span className="txt-bold">
                                                                                {
                                                                                    temp.invite_client === true && ', Requested'
                                                                                }
                                                                                {
                                                                                    temp.appointment_type && ",    " + temp.appointment_type
                                                                                }
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                } else {
                                                    return null
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        }

                        {/*Week List*/}
                        {
                            this.state.flag === 2 && (
                                <div className="grid-p">
                                    <div className="pt-20 pb-10 col-darkBlue txt-26 txt-bold">
                                        {
                                            new Date(this.state.first_day).toLocaleString([], {
                                                month: 'short',
                                                day: '2-digit',
                                            }) + ' - ' +
                                            new Date(new Date(this.state.first_day).getFullYear(), new Date(this.state.first_day).getMonth(), new Date(this.state.first_day).getDate() + 6).toLocaleString([], {
                                                year: 'numeric',
                                                month: 'short',
                                                day: '2-digit',
                                            })
                                        }
                                    </div>
                                    <div className="">
                                        {
                                            this.state.showMonthArray && this.state.showMonthArray.map((item, key) => {
                                                if(this.state.monthList && this.state.monthList[key] && this.state.monthList[key].length > 0) {
                                                    return (
                                                        <div key={key}>
                                                            <div className="justify-rl appointment-title">
                                                                <div>
                                                                    {
                                                                        this.state.dayArray[new Date(item.year, item.month, item.date).getDay()]
                                                                    }
                                                                </div>

                                                                <div>
                                                                    {
                                                                        this.state.monthArray[item.month] + " " + item.date + ", " + item.year
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div>
                                                                {
                                                                    this.state.monthList && this.state.monthList[key].map((temp, index) => {
                                                                        let client_list = '';
                                                                        let len = temp.clientInfo && temp.clientInfo.length;
                                                                        for (let k = 0; k < len; k++) {
                                                                            if(temp.clientInfo[k] && temp.clientInfo[k].name) client_list += temp.clientInfo[k].name + ", ";
                                                                        }
                                                                        client_list = client_list.slice(0, client_list.length - 2);
                                                                        return (
                                                                            <div key={index} className="appointment-month mouse-cursor txt-16" onClick={() => this.showEditModal(temp, client_list)}>
                                                                                {
                                                                                    new Date(temp.start_time).toLocaleString([], {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                    })
                                                                                    +
                                                                                    " - "
                                                                                    +
                                                                                    new Date(temp.end_time).toLocaleString([], {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                    })
                                                                                }
                                                                                {
                                                                                    ",     " + temp.title
                                                                                }
                                                                                <span className="txt-bold">
                                                                                {
                                                                                    temp.invite_client === true && ', Requested'
                                                                                }
                                                                                    {
                                                                                        temp.appointment_type && ",    " + temp.appointment_type
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                } else {
                                                    return null
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        }

                        {/* Day List */}
                        {
                            this.state.flag === 3 && (
                                <div className="grid-p">
                                    <div className="pt-20 pb-10 col-darkBlue txt-26 txt-bold">
                                        {
                                            this.state.monthArray[this.state.cMonth] + " " + this.state.cDay + ", " + this.state.cYear
                                        }
                                    </div>

                                    <div className="appointment-title">
                                        <div>
                                            {
                                                this.state.dayArray[new Date(this.state.cYear, this.state.cMonth, this.state.cDay).getDay()]
                                            }
                                        </div>
                                    </div>

                                    <div className="">
                                        {

                                            this.state.monthList && this.state.monthList[0] && this.state.monthList[0].map((item, key) => {
                                                let client_list = '';
                                                let len = item.clientInfo && item.clientInfo.length;
                                                for (let k = 0; k < len; k++) {
                                                    if(item.clientInfo[k] && item.clientInfo[k].name) client_list += item.clientInfo[k].name + ", ";
                                                }
                                                client_list = client_list.slice(0, client_list.length - 2);

                                                return (
                                                    <div key={key}>
                                                        <div className="appointment-month mouse-cursor txt-16" onClick={() => this.showEditModal(item, client_list)}>
                                                            {
                                                                new Date(item.start_time).toLocaleString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })
                                                                +
                                                                " - "
                                                                +
                                                                new Date(item.end_time).toLocaleString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })
                                                            }
                                                            {
                                                                ",     " + item.title
                                                            }
                                                            <span className="txt-bold">
                                                            {
                                                                item.invite_client === true && ', Requested'
                                                            }
                                                            {
                                                                item.appointment_type && ",    " + item.appointment_type
                                                            }
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        }

                        {/* Invite View*/}

                                <div className="table-p">
                                    {
                                        this.state.flag === 4 && (
                                            <div className="appointment-list invite-view">
                                                {
                                                    this.state.arrayAppt && this.state.arrayAppt.map((item, key) => {
                                                        return (
                                                            <div
                                                                className={key % 2 === 0 ? "even-bg list-p flex-space txt-14" : "list-p flex-space txt-14"}
                                                                key={key}
                                                            >
                                                                <div className="justify-left col-darkBlue mouse-cursor">
                                                                    <div style={{paddingLeft: 10}}>{key + 1}</div>
                                                                    <div className="invite_text"
                                                                         style={{paddingLeft: 20}}
                                                                         onClick={() => this.onSession(item._id)}>
                                                                        {
                                                                            new Date(item.requested_date).toLocaleString([], {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: '2-digit',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                            })
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className="time-p col-disabled invite_text"
                                                                        onClick={() => this.onSession(item._id)}
                                                                    >
                                                                        {
                                                                            item.invite_email && item.invite_email
                                                                        }
                                                                        {
                                                                            item.invite_phone && item.invite_phone
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="btn-deleting invite justify-center col-paragraphBg txt-12 mouse-cursor"
                                                                    onClick={() => this.onShowDelete(item._id)}
                                                                >
                                                                    Delete
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                                    {
                                        this.state.flag === 5 && (
                                            <div className="appointment-list">
                                                {
                                                    this.state.arrayAppt && this.state.arrayAppt.length === 0 && (
                                                        <div className="pb-20 txt-14"
                                                             style={{paddingTop: 10, paddingLeft: 20}}>You do not have any appointment requests.
                                                        </div>
                                                    )
                                                }
                                                {
                                                    <table id="tAppt">
                                                            <thead>
                                                            <tr>
                                                                <th></th>
                                                                <th>Date Requested</th>
                                                                <th>Time Length</th>
                                                                <th>Amount</th>
                                                                <th>Client Name</th>
                                                                <th>Type</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                this.state.arrayAppt && this.state.arrayAppt.map((item, key) => {
                                                                    let client_list = '';
                                                                    let len = item.clientInfo && item.clientInfo.length;
                                                                    for (let k = 0; k < len; k++) {
                                                                        if(item.clientInfo[k] && item.clientInfo[k].name)client_list += item.clientInfo[k].name + ", ";
                                                                    }
                                                                    client_list = client_list.slice(0, client_list.length - 2);
                                                                    return (
                                                                        <tr key={key}
                                                                            className="article-table col-heavyDark mouse-cursor"
                                                                        >
                                                                            <td className="time-p justify-center" onClick={() => this.showEditModal(item, client_list)}>
                                                                                {
                                                                                    item.state === 1 && (
                                                                                        <img className="justify-center"
                                                                                             src={require('../assets/img/appointment-creating.svg')}
                                                                                             alt=""/>
                                                                                    )
                                                                                }
                                                                                {
                                                                                    item.state === 2 && (
                                                                                        <img
                                                                                            src={require('../assets/img/appointment-accepting.svg')}
                                                                                            alt=""/>
                                                                                    )
                                                                                }

                                                                                {
                                                                                    (item.state === 3 || item.state === 31 || item.state === 32 || item.state === 4) && (
                                                                                        <img
                                                                                            src={require('../assets/img/appointment-paying.svg')}
                                                                                            alt=""/>
                                                                                    )
                                                                                }

                                                                                {
                                                                                    item.state === 5 && (
                                                                                        <img
                                                                                            src={require('../assets/img/appointment-finishing.svg')}
                                                                                            alt=""/>
                                                                                    )
                                                                                }

                                                                                {
                                                                                    item.state === 6 && (
                                                                                        <img
                                                                                            src={require('../assets/img/appointment-expiration.svg')}
                                                                                            alt=""/>
                                                                                    )
                                                                                }
                                                                            </td>
                                                                            <td onClick={() => this.showEditModal(item, client_list)}>
                                                                                {
                                                                                    new Date(item.start_time).toLocaleDateString([], {
                                                                                        year: 'numeric',
                                                                                        month: 'long',
                                                                                        day: '2-digit',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                    })
                                                                                },
                                                                            </td>
                                                                            <td className="time-p col-disabled" onClick={() => this.showEditModal(item, client_list)}>
                                                                                {
                                                                                    Number(item.time_distance) === 0
                                                                                        ?
                                                                                        'All Day'
                                                                                        :
                                                                                        (Number(item.time_distance) >= 60
                                                                                                ?
                                                                                                Math.floor(Number(item.time_distance) / 60) + ' hours ' + Number(item.time_distance) % 60
                                                                                                :
                                                                                                Number(item.time_distance) % 60
                                                                                        ) + ' minutes'
                                                                                }
                                                                                {
                                                                                    item.online ? ", online" : ""
                                                                                }
                                                                            </td>
                                                                            <td className="time-p" onClick={() => this.showEditModal(item, client_list)}>{item.payment} USD
                                                                            </td>
                                                                            <td className="col-blue" onClick={() => this.showEditModal(item, client_list)}>
                                                                                {
                                                                                    client_list
                                                                                }
                                                                            </td>
                                                                            <td className="time-p" onClick={() => this.showEditModal(item, client_list)}>
                                                                                <div>
                                                                                    {
                                                                                        item.appointment_type && item.appointment_type + " "
                                                                                    }
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        item.invite_client === true && 'Requested '
                                                                                    }
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                            </tbody>
                                                        </table>
                                                }
                                                {
                                                    this.state.flag === 4 && (
                                                        <table id="tppt1">
                                                            <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Date Requested</th>
                                                                <th>Invite via</th>
                                                                <th>Action</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                this.state.arrayAppt && this.state.arrayAppt.map((item, key) => {
                                                                    return (
                                                                        <tr key={key}>
                                                                            <td>{key + 1}</td>
                                                                            <td>
                                                                                <div className="invite_text" onClick={() => this.onSession(item._id)}>
                                                                                    {
                                                                                        new Date(item.requested_date).toLocaleDateString([], {
                                                                                            year: 'numeric',
                                                                                            month: 'long',
                                                                                            day: '2-digit',
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit',
                                                                                        })
                                                                                    },
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="invite_text" onClick={() => this.onSession(item._id)}>
                                                                                    {
                                                                                        item.invite_email && item.invite_email
                                                                                    }
                                                                                    {
                                                                                        item.invite_phone && item.invite_phone
                                                                                    }
                                                                                </div>
                                                                            </td>
                                                                            <td
                                                                                className="justify-center"
                                                                                onClick={() => this.onShowDelete(item._id)}
                                                                            >
                                                                                <div className="btn-deleting invite justify-center col-paragraphBg txt-12 mouse-cursor ">
                                                                                    Delete
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
                                        )
                                    }

                                    <div className="pt-30 justify-center">
                                        <div className="product-btn table justify-center" onClick={() => this.onAppointmentPageClick(1)}>
                                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z" fill="black" fillOpacity="0.65"/>
                                            </svg>
                                        </div>

                                        {
                                            this.state.appointment_page_num && appointmentPageArray && appointmentPageArray.map((item, key) => {
                                                return (
                                                    <div
                                                        className={this.state.appointment_current_page && this.state.appointment_current_page === item? "product-btn table justify-center btn-search": "product-btn table justify-center col-darkBlue"}
                                                        key={key}
                                                        onClick={() => this.onAppointmentPageClick(item)}
                                                    >
                                                        {item}
                                                    </div>
                                                )
                                            })
                                        }

                                        <div className="product-btn table justify-center" onClick={() => this.onAppointmentPageClick(this.state.appointment_page_num.total_page)}>
                                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z" fill="black" fillOpacity="0.65"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                    </div>
                </div>

                {/*  Modal  */}
                <DashboardCreateAppointment
                    show={this.state.modalVisible}
                    handleClose={this.hideModal}
                />

                {/*  Modal  */}
                <EditAppointment
                    itemAppt={this.state.itemAppt}
                    edit_show={this.state.edit_show}
                    client_list={this.state.clientArray}
                    handleClose={this.hideEditModal}
                />

                <DeleteInvite
                    show={this.state.deleteInvite_show}
                    id={this.state.delete_id}
                    handleClose={this.hideShowDelete}
                />
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        appointmentClientList: state.registers.appointmentClientList,
        spinning: state.registers.spinning,
        get_month: state.registers.get_month,
    }
};

export default connect(
    mapStateToProps,
    {
        appointmentClients,
        appointmentMonth,
    }
)(Appointment);
