import React, {Component} from 'react';
import {connect} from "react-redux";
import EditAppointment from "./appointment-edit";
import Config from '../config/index';
import {
    getProviderByIdRole,
    getSimpleUsers,
    getDragList,
    resetMsg,
} from "../redux/actions/register/login-register";
import {
    reset,
    appointmentClients,
    paidAppointment,
    requestedAppointment,
    emptyAppointmentRequest,
    appointmentAccept,
    appointmentCancel,
} from "../redux/actions/register/create-appointment";
import {
    allClientsRequest,
    acceptClientRequest,
    deleteClientRequest,
} from "../redux/actions/register/client-register-request"
import {
    lastMessageList,
} from "../redux/actions/register/messages";
import {
    getDocumentSharedWithMe,
} from "../redux/actions/register/documents";

import DeleteClientRequest from "./request-modal";
import '../assets/css/dashboard.css';
import DashboardCreateAppointment from "./dashboard-create-appointment";
import Invite from "./invite-modal";
import {Link} from "react-router-dom";
import EditInvoice from "./invoice-modal";
import DeleteInvite from "./invite-delete-modal";
import FirstModal from "./first-login-modal";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const current_page = 1;
const page_neighbours = 1;
const pagination = 6;

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.tmr = null;
        this.state = {
            show_first_modal: false,

            show: false,
            edit_show: false,
            itemAppt: '',
            arrayAppt: [],
            arrayRequest: [],
            todayDate: '',
            dd: new Date(),
            weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            curTime: null,
            graduating: '',
            requestVisible: false,
            downUpSettings: false,
            accountInfo: '',
            clientArray: '',

            more_message_id: '',

            /**
             * client List Page
             */
            page_num: '',
            current_page: current_page,
            page_neighbours: page_neighbours,
            pagination: pagination,

            /**
             * client request Page
             */
            client_page_num: '',
            client_current_page: current_page,
            client_page_neighbours: page_neighbours,
            client_pagination: pagination,
            clientList: '',

            invoice_show: false,
            invoice_id: '',
            price: '',
            des_text: '',
            request_date: new Date(),
            list_role: '',
            editable_state: '',

            /**
             * last message List
             */
            lastMessages: '',
            deleteData: '',
            requestShow: false,

            message_page_num: '',
            message_current_page: current_page,
            message_page_neighbours: page_neighbours,
            message_pagination: pagination,

            /**
             * Appointment List
             */
            flag: 1,
            appointment_page_num: '',
            appointment_current_page: current_page,
            appointment_page_neighbours: page_neighbours,
            appointment_pagination: pagination,

            accept_flag: false,

            //invoice
            invoice_page_num: '',
            invoice_current_page: current_page,
            invoice_page_neighbours: page_neighbours,
            invoice_pagination: pagination,
            requestedList: '',

            //payment history(paid)
            history_page_num: '',
            history_current_page: current_page,
            history_page_neighbours: page_neighbours,
            history_pagination: pagination,
            paidList: '',

            // Drag List
            dragList: '',
            // Share link
            share_link: '',
            link_flag: false,
            invite_show: false,
            message_data: {
                id: '',
                name: '',
                phone: '',
                type: '',
                room_link: '',
                appointment_id: '',
            },
            deleteInvite_show: false,
            delete_id: '',

            /**
             * recent Document list
             */
            document_list: '',
        };
        this.onClickShowMoreMessage = this.onClickShowMoreMessage.bind(this);
    };

    componentDidMount() {
        this.initial();

        this.onInputChange = this.onInputChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_appointment_accept && this.props.msg_appointment_accept !== prevProps.msg_appointment_accept) {
            toast(this.props.msg_appointment_accept);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
                window.location.href = "/dashboard";
            }, 2500);
        }
        if(this.props.get_recent_document && this.props.get_recent_document !== prevProps.get_recent_document) {
            this.setState({
                document_list: this.props.get_recent_document,
            });
        }

        if (prevProps.accountSimpleInfo !== this.props.accountSimpleInfo && this.props.accountSimpleInfo) {
            this.setState({
                accountInfo: this.props.accountSimpleInfo,
            });
            if (this.props.accountSimpleInfo.first_login === null || this.props.accountSimpleInfo.first_login === 0) {
                this.setState({
                    show_first_modal: true,
                })
            }
        }
        if (prevProps.appointmentClientList !== this.props.appointmentClientList || this.state.flag !== prevState.flag) {
            this.setState({
                arrayAppt: this.props.appointmentClientList.list,
                appointment_page_num: this.props.appointmentClientList.page_num,
            });
        }
        if (prevProps.requestClientList !== this.props.requestClientList) {
            this.setState({
                arrayRequest: this.props.requestClientList.list,
                page_num: this.props.requestClientList.page_num,
            });
        }
        if (this.state.accept_flag !== prevState.accept_flag) {
            this.initial();
        }
        if (this.props.userList && prevProps.userList !== this.props.userList) {
            this.setState({
                clientList: this.props.userList.list,
                client_page_num: this.props.userList.page_num,
            })
        }
        if (this.props.lastMessagesList && this.props.lastMessagesList !== prevProps.lastMessagesList) {
            this.setState({
                lastMessages: this.props.lastMessagesList.list,
                message_page_num: this.props.lastMessagesList.page_num,
            })
        }
        setInterval(() => {
            this.setState({
                curTime: new Date().toLocaleTimeString([], {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                todayDate: this.state.weekday[this.state.dd.getDay()],
            })
        }, 60000);
        //	invoice and payment
        if (this.props.requestedAppointmentList && prevProps.requestedAppointmentList !== this.props.requestedAppointmentList) {
            this.setState({
                requestedList: this.props.requestedAppointmentList.list,
                invoice_page_num: this.props.requestedAppointmentList.page_num,
            })
        }
        if (this.props.paidAppointmentList && prevProps.paidAppointmentList !== this.props.paidAppointmentList) {
            this.setState({
                paidList: this.props.paidAppointmentList.list,
                history_page_num: this.props.paidAppointmentList.page_num,
            })
        }
        if (this.props.getDragLists && this.props.getDragLists !== prevProps.getDragLists) {
            this.setState({
                dragList: this.props.getDragLists,
            });
        }
        if(this.props.empty_appointment && (this.state.link_flag !== prevState.link_flag || this.props.empty_appointment !== prevProps.empty_appointment)) {
            this.setState({
                share_link: "/room/" + this.props.empty_appointment,
            })
        }
    }

    initial = () => {
        const {
            appointmentClients,
            allClientsRequest,
            getProviderByIdRole,
            getSimpleUsers,
            lastMessageList,
            emptyAppointmentRequest,
            getDocumentSharedWithMe,
        } = this.props;

        if (appointmentClients) {
            const data = {
                role: 'provider',
                id: localStorage.provider_id,
                flag: this.state.flag,
                appointment_current_page: current_page,
                appointment_page_neighbours: page_neighbours,
                appointment_pagination: pagination,
            };
            appointmentClients(data);
        }

        if (allClientsRequest) {
            const data = {
                user_id: localStorage.provider_id,
                current_page: current_page,
                page_neighbours: page_neighbours,
                pagination: pagination,
            };
            allClientsRequest(data);
        }

        getProviderByIdRole({
            id: localStorage.provider_id,
            role: 'provider',
        });

        if (this.state.dd.getHours() < 12) {
            this.setState({
                graduating: 'Good Morning',
            });
        } else if (this.state.dd.getHours() < 18) {
            this.setState({
                graduating: 'Good Afternoon',
            });
        } else {
            this.setState({
                graduating: 'Good Evening',
            });
        }

        this.setState({
            curTime: new Date().toLocaleTimeString([], {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }),
            todayDate: this.state.weekday[this.state.dd.getDay()],
        });

        if (getSimpleUsers) {
            const role = {
                role: 'client',
                client_current_page: current_page,
                client_page_neighbours: page_neighbours,
                client_pagination: pagination,
            };
            getSimpleUsers(role);
        }

        if (lastMessageList) {
            const data = {
                id: localStorage.provider_id,
                message_current_page: current_page,
                message_page_neighbours: page_neighbours,
                message_pagination: pagination,
            };
            lastMessageList(data);
        }

        /**
         * invoice and payment
         */
        const {
            paidAppointment,
            requestedAppointment,
        } = this.props;

        const data_history = {
            id: localStorage.provider_id,
            history_current_page: this.state.history_current_page,
            history_page_neighbours: this.state.history_page_neighbours,
            history_pagination: this.state.history_pagination,
        };

        if (paidAppointment) {
            paidAppointment(data_history);
        }

        const data_invoice = {
            id: localStorage.provider_id,
            current_page: this.state.invoice_current_page,
            page_neighbours: this.state.invoice_page_neighbours,
            pagination: this.state.invoice_pagination,
        };
        if (requestedAppointment) {
            requestedAppointment(data_invoice);
        }

        /**
         * Drag List
         */
        const {
            getDragList,
        } = this.props;

        if (getDragList) {
            const data = {
                id: localStorage.provider_id,
                role: 'provider',
            };

            getDragList(data);
        }
        /**
         * empty appointment create
         */
        const empty = {
            id: localStorage.provider_id,
        };
        if(emptyAppointmentRequest) {
            this.setState({
                link_flag: !this.state.link_flag,
            });
            emptyAppointmentRequest(empty);
        }
        /**
         * document list
         */
        if(getDocumentSharedWithMe) {
            const document_data = {
                id: localStorage.provider_id,
            };
            getDocumentSharedWithMe(document_data);
        }
    };
    onAccept = (key) => {
        const {
            appointmentAccept,
        } = this.props;

        const data = {
            id: key,
        };
        if(appointmentAccept){
            appointmentAccept(data);
        }
        this.initial();
    };
    onClickShowMoreMessage = (id, state) => {
        if (state === 1) {
            this.setState({
                more_message_id: id,
            })
        } else {
            this.setState({
                more_message_id: '',
            })
        }

    };

    showModal = () => {
        if (localStorage.getItem('provider') === 'true') {
            this.setState({
                show: true,
            });
        }
    };
    hideModal = () => {
        this.setState({show: false,});
    };

    showInviteModal = (type) => {
        if (localStorage.getItem('provider') === 'true') {
            if(this.state.accountInfo) {
                if(this.state.accountInfo.plan_string === undefined || (this.state.accountInfo.plan_string !== "year_individual_ultimate" && this.state.accountInfo.plan_string !== "month_individual_ultimate")) {
                    toast("Please upgrade your account to invite by text or email message");
                    clearTimeout(this.tmr);
                    this.tmr = setTimeout(function () {
                        this.tmr = null;
                    }, 5000);
                    return null;
                }
                this.setState({
                    invite_show: true,
                    message_data: {
                        id: localStorage.provider_id,
                        name: localStorage.provider_name,
                        phone: this.state.accountInfo.phone? this.state.accountInfo.phone: '',
                        type: type,
                        room_link: Config.CLIENT_URL + this.state.share_link,
                        appointment_id: this.props.empty_appointment && this.props.empty_appointment,
                    },
                });
            }
        }
    };

    hideInviteModal = () => {
        this.setState({
            invite_show: false,
            message_data: '',
        });
    };
    showRequestModal = (data) => {
        if (localStorage.getItem('provider') === 'true') {
            this.setState({
                requestShow: true,
                deleteData: data,
            });
        }
    };
    hideRequestModal = () => {
        this.setState({requestShow: false});
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

    showInvoiceModal = (_id, client_list, price, notes, date, list_role, editable_state) => {
        if (localStorage.getItem('provider') === 'true') {
            this.setState({
                invoice_show: true,
                invoice_id: _id,
                clientArray: client_list,
                price: price,
                des_text: notes,
                request_date: date,
                list_role: list_role,
                editable_state: editable_state,
            });
        }
    };

    hideInvoiceModal = () => {
        this.setState({
            invoice_show: false,
            itemInvoice: '',
            clientArray: '',
            price: '',
            des_text: '',
            request_date: '',
            list_role: '',
            editable_state: '',
        });
    };

    toggleRequests = () => {
        this.setState({
            requestVisible: !this.state.requestVisible,
            downUpSettings: !this.state.downUpSettings,
        });
    };

    acceptRequest = (data) => {
        const {
            acceptClientRequest,
            allClientsRequest,
        } = this.props;

        if (acceptClientRequest) {
            acceptClientRequest(data);

            this.setState({
                accept_flag: !this.state.accept_flag,
            })
        }
        const datas = {
            user_id: localStorage.provider_id,
            current_page: this.state.current_page,
            page_neighbours: this.state.page_neighbours,
            pagination: this.state.pagination,
        };

        if (allClientsRequest) {
            allClientsRequest(datas)
        }
        let temp = this.state.arrayRequest.filter((item) => {
            return item.client_name !== data.client_name && item.client_email !== data.client_email;
        });

        this.setState({
            arrayRequest: temp,
        });

        this.setState({
            nCount_Request: this.state.nCount_Request - 1,
        });

    };

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value || '',
        })
    };

    onInputChange = (code) => {
        if (code.keyCode === 13) {
            this.searchClients(this.state.search_client);
        }
    };

    onPageClick = (item) => {
        this.setState({
            current_page: item,
        });

        const {
            allClientsRequest
        } = this.props;

        const data = {
            user_id: localStorage.provider_id,
            current_page: item,
            page_neighbours: this.state.page_neighbours,
            pagination: this.state.pagination,
        };

        if (allClientsRequest) {
            allClientsRequest(data)
        }
    };

    onClientPageClick = (item) => {
        this.setState({
            client_current_page: item,
        });

        const {
            getSimpleUsers
        } = this.props;

        const data = {
            role: "client",
            client_current_page: item,
            client_page_neighbours: this.state.client_page_neighbours,
            client_pagination: this.state.client_pagination,
        };

        if (getSimpleUsers) {
            getSimpleUsers(data);
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

        if (appointmentClients) {
            appointmentClients(data);
        }
    };
    onCancel = (key) => {
        const {
            appointmentCancel,
        } = this.props;
        const data = {
            id: key,
        };
        if(appointmentCancel){
            appointmentCancel(data);
        }
        this.initial();
    };

    onGetAppointments = (flag) => {
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

    onSession = (id) => {
        this.props.history.push("/invited-room/" + id);
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


    join = (sTime, eTime, url) => {
        window.location.href = "/room/" + url;
    };

    onInvoicePageClick = (item) => {
        const {
            requestedAppointment
        } = this.props;

        this.setState({
            invoice_current_page: item,
        });

        const data_invoice = {
            id: localStorage.provider_id,
            current_page: item,
            page_neighbours: this.state.invoice_page_neighbours,
            pagination: this.state.invoice_pagination,
        };
        if (requestedAppointment) {
            requestedAppointment(data_invoice);
        }
    };

    onPaymentPageClick = (item) => {
        const {
            paidAppointment
        } = this.props;
        this.setState({
            history_current_page: item,
        });

        const data = {
            id: localStorage.provider_id,
            history_current_page: item,
            history_page_neighbours: this.state.history_page_neighbours,
            history_pagination: this.state.history_pagination,
        };
        if (paidAppointment) {
            paidAppointment(data);
        }
    };

    onMessagePageClick = (item) => {
        this.setState({
            message_current_page: item,
        });

        const {
            lastMessageList
        } = this.props;

        const data = {
            id: localStorage.provider_id,
            message_current_page: item,
            message_page_neighbours: this.state.message_page_neighbours,
            message_pagination: this.state.message_pagination,
        };

        if (lastMessageList) {
            lastMessageList(data);
        }
    };

    onClient = (item,id) => {
        //console.log(item);
        let flag = 0;
        if(this.state.accountInfo.main_provider_id === "false") {
            flag = 1;
        } else {
            if (item.includes(localStorage.provider_id)) {
                flag = 1;
            }
        }
        if (flag === 0) {
            alert("You can not see or edit his/her detailed information because you did not still connect with this client.")
        } else {
            this.props.history.push("/client-management/" + this.state.client_current_page + "-" + id);
        }
    };

    hideFirstModal = () => {
        this.setState({
            show_first_modal: false,
        })
    };

    render() {
        const requestPageArray = [];
        const clientPageArray = [];
        const appointmentPageArray = [];
        const pageArray = [];
        const history_pageArray = [];
        const messagePageArray = [];

        if (this.state.message_page_num) {
            for (let k = this.state.message_page_num.start_page; k <= this.state.message_page_num.end_page; k++) {
                messagePageArray.push(k);
            }
        }

        if (this.state.page_num) {
            for (let k = this.state.page_num.start_page; k <= this.state.page_num.end_page; k++) {
                requestPageArray.push(k);
            }
        }

        if (this.state.client_page_num) {
            for (let k = this.state.client_page_num.start_page; k <= this.state.client_page_num.end_page; k++) {
                clientPageArray.push(k);
            }
        }

        if (this.state.appointment_page_num) {
            for (let k = this.state.appointment_page_num.start_page; k <= this.state.appointment_page_num.end_page; k++) {
                appointmentPageArray.push(k);
            }
        }

        if (this.state.history_page_num) {
            for (let k = this.state.history_page_num.start_page; k <= this.state.history_page_num.end_page; k++) {
                history_pageArray.push(k);
            }
        }

        if (this.state.invoice_page_num) {
            for (let k = this.state.invoice_page_num.start_page; k <= this.state.invoice_page_num.end_page; k++) {
                pageArray.push(k);
            }
        }
        return (
            <>
                <ToastContainer />
                <div className="spinning-curtain" style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>

                <div className="flex-space appointment">
                    <div className=" txt-22 col-darkBlue">
                        {this.state.graduating}, {this.state.accountInfo.name}
                    </div>
                    <div className=" txt-16 col-heavyDark">{this.state.todayDate}, {this.state.curTime}</div>
                    <div
                        className="btn-common justify-center col-white txt-16 res-top mouse-cursor"
                        onClick={this.showModal}
                    >
                        Create Appointment
                    </div>
                </div>

                <div className="pt-20 txt-16 col-disabled quickly-link">
                    <div className="center-text">To invite someone to your waiting room, share this link</div>
                    <div className="pt-20 invite-flex">
                        <input
                            id="share_link"
                            className="invite"
                            placeholder={Config.CLIENT_URL + this.state.share_link}
                            value={Config.CLIENT_URL +  this.state.share_link}
                            disabled={true}
                        />
                        <div className="btn-invite mouse-cursor dropdown">
                            <span>Invite via</span>
                                <img className="drop-icon" src={require("../assets/img/drop-down.svg")} alt="drop down" />
                            <div className="dropdown-content">
                                <div className="menu-txt justify-left" onClick={() => this.showInviteModal('Email Message')}>
                                    <img className="email-size" src={require('../assets/img/email.png')} alt="Email" />
                                    Email
                                </div>
                                <div className="menu-txt justify-left" onClick={() => this.showInviteModal("Text Message")}>
                                    <img className="email-size" src={require('../assets/img/text-message.png')} alt="Text Message" />
                                    Text Message
                                </div>
                                <div className="menu-txt justify-left" onClick={() => this.showInviteModal("Prints")}>
                                    <img className="email-size" src={require('../assets/img/prints.png')} alt="Prints" />
                                    Prints
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-20 pb-30 flex-grid2 list-gaps2">
                    {
                        this.state.dragList && this.state.dragList.map((item, key) => {
                            return (
                                <div className="table-common" key={key}>
                                    {
                                        item['title'].toLowerCase() === "client list" && (
                                            <div>
                                                <div className="patient-header justify-center col-white">
                                                    Client List
                                                </div>

                                                <div className="table-dash txt-14">
                                                    <div className="table-list">
                                                        <table id="tAppt">
                                                            <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Phone Number</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                this.state.clientList && this.state.clientList.map((item, key) => {
                                                                    let display_phone = '';
                                                                    if(item.phone) {
                                                                        let phone = (item.phone).toString();
                                                                        for (let k = 0; k < phone.length; k ++) {
                                                                            let m = phone.slice(k,k + 1);
                                                                            if (k === 3 || k === 6) {
                                                                                m = "-" + m;
                                                                            }
                                                                            display_phone += m;
                                                                        }
                                                                    }
                                                                    return (
                                                                        <tr key={key} className="mouse-cursor" onClick={() => this.onClient(item.provider_ids, item._id)}>
                                                                            <td>{key + 1}</td>
                                                                            <td>{item.name}</td>
                                                                            <td>{item.email}</td>
                                                                            <td>
                                                                                {
                                                                                    item.phone && display_phone
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="pt-30 justify-center">
                                                        <div className="product-btn table justify-center"
                                                             onClick={() => this.onClientPageClick(1)}>
                                                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                                                    fill="black" fillOpacity="0.65"/>
                                                            </svg>
                                                        </div>

                                                        {
                                                            this.state.client_page_num && clientPageArray && clientPageArray.map((item, key) => {
                                                                return (
                                                                    <div
                                                                        className={this.state.client_current_page && this.state.client_current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
                                                                        key={key}
                                                                        onClick={() => this.onClientPageClick(item)}
                                                                    >
                                                                        {item}
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                        <div className="product-btn table justify-center"
                                                             onClick={() => this.onClientPageClick(this.state.client_page_num.total_page)}>
                                                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
                                                                    fill="black" fillOpacity="0.65"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        item['title'].toLowerCase() === "document list" && (
                                            <div>
                                                <div className="document-header justify-center col-white">
                                                    Document List
                                                </div>

                                                <div className="table-dash message-scroll txt-14">
                                                    <div className="table-list"
                                                         style={{padding: 10}}>
                                                        {
                                                            this.state.document_list && this.state.document_list.map((item, key) => {
                                                                const path = "/documents/";
                                                                return (
                                                                    <div className="messaging flex-space messages col-darkBlue mouse-cursor" key={key}>
                                                                            <Link to={path}>
                                                                                <div className="pt-5 col-heavyDark">{item.filename}</div>
                                                                                <div className="col-darkBlue">{item.recipient[0].name} shared this document with you at
                                                                                    {
                                                                                        " " + new Date(item.shared_date).toLocaleDateString([], {
                                                                                            year: 'numeric',
                                                                                            month: 'long',
                                                                                            day: '2-digit',
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit',
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            </Link>

                                                                            <a className="btn-upload download col-white mouse-cursor" href={item.path}>
                                                                                <img className="attached-icon" src={require('../assets/img/download-solid.svg')}
                                                                                     alt=""/> Download
                                                                            </a>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        {
                                                            this.state.document_list && this.state.document_list.length === 0 && (
                                                                <div className="txt-14">You have not shared a document yet</div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        item['title'].toLowerCase() === "message center" && (
                                            <div>
                                                <div className="message-header justify-center col-white">
                                                    Message Center
                                                </div>

                                                <div className="table-dash message-scroll txt-14">
                                                    <div className="table-list"
                                                         style={{padding: 10}}>
                                                        {
                                                            this.state.lastMessages && this.state.lastMessages.map((item, key) => {
                                                                const path = "/view-messages/" + item.id;
                                                                return (
                                                                    <Link to={path}
                                                                          className="messaging flex-space messages mouse-cursor"
                                                                          key={key}>
                                                                        <div className="justify-left">
                                                                            <img className="message-photo"
                                                                                 src={item.photo ? item.photo : require('../assets/img/account.svg')}
                                                                                 alt=""/>
                                                                            <div className="name-pl">{item.name}</div>
                                                                        </div>

                                                                        <div className="">
                                                                            <div
                                                                                className="col-disabled">{item.date}</div>
                                                                            <div>{item.msg}</div>
                                                                        </div>
                                                                    </Link>
                                                                )
                                                            })
                                                        }
                                                    </div>

                                                    <div className="pt-30 justify-center">
                                                        <div className="product-btn table justify-center"
                                                             onClick={() => this.onMessagePageClick(1)}>
                                                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                                                    fill="black" fillOpacity="0.65"/>
                                                            </svg>
                                                        </div>

                                                        {
                                                            this.state.message_page_num && messagePageArray && messagePageArray.map((item, key) => {
                                                                return (
                                                                    <div
                                                                        className={this.state.message_current_page && this.state.message_current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
                                                                        key={key}
                                                                        onClick={() => this.onMessagePageClick(item)}
                                                                    >
                                                                        {item}
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                        <div className="product-btn table justify-center"
                                                             onClick={() => this.onMessagePageClick(this.state.message_page_num.total_page)}>
                                                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
                                                                    fill="black" fillOpacity="0.65"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        item['title'].toLowerCase() === "appointment list" && (
                                            <div>
                                                <div className="scheduler-header justify-center col-white">
                                                    Appointment List
                                                </div>

                                                <div className="pt-20 justify-left appointment col-white txt-14 btn-days">
                                                    <div
                                                        className={this.state.flag === 1 ? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"}
                                                        onClick={(e) => this.onGetAppointments(1)}>Day
                                                    </div>
                                                    <div
                                                        className={this.state.flag === 2 ? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"}
                                                        onClick={(e) => this.onGetAppointments(2)}>Week
                                                    </div>
                                                    <div
                                                        className={this.state.flag === 3 ? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"}
                                                        onClick={(e) => this.onGetAppointments(3)}>Month
                                                    </div>
                                                    <div
                                                        className={this.state.flag === 4 ? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"}
                                                        onClick={(e) => this.onGetAppointments(4)}>Invited
                                                    </div>
                                                    <div
                                                        className={this.state.flag === 5 ? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"}
                                                        onClick={(e) => this.onGetAppointments(5)}>Requested
                                                    </div>
                                                </div>

                                                <div className="table-dash txt-14">
                                                    <div className="appointment-list">
                                                        {
                                                            this.state.arrayAppt && this.state.arrayAppt.length === 0 && (
                                                                <div className="pb-20 txt-14"
                                                                     style={{paddingTop: 10, paddingLeft: 20}}>You do not have any appointment requests.
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            this.state.flag !== 4 && (
                                                                <table id="tAppt">
                                                                    <thead>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th>Date Requested</th>
                                                                        <th>Time Length</th>
                                                                        <th>Amount</th>
                                                                        <th>Client Name</th>
                                                                        <th>Type</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {
                                                                        this.state.arrayAppt && this.state.arrayAppt.map((item, key) => {
                                                                            const path = item._id;
                                                                            const pathRoom = item._id;
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
                                                                                    <td>
                                                                                        {
                                                                                            item.state === 1 && (item.role_updated === "provider" || (item.role_updated === undefined && item.invite_client !== true)) && (
                                                                                                <div
                                                                                                    className="hover-wait btn-join col-white align-center mouse-cursor"
                                                                                                    onClick={() => this.join(item.start_time, item.end_time, path)}>
                                                                                                    Created
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        {
                                                                                            item.state === 1 && (item.role_updated === "client" || (item.role_updated === undefined && item.invite_client === true))&& (
                                                                                                <div className="">
                                                                                                    <div className="btn-small justify-center col-selected-bg txt-14 mouse-cursor"
                                                                                                         onClick={() => this.onAccept(item._id)}>
                                                                                                        Approve
                                                                                                    </div>
                                                                                                    <div className="btn-deleting justify-center col-paragraphBg txt-14 mouse-cursor"
                                                                                                         onClick={() => this.onCancel(item._id)}>
                                                                                                        Decline
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                        }

                                                                                        {
                                                                                            item.state === 2 && (
                                                                                                <div
                                                                                                    className="hover-wait btn-join col-white align-center mouse-cursor"
                                                                                                    onClick={() => this.join(item.start_time, item.end_time, path)}>
                                                                                                    Accepted
                                                                                                </div>
                                                                                            )
                                                                                        }

                                                                                        {
                                                                                            item.state === 31 && (
                                                                                                <div
                                                                                                    className="btn-join col-white align-center mouse-cursor"
                                                                                                    onClick={() => this.join(item.start_time, item.end_time, path)}>
                                                                                                    Join
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        {
                                                                                            item.state === 32 && (
                                                                                                <div
                                                                                                    className="btn-join col-white align-center mouse-cursor"
                                                                                                    onClick={() => this.join(item.start_time, item.end_time, path)}>
                                                                                                    Start
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        {
                                                                                            item.state === 3 && (
                                                                                                <div
                                                                                                    className="hover-wait btn-join col-white align-center mouse-cursor"
                                                                                                    onClick={() => this.join(item.start_time, item.end_time, pathRoom)}>
                                                                                                    Wait
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        {
                                                                                            item.state === 4 && (
                                                                                                <div
                                                                                                    className="btn-join col-white align-center mouse-cursor"
                                                                                                    onClick={() => this.join(item.start_time, item.end_time, pathRoom)}>
                                                                                                    Progressing
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        {
                                                                                            item.state === 5 && (
                                                                                                <div
                                                                                                    className="btn-expiration">Finished</div>
                                                                                            )
                                                                                        }
                                                                                        {
                                                                                            item.state === 6 && (
                                                                                                <div
                                                                                                    className="btn-expiration">Expiration</div>
                                                                                            )
                                                                                        }
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            )
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
                                                </div>

                                                <div className="pb-20 justify-center">
                                                    <div className="product-btn table justify-center"
                                                         onClick={() => this.onAppointmentPageClick(1)}>
                                                        <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                                                fill="black" fillOpacity="0.65"/>
                                                        </svg>
                                                    </div>

                                                    {
                                                        this.state.appointment_page_num && appointmentPageArray && appointmentPageArray.map((item, key) => {
                                                            return (
                                                                <div
                                                                    className={this.state.appointment_current_page && this.state.appointment_current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
                                                                    key={key}
                                                                    onClick={() => this.onAppointmentPageClick(item)}
                                                                >
                                                                    {item}
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                    <div className="product-btn table justify-center"
                                                         onClick={() => this.onAppointmentPageClick(this.state.appointment_page_num.total_page)}>
                                                        <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
                                                                fill="black" fillOpacity="0.65"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        item['title'].toLowerCase() === "invoice list" && (
                                            <div>
                                                <div className="invoice-header justify-center col-white">
                                                    Invoice List
                                                </div>

                                                <div className="table-dash txt-14">
                                                    <div className="table-list">
                                                        {
                                                            this.state.requestedList && this.state.requestedList.length === 0 && (
                                                                <div className="pb-20 txt-14"
                                                                     style={{paddingTop: 10}}>You do not have any
                                                                    outstanding payment requests.
                                                                    Click the create button above
                                                                    and to the right to get started.</div>
                                                            )
                                                        }
                                                        <table id="tAppt">
                                                            <thead>
                                                            <tr>
                                                                <th>Payer Name</th>
                                                                <th>Requested By</th>
                                                                <th>Amount</th>
                                                                <th>Date Requested</th>
                                                                <th>Appointment Type</th>
                                                                <th>Action</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                this.state.requestedList && this.state.requestedList.map((item, key) => {
                                                                    let client_list = '';
                                                                    for (let k = 0; k < item.clientInfo.length; k++) {
                                                                        client_list += item.clientInfo[k].name + ", ";
                                                                    }

                                                                    client_list = client_list.slice(0, client_list.length - 3);

                                                                    return (
                                                                        <tr key={key}
                                                                            className="article-table col-heavyDark mouse-cursor"
                                                                            onClick={() => this.showInvoiceModal(item._id, client_list, item.payment, item.notes, item.requested_date, 'Invoice', item.editable_state)}
                                                                        >
                                                                            <td>
                                                                                <span
                                                                                    className="col-darkBlue">{client_list}</span>
                                                                                <div>
                                                                                    Appointment scheduled for
                                                                                    <span style={{paddingLeft: 5}}>
                                                                                    {
                                                                                        new Date(item.start_time).toLocaleDateString([], {
                                                                                            year: 'numeric',
                                                                                            month: 'long',
                                                                                            day: '2-digit',
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit',
                                                                                        })
                                                                                    }
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                {localStorage.provider_name}
                                                                            </td>
                                                                            <td>
                                                                                ${item.payment}
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    new Date(item.requested_date).toLocaleDateString([], {
                                                                                        year: 'numeric',
                                                                                        month: 'long',
                                                                                        day: '2-digit',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                    })
                                                                                }
                                                                            </td>
                                                                            <td className="align-c">
                                                                                <div>
                                                                                    {
                                                                                        item.invite_client === true && "Requested"
                                                                                    }
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        item.appointment_type && item.appointment_type
                                                                                    }
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.state === 2 ?
                                                                                        "Accepted"
                                                                                        :
                                                                                        <div
                                                                                            className="btn-common edit-btn pay-col col-white align-c mouse-cursor"
                                                                                            onClick={() => this.showModal(item._id, client_list, item.payment)}>
                                                                                            Edit
                                                                                        </div>
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="pt-30 justify-center">
                                                        <div className="product-btn table justify-center"
                                                             onClick={() => this.onInvoicePageClick(1)}>
                                                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                                                    fill="black" fillOpacity="0.65"/>
                                                            </svg>
                                                        </div>

                                                        {
                                                            this.state.invoice_page_num && pageArray && pageArray.map((item, key) => {
                                                                return (
                                                                    <div
                                                                        className={this.state.invoice_current_page && this.state.invoice_current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
                                                                        key={key}
                                                                        onClick={() => this.onInvoicePageClick(item)}
                                                                    >
                                                                        {item}
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                        <div className="product-btn table justify-center"
                                                             onClick={() => this.onInvoicePageClick(this.state.invoice_page_num.total_page)}>
                                                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
                                                                    fill="black" fillOpacity="0.65"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        item['title'].toLowerCase() === "payment list" && (
                                            <div>
                                                <div className="payment-header justify-center col-white">
                                                    Payment List
                                                </div>

                                                <div className="table-dash txt-14">
                                                    <div className="table-list">
                                                        {
                                                            this.state.paidList && this.state.paidList.length === 0 && (
                                                                <div className="pb-20 txt-14"
                                                                     style={{paddingTop: 10}}>You do not have any
                                                                    payment
                                                                    history. Click the create
                                                                    button above and to the
                                                                    right to get started.</div>
                                                            )
                                                        }
                                                        <table id="tAppt">
                                                            <thead>
                                                            <tr>
                                                                <th>Payer Name</th>
                                                                <th>Paid To</th>
                                                                <th>Amount</th>
                                                                <th>Date Paid</th>
                                                                <th>Type</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                this.state.paidList && this.state.paidList.map((item, key) => {
                                                                    let client_list = '';
                                                                    for (let k = 0; k < item.clientInfo.length; k++) {
                                                                        if(item.clientInfo[k] && item.clientInfo[k].name) client_list += item.clientInfo[k].name + ", ";
                                                                    }
                                                                    client_list = client_list.slice(0, client_list.length - 3);
                                                                    return (
                                                                        <tr key={key}
                                                                            className="article-table col-heavyDark mouse-cursor"
                                                                            onClick={() => this.showInvoiceModal(item._id, client_list, item.payment, item.notes, item.requested_date, 'Payment',  item.editable_state)}
                                                                        >
                                                                            <td>
                                                                                {
                                                                                    client_list
                                                                                }
                                                                                <div>
                                                                                    Appointment scheduled for
                                                                                    <span
                                                                                        className="">{item.session_date ? item.session_date : " Payment Request"}</span>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                {localStorage.provider_name}
                                                                            </td>
                                                                            <td>
                                                                                $ {item.payment}
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.payment === 0?
                                                                                        new Date(item.requested_date).toLocaleDateString([], {
                                                                                            year: 'numeric',
                                                                                            month: 'long',
                                                                                            day: '2-digit',
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit',
                                                                                        })
                                                                                        :
                                                                                        new Date(item.paid_date).toLocaleDateString([], {
                                                                                            year: 'numeric',
                                                                                            month: 'long',
                                                                                            day: '2-digit',
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit',
                                                                                        })

                                                                                },
                                                                            </td>
                                                                            <td>
                                                                                <div>
                                                                                    {
                                                                                        item.invite_client === true && "Requested"
                                                                                    }
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        item.appointment_type && item.appointment_type
                                                                                    }
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="pt-30 justify-center">
                                                        <div className="product-btn table justify-center"
                                                             onClick={() => this.onPaymentPageClick(1)}>
                                                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                                                    fill="black" fillOpacity="0.65"/>
                                                            </svg>
                                                        </div>

                                                        {
                                                            this.state.history_page_num && history_pageArray && history_pageArray.map((item, key) => {
                                                                return (
                                                                    <div
                                                                        className={this.state.history_current_page && this.state.history_current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
                                                                        key={key}
                                                                        onClick={() => this.onPaymentPageClick(item)}
                                                                    >
                                                                        {item}
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                        <div className="product-btn table justify-center"
                                                             onClick={() => this.onPaymentPageClick(this.state.history_page_num.total_page)}>
                                                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
                                                                    fill="black" fillOpacity="0.65"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        (item['title'].toLowerCase() === "client request list" || item['title'].toLowerCase() === "client requested list") && (
                                            <div>
                                                <div className="request-header justify-center col-white">
                                                    Client Requested List
                                                </div>

                                                <div className="table-dash txt-14">
                                                    <div className="client-scroll" style={{overflowX: 'auto'}}>
                                                        <table id="tAppt0">
                                                            <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Requested date</th>
                                                                <th>Message</th>
                                                                <th>Action</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                this.state.arrayRequest && this.state.arrayRequest.map((item, key) => {
                                                                    return (
                                                                        <tr key={key}>
                                                                            <td>{key + 1}</td>
                                                                            <td>{item.client_name}</td>
                                                                            <td>{item.client_email}</td>
                                                                            <td>{item.request_date}</td>
                                                                            <td>
                                                                                {
                                                                                    item.msg && item.msg.length <= 50 && item.msg
                                                                                }
                                                                                {
                                                                                    item.msg && item.msg.length > 50 && (
                                                                                        item._id === this.state.more_message_id ?
                                                                                            item.msg
                                                                                            :
                                                                                            item.msg.slice(0, 49) + "..."
                                                                                    )
                                                                                }
                                                                                {
                                                                                    item.msg && item.msg.length > 50 && item._id !== this.state.more_message_id && (
                                                                                        <span
                                                                                            className="mouse-cursor col-blue"
                                                                                            style={{paddingLeft: 15}}
                                                                                            onClick={() => this.onClickShowMoreMessage(item._id, 1)}
                                                                                        > More </span>
                                                                                    )
                                                                                }
                                                                                {
                                                                                    item.msg && item.msg.length > 50 && item._id === this.state.more_message_id && (
                                                                                        <span
                                                                                            className="mouse-cursor col-blue"
                                                                                            style={{paddingLeft: 15}}
                                                                                            onClick={() => this.onClickShowMoreMessage(item._id, 2)}
                                                                                        > Less </span>
                                                                                    )
                                                                                }

                                                                            </td>
                                                                            <td className="">
                                                                                {
                                                                                    item.accept_state === 'true' ?
                                                                                        <div
                                                                                            className="txt-12 col-disabled-shown">Accepted</div>
                                                                                        :
                                                                                        <>
                                                                                            <div
                                                                                                className="accept justify-center col-selected-bg txt-12 mouse-cursor"
                                                                                                onClick={this.acceptRequest.bind(this, item)}>Approve
                                                                                            </div>

                                                                                            <div
                                                                                                className="btn-deleting justify-center col-paragraphBg txt-12 mouse-cursor"
                                                                                                onClick={() => this.showRequestModal(item)}>Decline
                                                                                            </div>
                                                                                        </>
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="pt-30 justify-center">
                                                        <div className="product-btn table justify-center"
                                                             onClick={() => this.onPageClick(1)}>
                                                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                                                    fill="black" fillOpacity="0.65"/>
                                                            </svg>
                                                        </div>

                                                        {
                                                            this.state.page_num && requestPageArray && requestPageArray.map((item, key) => {
                                                                return (
                                                                    <div
                                                                        className={this.state.current_page && this.state.current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
                                                                        key={key}
                                                                        onClick={() => this.onPageClick(item)}
                                                                    >
                                                                        {item}
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                        <div className="product-btn table justify-center"
                                                             onClick={() => this.onPageClick(this.state.page_num.total_page)}>
                                                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
                                                                    fill="black" fillOpacity="0.65"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>

                {/*  Modal  */}
                <DashboardCreateAppointment
                    show={this.state.show}
                    handleClose={this.hideModal}
                />

                <DeleteClientRequest
                    requestShow={this.state.requestShow}
                    deleteData={this.state.deleteData}
                    handleClose={this.hideRequestModal}
                />

                {/*  Modal  */}
                <EditAppointment
                    itemAppt={this.state.itemAppt}
                    edit_show={this.state.edit_show}
                    client_list={this.state.clientArray}
                    handleClose={this.hideEditModal}
                />

                <EditInvoice
                    invoice_id={this.state.invoice_id}
                    price={this.state.price}
                    invoice_show={this.state.invoice_show}
                    client_list={this.state.clientArray}
                    des_text={this.state.des_text}
                    request_date={this.state.request_date}
                    list_role={this.state.list_role}
                    editable_state={this.state.editable_state}
                    handleClose={this.hideInvoiceModal}
                />

                <Invite
                    data={this.state.message_data}
                    show={this.state.invite_show}
                    handleClose={this.hideInviteModal}
                />

                <DeleteInvite
                    show={this.state.deleteInvite_show}
                    id={this.state.delete_id}
                    handleClose={this.hideShowDelete}
                />

                <FirstModal
                    show={this.state.show_first_modal}
                    handleClose={this.hideFirstModal}
                />

            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        appointmentClientList: state.registers.appointmentClientList,
        requestClientList: state.registers.requestClientList,
        accountSimpleInfo: state.registers.accountSimpleInfo,

        userList: state.registers.userList,
        lastMessagesList: state.registers.lastMessagesList,
        spinning: state.registers.spinning,

        paidAppointmentList: state.registers.paidAppointmentList,
        requestedAppointmentList: state.registers.requestedAppointmentList,
        empty_appointment: state.registers.empty_appointment,
        getDragLists: state.registers.getDragLists,
        get_recent_document: state.registers.get_recent_document,
        msg_appointment_accept: state.registers.msg_appointment_accept,
        msg_cancel: state.registers.msg_cancel,
    }
};

export default connect(
    mapStateToProps,
    {
        reset,
        getProviderByIdRole,
        appointmentClients,
        allClientsRequest,
        acceptClientRequest,
        deleteClientRequest,

        getSimpleUsers,
        lastMessageList,

        paidAppointment,
        requestedAppointment,
        emptyAppointmentRequest,
        getDragList,
        resetMsg,
        getDocumentSharedWithMe,
        appointmentAccept,
        appointmentCancel,
    }
)(Dashboard);
