import axios from "axios";
import config from "../../../config/index";

import {
    MESSAGES_LIST,
    MESSAGES_LIST_ERROR,
    MESSAGES,
    MESSAGES_EDIT,
    MESSAGES_ONE_ERROR,
    CLIENT_CONNECTED,
    LAST_MESSAGES,
} from "../types/types";

export const registerMessages = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/message/register-message", data)
        .then(res => {
        })
        .catch(err => {
            dispatch({
                type: MESSAGES,
                payload: err.response.data.msg,
            });
            console.log(err.response.data.msg);
        })
};

export const getMessagesToClientId = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/message/get-messages", data)
        .then(res => {
            dispatch({
                type: MESSAGES_LIST,
                payload: res.data.results,
            });
        })
        .catch(err => {
            dispatch({
                type: MESSAGES_LIST_ERROR,
                payload: err.response.data.msg,
            });
            console.log(err.response.data.msg);
        })
};

/**
 * Only ID, Name, and Email List of the connected clients by messages
 */
export const getConnectedClients = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/message/get-clients", data)
        .then(res => {
            if(res.data.results.length !== 0){
                dispatch({
                    type: CLIENT_CONNECTED,
                    payload: res.data.results,
                });
            }
        })
        .catch(err => {
            console.log("Failed.", err);
        })
};

/**
 * Only ID, Name, and List of the last messages with connected clients
 */
export const lastMessageList = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/message/get-last-messages", data)
        .then(res => {
            if(res.data.results.length !== 0){
                dispatch({
                    type: LAST_MESSAGES,
                    payload: res.data.results,
                });
            }
        })
        .catch(err => {
            console.log("Failed.", err);
        })
};


export const deleteMessage = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/message/delete-message", data)
        .then(res => {
            console.log(res.data.msg);
        })
        .catch(err => {
            console.log(err.response.data.msg);
        })
};

export const getEditMessage = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/message/get-edit-message", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: MESSAGES_EDIT,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log(err.response.data.msg);
            dispatch({
                type: MESSAGES_ONE_ERROR,
                payload: err.response.data.msg,
            });
        })
};

export const updateMessage = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/message/update-message", data)
        .then(res => {
            console.log(res.data.msg);
        })
        .catch(err => {
            console.log(err.response.data.msg);
        })
};

/**
 *
 */
export const getMessageOne = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/message/get-message-one", data)
        .then(res => {
            dispatch({
                type: LAST_MESSAGES,
                payload: res.data.results,
            });
        }).catch(err => {
            console.log(err.toString());
    })
};