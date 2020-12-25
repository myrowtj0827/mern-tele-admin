import React, {Component} from 'react';
import '../assets/css/views.css';
import {connect} from "react-redux";
import EditAppointment from "./invoice-modal";
import EditInvoice from "./invoice-modal";
import {
    paidAppointment,
    requestedAppointment,
} from "../redux/actions/register/create-appointment";
import {
    getFullUserByIdRole,
} from '../redux/actions/register/login-register';

class Payments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuVisible: true,
            paidList: '',
            requestedList: '',
            show: false,
            edit_id: '',
            name: '',
            amount: '',

            edit_show: false,
            itemAppt: '',
            clientArray: '',

            invoice_show: false,
            invoice_id: '',
            price: '',
            des_text: '',
            request_date: new Date(),
            list_role: '',
            editable_state: '',

            //invoice
            page_num: '',
            current_page: 1,
            page_neighbours: 4,
            pagination: 6,

            //payment history(paid)
            history_page_num: '',
            history_current_page: 1,
            history_page_neighbours: 4,
            history_pagination: 6,

            account: '',
        }
    }

    componentDidMount() {
        const {
            paidAppointment,
            requestedAppointment,
            getFullUserByIdRole,
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
            current_page: this.state.current_page,
            page_neighbours: this.state.page_neighbours,
            pagination: this.state.pagination,
        };
        if (requestedAppointment) {
            requestedAppointment(data_invoice);
        }

        if (getFullUserByIdRole) {
            const data = {
                id: localStorage.provider_id,
                role: 'provider',
            };
            getFullUserByIdRole(data);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.requestedAppointmentList && prevProps.requestedAppointmentList !== this.props.requestedAppointmentList) {
            this.setState({
                requestedList: this.props.requestedAppointmentList.list,
                page_num: this.props.requestedAppointmentList.page_num,
            })
        }

        if (this.props.paidAppointmentList && prevProps.paidAppointmentList !== this.props.paidAppointmentList) {
            this.setState({
                paidList: this.props.paidAppointmentList.list,
                history_page_num: this.props.paidAppointmentList.page_num,
            })
        }

        if(this.props.providerFullInfo && this.props.providerFullInfo !== prevProps.providerFullInfo) {
            this.setState({
                account: this.props.providerFullInfo,
            })
        }
    }

    showModal = (_id, name, amount) => {
        if (localStorage.getItem('provider') === 'true') {
            this.setState({
                show: true,
                edit_id: _id,
                name: name,
                amount: amount,
            });
        }
    };

    hideModal = () => {
        this.setState({show: false});
    };

    profileToggleMenu = () => {
        this.setState({
            menuVisible: !this.state.menuVisible,
        })
    };

    onPageClick = (item) => {
        if (this.state.menuVisible === true) {
            const {
                requestedAppointment
            } = this.props;

            this.setState({
                current_page: item,
            });

            const data_invoice = {
                id: localStorage.provider_id,
                current_page: item,
                page_neighbours: this.state.page_neighbours,
                pagination: this.state.pagination,
            };
            if (requestedAppointment) {
                requestedAppointment(data_invoice);
            }
        } else {
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
        }
        window.scrollTo(0, 0);
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
    render() {
        const pageArray = [];
        const history_pageArray = [];

        if (this.state.history_page_num) {
            for (let k = this.state.history_page_num.start_page; k <= this.state.history_page_num.end_page; k++) {
                history_pageArray.push(k);
            }
        }

        if (this.state.page_num) {
            for (let k = this.state.page_num.start_page; k <= this.state.page_num.end_page; k++) {
                pageArray.push(k);
            }
        }
        if(this.state.account && this.state.account.stripe_account_id) console.log(this.state.account.stripe_account_id)
        return (
            <>
                <div className="payment-requests-body">
                    <div className="txt-24 col-black pb-20">Invoices and Payments</div>

                    {
                        !(this.state.account && this.state.account.stripe_account_id) && (
                            <div className="flex-space history-warning-message">
                                <div className="flex-warning txt-14 col-darkBlue">
                                    <img className="warning-icon" src={require('../assets/img/warning.svg')} alt=""/>
                                    <div className="payment-pl-5">
                                        No Stripe Connect account!
                                    </div>
                                </div>
                                <a className="txt-14 mouse-cursor see-details" href="/">See details</a>
                            </div>
                        )
                    }

                    <div className="flex-document documentMenu txt-14 col-disabled-shown">
                        <div
                            className={this.state.menuVisible === true ? "menuSelected menu-payment" : "menu-payment"}
                            onClick={this.profileToggleMenu}
                        >
                            Invoice
                        </div>

                        <div
                            className={this.state.menuVisible === false ? "menuSelected menu-payment" : "menu-payment"}
                            onClick={this.profileToggleMenu}
                        >
                            Payment
                        </div>
                    </div>

                    <div className="documents-card">
                        <div className="table-border">
                            {
                                this.state.menuVisible === true && this.state.requestedList && this.state.requestedList.length === 0 && (
                                    <div className="pb-20 txt-14">You do not have any outstanding payment requests. Click
                                        the create button above
                                        and to the right to get started.</div>
                                )
                            }

                            {
                                this.state.menuVisible === false && this.state.paidList && this.state.paidList.length === 0 && (
                                    <div className="pb-20 txt-14">You do not have any payment history. Click the create
                                        button above and to the
                                        right to get started.</div>
                                )
                            }

                            <table id="t05" className="txt-14" cellSpacing={0}>
                                {
                                    this.state.menuVisible === true && (
                                        <thead>
                                        <tr className="article-table">
                                            <th>No</th>
                                            <th>Payer Name</th>
                                            <th>Requested By</th>
                                            <th>Amount</th>
                                            <th>Date Requested</th>
                                            <th className="align-c">Type</th>
                                            <th className="align-c">Action</th>
                                        </tr>
                                        </thead>
                                    )
                                }

                                {
                                    this.state.menuVisible === false && (
                                        <thead>
                                        <tr className="article-table">
                                            <th>No</th>
                                            <th>Session End Date</th>
                                            <th>Payer Name</th>
                                            <th>Paid To</th>
                                            <th>Amount</th>
                                            <th>Date Paid</th>
                                            <th className="align-c">Type</th>
                                        </tr>
                                        </thead>
                                    )
                                }

                                <tbody>
                                {
                                    this.state.menuVisible === true && this.state.requestedList && this.state.requestedList.map((item, key) => {
                                        let client_list = '';
                                        for (let k = 0; k < item.clientInfo.length; k++) {
                                            client_list += item.clientInfo[k].name + ", ";
                                        }

                                        client_list = client_list.slice(0, client_list.length - 3);

                                        return (
                                            <tr key={key}
                                                className="article-table col-heavyDark mouse-cursor"
                                                onClick={() => this.showInvoiceModal(item._id, client_list, item.payment, item.notes, item.requested_date, 'Invoice',  item.editable_state)}
                                            >
                                                <td>{key + 1}</td>
                                                <td>
                                                    {
                                                        client_list
                                                    }
                                                    <div>
                                                        Appointment scheduled for
                                                        <span style={{paddingLeft: 10}}>
														{
                                                            item.start_time && (
                                                                new Date(item.start_time).toLocaleString([], {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })
                                                            )
                                                        }
													</span>
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
                                                        item.requested_date && (
                                                            new Date(item.requested_date).toLocaleString([], {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })
                                                        )
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

                                {
                                    this.state.menuVisible === false && this.state.paidList && this.state.paidList.map((item, key) => {
                                        let client_list = '';
                                        for (let k = 0; k < item.clientInfo.length; k++) {
                                            if(item.clientInfo[k] && item.clientInfo[k].name)
                                                client_list += item.clientInfo[k].name + ", ";
                                        }
                                        client_list = client_list.slice(0, client_list.length - 3);
                                        return (
                                            <tr key={key}
                                                className="article-table col-heavyDark mouse-cursor"
                                                onClick={() => this.showInvoiceModal(item._id, client_list, item.payment, item.notes, item.requested_date, 'Payment',  item.editable_state)}
                                            >
                                                <td>{key + 1}</td>
                                                <td>
                                                    {
                                                        item.actual_end && new Date(item.actual_end).toLocaleDateString([], {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        client_list
                                                    }
                                                    <div>
                                                        Appointment scheduled for
                                                        <span
                                                            className="">
														{
                                                            item.session_date ?
                                                                new Date(item.session_date).toLocaleString([], {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })
                                                                : " Payment Request"
                                                        }
                                                    </span>
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
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>

                                {
                                    this.state.menuVisible === true && this.state.requestedList && this.state.requestedList.length > 5 && (
                                        <tfoot>
                                        <tr className="article-table">
                                            <th>No</th>
                                            <th>Payer Name</th>
                                            <th>Requested By</th>
                                            <th>Amount</th>
                                            <th>Date Requested</th>
                                            <th className="align-c">Type</th>
                                            <th className="align-c">Action</th>
                                        </tr>
                                        </tfoot>
                                    )
                                }
                                {
                                    this.state.menuVisible === false && this.state.paidList.length > 5 && (
                                        <tfoot>
                                        <tr className="article-table">
                                            <th>No</th>
                                            <th>Session End Date</th>
                                            <th>Payer Name</th>
                                            <th>Paid To</th>
                                            <th>Amount</th>
                                            <th>Date Paid</th>
                                            <th className="align-c">Type</th>
                                        </tr>
                                        </tfoot>
                                    )
                                }
                            </table>
                        </div>

                        <div className="help-center-align">
                            <div className="product-btn justify-center" onClick={() => this.onPageClick(1)}>
                                <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                        fill="black" fillOpacity="0.65"/>
                                </svg>
                            </div>

                            {
                                this.state.menuVisible === true && this.state.page_num && pageArray && pageArray.map((item, key) => {
                                    return (
                                        <div
                                            className={this.state.current_page && this.state.current_page === item ? "product-btn justify-center btn-search" : "product-btn justify-center col-darkBlue"}
                                            key={key}
                                            onClick={() => this.onPageClick(item)}
                                        >
                                            {item}
                                        </div>
                                    )
                                })
                            }

                            {
                                this.state.menuVisible === false && this.state.history_page_num && history_pageArray && history_pageArray.map((item, key) => {
                                    return (
                                        <div
                                            className={this.state.history_current_page && this.state.history_current_page === item ? "product-btn justify-center btn-search" : "product-btn justify-center col-darkBlue"}
                                            key={key}
                                            onClick={() => this.onPageClick(item)}
                                        >
                                            {item}
                                        </div>
                                    )
                                })
                            }

                            <div
                                className="product-btn justify-center"
                                onClick={() => this.onPageClick(
                                    this.state.menuVisible ?
                                        this.state.page_num && this.state.page_num.total_page
                                        :
                                        this.state.history_page_num && this.state.history_page_num.total_page
                                )}
                            >
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

                {/*  Modal  */}
                <EditAppointment
                    show={this.state.show}
                    editId={this.state.edit_id}
                    name={this.state.name}
                    amount={this.state.amount}
                    handleClose={this.hideModal}
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
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        paidAppointmentList: state.registers.paidAppointmentList,
        requestedAppointmentList: state.registers.requestedAppointmentList,
        providerFullInfo: state.registers.providerFullInfo,
    }
};

export default connect(
    mapStateToProps,
    {
        paidAppointment,
        requestedAppointment,
        getFullUserByIdRole,
    }
)(Payments);
