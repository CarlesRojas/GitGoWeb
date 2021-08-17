import React, { useContext } from "react";

// Components
import CommitInfo from "./CommitInfo";
import UncommitInfo from "./UncommitInfo";

// Contexts
import { Data } from "../contexts/Data";

export default function Sidebar() {
    console.log("RENDER SIDEBAR");

    // Contexts
    const { selectedCommit, commits, mappedCommits } = useContext(Data);

    // Current commit
    const currCommitIndex = selectedCommit in mappedCommits.current ? mappedCommits.current[selectedCommit] : null;
    const currCommit = currCommitIndex < commits.length ? commits[currCommitIndex] : null;

    // Get the current sidebar content
    var render = currCommit ? <CommitInfo commit={currCommit} /> : <UncommitInfo />;

    // #################################################
    //   RENDER
    // #################################################

    return <div className="sidebar">{render}</div>;
}
