import React, { useContext, useRef, useEffect, useState } from "react";
import classnames from "classnames";

// Contexts
import { Data } from "../contexts/Data";

// Icons
import BranchIcon from "../resources/icons/branch.svg";
import MergeIcon from "../resources/icons/merge.svg";
import RebaseIcon from "../resources/icons/rebase.svg";
import ResetIcon from "../resources/icons/reset.svg";

export default function CommitSelectors({ scrollRef }) {
    const { commits, mappedCommits } = useContext(Data);

    // Selected commit
    const [selectedCommit, setSelectedCommit] = useState("");

    // #################################################
    //   EVENTS
    // #################################################

    // On any context action clicked
    const onContextActionClick = (action, hash) => {
        if (action === "branch") console.log(`branch ${hash}`);
        else if (action === "merge") console.log(`merge ${hash}`);
        else if (action === "rebase") console.log(`rebase ${hash}`);
        else if (action === "reset") console.log(`reset ${hash}`);
    };

    // On commit clicked
    const onCommitClick = (selectedHash) => {
        if (selectedHash === selectedCommit) {
            setSelectedCommit("");
            window.PubSub.emit("onCommitSelected", { hash: "" });
        } else {
            setSelectedCommit(selectedHash);
            window.PubSub.emit("onCommitSelected", { hash: selectedHash });
        }
    };

    // On commit right click
    const onCommitRightClick = (event, hash) => {
        // ROJAS if the current branch is in this commit -> Dont show the menu

        // Actions
        const actions = [
            { name: "Branch", callback: () => onContextActionClick("branch", hash), icon: BranchIcon, tooltip: "create a branch on this commit" },
            { name: "Merge", callback: () => onContextActionClick("merge", hash), icon: MergeIcon, tooltip: "merge this commit into the current branch" },
            { name: "Rebase", callback: () => onContextActionClick("rebase", hash), icon: RebaseIcon, tooltip: "rebase current branch on this commit" },
            { name: "Reset", callback: () => onContextActionClick("reset", hash), icon: ResetIcon, tooltip: "reset current branch to this commit" },
        ];

        // Show context menu
        window.PubSub.emit("onShowContextMenu", { actions, mousePos: { x: event.clientX, y: event.clientY } });
    };

    // #################################################
    //   USE ARROWS TO SCROLL COMMITS
    // #################################################

    // First commit
    const firstCommitRef = useRef();

    // Select next commit
    useEffect(() => {
        const onKeyDown = (event) => {
            if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.code) > -1) {
                // Prevent scroll
                event.preventDefault();

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
                    window.PubSub.emit("onCommitSelected", { hash: commitHash });

                    scrollRef.current.scrollBy({ top: -firstCommitRef.current.clientHeight });
                }

                // Move down
                else if (event.code === "ArrowDown") {
                    // Return if in the first commit
                    if (currCommitIndex >= commits.length - 1) return; // ROJAS LOAD MORE COMMITS

                    const commitHash = commits[currCommitIndex + 1].commit.long;
                    setSelectedCommit(commitHash);
                    window.PubSub.emit("onCommitSelected", { hash: commitHash });

                    scrollRef.current.scrollBy({ top: firstCommitRef.current.clientHeight });
                }
            }
        };

        // Subscribe to event
        window.addEventListener("keydown", onKeyDown, false);

        return () => {
            // Unsubscribe from events
            window.removeEventListener("keydown", onKeyDown, false);
        };
    }, [commits, mappedCommits, selectedCommit, setSelectedCommit, scrollRef]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="commitSelectors">
            {commits.map(({ commit }) => {
                return (
                    <div
                        key={commit.long}
                        ref={(elem) => {
                            if (!firstCommitRef.current) firstCommitRef.current = elem;
                        }}
                        className={classnames("commit", "clickable", { selected: commit.long === selectedCommit })}
                        onClick={() => onCommitClick(commit.long)}
                        onContextMenu={(event) => onCommitRightClick(event, commit.long)}
                    ></div>
                );
            })}
        </div>
    );
}
