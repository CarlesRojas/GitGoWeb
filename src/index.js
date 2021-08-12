import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// CSS
import "./index.scss";

// Contexts
import UtilsProvider from "./contexts/Utils";
import DataProvider from "./contexts/Data";

ReactDOM.render(
    <UtilsProvider>
        <DataProvider>
            <App />
        </DataProvider>
    </UtilsProvider>,
    document.getElementById("root")
);
