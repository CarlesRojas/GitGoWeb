import React, { createContext, useRef, useState } from "react";

// Data Context
export const Data = createContext();

const DataProvider = ({ children }) => {
    // #################################################
    //   COMMITS
    // #################################################

    // Commits & Branches
    const [commits, setCommits] = useState([]);
    const [localBranches, setLocalBranches] = useState([]);
    const [remoteBranches, setRemoteBranches] = useState([]);

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

    // Selected commit
    const [selectedCommit, setSelectedCommit] = useState("");

    // #################################################
    //   BRANCH COLORS
    // #################################################

    // Colors
    const colors = useRef(["#6ba1ff", "#d56bff", "#ff6b6b", "#ffab6b", "#ffe16b", "#70ff6b", "#6bebff"]);

    // #################################################
    //   PROVIDE DATA
    // #################################################

    return (
        <Data.Provider
            value={{
                // COMMITS
                commits,
                setCommits,
                localBranches,
                setLocalBranches,
                remoteBranches,
                setRemoteBranches,
                mappedCommits,
                branchMatrix,
                commitsWithNotLoadedParents,
                branches,
                numColumns,
                selectedCommit,
                setSelectedCommit,

                // BRANCH COLORS
                colors,
            }}
        >
            {children}
        </Data.Provider>
    );
};

export default DataProvider;
