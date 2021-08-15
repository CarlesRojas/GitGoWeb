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

        // Find commit I index
        const findCommitIndex = (hash) => {
            for (let i = 0; i < sortedCommits.length; i++) if (sortedCommits[i].commit.long === hash) return i;
            return -1;
        };

        // Branches commits
        var branchesCommits = [];

        // Commits that have not loaded parents (BranchIndex -> CommitHash)
        var lastCommit = {};

        // Find Start and Finish of a branch
        const exploreBranch = (currCommitI, minI, branchI) => {
            // Check if commit has been explored
            const isExplored = (commitI) => {
                return "explored" in sortedCommits[commitI] && sortedCommits[commitI].explored;
            };

            // Set commit as explored
            sortedCommits[currCommitI].explored = true;

            // Add commit to its branch
            branchesCommits[branchI].commits.push(sortedCommits[currCommitI].commit.long);
            console.log(sortedCommits[currCommitI].commit.long);

            // No Parent -> Add commit to its branch and exit
            if (!("parent" in sortedCommits[currCommitI]) || sortedCommits[currCommitI].parent.length <= 0) {
                branchesCommits[branchI].max = currCommitI;
                console.log("End");
                return;
            }

            // One Parent
            else if (sortedCommits[currCommitI].parent.length === 1) {
                // Parent commit
                var parentCommitI = findCommitIndex(sortedCommits[currCommitI].parent[0]);

                // If parent is not loaded
                if (parentCommitI < 0) {
                    branchesCommits[branchI].max = currCommitI;
                    lastCommit[branchI] = sortedCommits[currCommitI].parent[0];
                    console.log("Parent Not Loaded");
                }
                // If parent is not already explored -> Keep exploring
                else if (!isExplored(parentCommitI)) exploreBranch(parentCommitI, minI, branchI);
                // Otherwise -> End of branch
                else {
                    branchesCommits[branchI].max = parentCommitI;
                    console.log("End Branch");
                }
            }

            // Two Parents
            else {
                // First parent commit
                var firstParentCommitI = findCommitIndex(sortedCommits[currCommitI].parent[0]);

                // If parent is not loaded
                if (firstParentCommitI < 0) {
                    branchesCommits[branchI].max = currCommitI;
                    lastCommit[branchI] = sortedCommits[currCommitI].parent[0];
                    console.log("Parent Not Loaded");
                }
                // If first parent is not already explored -> Keep exploring
                else if (!isExplored(firstParentCommitI)) exploreBranch(firstParentCommitI, minI, branchI);
                // Otherwise -> End of branch
                else {
                    branchesCommits[branchI].max = firstParentCommitI;
                    console.log("End Branch");
                }

                // Second parent commit
                var secondParentCommitI = findCommitIndex(sortedCommits[currCommitI].parent[1]);

                // If parent is not loaded
                if (secondParentCommitI < 0) {
                    branchesCommits[branchI].max = currCommitI;
                    lastCommit[branchesCommits.length - 1] = sortedCommits[currCommitI].parent[1];
                    console.log("Parent Not Loaded");
                }
                // If second parent is not already explored -> Start new branch with the second parent
                else if (!isExplored(secondParentCommitI)) {
                    console.log("Start Branch");
                    branchesCommits.push({ commits: [], min: currCommitI, max: currCommitI });
                    exploreBranch(secondParentCommitI, secondParentCommitI, branchesCommits.length - 1);
                }
                // Otherwise -> End of branch
                else {
                    branchesCommits[branchI].max = secondParentCommitI;
                    console.log("End Branch");
                }
            }
        };

        // Try to place branch that spans from 'minI' to 'maxI' in the 'branch' column
        const placeBranch = (minI, maxI, branch, i) => {
            while (branch >= branches.length) branches.push(new Array(sortedCommits.length).fill(false));

            if (i > maxI) return true;

            if (!branches[branch][i]) {
                if (placeBranch(minI, maxI, branch, i + 1)) {
                    branches[branch][i] = true;
                    return true;
                } else return false;
            } else return false;
        };

        // Get Branches
        for (let i = 0; i < sortedCommits.length; i++) {
            if (!("explored" in sortedCommits[i]) || !sortedCommits[i].explored) {
                branchesCommits.push({ commits: [], min: i, max: i });
                exploreBranch(i, i, branchesCommits.length - 1);
            }
        }

        // ROJAS
        // Create object with hashes as keys and the commits as values
        // Set children in each commit
        // After exploreBranch() find min and max with the farthest parent and the farthest children

        // Place branches
        // for (let i = 0; i < branchesCommits.length; i++) {
        //     const element = branchesCommits[i];
        // }

        console.log(branchesCommits);

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
