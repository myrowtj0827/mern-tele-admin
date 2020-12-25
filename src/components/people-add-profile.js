import React, {Component} from 'react';
import '../assets/css/dashboard.css';
import {
    acceptClientRequest,
    reset,
} from "../redux/actions/register/client-register-request";
import {
    registers,
    resetMsg,
} from "../redux/actions/register/login-register";
import {connect} from "react-redux";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class PeopleAddProfile extends Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            invite: true,
            name: '',
            email: '',
            practice_name: '',
            phone: '',
            flag: 0,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_invitation && this.props.msg_invitation !== prevProps.msg_invitation) {
            if(this.state.flag === 1) {
                this.setState({
                    flag: 1,
                });
                toast(this.props.msg_invitation);
                const {
                    reset
                } = this.props;
                clearTimeout(this.tmr);
                this.tmr = setTimeout(function () {
                    reset();
                    this.tmr = null;
                }, 3000)
            }
        }

        if(this.props.registerProvider && this.props.registerProvider !== prevProps.registerProvider) {
            toast(this.props.registerProvider);
            const {
                resetMsg,
            } = this.props;

            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                resetMsg();
                this.tmr = null;
            }, 3000)
        }
    }

    onCancel = () => {
        const {
            handleClose
        } = this.props;

        handleClose();
    };

    onSend = () => {
        if(this.props.data) {
            let chars = "abcdefghijklmnopqrstubwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            let password = '';
            for(let i=0; i< 8; i++){
                password+=chars.charAt(Math.floor(Math.random()*chars.length));
            }

            if(this.props.data.add_role === 'client') {
                this.setState({
                    flag: 1,
                });
                const {
                    acceptClientRequest
                } = this.props;

                const data = {
                    name: this.state.name,
                    email: this.state.email,
                    phone: this.state.phone,
                    provider_id: this.props.data.provider_id,
                    provider_email: this.props.data.provider_email,
                    add_role: 'client',
                    password: password,
                    confirm_password: password,
                };
                console.log(data);
                acceptClientRequest(data);
            } else if (this.props.data.add_role === 'provider') {
                const {
                    registers
                } = this.props;

                const data = {
                    provider_name: localStorage.provider_name,
                    provider_id: this.props.data.provider_id,
                    practice_name: this.state.practice_name,
                    name: this.state.name,
                    email: this.state.email,
                    phone: this.state.phone,
                    password: password,
                    confirm_password: password,
                    add_role: 'provider',
                };
                registers(data);
            }
            this.onCancel();
        }
    };

    onPhoneChange = (e) => {
        this.setState({[e.target.id]: parseFloat(e.target.value || 0)});
    };

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value || '',
        });
    };

    render() {
        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName}>
                <ToastContainer />
                <section className="profile-modal-main">
                    <div className="profile-header txt-18 justify-left col-white">
                        Add {this.props.data && this.props.data.add_role === 'client'? 'Client': 'Provider'}
                    </div>
                    <div className="modal-body txt-16 txt-medium col-darkBlue profile">
                        {
                            this.props.data.add_role !== 'client' && (
                                <>
                                    <div className="pb-10">Practice Name</div>
                                    <input
                                        id="practice_name"
                                        type="text"
                                        placeholder="Practice Name"
                                        value={this.state.practice_name}
                                        onChange={this.onChange}
                                        required
                                    />
                                </>
                            )
                        }
                        <div className="pt-10">Name</div>
                        <input
                            id="name"
                            type="text"
                            placeholder="Name"
                            value={this.state.name}
                            onChange={this.onChange}
                            required
                        />

                        <div className="pt-10">Email</div>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={this.state.email}
                            onChange={this.onChange}
                            required
                        />

                        <div className="pt-10">Phone Number</div>
                        <input
                            id={'phone'}
                            type="tel"
                            placeholder="12345678"
                            value={this.state.phone}
                            onChange={this.onPhoneChange}
                            required
                        />
                        <div className="pt-20">
                            <div className="btn-common mouse-cursor create save-cancel justify-center col-white" onClick={this.onSend}>Send</div>
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
        registerProvider: state.registers.registerProvider,
        msg_invitation: state.registers.msg_invitation,
    }
};

export default connect(
    mapStateToProps,
    {
        reset,
        acceptClientRequest,

        registers,
        resetMsg,
    }
)(PeopleAddProfile);
