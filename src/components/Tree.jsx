import React, { useEffect } from "react";

export default function Tree({ commits }) {
    // #################################################
    //   SORTING COMMITS
    // #################################################

    // On component mount
    useEffect(() => {
        console.log(commits);

        const getGitGraph = (sortedCommits) => {
            // Branches
            var branches = [new Array(sortedCommits.length).fill(false)];

            // Find Start and Finish of a branch
            const findMinAndMaxHeightOfBranch = (initialCommit, minIndex) => {};

            // GetGraph
        };

        getGitGraph(commits);
    }, [commits]);

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // #################################################
    //   RENDER
    // #################################################

    return <div className="tree"></div>;
}
