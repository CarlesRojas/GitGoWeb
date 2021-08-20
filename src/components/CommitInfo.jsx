import React, { useContext, useRef } from "react";
import moment from "moment";
import md5 from "crypto-js/md5";
import Jdenticon from "react-jdenticon";

// Contexts
import { Data } from "../contexts/Data";

export default function CommitInfo({ commit }) {
    console.log("RENDER COMMIT INFO");

    // Contexts
    const { colors } = useContext(Data);

    // Destructure commit
    const { subject, commit: hash, parent, author, committer, column } = commit;

    // #################################################
    //   TOOLTIP
    // #################################################

    // Defaults
    const tooltipDefaults = useRef({
        commitHash: { default: "click to copy the commit hash", clicked: "hash copied" },
        parentHash: { default: "click to copy the parent commit hash", clicked: "hash copied" },
        authorEmail: { default: "click to copy the author email", clicked: "email copied" },
        committerEmail: { default: "click to copy the committer email", clicked: "email copied" },
    });

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="commitInfo">
            <p className="subject" style={{ color: colors.current[column % colors.current.length] }}>
                {subject}
            </p>

            <div className="hashContainer">
                <p className="hashTitle">Commit</p>
                <p className="hash commit clickable">{hash.long.substring(0, 9)}</p>
            </div>

            <div className="hashContainer">
                <p className="hashTitle">Parents</p>
                {parent &&
                    parent.map((parentHash, i) => (
                        <p className="hash clickable" key={parentHash}>
                            {parentHash.substring(0, 9)}
                        </p>
                    ))}
            </div>

            <div className="authorCommitter">
                <div className="elem clickable">
                    <Jdenticon size="48" value={author.email} />
                    <img className="grabatar" src={`https://www.gravatar.com/avatar/${md5(author.email).toString()}?d=blank`} alt="" />

                    <p className="name">{author.name}</p>
                    <p className="title">Author</p>
                </div>

                <div className="elem clickable">
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
