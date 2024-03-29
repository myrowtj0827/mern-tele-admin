import {
    SET_CURRENT_USER,
} from "../actions/types/types";

const initialState = {
    isAuthenticated: false,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                // isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        default:
            return state;
    }
}