// import external modules
import { combineReducers } from "redux";
// import internal(own) modules
import registers from "./registors";
import authProvider from "./auth-reducer";

const rootProvider = combineReducers({
    registers: registers,
    authProvider: authProvider
});

export default rootProvider;
