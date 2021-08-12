import React from "react";

// Components
import Graph from "./components/Graph";
import Info from "./components/Info";
import Toolbar from "./components/Toolbar";

export default function App() {
    // const vscode = window.acquireVsCodeApi();

    // vscode.postMessage({
    //     command: "cmd",
    //     text: "text",
    // });

    // const recieveMessage = (message) => {
    //     console.log(message.data);
    // };

    // useEffect(() => {
    //     window.addEventListener("message", recieveMessage);
    //     return () => {
    //         window.removeEventListener("message", recieveMessage);
    //     };
    // }, []);

    return (
        <div className="app">
            <Toolbar />
            <div className="container">
                <Graph />
                <Info />
            </div>
        </div>
    );
}
