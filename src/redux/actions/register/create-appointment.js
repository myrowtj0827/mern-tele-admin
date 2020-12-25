import axios from "axios";
import config from "../../../config/index"

import {
    APPOINTMENT_CLIENT_ALL,
    APPOINTMENT_PAID_ALL,
    APPOINTMENT_REQUESTED_ALL,
    APPOINTMENT_EDIT,
    INVOICE_UPDATE,
    APPOINTMENT_DELETE,
    APPOINTMENT_GET,
    APPOINTMENT_JOIN,
    APPOINTMENT_CREATE,
    APPOINTMENT_TYPE_CREATE,
    APPOINTMENT_GROUPING,
    GET_APPOINTMENT_TYPE,
    APPOINTMENT_ACCEPT,
    INVITE,
    APPOINTMENT_ONE_ONE,
    EMPTY_APPOINTMENT,
    UPDATE_REMINDERS,
    SHOW_SPINNING,
    GET_REMINDERS_ALLOW,
    APPOINTMENT_MONTH,
    APPOINTMENT_ALLOW,
    APPOINTMENT_ALLOW_MSG,
    APPOINTMENT_OUT,
    APPOINTMENT_CANCEL,
} from "../types/types";

export const reset = () => dispatch => {
    dispatch({
        type: APPOINTMENT_CREATE,
        payload: '',
    });

    dispatch({
        type: UPDATE_REMINDERS,
        payload: '',
    });

    dispatch({
        type: INVITE,
        payload: '',
    });
    dispatch({
        type: APPOINTMENT_ALLOW_MSG,
        payload: '',
    });
    dispatch({
        type: APPOINTMENT_JOIN,
        payload: '',
    });
    dispatch({
        type: APPOINTMENT_OUT,
        payload: '',
    });
    dispatch({
        type: APPOINTMENT_ACCEPT,
        payload: '',
    })
};

export const resetEdit = () => dispatch => {
    dispatch({
        type: APPOINTMENT_EDIT,
        payload: '',
    });
    dispatch({
        type: INVOICE_UPDATE,
        payload: '',
    });
    dispatch({
        type: APPOINTMENT_DELETE,
        payload: '',
    });
    dispatch({
        type: APPOINTMENT_TYPE_CREATE,
        payload: '',
    });
};

export const createAppointment = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/appointments/create-appointment", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: APPOINTMENT_CREATE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: APPOINTMENT_CREATE,
                payload: err.response.data.msg,
            });
        });
};
export const appointmentCancel = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/cancel-appointment", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_CANCEL,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            console.log("Failed.", err.toString());
        })
};
export const appointmentAccept = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/accept-appointment", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_ACCEPT,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            console.log("Failed.", err.toString());
        })
};
export const createAppointmentType = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/appointments/create-appointment-type", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: APPOINTMENT_TYPE_CREATE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: APPOINTMENT_TYPE_CREATE,
                payload:  err.response.data.msg,
            });
        });
};

export const deleteAppointmentType = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/appointments/delete-appointment-type", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: APPOINTMENT_TYPE_CREATE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: APPOINTMENT_TYPE_CREATE,
                payload: err.response.data.msg,
            });
        });
};
export const getAppointmentType = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/get-appointment-type", data)
        .then(res => {
            dispatch({
                type: GET_APPOINTMENT_TYPE,
                payload: res.data.results
            });
        })
        .catch(err => {
            console.log(err.toString());
        });
};
export const appointmentClients = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/get-clients-appointment", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_CLIENT_ALL,
                payload: res.data.results,
            });

        })
        .catch(err => {
            console.log("fail", err.toString());
        })
};
export const appointmentGrouping = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/get-appointment-grouping", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_GROUPING,
                payload: res.data.results,
            });

        })
        .catch(err => {
            console.log("fail", err.response.data.msg);
        })
};

export const paidAppointment = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/get-paid-provider", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_PAID_ALL,
                payload: res.data.results,
            });

        })
        .catch(err => {
            console.log("fail", err.toString());
        })
};

export const requestedAppointment = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/get-request-provider", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_REQUESTED_ALL,
                payload: res.data.results,
            });

        })
        .catch(err => {
            console.log("fail", err.toString());
        })
};

export const editAppointment = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/edit-appointment", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_EDIT,
                payload: res.data.msg,
            });

            window.location.href = "/appointment";
        })
        .catch(err => {
            dispatch({
                type: APPOINTMENT_EDIT,
                payload: err.response.data.msg,
            });
        })
};

export const deleteAppointment = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/cancel-appointment", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_DELETE,
                payload: res.data.msg,
            });
            window.location.href = "/appointment";
        })
        .catch(err => {
            dispatch({
                type: APPOINTMENT_DELETE,
                payload: err.response.data.msg,
            });
        })
};

export const appointmentById = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/get-appointment", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_GET,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Failed.", err.toString());
        })
};

export const joinAppointment = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/join-appointment", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_JOIN,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            console.log("Failed.", err.toString());
            dispatch({
                type: APPOINTMENT_JOIN,
                payload: err.response.data.msg,
            });
        })
};
export const outAppointment = (data) => dispatch => {
    console.log("outAppointment = ", data)
    axios
        .post(config.SIM_API_URL + "api/appointments/out-appointment", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_OUT,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({
                type: APPOINTMENT_OUT,
                payload: err.response.data.msg,
            });
        })
};

export const allowAppointment = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/allow-appointment", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_ALLOW,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Failed.", err.toString());
            dispatch({
                type: APPOINTMENT_ALLOW_MSG,
                payload: err.response.data.msg,
            });
        })
};
export const sendAllowAppointment = (data) => dispatch => {
    console.log("sendAllowAppointment = ", data);
    axios
        .post(config.SIM_API_URL + "api/appointments/send-allow-appointment", data)
        .then(res => {
            console.log(res.data.msg);
        })
        .catch(err => {
            //console.log(err.toString());
        })
};

export const updateInvoice = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/appointments/update-invoice", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: INVOICE_UPDATE,
                payload: res.data.msg,
            });
           window.location.href = "/payments";
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: INVOICE_UPDATE,
                payload: err.response.data.msg,
            });
        })
};

/**
 * Getting the appointment to one client and one provider
 * @param data
 * @returns {function(...[*]=)}
 */
export const
    getAppointmentByIds = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/appointment-one-one", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_ONE_ONE,
                payload: res.data.results,
            });
        }).catch(err => {
            console.log(err.toString());
    })
};

/**
 * Updating reminder and allow request
 */
export const updateReminderRequests = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/appointment-settings", data)
        .then(res => {
            dispatch({
                type: UPDATE_REMINDERS,
                payload: res.data.msg,
            });
        }).catch(err => {
        console.log(err.toString());
    })
};

/**
 * Getting reminder and allow settings
 */
export const getSettings = (data) => dispatch => {
     axios
        .post(config.SIM_API_URL + "api/appointments/get-allow-reminders", data)
        .then(res => {
            dispatch({
                type: GET_REMINDERS_ALLOW,
                payload: res.data.results,
            });
        }).catch(err => {
            console.log(err.toString());
    })
};
/**
 * creating empty appointment
 */
export const emptyAppointmentRequest = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/appointment-empty", data)
        .then(res => {
            dispatch({
                type: EMPTY_APPOINTMENT,
                payload: res.data.results,
            });
        }).catch(err => {
        console.log(err.toString());
    })
};

/**
 * Inviting via email or phone
 */
export const sendInvite = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/appointments/appointment-invite", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: INVITE,
                payload: res.data.msg,
            });
        }).catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            console.log(err.toString());
            dispatch({
                type: INVITE,
                payload: err.response.data.msg,
            });
        })
};

/**
 * Calendar
 */
export const appointmentMonth = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/appointments/get-month-appointment", data)
        .then(res => {
            dispatch({
                type: APPOINTMENT_MONTH,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log(err.toString());
        })
};