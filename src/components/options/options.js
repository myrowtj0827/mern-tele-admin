import React, {Component} from "react";

class Options extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [
                {
                    text: "Subscription and Pricing",
                    handler: props.actionProvider.handlePricing,
                    id: 1,
                },
                {
                    text: "teletherapist Training",
                    handler: props.actionProvider.handleTraining,
                    id: 2,
                },
                {
                    text: "Technical Support",
                    handler: props.actionProvider.handleTechnical,
                    id: 3,
                },
            ],
        }
    }

    render() {
        return (
            <div className="options-container">
                {
                    this.state.options.map((option) => (
                        <button key={option.id} onClick={option.handler} className="option-button">
                            {option.text}
                        </button>
                    ))
                }
            </div>
        )
    }

}
export default Options;