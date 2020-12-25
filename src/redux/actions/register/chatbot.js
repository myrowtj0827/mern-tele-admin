import {
    CHATBOT_PAGE,
    SHOW_SPINNING,

    CHATBOT_ADD,
    CHATBOT_ADD_MESSAGE,
    CHATBOT_DELETE_MESSAGE,
    CHATBOT_ERROR,
    GET_CHATBOT,
    GET_REPLY,
    GET_FAIL,
} from "../types/types";
import axios from "axios";
import config from "../../../config";

export const reset = () => dispatch => {
    dispatch({
        type: CHATBOT_PAGE,
        payload: '',
    });

    dispatch({
        type: CHATBOT_ERROR,
        payload: '',
    });

    dispatch({
        type: CHATBOT_ADD_MESSAGE,
        payload: '',
    });

    dispatch({
        type: CHATBOT_DELETE_MESSAGE,
        payload: '',
    });
};

export const chatDescription = (data) => dispatch => {
    dispatch({
        type: CHATBOT_PAGE,
        payload: data,
    });
};

export const addChatbot = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/chatbot/add-chatbot", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: CHATBOT_ADD,
                payload: res.data.results,
            });
            dispatch({
                type: CHATBOT_ADD_MESSAGE,
                payload: res.data.msg,
            });
            console.log(res.data.msg);

        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: CHATBOT_ERROR,
                payload: err.response.data.msg,
            });
        })
};

export const updateChatbot = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/chatbot/update-chatbot", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: CHATBOT_ADD,
                payload: res.data.results,
            });
            dispatch({
                type: CHATBOT_ADD_MESSAGE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: CHATBOT_ERROR,
                payload: err.response.data.msg,
            });
        })
};

export const deleteChatbot = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/chatbot/delete-chatbot", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: CHATBOT_DELETE_MESSAGE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: CHATBOT_ERROR,
                payload: err.toString(),
            });
        })
};

export const getData = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/chatbot/get-chatbot", data)
        .then(res => {
            dispatch({
                type: GET_CHATBOT,
                payload: res.data.results,
            });
        })
        .catch(err => {

        })
};

export const learningBot = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/chatbot/learn-chatbot", data)
        .then(res => {
            dispatch({
                type: GET_REPLY,
                payload: res.data.results,
            });
        })
        .catch(err => {
            dispatch({
                type: GET_FAIL,
                payload: err.response.data.msg,
            });
        })
};

export async function replyBot(data) {
    return await axios.post(config.SIM_API_URL + "api/chatbot/learn-chatbot", data);
}