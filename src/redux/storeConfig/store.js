import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import rootProvider from "../reducers/rootProvider";

const initialState = {};
const middleware = [thunk];
const store = createStore(
    rootProvider,
    initialState,
    compose(
        applyMiddleware(...middleware)
    )
);

export { store };