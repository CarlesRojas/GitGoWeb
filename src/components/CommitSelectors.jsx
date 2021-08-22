import React, { useContext, useRef, useEffect, useState } from "react";
import classnames from "classnames";

// Contexts
import { Data } from "../contexts/Data";

export default function CommitSelectors({ scrollRef }) {
    const { commits, mappedCommits } = useContext(Data);

    // Selected commit
    const [selectedCommit, setSelectedCommit] = useState("");

    // #################################################
    //   EVENTS
    // #################################################

    // On commit clicked
    const onCommitClick = (selectedHash) => {
        if (selectedHash === selectedCommit) {
            setSelectedCommit("");
        } else {
            setSelectedCommit(selectedHash);
            window.PubSub.emit("onCommitSelected", { hash: selectedHash });
        }
    };

    // On commit right click
    const onCommitRightClick = (selectedHash) => {
        console.log(`menu ${selectedHash}`);
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
                        onContextMenu={() => onCommitRightClick(commit.long)}
                    ></div>
                );
            })}
        </div>
    );
}
