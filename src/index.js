import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import EventsPubSub from "./EventsPubSub";

// CSS
import "./index.scss";

// Contexts
import UtilsProvider from "./contexts/Utils";
import DataProvider from "./contexts/Data";

// Register the PubSub
window.PubSub = new EventsPubSub();

ReactDOM.render(
    <UtilsProvider>
        <DataProvider>
            <App />
        </DataProvider>
    </UtilsProvider>,
    document.getElementById("root")
);
