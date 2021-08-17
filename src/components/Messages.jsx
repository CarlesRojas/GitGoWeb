import React from "react";

export default function Messages({ commits }) {
    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="messages">
            {commits.map(({ subject, commit }, i) => {
                return (
                    <div className="commit" key={commit.long}>
                        {i + " " + subject}
                    </div>
                );
            })}
        </div>
    );
}
