class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
    }

    greet = (name) => {
      const message = this.createChatBotMessage("Hello " + name);
        this.addMessageToState(message);
    };

    generalMessage = (_message) => {
        const message = this.createChatBotMessage(_message);
        this.addMessageToState(message);
    };

    handlePricing = () => {
        const message = this.createChatBotMessage(
            "All our pricing information can be found in this guide:",
            {
                widget: "subscription and pricing",
            }
        );
        this.addMessageToState(message);
    };

    handleTraining = () => {
        const message = this.createChatBotMessage(
            "If you are a visual or auditory learner you'll love our training videos!",
            {
                widget: "teletherapist Training",
            }
        );
        this.addMessageToState(message);
    };

    handleTechnical = () => {
        const message = this.createChatBotMessage(
            "We are happy to help resolve any technical difficulties you might be experiencing!",
            {
                widget: "Technical Support",
            }
        );
        this.addMessageToState(message);
    };

    addMessageToState = (message) => {
        this.setState(preState => ({
            ...preState,
            messages: [...preState.messages, message],
        }));
    }
}

export default ActionProvider;