import React from "react";
import SVG from "react-inlinesvg";

// Icons
import PullIcon from "../resources/icons/pull.svg";
import PushIcon from "../resources/icons/push.svg";
import BranchIcon from "../resources/icons/branch.svg";
import StashIcon from "../resources/icons/stash.svg";
import PopIcon from "../resources/icons/pop.svg";

export default function Toolbar() {
    const onActionClick = (action) => {
        if (action === "pull") console.log("pull");
        else if (action === "push") console.log("push");
        else if (action === "branch") console.log("branch");
        else if (action === "stash") console.log("stash");
        else if (action === "pop") console.log("pop");
    };

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="toolbar">
            <div className="button" onClick={() => onActionClick("pull")}>
                <SVG className="icon" src={PullIcon} />
                <p className="action">Pull</p>
            </div>

            <div className="button" onClick={() => onActionClick("push")}>
                <SVG className="icon" src={PushIcon} />
                <p className="action">Push</p>
            </div>

            <div className="button" onClick={() => onActionClick("branch")}>
                <SVG className="icon" src={BranchIcon} />
                <p className="action">Branch</p>
            </div>

            <div className="button" onClick={() => onActionClick("stash")}>
                <SVG className="icon" src={StashIcon} />
                <p className="action">Stash</p>
            </div>

            <div className="button" onClick={() => onActionClick("pop")}>
                <SVG className="icon" src={PopIcon} />
                <p className="action">Pop</p>
            </div>
        </div>
    );
}
