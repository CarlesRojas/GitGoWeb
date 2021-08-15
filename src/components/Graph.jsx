import React, { useEffect, useState, useRef } from "react";
import classnames from "classnames";

// Components
import Branches from "./Branches";
import Tree from "./Tree";
import Messages from "./Messages";

// ROJAS REMOVE
import jsonData from "../resources/commits.json";

export default function Graph() {
    const [commits, setCommits] = useState([]);
    const [selectedCommit, setSelectedCommit] = useState("");

    const onCommitClick = (selectedHash) => {
        if (selectedHash === selectedCommit) setSelectedCommit("");
        else setSelectedCommit(selectedHash);
    };

    const calculateGraph = (sortedCommits) => {
        // Return if there are no commits
        if (!sortedCommits.length) return [];

        // Branches
        var branches = [new Array(sortedCommits.length).fill(false)];

        // Find parent I index
        const findParent = (hash) => {
            for (let i = 0; i < sortedCommits.length; i++) if (sortedCommits[i].commit.long === hash) return i;
            return -1;
        };

        // Place branch
        // const placeBranch = (minI, maxI, branch, i) => {
        //     while (branch >= branches.length) branches.push(new Array(sortedCommits.length).fill(false));

        //     if (i > maxI) return true;

        //     if (!branches[branch][i]) {
        //         if (placeBranch(minI, maxI, branch, i + 1)) {
        //             branches[branch][i] = true;
        //             return true;
        //         } else return false;
        //     } else return false;
        // };

        // // Find Start and Finish of a branch
        // const getMaxI = (currCommitI, minI) => {
        //     // Set commit as explored
        //     sortedCommits[currCommitI].explored = true;

        //     // No Parent
        //     if (!("parent" in sortedCommits[currCommitI]) || sortedCommits[currCommitI].parent.length <= 0) {
        //     }

        //     // One Parent
        //     else if (sortedCommits[currCommitI].parent.length === 1) {
        //     }

        //     // Two Parents
        //     else {
        //     }

        //     for (let i = 0; i < sortedCommits[currCommitI].parent.length; i++) {
        //         const parentI = findParent(sortedCommits[currCommitI].parent[i]);

        //         // Parent not loaded
        //         if (parentI < 0) return storedCommits.le;

        //         // Parent already explored
        //         if ("explored" in sortedCommits[parentI]) return getMaxI(parentI, minI);
        //     }
        // };

        // // Get Graph
        // getMaxI(0, 0);

        // console.log(sortedCommits);

        return [];
    };

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
        setCommits(
            calculateGraph(
                JSON.parse(JSON.stringify(jsonData)).map((commit) => {
                    return { ...commit, parent: commit.parent.split(" ") };
                })
            )
        );

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

    console.log(commits);
    return (
        <div className="graph">
            <div className="commits">
                {commits.map(({ commit }) => {
                    return <div key={commit.long} className={classnames("commit", { selected: commit.long === selectedCommit })} onClick={() => onCommitClick(commit.long)}></div>;
                })}
            </div>
            {branches}
            {tree}
            {messages}
        </div>
    );
}
