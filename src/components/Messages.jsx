import React from "react";

export default function Messages({ commits }) {
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
