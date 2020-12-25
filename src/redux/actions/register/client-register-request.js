import axios from "axios";
import config from "../../../config/index"
import {REQUEST_ALL, SHOW_SPINNING, INVITE_USER} from "../types/types";

export const reset = () => dispatch => {
    dispatch({
        type: INVITE_USER,
        payload: '',
    })
};

export const allClientsRequest = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/all-client-request", data)
        .then(res => {
            dispatch({
                type: REQUEST_ALL,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Failed.");
        })
};

export const acceptClientRequest = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/users/accept-request", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: INVITE_USER,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: INVITE_USER,
                payload: err.response.data.msg,
            })
        })
};

export const deleteClientRequest = (data) => dispatch => {
    axios
        .get(config.SIM_API_URL + "api/users/delete-request", { params: {deleteData: data}})
        .then(res => {
            console.log("Delete Success ! ");
            console.log(res.data.msg);
            window.location.href = "/dashboard";
        })
        .catch(err => {
            console.log("Failed.");
        })
};