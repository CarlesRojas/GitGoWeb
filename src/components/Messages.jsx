import React from "react";

export default function Messages({ commits }) {
    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="messages">
            {commits.map(({ subject, commit }) => {
                return (
                    <div className="commit" key={commit.long}>
                        {subject}
                    </div>
                );
            })}
        </div>
    );
}
