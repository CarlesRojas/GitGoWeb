import React from "react";
import moment from "moment";
import md5 from "crypto-js/md5";
import Jdenticon from "react-jdenticon";

export default function CommitInfo({ commit }) {
    console.log("RENDER COMMIT INFO");

    const { subject, commit: hash, parent, author, committer } = commit;

    const parents = parent
        ? parent.map((parentHash) => (
              <p className="hash" key={parentHash}>
                  {parentHash.substring(0, 9)}
              </p>
          ))
        : null;

    console.log(commit);
    console.log(md5(author.email).toString());
    return (
        <div className="commitInfo">
            <p className="subject">{subject}</p>

            <div className="hash">
                <p className="hashTitle">Commit</p>
                <p className="hash">{hash.long.substring(0, 9)}</p>
            </div>

            <div className="hash">
                <p className="hashTitle">Parents</p>
                {parents}
            </div>

            <div className="authorCommitter">
                <div className="elem">
                    <Jdenticon size="48" value={author.email} />
                    <img className="grabatar" src={`https://www.gravatar.com/avatar/${md5(author.email).toString()}?d=blank`} alt="" />
                    <a href={`mailto:${author.email}`}>{author.name}</a>
                    <p>Author</p>
                </div>

                <div className="elem">
                    <Jdenticon className="identicon" size="48" value={author.email} />
                    <img className="grabatar" src={`https://www.gravatar.com/avatar/${md5(committer.email).toString()}?d=blank`} alt="" />
                    <a href={`mailto:${committer.email}`}>{committer.name}</a>
                    <p>Committer</p>
                </div>
            </div>

            <div className="dateTime">
                <p className="date">{moment(author.date).format("YYYY-MMMM-D")}</p>
                <p className="time">{moment(author.date).format("h:mm A")}</p>
            </div>
        </div>
    );
}
