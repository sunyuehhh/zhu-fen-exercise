import React from "react";
import { HashRouter } from 'react-router-dom';
import RouterView from "./router";
import { KeepAliveProvider } from 'keepalive-react-component';
import './index.less'

const App = function App() {
    return <HashRouter>
        <KeepAliveProvider>
            <RouterView />
        </KeepAliveProvider>
    </HashRouter>;
};
export default App;