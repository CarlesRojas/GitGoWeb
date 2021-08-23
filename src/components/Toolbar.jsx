import React from "react";
import SVG from "react-inlinesvg";

// Icons
import FetchIcon from "../resources/icons/fetch.svg";
import PullIcon from "../resources/icons/pull.svg";
import PushIcon from "../resources/icons/push.svg";
import BranchIcon from "../resources/icons/branch.svg";
import StashIcon from "../resources/icons/stash.svg";
import PopIcon from "../resources/icons/pop.svg";

export default function Toolbar() {
    // #################################################
    //   EVENTS
    // #################################################

    // On any button clicked
    const onActionClick = (action) => {
        if (action === "pull") console.log("pull");
        else if (action === "push") console.log("push");
        else if (action === "branch") console.log("branch");
        else if (action === "stash") console.log("stash");
        else if (action === "pop") console.log("pop");
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
    //   RENDER
    // #################################################

    return (
        <div className="toolbar">
            <div className="button clickable" onClick={() => onActionClick("push")} onMouseEnter={() => onShowTooltip("fetch changes in the remote")} onMouseLeave={onHideTooltip}>
                <SVG className="icon" src={FetchIcon} />
                <p className="action">Fetch</p>
            </div>

            <div
                className="button clickable"
                onClick={() => onActionClick("pull")}
                onMouseEnter={() => onShowTooltip("fetch & merge the remote branch to the current branch")}
                onMouseLeave={onHideTooltip}
            >
                <SVG className="icon" src={PullIcon} />
                <p className="action">Pull</p>
            </div>

            <div className="button clickable" onClick={() => onActionClick("push")} onMouseEnter={() => onShowTooltip("push this branch to its remote counterpart")} onMouseLeave={onHideTooltip}>
                <SVG className="icon" src={PushIcon} />
                <p className="action">Push</p>
            </div>

            <div className="button clickable" onClick={() => onActionClick("branch")} onMouseEnter={() => onShowTooltip("create a branch on the current commit")} onMouseLeave={onHideTooltip}>
                <SVG className="icon" src={BranchIcon} />
                <p className="action">Branch</p>
            </div>

            <div className="button clickable" onClick={() => onActionClick("stash")} onMouseEnter={() => onShowTooltip("save changes to apply them later")} onMouseLeave={onHideTooltip}>
                <SVG className="icon" src={StashIcon} />
                <p className="action">Stash</p>
            </div>

            <div className="button clickable" onClick={() => onActionClick("pop")} onMouseEnter={() => onShowTooltip("apply the changes from your stash")} onMouseLeave={onHideTooltip}>
                <SVG className="icon" src={PopIcon} />
                <p className="action">Pop</p>
            </div>
        </div>
    );
}
