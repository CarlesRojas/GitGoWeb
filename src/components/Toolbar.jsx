import React from "react";
import SVG from "react-inlinesvg";

// Icons
import PullIcon from "../resources/icons/pull.svg";
import PushIcon from "../resources/icons/push.svg";
import BranchIcon from "../resources/icons/branch.svg";
import StashIcon from "../resources/icons/stash.svg";
import PopIcon from "../resources/icons/pop.svg";

export default function Toolbar() {
    console.log("RENDER TOOLBAR");
    return (
        <div className="toolbar">
            <div className="button">
                <SVG className="icon" src={PullIcon} />
                <p className="action">Pull</p>
            </div>

            <div className="button">
                <SVG className="icon" src={PushIcon} />
                <p className="action">Push</p>
            </div>

            <div className="button">
                <SVG className="icon" src={BranchIcon} />
                <p className="action">Branch</p>
            </div>

            <div className="button">
                <SVG className="icon" src={StashIcon} />
                <p className="action">Stash</p>
            </div>

            <div className="button">
                <SVG className="icon" src={PopIcon} />
                <p className="action">Pop</p>
            </div>
        </div>
    );
}
