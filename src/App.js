import React, { useEffect } from "react";

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

    // On context menu clicked
    const onContextMenu = (event) => {
        event.preventDefault();
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    useEffect(() => {
        //window.addEventListener("message", recieveMessage);
        window.addEventListener("contextmenu", onContextMenu);
        return () => {
            //window.removeEventListener("message", recieveMessage);
            window.removeEventListener("contextmenu", onContextMenu);
        };
    }, []);

    // #################################################
    //   RENDER
    // #################################################

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
