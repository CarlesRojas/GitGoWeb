import React, { useContext, useState, useEffect } from "react";

// Components
import CommitInfo from "./CommitInfo";
import UncommitInfo from "./UncommitInfo";

// Contexts
import { Data } from "../contexts/Data";

export default function Sidebar() {
    // console.log("RENDER SIDEBAR");

    // Contexts
    const { commits, mappedCommits } = useContext(Data);

    // Selected commit
    const [selectedCommit, setSelectedCommit] = useState("");

    // Current commit
    const currCommitIndex = selectedCommit in mappedCommits.current ? mappedCommits.current[selectedCommit] : null;
    const currCommit = currCommitIndex < commits.length ? commits[currCommitIndex] : null;

    // Get the current sidebar content
    var render = currCommit ? <CommitInfo commit={currCommit} /> : <UncommitInfo />;

    // #################################################
    //   EVENTS
    // #################################################

    // On commit selected
    const onCommitSelected = ({ hash }) => {
        setSelectedCommit(hash);
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    useEffect(() => {
        // Subscribe to events
        window.PubSub.sub("onCommitSelected", onCommitSelected);

        return () => {
            // Unsubscribe to events
            window.PubSub.unsub("onCommitSelected", onCommitSelected);
        };

        // eslint-disable-next-line
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    return <div className="sidebar">{render}</div>;
}
