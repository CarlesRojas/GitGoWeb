import React, { memo } from "react";

const UncommitInfo = memo(() => {
    console.log("RENDER UNCOMMIT INFO");

    return <div className="uncommitInfo"></div>;
});

export default UncommitInfo;
