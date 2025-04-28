import React from "react";
import ReactDOM from "react-dom/client";
import "./index.less";
import Vote from "./views/Vote";
import store from "./store/index";
import ThemeContext from "./ThemeContext";
import { Provider } from "react-redux";
import App from "./App";

console.log(store,'store')


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <App></App>
    </Provider>
);


