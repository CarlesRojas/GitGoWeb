import React, { useEffect, useState, useRef } from "react";
import classnames from "classnames";

// Components
import Tree from "./Tree";
import Messages from "./Messages";

// ROJAS REMOVE
import jsonData from "../resources/commits.json";

export default function Graph() {
    const [commits, setCommits] = useState([]);

    // #################################################
    //   CALCULATE GRAPH
    // #################################################

    // Indicates the index of each commit in the commits array
    const mappedCommits = useRef({});

    // Matrix of the branches that indicates witch positions are occupied
    const branchMatrix = useRef([]);

    // Commits that have not loaded parents
    const commitsWithNotLoadedParents = useRef([]);

    // Branches with the commits they include, and the space they occupy in the matrix
    const branches = useRef([]);

    // Number of columns
    const numColumns = useRef(0);

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

            // One Parent
            else if (sortedCommits[currCommitI].parent.length === 1) {
                // Parent commit
                var parentCommitI = mappedCommits.current[sortedCommits[currCommitI].parent[0]];

                // If parent is not loaded
                if (!parentCommitI) commitsWithNotLoadedParents.current.push(sortedCommits[currCommitI].parent[0]);
                // If parent is not already explored -> Keep exploring
                else if (!isExplored(parentCommitI)) exploreBranch(parentCommitI, branchI);
            }

            // Two Parents
            else {
                // First parent commit
                var firstParentCommitI = mappedCommits.current[sortedCommits[currCommitI].parent[0]];

                // If parent is not loaded
                if (!firstParentCommitI) commitsWithNotLoadedParents.current.push(sortedCommits[currCommitI].parent[0]);
                // If first parent is not already explored -> Keep exploring
                else if (!isExplored(firstParentCommitI)) exploreBranch(firstParentCommitI, branchI);

                // Second parent commit
                var secondParentCommitI = mappedCommits.current[sortedCommits[currCommitI].parent[1]];

                // If parent is not loaded
                if (!secondParentCommitI) commitsWithNotLoadedParents.current.push(sortedCommits[currCommitI].parent[1]);
                // If second parent is not already explored -> Start new branch with the second parent
                else if (!isExplored(secondParentCommitI)) {
                    branches.current.push({ commits: [] });
                    exploreBranch(secondParentCommitI, branches.current.length - 1);
                }
            }
        };

        // Find the max and min of each branch
        const findBranchesMinAndMax = () => {
            // Get comit branch index
            // const getCommitBranchIndex = (hash) => {
            //     for (let i = 0; i < branches.current.length; i++) if (branches.current[i].commits.includes(hash)) return true;
            // };

            for (let i = 0; i < branches.current.length; i++) {
                const firstCommitI = mappedCommits.current[branches.current[i].commits[0]];
                const lastCommitI = mappedCommits.current[branches.current[i].commits[branches.current[i].commits.length - 1]];

                // Get the min postion the branch will occupy
                if ("children" in sortedCommits[firstCommitI]) {
                    // Minimum children commit
                    var minChildren = firstCommitI;

                    for (let j = 0; j < sortedCommits[firstCommitI].children.length; j++) {
                        // Ignore children if in a branch to the right
                        const children = sortedCommits[firstCommitI].children[j];
                        // if (getCommitBranchIndex(children) > i) continue;

                        const childrenI = mappedCommits.current[children];
                        if (!childrenI) continue;
                        else minChildren = Math.min(childrenI, minChildren);
                    }
                    branches.current[i]["min"] = minChildren;
                } else branches.current[i]["min"] = firstCommitI;

                // Get the max postion the branch will occupy
                if ("parent" in sortedCommits[lastCommitI]) {
                    // Maximum parent commit
                    var maxParent = lastCommitI;

                    for (let j = 0; j < sortedCommits[lastCommitI].parent.length; j++) {
                        // Ignore children if in a branch to the right
                        const parent = sortedCommits[lastCommitI].parent[j];
                        // if (getCommitBranchIndex(parent) > i) continue;

                        const parentI = mappedCommits.current[parent];
                        if (!parentI) continue;
                        else maxParent = Math.max(parentI, maxParent);
                    }
                    branches.current[i]["max"] = maxParent;
                } else branches.current[i]["max"] = lastCommitI;
            }
        };

        // Try to place branch that spans from 'minI' to 'maxI' in the 'branch' column
        const placeBranch = (minI, maxI, branch, i) => {
            while (branch >= branchMatrix.current.length) branchMatrix.current.push(new Array(sortedCommits.length).fill(false));

            if (i > maxI) return { done: true, branch };

            if (!branchMatrix.current[branch][i]) {
                const next = placeBranch(minI, maxI, branch, i + 1);
                if (next.done) {
                    branchMatrix.current[branch][i] = true;
                    return next;
                } else return { done: false, branch };
            } else return { done: false, branch };
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

        // Sort branches
        branches.current = branches.current.sort((a, b) => {
            return b.commits.length - a.commits.length;
        });

        // Get min and max for each branch
        findBranchesMinAndMax();

        // Place branches
        for (let i = 0; i < branches.current.length; i++) {
            const { min, max } = branches.current[i];

            var result = { done: false, branch: -1 };
            for (let j = 0; true; j++) {
                result = placeBranch(min, max, j, min);
                if (result.done) break;
            }

            // Update numColumns
            if (numColumns.current < result.branch + 1) numColumns.current = result.branch + 1;

            // Save the branch index in each commit
            for (let j = 0; j < branches.current[i].commits.length; j++) {
                const commitI = mappedCommits.current[branches.current[i].commits[j]];
                sortedCommits[commitI]["column"] = result.branch;
            }
        }

        return sortedCommits;
    };

    // #################################################
    //   SELECTED COMMIT
    // #################################################

    const [selectedCommit, setSelectedCommit] = useState("");

    // On commit clicked
    const onCommitClick = (selectedHash) => {
        if (selectedHash === selectedCommit) setSelectedCommit("");
        else setSelectedCommit(selectedHash);
    };

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
    const treeDOM = hidden.tree ? null : <Tree commits={commits} numColumns={numColumns.current} mappedCommits={mappedCommits.current} />;
    const messagesDOM = hidden.messages ? null : <Messages commits={commits} />;

    return (
        <div className="graph">
            <div className="commits">
                {commits.map(({ commit }) => {
                    return <div key={commit.long} className={classnames("commit", { selected: commit.long === selectedCommit })} onClick={() => onCommitClick(commit.long)}></div>;
                })}
            </div>
            {treeDOM}
            {messagesDOM}
        </div>
    );
}
