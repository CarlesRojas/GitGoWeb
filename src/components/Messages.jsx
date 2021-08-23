import React, { useContext, useRef, useEffect, useState } from "react";
import classNames from "classnames";
import SVG from "react-inlinesvg";
import md5 from "crypto-js/md5";
import Jdenticon from "react-jdenticon";

// Contexts
import { Data } from "../contexts/Data";

// Icons
import LocalIcon from "../resources/icons/local.svg";
import RemoteIcon from "../resources/icons/remote.svg";
import SelectIcon from "../resources/icons/select.svg";
import RenameIcon from "../resources/icons/rename.svg";
import DeleteIcon from "../resources/icons/delete.svg";
import PushIcon from "../resources/icons/push.svg";

export default function Messages({ numColumns }) {
    // Contexts
    const { commits, localBranches, remoteBranches, colors } = useContext(Data);

    // Message ref
    const messagesRef = useRef();
    const [showAuthor, setShowAuthor] = useState(true);

    // #################################################
    //   EVENTS
    // #################################################

    // On any context action clicked
    const onContextActionClick = (action) => {
        if (action === "select") console.log("select");
        else if (action === "rename") console.log("rename");
        else if (action === "delete") console.log("delete");
        else if (action === "push") console.log("push");
    };

    // On branch right click
    const onBranchRightClick = (event, branch) => {
        // Actions
        const actions = [
            { name: "Rename", callback: () => onContextActionClick("rename"), icon: RenameIcon, tooltip: "rename this branch" },
            { name: "Delete", callback: () => onContextActionClick("delete"), icon: DeleteIcon, tooltip: "delete this branch" },
            { name: "Push", callback: () => onContextActionClick("push"), icon: PushIcon, tooltip: "push this branch" },
        ];

        // Add select if it is not the current branch
        if (!branch.current) actions.unshift({ name: "Checkout", callback: () => onContextActionClick("select"), icon: SelectIcon, tooltip: "checkout this branch" });

        // Show context menu
        window.PubSub.emit("onShowContextMenu", { actions, mousePos: { x: event.clientX, y: event.clientY } });
    };

    // On messages resize
    const onResize = () => {
        const bounds = messagesRef.current.getBoundingClientRect();
        setShowAuthor(bounds.width > 500);
    };

    // #################################################
    //   TOOLTIP
    // #################################################

    // Show the tooltip
    const onShowTooltip = (message) => {
        window.PubSub.emit("onShowTooltip", { message, instant: false });
    };

    // Hide the tooltip
    const onHideTooltip = () => {
        window.PubSub.emit("onHideTooltip");
    };

    // #################################################
    //   BRANCHES & MESSAGE
    // #################################################

    // Get the message with its branches
    const getMessage = (currentCommit) => {
        const { subject, commit: commitHash, column, author } = currentCommit;

        var branches = [];

        // Get local branches in this commit
        for (let j = 0; j < localBranches.length; j++) {
            const { commit, current } = localBranches[j];
            if (commitHash.long.startsWith(commit)) {
                if (current) branches.unshift({ ...localBranches[j], isLocal: true });
                else branches.push({ ...localBranches[j], isLocal: true });
            }
        }

        // Get remote branches in this commit
        for (let j = 0; j < remoteBranches.length; j++) {
            const { commit, name } = remoteBranches[j];
            if (commitHash.long.startsWith(commit)) {
                // Check if there is also a local branch here
                var sameAsLocal = false;
                for (let k = 0; k < branches.length; k++) {
                    const { name: localName } = branches[k];
                    if (name === localName) {
                        sameAsLocal = true;
                        branches[k].hasRemote = true;
                        break;
                    }
                }

                if (!sameAsLocal) branches.push({ ...remoteBranches[j], isLocal: false });
            }
        }

        return (
            <div className="commit" key={commitHash.long}>
                {/* BRANCHES */}
                {branches.map((branch) => {
                    // Decostruct
                    const { name, commit, isLocal, hasRemote, current } = branch;

                    // Icons
                    const localIcon = isLocal ? <SVG className="icon" src={LocalIcon} /> : null;
                    const remoteIcon = !isLocal || hasRemote ? <SVG className="icon" src={RemoteIcon} /> : null;

                    // Color
                    const color = colors.current[column % colors.current.length];

                    return (
                        <div
                            key={name + commit}
                            className={classNames("branch", { current })}
                            style={{ "--branch-color": color }}
                            onContextMenu={(event) => onBranchRightClick(event, branch)}
                            onMouseEnter={() => onShowTooltip("double click to checkout this branch")}
                            onMouseLeave={onHideTooltip}
                        >
                            {localIcon}
                            {remoteIcon}
                            {name}
                        </div>
                    );
                })}

                {/* MESSAGE */}
                <div className="message" style={{ color: colors.current[column % colors.current.length] }}>
                    {subject}
                </div>

                {/* NAME */}
                {showAuthor && <p className="name">{author.name}</p>}

                {/* PICTURE */}
                {showAuthor && (
                    <div className="picture">
                        <Jdenticon size="48" value={author.email} />
                        <img className="grabatar" src={`https://www.gravatar.com/avatar/${md5(author.email).toString()}?d=blank`} alt="" />
                    </div>
                )}
            </div>
        );
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On component mount
    useEffect(() => {
        // Subscribe to events
        window.addEventListener("resize", onResize);
        onResize();

        return () => {
            // Unsubscribe from events
            window.removeEventListener("resize", onResize);
        };

        // eslint-disable-next-line
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div
            className="messages"
            ref={messagesRef}
            style={{ width: `calc(100% - ${numColumns * 2 + 2}rem)`, maxWidth: `calc(100% - ${numColumns * 2 + 2}rem)`, minWidth: `calc(100% - ${numColumns * 2 + 2}rem)` }}
        >
            {commits.map(getMessage)}
        </div>
    );
}
