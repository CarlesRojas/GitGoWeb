import React, { useEffect, useState, useRef } from "react";

// Components
import Branches from "./Branches";
import Tree from "./Tree";
import Messages from "./Messages";

// ROJAS REMOVE
import jsonData from "../resources/commits.json";

export default function Graph() {
    const [commits, setCommits] = useState([]);

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // Hidden components state
    const [hidden, setHidden] = useState({ branches: false, tree: false, messages: false });

    // Resize timer
    const resizeTimeout = useRef();

    // Resize canvases
    const onResize = () => {
        clearTimeout(resizeTimeout.current);

        resizeTimeout.current = setTimeout(() => {
            const width = window.innerWidth;

            // Remove components
            setHidden({ branches: width < 800, tree: false, messages: width < 600 });
        }, 200);
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On component mount
    useEffect(() => {
        setCommits(JSON.parse(JSON.stringify(jsonData)));

        // Subscribe to events
        window.addEventListener("resize", onResize);
        onResize();

        return () => {
            // Unsubscribe from events
            window.removeEventListener("resize", onResize);

            // Clear timeouts
            clearTimeout(resizeTimeout);
        };
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Components to render
    const branches = hidden.branches ? null : <Branches commits={commits} />;
    const tree = hidden.tree ? null : <Tree commits={commits} />;
    const messages = hidden.messages ? null : <Messages commits={commits} />;

    return (
        <div className="graph">
            {branches}
            {tree}
            {messages}
        </div>
    );
}
