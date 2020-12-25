import React, {Component} from 'react';
import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import {
    reset,
    updateChatbot,
    deleteChatbot,
} from "../redux/actions/register/chatbot";

class ShowChatbotData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: '',
            question: '',
            id: '',
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.item !== this.props.item) {
            this.setState({
                answer: this.props.item && this.props.item.answer,
                question: this.props.item && this.props.item.origin_question,
                id: this.props.item && this.props.item._id,
            })
        }
    }

    onCancel = () => {
        const {
            handleClose
        } = this.props;

        handleClose();
        this.setState({
            answer: '',
            question: '',
            id: '',
        })
    };

    onSave = () => {
        const data = {
            id: this.state.id,
            question: this.state.question,
            answer: this.state.answer,
        };

        const {
            updateChatbot
        } = this.props;

        if(updateChatbot) {
            updateChatbot(data);
        }
        this.onCancel();
    };

    onDelete = () => {
        const data = {
            id: this.state.id,
        };

        const {
            deleteChatbot
        } = this.props;

        if(deleteChatbot) {
            deleteChatbot(data);
        }
        this.onCancel();
    };


    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value || '',
        })
    };

    render() {
        const showHideClassName = this.props.show ? "modal-b display-modal-block" : "modal-b display-modal-none";
        return (
            <div className={showHideClassName}>
                {
                    this.props.item && (
                        <section className="modal-article question">
                            <div className="create-modal-header txt-18 justify-left col-white">Question and Answer</div>

                            <div className="pt-45 pb-30 txt-16 col-blue" style={{padding: '30px 30px'}}>
                                <div className="question-answer">
                                    Question:
                                    <textarea
                                        id="question"
                                        value={this.state.question}
                                        onChange={(e) => this.onChange(e)}
                                    />
                                </div>

                                <div className="question-answer">
                                    Answer:
                                    <textarea
                                        id="answer"
                                        value={this.state.answer}
                                        onChange={(e) => this.onChange(e)}
                                    />
                                </div>

                                <div className="">
                                    {
                                        this.props.item &&  new Date(this.props.item.add_date).toLocaleDateString([], {
                                            year: 'numeric',
                                            month: 'long',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })
                                    }
                                </div>
                            </div>
                            <div className="flex-grid3 modal-grid2-gaps modal-p">
                                <div className="btn-common mouse-cursor cancel justify-center col-white" onClick={this.onCancel}>Cancel</div>
                                <div className="btn-common mouse-cursor create justify-center col-white" onClick={this.onDelete}>Delete</div>
                                <div className="btn-common mouse-cursor create justify-center col-white" onClick={this.onSave}>Save</div>
                            </div>
                        </section>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        spinning: state.registers.spinning,
        msg_add_chatbot: state.registers.msg_add_chatbot,
        msg_error_chatbot: state.registers.msg_error_chatbot,
        msg_delete_chatbot: state.registers.msg_delete_chatbot,
    }
};

export default connect(
    mapStateToProps,
    {
        reset,
        updateChatbot,
        deleteChatbot,
    }
)(ShowChatbotData);

