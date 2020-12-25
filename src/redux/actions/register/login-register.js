import axios from "axios";
import config from "../../../config/index"
import {
    REQUEST_PROVIDER,
    REGISTER_PROVIDER,
    SHOW_SPINNING,
    PROVIDER_INFO,
    PROVIDER_PHOTO,
    PROVIDER_FULL,
    PROVIDER_MUSIC_BACKGROUND,
    PRACTICE_LIST,

    PROVIDERS_ID,
    USER_DELETE,
    CLIENTS_ID,

    SHOW_FORGOT_PASSWORD,
    LOGIN_PROVIDER,
    SHOW_RESET_PASSWORD, SET_PRICING_PLANS, SET_CURRENT_SUBSCRIPTION,
    //SET_STRIPE_ACCOUNT_LINK,
    USERS,
    UPDATE_INFO,

    DRAG_UPDATE,
    GET_DRAG,
} from "../types/types";

export const reset = () => dispatch => {
    dispatch({
        type: UPDATE_INFO,
        payload: '',
    });
};

export const resetMsg = () => dispatch => {
    dispatch({
        type: REGISTER_PROVIDER,
        payload: "",
    });
    dispatch({
        type: LOGIN_PROVIDER,
        payload: '',
    });
    dispatch({
        type: SHOW_FORGOT_PASSWORD,
        payload: '',
    });
    dispatch({
        type: SHOW_RESET_PASSWORD,
        payload: '',
    });
    dispatch({
        type: UPDATE_INFO,
        payload: '',
    });
};

export const registers = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/users/register-provider", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: REGISTER_PROVIDER,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: REGISTER_PROVIDER,
                payload: err.response.data.msg,
            });
        })
};

export const getPractice = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-practice", data)
        .then(res => {
            dispatch({
                type: PRACTICE_LIST,
                payload: res.data.results,
            })
        }).catch(err => {
            console.log(err.toString());
        })
};

export const getRequestProvider = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-request-provider", data)
        .then(res => {
            if (res.status === 200) {
                dispatch({
                    type: REQUEST_PROVIDER,
                    payload: res.data.results,
                });
            }
        })
        .catch(err => {
            console.log(err.response);
        })
};

export const verification = (data) => dispatch => {
    console.log(data);
    axios
        .post(config.SIM_API_URL + "api/users/verification", data)
        .then(res => {
            console.log('Verification SUCCESS');
        })
        .catch(err => {
            console.log(err.toString());
        })
};

export const login = (data, history) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/users/login", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            if (res.status === 200) {
                dispatch({
                    type: LOGIN_PROVIDER,
                    payload: res.data.msg,
                });

                localStorage.setItem("role", 'provider');
                localStorage.setItem("provider", true);
                localStorage.setItem("provider_id", res.data.results._id);
                localStorage.setItem("provider_name", res.data.results.name);
                localStorage.setItem("provider_email", res.data.results.email);
                history.push("/dashboard");
                //window.location.href = "/dashboard";
            }
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: LOGIN_PROVIDER,
                payload: err.response.data.msg,
            });
            console.log(err.response.data.msg);
        })
};

export const logout = (data, history) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/logout", data)
        .then(res => {
            if (res.status === 200) {
                localStorage.setItem("role", '');
                localStorage.setItem("provider", '');
                localStorage.setItem("provider_id", '');
                localStorage.setItem("provider_name", '');
                localStorage.setItem("provider_email", '');
                window.location.href = "/login";
                //history.push("/login");
            }
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
};

export const forgot = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/users/forgot-password", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            if (res.status === 200) {
                dispatch({
                    type: SHOW_FORGOT_PASSWORD,
                    payload: res.data.msg,
                })
            }
            console.log(res.data.msg);
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: SHOW_FORGOT_PASSWORD,
                payload: err.response.data.msg,
            });
            console.log(err.response.data.msg);
        })
};

export const resetPassword = (data, history) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/reset-password", data)
        .then(res => {
            if (res.status === 200) {
                dispatch({
                    type: SHOW_RESET_PASSWORD,
                    payload: res.data.msg,
                });

                if (data.flag === "profile") {

                } else {
                    history.push("/login");
                }
            }
        })
        .catch(err => {
            dispatch({
                type: SHOW_RESET_PASSWORD,
                payload: err.response.data.msg,
            });
            console.log(err.toString());
        })
};

/**
 * Only ID, Email, and Name of the provider ID
 */
export const getProviderByIdRole = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-simple-user", data)
        .then(res => {
            if (res.data.results !== 'database initialize') {
                dispatch({
                    type: PROVIDER_INFO,
                    payload: res.data.results,
                });
            } else {
                localStorage.setItem("role", '');
                localStorage.setItem("provider", '');
                localStorage.setItem("provider_id", '');
                localStorage.setItem("provider_name", '');
                localStorage.setItem("provider_email", '');
                window.location.href = "/login";
            }
        })
        .catch(err => {
            console.log("Failed -> ", err.toString());
        })
};

/**
 * Only ID, Email, Name, and photo according to the provider ID
 */
export const getPhotoByIdRole = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-photo-user", data)
        .then(res => {
            dispatch({
                type: PROVIDER_PHOTO,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Failed -> ", err.toString());
        })
};

/**
 * One Full Information the provider ID
 */
export const getFullUserByIdRole = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-info-user", data)
        .then(res => {
            dispatch({
                type: PROVIDER_FULL,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Failed -> ", err.toString());
        })
};

/**
 * User Information Updating
 */
export const providerInfoUpdate = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/users/user-profile", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            if (data.localUpdate !== false) {
                // Not the user logged in, so client
                localStorage.setItem("provider", true);
                localStorage.setItem("provider_id", data.id);
                localStorage.setItem("provider_name", data.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()),);
                localStorage.setItem("provider_email", data.email);
            }
            dispatch({
                type: UPDATE_INFO,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
			dispatch({
				type: UPDATE_INFO,
				payload: err.response.data.msg,
			});
        })
};

export const userAddressUpdate = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/users/address-update", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            // dispatch({
            // 	type: SET_STRIPE_ACCOUNT_LINK,
            // 	payload: res.data.accountLink,
            // });
            console.log("Set-up account:", res.data.accountLink);
            dispatch({
                type: UPDATE_INFO,
                payload: res.data.msg,
            });

            if (data.role === 'provider') {
                window.open(res.data.accountLink, "_new");
            }
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: UPDATE_INFO,
                payload: err.response.data.msg,
            });
        })
};

export const providerAboutUpdate = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/users/about-update", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: UPDATE_INFO,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
                dispatch({
                    type: UPDATE_INFO,
                    payload: err.response.data.msg,
                });
        })
};

/**
 * Room background Image update
 */
export const roomImg = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/room-image", data)
        .then(res => {
            if (res.status === 200) {
                console.log(res.data.msg);
            }
        })
        .catch(err => {
            if (err.status === 400) {
                console.log(err.response.data.msg);
            }
        })
};

export const musicImageByIdRole = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-background-user", data)
        .then(res => {
            dispatch({
                type: PROVIDER_MUSIC_BACKGROUND,
                payload: res.data.results,
            });
            console.log(res.data.msg);

        })
        .catch(err => {
            if (err.status === 400) {
                console.log(err.response.data.msg);
            }
        })
};

/**
 * Only ID, Name, and Email List according to role
 */
export const getSimpleClients = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-users", data)
        .then(res => {
            if (res.data.results.length !== 0) {
                dispatch({
                    type: CLIENTS_ID,
                    payload: res.data.results,
                });
            }
            console.log(res.data.results);
        })
        .catch(err => {
            console.log("Failed.", err);
        })
};

/**
 * Only ID, Name, Email, phone number List according to role
 */
export const getSimpleUsers = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-user-list", data)
        .then(res => {
            if (res.data.results.length !== 0) {
                dispatch({
                    type: USERS,
                    payload: res.data.results,
                });
            }
            console.log(res.data.results);
        })
        .catch(err => {
            console.log("Failed.", err);
        })
};

export const getSimpleProviders = (data) => dispatch => {
    axios
        .get(config.SIM_API_URL + "api/users/get-users", data)
        .then(res => {
            dispatch({
                type: PROVIDERS_ID,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log(err.toString());
        })
};

export const deleteUser = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/delete-user", data)
        .then(res => {
            dispatch({
                type: USER_DELETE,
                payload: res.data.msg,
            });

            if (data.role === "client") {
                window.location.href = "/client-management";
            } else {
                window.location.href = "/provider-management";
            }

        })
        .catch(err => {
            console.log("Failed.", err.toString());
        })
};

export const getPricingPlans = () => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/payment/get-plans", {})
        .then(res => {
            dispatch({
                type: SET_PRICING_PLANS,
                payload: res.data.plans,
            });
        })
        .catch(err => {
            console.log("Failed.");
        })
};

export const getCurrentSubscription = info => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/payment/current-subscription", info)
        .then(res => {
            console.log(res.data.results);
            dispatch({
                type: SET_CURRENT_SUBSCRIPTION,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log(err.toString());
        })
};

export const createSubscription = info => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/payment/create-subscription", info)
        .then(res => {
            console.log(res.data.results);
            dispatch({
                type: SET_CURRENT_SUBSCRIPTION,
                payload: res.data.results,
            });
            dispatch({type: SHOW_SPINNING, payload: false});
        })
        .catch(err => {
            console.log(err.toString());
            dispatch({type: SHOW_SPINNING, payload: false});
        })
};

/**
 * Drag
 * @param data
 * @returns {function(...[*]=)}
 */
export const updateDragDrop = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/drag-update", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: DRAG_UPDATE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            console.log("fail", err.toString());
        })
};

export const getDragList = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-drag", data)
        .then(res => {
            dispatch({
                type: GET_DRAG,
                payload: res.data.results,
            });

        })
        .catch(err => {
            console.log("fail", err.toString());
        })
};

/**
 * Accept terms and conditions
 */
export const acceptTerms = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/accept-terms", data)
        .then(res => {
            console.log(res.data.msg, "accept-terms");
        })
        .catch(err => {
            console.log("fail", err.toString());
        })
};