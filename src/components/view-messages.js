import React, {Component} from 'react';
import '../assets/css/views.css';
import {connect} from "react-redux";
import {
    registerMessages,
    getMessagesToClientId,
    getConnectedClients,
    deleteMessage,
    getEditMessage,
    updateMessage,
} from "../redux/actions/register/messages";
class ViewMessages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            client_id: '',
            messagesList: '',
            message: '',

            connectedList: '',
            flag_send: false,
            get_message_id: '',
        };
        this.registerMessages = this.registerMessages.bind(this);
    }

    componentDidMount() {
        const {
            getConnectedClients,
        } = this.props;

        if(getConnectedClients) {
            const data = {
                id: localStorage.provider_id,
            };
            getConnectedClients(data);
        }

        if (this.props.match.params.id) {
            this.setState({
                client_id: this.props.match.params.id,
            });

            const {
                getMessagesToClientId,
            } = this.props;

            if (getMessagesToClientId) {
                const data = {
                    id1: localStorage.provider_id,
                    id2: this.props.match.params.id,
                };
                getMessagesToClientId(data);
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.connected_clients && this.props.connected_clients !== prevProps.connected_clients) {
            this.setState({
                connectedList: this.props.connected_clients,
            });

            if (this.state.client_id === '') {
                if (this.props.match.params.id) {
                    this.setState({
                        client_id: this.props.match.params.id,
                    });
                } else {
                    this.setState({
                        client_id: this.props.connected_clients[0].id,
                    });
                }

                const {
                    getMessagesToClientId,
                } = this.props;

                if (getMessagesToClientId) {
                    const data = {
                        id1: localStorage.provider_id,
                        id2: this.props.connected_clients[0].id,
                    };
                    getMessagesToClientId(data);
                }
            }
        }

        if(this.state.flag_send !== prevState.flag_send && this.props.connected_clients) {
            const {
                getMessagesToClientId,
            } = this.props;

            if (getMessagesToClientId) {
                const data = {
                    id1: localStorage.provider_id,
                    id2: this.state.client_id,
                };
                getMessagesToClientId(data);
            }
        }

        if (this.props.messageList && this.props.messageList !== prevProps.messageList) {
            this.setState({
                messagesList: this.props.messageList,
            })
        }

        if(this.props.getEdit && this.props.getEdit !== prevProps.getEdit) {
            this.setState({
                get_message_id: this.props.getEdit._id,
            });

            this.setState({
                message: this.props.getEdit.message,
            })
        }
    }

    onChangeMessage = (e) => {
        this.setState({
            [e.target.id]: e.target.value || '',
        })
    };

    onEnter = (code) => {
        if (code.keyCode === 13) {
            this.registerMessages();
        }
    };

    onDisplayMessages = (e) => {
        this.setState({
            client_id: e.target.value || '',
        });

        const {
            getMessagesToClientId,
        } = this.props;

        if (getMessagesToClientId) {
            const data = {
                id1: localStorage.provider_id,
                id2: e.target.value || '',
            };
            getMessagesToClientId(data);
        }
        this.props.history.push('/view-messages');
    };

    registerMessages = () => {
        if(this.state.message === '') {
            this.setState({
                get_message_id: '',
            });
            return;
        }

        this.setState({
            flag_send: !this.state.flag_send,
        });

        const {
            registerMessages,
        } = this.props;

        if(this.state.get_message_id !== '') {
            const {
                updateMessage
            } = this.props;

            const data = {
                id: this.state.get_message_id,
                message: this.state.message,
            };

            if(updateMessage) {
                updateMessage(data)
            }

            this.setState({
                get_message_id: '',
                message: '',
            })
        } else {
            if (registerMessages) {
                const data = {
                    sender_id: localStorage.provider_id,
                    recipient_id: this.state.client_id,
                    message: this.state.message,
                };

                this.setState({
                    message: '',
                });

                registerMessages(data);
            }
        }
    };

    onEdit = (id) => {
        const data ={
            id: id,
        };

        const {
            getEditMessage
        } = this.props;

        if(getEditMessage) {
            getEditMessage(data);
        }
    };

    onDelete = (id) => {
        const data ={
            id: id,
        };

        this.setState({
            flag_send: !this.state.flag_send,
        });

        const {
            deleteMessage
        } = this.props;

        if(deleteMessage) {
            deleteMessage(data);
        }
    };

    render() {
        let tempTime = 0;
        return (
            <>
                <div className="justify-left message-select pb-30">
                    <div className="txt-24 col-black align-left" style={{paddingRight: 15}}>Messages
                        with </div>

                    <select
                        className="category-sel sel-message col-black"
                        onChange={this.onDisplayMessages}
                    >
                        {
                            this.state.connectedList && this.state.connectedList.map((item, key) => (
                                this.props.match.params.id && this.props.match.params.id === item.id?
                                    <option key={key} value={item.id} selected>{item.name}</option>
                                    :
                                    <option key={key} value={item.id}>{item.name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="message-txt">
                    {
                        this.state.messagesList && this.state.messagesList.item.map((item, key) => {
                            let time_flag = 0;

                            if (tempTime !== item.messageDate) {
                                tempTime = item.messageDate;
                                time_flag = 1;
                            }
                            return (
                                <div key={key}>
                                    <div className="pt-20 align-center txt-12 col-buttonAndLink pb-10">
                                        {
                                            time_flag === 1 && tempTime
                                        }
                                    </div>
                                    <div className="justify-left" >
                                        <div className="msg-navbar mouse-cursor msg-dropdown">
                                            <img className="message-drop" src={require('../assets/img/message-menu.svg')} alt="" />

                                            <div className="msg-dropdown-content col-white">
                                                <div className="edit-delete" onClick={() => item.sender_id === localStorage.provider_id && this.onEdit(item._id)}>
                                                    Edit
                                                </div>
                                                <div className="edit-delete" onClick={() => item.sender_id === localStorage.provider_id && this.onDelete(item._id)}>
                                                    Delete
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            item.sender_id === localStorage.provider_id?
                                                <img
                                                    className="icon-size"
                                                    src={
                                                        this.state.messagesList.user1.photo
                                                            ?
                                                            this.state.messagesList.user1.photo
                                                            :
                                                            require('../assets/img/account.svg')}
                                                    alt=""
                                                />
                                                :
                                                <img
                                                    className="icon-size"
                                                    src={
                                                        this.state.messagesList.user2.photo
                                                            ?
                                                            this.state.messagesList.user2.photo
                                                            :
                                                            require('../assets/img/account.svg')}
                                                    alt=""
                                                />
                                        }
                                        <div className="justify-center">
                                            <div className="user-commit">
                                                <div className="message-user txt-16 col-darkBlue">
                                                    <div className="rectangle-trans-message"></div>
                                                    {item.message}
                                                </div>
                                                <div className="txt-10 col-heavyDark align-left pl-10">
                                                    {
                                                        item.sender_id === localStorage.provider_id?
                                                            this.state.messagesList.user1.name
                                                            :
                                                            this.state.messagesList.user2.name
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="flex-space" style={{marginBottom: 50}}>
                    <input
                        id="message"
                        className="view-message"
                        placeholder="Input the message"
                        value={this.state.message}
                        onKeyUp={event => this.onEnter(event)}
                        onChange={this.onChangeMessage}
                    />
                    <div className="btn-common col-white txt-16 mouse-cursor" onClick={this.registerMessages}>Send</div>
                </div>
            </>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        messageList: state.registers.messageList,
        message: state.registers.message,
        connected_clients: state.registers.connected_clients,
        getEditError: state.registers.getEditError,
        getEdit: state.registers.getEdit,
    }
};

export default connect(
    mapStateToProps,
    {
        registerMessages,
        getMessagesToClientId,
        getConnectedClients,
        deleteMessage,
        getEditMessage,
        updateMessage,
    }
)(ViewMessages);