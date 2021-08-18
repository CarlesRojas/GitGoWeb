import React, { useEffect, useState, useRef, useContext } from "react";
import classnames from "classnames";

// Components
import Tree from "./Tree";
import Messages from "./Messages";

// ROJAS REMOVE
import commitsData from "../resources/commits.json";
import localBrancesData from "../resources/localBranches.json";
import remoteBranchesData from "../resources/remoteBranches.json";

// Contexts
import { Data } from "../contexts/Data";

export default function Graph() {
    console.log("RENDER GRAPH");

    // Contexts
    const { commits, setCommits, setLocalBranches, setRemoteBranches, mappedCommits, branchMatrix, commitsWithNotLoadedParents, branches, numColumns, selectedCommit, setSelectedCommit, colors } =
        useContext(Data);

    // #################################################
    //   CALCULATE GRAPH
    // #################################################

    // Calcualte graph. Branches & position of nodes
    const calculateGraph = (sortedCommits) => {
        // Return if there are no commits
        if (!sortedCommits.length) return [];

        // Map commits
        const mapCommits = () => {
            for (let i = 0; i < sortedCommits.length; i++) mappedCommits.current[sortedCommits[i].commit.long] = i;
        };

        // Get commits children
        const getCommitsChildren = () => {
            for (let i = 0; i < sortedCommits.length; i++) {
                for (let j = 0; j < sortedCommits[i].parent.length; j++) {
                    const parentIndex = mappedCommits.current[sortedCommits[i].parent[j]];
                    if (!parentIndex) continue;
                    if (!("children" in sortedCommits[parentIndex])) sortedCommits[parentIndex]["children"] = [];
                    sortedCommits[parentIndex]["children"].push(sortedCommits[i].commit.long);
                }
            }
        };

        // Find Start and Finish of a branch
        const exploreBranch = (currCommitI, branchI) => {
            // Check if commit has been explored
            const isExplored = (commitI) => {
                return "explored" in sortedCommits[commitI] && sortedCommits[commitI].explored;
            };

            // Set commit as explored
            sortedCommits[currCommitI].explored = true;

            // Add commit to its branch
            branches.current[branchI].commits.push(sortedCommits[currCommitI].commit.long);

            // No Parent -> Add commit to its branch and exit
            if (!("parent" in sortedCommits[currCommitI]) || sortedCommits[currCommitI].parent.length <= 0) {
                return;
            }

            // Has at least one parent
            else if (sortedCommits[currCommitI].parent.length >= 1) {
                // Parent commit
                var parentCommitI = mappedCommits.current[sortedCommits[currCommitI].parent[0]];

                // If parent is not loaded
                if (!parentCommitI) commitsWithNotLoadedParents.current.push(sortedCommits[currCommitI].parent[0]);
                // If parent is not already explored -> Keep exploring
                else if (!isExplored(parentCommitI)) exploreBranch(parentCommitI, branchI);
            }
        };

        // Find a branch min and max position
        const findBranchMinAndMax = (branchI, column) => {
            // Check if a commit is in a branch prior to this one
            const isCommitInToTheRight = (hash) => {
                for (let i = 0; i < branches.current.length; i++) if (column < branches.current[i].column && branches.current[i].commits.includes(hash)) return true;
                return false;
            };

            // Get first and last commits in the branch
            const firstCommitI = mappedCommits.current[branches.current[branchI].commits[0]];
            const lastCommitI = mappedCommits.current[branches.current[branchI].commits[branches.current[branchI].commits.length - 1]];

            // Result
            var minMax = { min: firstCommitI, max: lastCommitI };

            // Get the min postion the branch will occupy
            if ("children" in sortedCommits[firstCommitI]) {
                for (let j = 0; j < sortedCommits[firstCommitI].children.length; j++) {
                    const childrenI = mappedCommits.current[sortedCommits[firstCommitI].children[j]];
                    if (!childrenI) continue;
                    else minMax.min = Math.min(childrenI, minMax.min);
                }
                branches.current[branchI]["min"] = Math.min(sortedCommits.length - 1, minMax.min + 1);
            } else branches.current[branchI]["min"] = firstCommitI;

            // Get the max postion the branch will occupy
            if ("parent" in sortedCommits[lastCommitI]) {
                for (let j = 0; j < sortedCommits[lastCommitI].parent.length; j++) {
                    // Ignore parent if in a branch to the right
                    const parent = sortedCommits[lastCommitI].parent[j];
                    if (isCommitInToTheRight(parent)) continue;

                    const parentI = mappedCommits.current[parent];
                    if (!parentI) minMax.max = sortedCommits.length - 1;
                    else minMax.max = Math.max(parentI, minMax.max);
                }
                branches.current[branchI]["max"] = Math.max(0, minMax.max - 1);
            } else branches.current[branchI]["max"] = lastCommitI;

            return minMax;
        };

        // Try to place branch that spans from 'minI' to 'maxI' in the 'column'
        const placeBranch = (minI, maxI, column, i) => {
            while (column >= branchMatrix.current.length) branchMatrix.current.push(new Array(sortedCommits.length).fill(false));

            if (i > maxI) return { done: true, column };

            if (!branchMatrix.current[column][i]) {
                const next = placeBranch(minI, maxI, column, i + 1);

                if (next.done) {
                    branchMatrix.current[column][i] = true;
                    return next;
                } else return { done: false, column };
            } else return { done: false, column };
        };

        // Map commits
        mapCommits();

        // Get the children of each commit
        getCommitsChildren();

        // Explore Branches
        for (let i = 0; i < sortedCommits.length; i++) {
            if (!("explored" in sortedCommits[i]) || !sortedCommits[i].explored) {
                branches.current.push({ commits: [] });
                exploreBranch(i, branches.current.length - 1);
            }
        }

        // Place branches
        for (let i = 0; i < branches.current.length; i++) {
            var result = { done: false, branch: -1 };

            // Try to place as much to the left as posible
            for (let j = 0; true; j++) {
                const { min, max } = findBranchMinAndMax(i, j);
                result = placeBranch(min, max, j, min);

                // Placed successfully
                if (result.done) {
                    branches.current[i].column = result.column;
                    break;
                }
            }

            // Update numColumns
            if (numColumns.current < result.column + 1) numColumns.current = result.column + 1;

            // Save the branch index in each commit
            for (let j = 0; j < branches.current[i].commits.length; j++) {
                const commitI = mappedCommits.current[branches.current[i].commits[j]];
                sortedCommits[commitI]["column"] = result.column;
            }
        }

        return sortedCommits;
    };

    // #################################################
    //   SELECTED COMMIT
    // #################################################

    // On commit clicked
    const onCommitClick = (selectedHash) => {
        if (selectedHash === selectedCommit) setSelectedCommit("");
        else setSelectedCommit(selectedHash);
    };

    // Node refs
    const scrollRef = useRef();
    const firstCommitRef = useRef();
    const firstPressDoneRef = useRef(false);

    // Select next commit
    useEffect(() => {
        const onKeyDown = (event) => {
            if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.code) > -1) {
                // Prevent scroll
                event.preventDefault();

                // Only fire once
                if (firstPressDoneRef.current) return;
                firstPressDoneRef.current = true;

                // Return if there is no selected commit
                if (!selectedCommit) return;

                // Get current commit
                const currCommitIndex = mappedCommits.current[selectedCommit];

                // Move up
                if (event.code === "ArrowUp") {
                    // Return if in the first commit
                    if (currCommitIndex === 0) return;

                    const commitHash = commits[currCommitIndex - 1].commit.long;
                    setSelectedCommit(commitHash);

                    scrollRef.current.scrollBy({ top: -firstCommitRef.current.clientHeight });
                }

                // Move down
                else if (event.code === "ArrowDown") {
                    // Return if in the first commit
                    if (currCommitIndex >= commits.length - 1) return; // ROJAS LOAD MORE COMMITS

                    const commitHash = commits[currCommitIndex + 1].commit.long;
                    setSelectedCommit(commitHash);

                    scrollRef.current.scrollBy({ top: firstCommitRef.current.clientHeight });
                }
            }
        };

        const onKeyUp = (event) => {
            event.preventDefault();
            firstPressDoneRef.current = false;
        };

        // Subscribe to event
        window.addEventListener("keydown", onKeyDown, false);
        window.addEventListener("keyup", onKeyUp, false);

        return () => {
            // Unsubscribe from events
            window.removeEventListener("keydown", onKeyDown, false);
            window.removeEventListener("keyup", onKeyUp, false);
        };
    }, [commits, mappedCommits, selectedCommit, setSelectedCommit]);

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // Hidden components state
    const [hidden, setHidden] = useState({ tree: false, messages: false });

    // Resize timer
    const resizeTimeout = useRef();

    // Resize canvases
    const onResize = () => {
        clearTimeout(resizeTimeout.current);

        resizeTimeout.current = setTimeout(() => {
            const width = window.innerWidth;

            // Remove components
            setHidden({ tree: false, messages: width < 600 });
        }, 200);
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On component mount
    useEffect(() => {
        setLocalBranches(JSON.parse(JSON.stringify(localBrancesData)));
        setRemoteBranches(JSON.parse(JSON.stringify(remoteBranchesData)));

        setCommits(
            calculateGraph(
                JSON.parse(JSON.stringify(commitsData)).map((commit) => {
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
        // eslint-disable-next-line
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Components to render
    const treeDOM = hidden.tree ? null : <Tree commits={commits} numColumns={numColumns.current} mappedCommits={mappedCommits.current} branches={branches.current} colors={colors} />;
    const messagesDOM = hidden.messages ? null : <Messages />;

    return (
        <div className="graph" ref={scrollRef}>
            <div className="commits">
                {commits.map(({ commit }) => {
                    return (
                        <div
                            key={commit.long}
                            ref={(elem) => {
                                if (!firstCommitRef.current) firstCommitRef.current = elem;
                            }}
                            className={classnames("commit", { selected: commit.long === selectedCommit })}
                            onClick={() => onCommitClick(commit.long)}
                        ></div>
                    );
                })}
            </div>
            {messagesDOM}
            {treeDOM}

            <div className="gradient top"></div>
            <div className="gradient bottom"></div>
        </div>
    );
}
