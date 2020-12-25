import React, {Component} from 'react';
import {
    updateInvoice,
    resetEdit,
} from "../redux/actions/register/create-appointment";
import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class EditInvoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            payment_amount: '',
            price: '',
            client_list: '',
            flag: true,
            des_text: '',
            editable_state:'',
            request_date: new Date(),
        };
        this.onChange = this.onChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.client_list && this.state.flag === true) {
            this.setState({
                price: this.props.price && this.props.price,
                client_list: this.props.client_list && this.props.client_list,
                des_text: this.props.des_text? this.props.des_text: '',
                request_date: this.props.request_date && this.props.request_date,
                editable_state: this.props.editable_state && this.props.editable_state,
                flag: false,
            })
        }

        if(this.props.msg_invoice && prevProps.msg_invoice !== this.props.msg_invoice) {
            toast(this.props.msg_invoice);

            const {
                resetEdit
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                resetEdit();
                this.tmr = null;
            }, 4000);
        }
    }

    Cancel = () => {
        const {
            handleClose
        } = this.props;
        handleClose();

        this.setState({
            flag: true,
            price: '',
            client_list: '',
            des_text: '',
            request_date: new Date(),
        })
    };

    onUpdate = () => {
        const {
            updateInvoice
        } = this.props;

        const data = {
            id: this.props.invoice_id,
            price: this.state.price,
            notes: this.state.des_text,
        };
        if(updateInvoice) {
            updateInvoice(data);
        }
    };

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value || 0,
        })
    };

    onChangeText = (e) => {
        this.setState({
            [e.target.id]: e.target.value || '',
        })
    };

    render() {
        if(this.state.editable_state !== '') console.log("editable_state = ", this.state.editable_state)
        const showHideClassName = this.props.invoice_show ? "modal-b display-modal-block" : "modal-b display-modal-none";
        return (
            <div className={showHideClassName}>
                <div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>

                <ToastContainer />
                <section className="modal-edit-appt">
                    <div className="create-modal-header txt-18 justify-left col-white">
                        {
                            this.props.list_role && this.props.list_role
                        }
                    </div>

                    <div className="pt-45 txt-16 txt-14 col-black input-p">
                        <span>Payer</span>
                        <input
                            type="text"
                            placeholder={this.state.client_list}
                            disabled={true}
                        />
                        <span>Requested Date</span>
                        <input
                            id="request_date"
                            type="text"
                            placeholder={new Date(this.state.request_date).toLocaleDateString([], {
                                year: 'numeric',
                                month: 'long',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                            disabled={true}
                        />
                        <span>Description</span>
                        <textarea
                            id="des_text"
                            value={this.state.des_text}
                            onChange={(e) => this.onChangeText(e)}
                            disabled={this.state.editable_state !== '' && this.state.editable_state === 0 && true}
                        />
                        <span>Price</span>
                        <input
                            id="price"
                            type="number"
                            value={this.state.price}
                            onChange={(e) => this.onChange(e)}
                            disabled={this.state.editable_state !== '' && this.state.editable_state === 0 && true}
                        />

                        <span>Payment Amount</span>
                        <input
                            type="number"
                            placeholder={this.state.price}
                            disabled={true}
                        />

                        <span>Total Amount</span>
                        <input
                            type="number"
                            placeholder={this.state.price}
                            disabled={true}
                        />

                    </div>

                    <div className="modal-p flex-space edit-appt">
                        <div className="btn-cancel mouse-cursor justify-center" onClick={this.Cancel}>Cancel</div>
                        {
                            (this.state.editable_state !== '' && this.state.editable_state === 1)?
                                <div className="btn-payment mouse-cursor justify-center col-white" onClick={this.onUpdate}>Update</div>
                                :
                                <div className="btn-payment mouse-cursor justify-center col-white" style={{width: 100}} onClick={this.Cancel}>Ok</div>
                        }
                    </div>
                </section>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        msg_invoice: state.registers.msg_invoice,
        spinning: state.registers.spinning,
    }
};

export default connect(
    mapStateToProps,
    {
        updateInvoice,
        resetEdit,
    }
)(EditInvoice);