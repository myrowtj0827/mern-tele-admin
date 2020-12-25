import axios from "axios";
import config from "../../../config/index";

import {
    RECIPIENT_ALL,
    SENDER_ALL,
    SHARE_DOCUMENT,
    RECENT_DOCUMENT,
} from "../types/types";

export const reset = () => dispatch => {
    dispatch({
        type: SHARE_DOCUMENT,
        payload: '',
    });
};

export function fileUpload(data) {
    return axios.post(config.SIM_API_URL + "api/documents/upload", data);
}

export function imageUpload(data) {
    return axios.post(config.SIM_API_URL + "api/documents/image-upload", data);
}

export const getDocumentRecipients = () => dispatch => {
    axios
        .get(config.SIM_API_URL + "api/documents/document-provider-recipient",)
        .then(res => {
            dispatch({
                type: RECIPIENT_ALL,
                payload: res.data.results,
            });

        })
        .catch(err => {
            console.log("Failed.");
        })
};

export const getDocumentSenders = () => dispatch => {
    axios
        .get(config.SIM_API_URL + "api/documents/document-provider-sender",)
        .then(res => {
            dispatch({
                type: SENDER_ALL,
                payload: res.data.results,
            });

        })
        .catch(err => {
            console.log("Failed.");
        })
};

export const ShareDocument = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/documents/share-with", data)
        .then(res => {
            dispatch({
                type: SHARE_DOCUMENT,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            console.log("", err.response.data.msg);
            dispatch({
                type: SHARE_DOCUMENT,
                payload: err.response.data.msg,
            });
        })
};

export const getDocumentOne = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/documents/get-document-one", data)
        .then(res => {
            dispatch({
                type: RECIPIENT_ALL,
                payload: res.data.results,
            });

        })
        .catch(err => {
            console.log("Failed.");
        })
};

export const getDocumentSharedWithMe = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/documents/shared-with-me", data)
        .then(res => {
            dispatch({
                type: RECENT_DOCUMENT,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log(err.toString());
        })
};