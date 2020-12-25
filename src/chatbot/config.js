import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";

import Options from "../components/options/options";
import Quiz from "../components/quiz/quiz";

const config = {
    botName: "Bot",
    initialMessages: [createChatBotMessage('Hello. What can I do for you?', {
        widget: "options",
    })],

    widgets: [
        {
            widgetName: "options",
            widgetFunc: (props) => <Options {...props} />,
        },
        {
            widgetName: "subscription and pricing",
            widgetFunc: (props) => <Quiz {...props} />,
            props: {
                questions: [
                    {
                        question: "Subscription and Pricing",
                        answer:
                            "All our pricing information can be found in this guide:",
                        id: 1,
                    },
                    {
                        question: "teletherapist Traning",
                        answer:
                            "If you are a visual or auditory learner you'll love our training videos!",
                        id: 2,
                    },
                    {
                        question: "Technical Support",
                        answer:
                            "We are happy to help resolve any technical difficulties you might be experiencing!",
                        id: 3,
                    },
                ],
            },
        },
        {
            widgetName: "teletherapist Training",
            widgetFunc: (props) => <Quiz {...props} />,
            props: {
                questions: [
                    {
                        question: "teletherapist Traning",
                        answer:
                            "If you are a visual or auditory learner you'll love our training videos!",
                        id: 2,
                    },
                    {
                        question: "Technical Support",
                        answer:
                            "We are happy to help resolve any technical difficulties you might be experiencing!",
                        id: 3,
                    },
                ],
            },
        },
        {
            widgetName: "Technical Support",
            widgetFunc: (props) => <Quiz {...props} />,
            props: {
                questions: [
                    {
                        question: "Technical Support",
                        answer:
                            "We are happy to help resolve any technical difficulties you might be experiencing!",
                        id: 3,
                    },
                ],
            },
        },
    ],
};

export default config