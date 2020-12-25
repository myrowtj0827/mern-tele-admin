import React, {Component} from 'react';
import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    sendInvite, reset,
} from "../redux/actions/register/create-appointment";

class Invite extends Component {
    constructor(props) {
        super(props);

        this.tmr = null;
        this.state = {
            email: '',
            phone: '',
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_invite && this.props.msg_invite !== prevProps.msg_invite) {
            toast(this.props.msg_invite);
            const {
                reset
            } = this.props;

            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 2000)
        }
    }

    onCancel = () => {
        const {
            handleClose
        } = this.props;
        this.setState({
            email: '',
            phone: '',
        });

        handleClose();
    };

    onSend = () => {
        let array = {
            'Email Message': 1,
            'Text Message': 2,
        };
        const data = {
            _id: this.props.data.id,
            name: this.props.data.name,
            provider_phone: this.props.data.phone,
            email: this.state.email,
            phone: this.state.phone,
            type: array[this.props.data.type],
            appointment_id: this.props.data.appointment_id,
        };
        const {
            sendInvite
        } = this.props;
        if(sendInvite) {
            sendInvite(data);
        }

        this.onCancel();
    };

    onChangeEmail = (e) => {
        this.setState({
            email: e.target.value || '',
        })
    };
    onChangePhone = (e) => {
        this.setState({
            phone: e.target.value || 0,
        })
    };
    render() {
        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName}>
                <ToastContainer />
                <div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>
                <section className="profile-modal-main invite">
                    <div className="profile-header txt-18 justify-left col-white">
                        {
                            (this.props.data && this.props.data.type === "Prints")?
                                "Prints"
                                :
                                "Invite via " + this.props.data.type
                        }
                    </div>
                    <div className="modal-body txt-16 txt-medium col-darkBlue profile">
                        {
                            this.props.data && this.props.data.type !== "Text Message" && (
                                <>
                                    <div className="pt-10 pb-10">Patient email address</div>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        value={this.state.email}
                                        onChange={(e) => this.onChangeEmail(e)}
                                        required
                                    />
                                </>
                            )
                        }
                        {
                            this.props.data && this.props.data.type !== "Email Message" && (
                                <>
                                    <div className="pt-10 pb-10">Patient phone number</div>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="Please input the full number. Ex: 12345678900"
                                        value={this.state.phone}
                                        onChange={(e) => this.onChangePhone(e)}
                                        required
                                    />
                                </>
                            )
                        }

                        <div className="pt-30 pb-10">Invite to room</div>
                        <input
                            id="invite_room"
                            type="text"
                            placeholder="this.state.invite_room"
                            value={this.props.data && this.props.data.room_link}
                            disabled={true}
                        />

                        <div className="pt-30 txt-word">
                            <div className="col-buttonAndLink">Message preview</div>
                            <div className="pt-20">Hello, this is {this.props.data && this.props.data.name}
                                - please join me for a secure video call:
                            </div>
                            <div className="pt-10 col-buttonAndLink txt-12">
                                {
                                    this.props.data && this.props.data.room_link
                                }
                            </div>
                        </div>
                        <div className="pt-20">
                            {
                                this.props.data && this.props.data.type === "Prints"?
                                    <div
                                        className="btn-common mouse-cursor create save-cancel justify-center col-white"
                                        onClick={() => window.print('')}
                                    >
                                        Print
                                    </div>
                                    :
                                    <div
                                        className="btn-common mouse-cursor create save-cancel justify-center col-white"
                                        onClick={this.onSend}
                                    >
                                        Send
                                    </div>
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
        msg_invite: state.registers.msg_invite,
        spinning: state.registers.spinning,
    }
};

export default connect(
    mapStateToProps,
    {
        sendInvite,
        reset,
    }
)(Invite);
