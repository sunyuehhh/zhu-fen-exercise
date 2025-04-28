import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers";
import { thunk } from "redux-thunk"; // ✅ 正确用法
import logger from "redux-logger";
import reduxPromise from 'redux-promise'

const store = createStore(reducer, applyMiddleware(thunk, logger,reduxPromise));
export default store;
