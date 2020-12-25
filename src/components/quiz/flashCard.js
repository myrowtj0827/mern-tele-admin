import React, { Component } from "react";
import { chatDescription} from "../../redux/actions/register/chatbot";
import {connect} from "react-redux";

class FlashCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description_show: false,
            showAnswer: false,
            question: this.props.question && this.props.question,
            answer: this.props.answer && this.props.answer,
            incrementIndex: this.props.incrementIndex && this.props.incrementIndex,
            _questionIndex: this.props._questionIndex && this.props._questionIndex,

            _compare: '',
        }
    }

    setShowAnswer = () => {
        this.setState({
            showAnswer: !this.state.showAnswer,
        });
    };

    onDirectoryPage = (_compare) => {
        this.setState({
            description_show: !this.state.description_show,
        });
        const {
            chatDescription
        } = this.props;

        let s = this.props._questionIndex;
        if(_compare === "Subscription and Pricing") {
            s = 0;
        } else if(_compare === "Technical Support") {
            s = 2;
        } else {
            s = 1;
        }

        const data = {
            pageShown:  !this.state.description_show,
            pageNumber: s,
        };
        if(chatDescription) {
            chatDescription(data);
        }
    };

    onNextQuestion = () => {
        this.setState({
            showAnswer: false,
            description_show: false,
        });

        const {
            incrementIndex
        } = this.props;
        incrementIndex();

        const {
            chatDescription
        } = this.props;

        const data = {
            pageShown: false,
            pageNumber: this.props._questionIndex + 1,
        };

        if(chatDescription) {
            chatDescription(data);
        }
    };

    render() {
        const {
            question, answer,
        } = this.props;
        return (
            <>
                <div
                    className="flashcard-container mouse-cursor"
                    onClick={this.setShowAnswer}
                >
                    {!this.state.showAnswer && (
                        <div className="under-line" onClick={() => this.onDirectoryPage(question)}>{question}</div>
                    )}
                    {this.state.showAnswer && (
                        <div className="" onClick={() => this.onDirectoryPage(answer)}>{answer}</div>
                    )}
                </div>
                {
                    !this.state.showAnswer && (
                        <button onClick={this.onNextQuestion} className="option-button" style={{marginTop: 20}}>
                            Next question
                        </button>
                    )
                }
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        description_page: state.registers.description_page,
    }
};

export default connect(
    mapStateToProps,
    {
        chatDescription,
    }
)(FlashCard);