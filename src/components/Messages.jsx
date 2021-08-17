import React, { useContext } from "react";
import classNames from "classnames";
import SVG from "react-inlinesvg";

// Contexts
import { Data } from "../contexts/Data";

// Icons
import LocalIcon from "../resources/icons/local.svg";
import RemoteIcon from "../resources/icons/branch.svg";

export default function Messages({ commits, localBranches, remoteBranches }) {
    // Contexts
    const { colors } = useContext(Data);

    // Get the message with its branches
    const getMessage = (currentCommit) => {
        const { subject, commit: commitHash, column } = currentCommit;

        var branches = [];
        var currentBranch = false;

        // Get local branches in this commit
        for (let j = 0; j < localBranches.length; j++) {
            const { commit, current } = localBranches[j];
            if (commitHash.long.startsWith(commit)) {
                if (current) currentBranch = true;
                branches.push({ ...localBranches[j], isLocal: true });
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

        // Current commit
        // const current = currentBranch ? <div className="current" style={{ backgroundColor: colors.current[column % colors.current.length] }}></div> : null;

        return (
            <div className={classNames("commit", { current: currentBranch })} key={commitHash.long}>
                {/* {current} */}

                {branches.map(({ name, commit, isLocal, hasRemote }) => {
                    // Icons
                    const localIcon = isLocal ? <SVG className="icon" src={LocalIcon} /> : null;
                    const remoteIcon = !isLocal || hasRemote ? <SVG className="icon" src={RemoteIcon} /> : null;

                    return (
                        <div key={name + commit} className="branch" style={{ backgroundColor: colors.current[column % colors.current.length] }}>
                            {localIcon}
                            {remoteIcon}
                            {name}
                        </div>
                    );
                })}

                <div className="message" style={{ color: colors.current[column % colors.current.length] }}>
                    {subject}
                </div>
            </div>
        );
    };

    // #################################################
    //   RENDER
    // #################################################

    return <div className="messages">{commits.map(getMessage)}</div>;
}
