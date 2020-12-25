import React, { Component } from "react";
import FlashCard from "./flashCard";
import {connect} from "react-redux";

class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionIndex: 0,
            currentQuestion: this.props.questions && this.props.questions[0],
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.questionIndex !== prevState.questionIndex) {
            this.setState({
                currentQuestion: this.props.questions[this.state.questionIndex],
            })
        }
    }

    incrementIndex = () => {
        this.setState({
            questionIndex: this.state.questionIndex + 1,
        });
    };

    render() {
        const {
            currentQuestion
        } = this.state;

        if(!currentQuestion) {
            return <p>Quiz over.</p>;
        }

        return (
            <FlashCard
                question={currentQuestion.question}
                answer={currentQuestion.answer}
                incrementIndex={this.incrementIndex}
                _questionIndex={this.state.questionIndex}
            />
        )
    }
}
const mapStateToProps = (state) => {
    return {
    }
};

export default connect(
    mapStateToProps,
    {
    }
)(Quiz);
