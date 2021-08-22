import React, { useContext } from "react";
import moment from "moment";
import md5 from "crypto-js/md5";
import Jdenticon from "react-jdenticon";

// Contexts
import { Data } from "../contexts/Data";

export default function CommitInfo({ commit }) {
    // console.log("RENDER COMMIT INFO");

    // Contexts
    const { colors } = useContext(Data);

    // Destructure commit
    const { subject, commit: hash, parent, author, committer, column } = commit;

    // #################################################
    //   EVENTS
    // #################################################

    // On commit clicked
    const onCommitHashClick = (hash) => {
        // Show tooltip
        window.PubSub.emit("onShowTooltip", { message: "commit hash copied", instant: true });
    };

    // On parent commit clicked
    const onParentCommitHashClick = (hash) => {
        // Show tooltip
        window.PubSub.emit("onShowTooltip", { message: "parent hash copied", instant: true });
    };

    // On author elem clicked
    const onAuthorClick = (email) => {
        // Show tooltip
        window.PubSub.emit("onShowTooltip", { message: "author email copied", instant: true });
    };

    // On committer elem clicked
    const onCommiterClick = (email) => {
        // Show tooltip
        window.PubSub.emit("onShowTooltip", { message: "committer email copied", instant: true });
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
        <div className="commitInfo">
            {/* REST */}
            <p className="subject" style={{ color: colors.current[column % colors.current.length] }}>
                {subject}
            </p>

            <div className="hashContainer">
                <p className="hashTitle">Commit</p>
                <p className="hash commit clickable" onClick={() => onCommitHashClick(hash)} onMouseEnter={() => onShowTooltip("click to copy the commit hash")} onMouseLeave={onHideTooltip}>
                    {hash.long.substring(0, 9)}
                </p>
            </div>

            <div className="hashContainer">
                <p className="hashTitle">Parents</p>
                {parent &&
                    parent.map((parentHash, i) => (
                        <p
                            className="hash clickable"
                            key={parentHash}
                            onClick={() => onParentCommitHashClick(hash)}
                            onMouseEnter={() => onShowTooltip("click to copy the parent commit hash")}
                            onMouseLeave={onHideTooltip}
                        >
                            {parentHash.substring(0, 9)}
                        </p>
                    ))}
            </div>

            <div className="authorCommitter">
                <div className="elem clickable" onClick={() => onAuthorClick(author.email)} onMouseEnter={() => onShowTooltip("click to copy the author email")} onMouseLeave={onHideTooltip}>
                    <Jdenticon size="48" value={author.email} />
                    <img className="grabatar" src={`https://www.gravatar.com/avatar/${md5(author.email).toString()}?d=blank`} alt="" />

                    <p className="name">{author.name}</p>
                    <p className="title">Author</p>
                </div>

                <div className="elem clickable" onClick={() => onCommiterClick(committer.email)} onMouseEnter={() => onShowTooltip("click to copy the committer email")} onMouseLeave={onHideTooltip}>
                    <Jdenticon className="identicon" size="48" value={author.email} />
                    <img className="grabatar" src={`https://www.gravatar.com/avatar/${md5(committer.email).toString()}?d=blank`} alt="" />

                    <p className="name">{committer.name}</p>
                    <p className="title">Committer</p>
                </div>
            </div>

            <div className="dateTime">
                <p className="date">{moment(author.date).format("YYYY-MMMM-D")}</p>
                <p className="time">{moment(author.date).format("h:mm A")}</p>
            </div>

            <div className="changedFiles"></div>
        </div>
    );
}
