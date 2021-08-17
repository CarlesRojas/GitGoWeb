import React, { createContext, useRef } from "react";

// Data Context
export const Data = createContext();

const DataProvider = ({ children }) => {
    // Colors for branches
    const colors = useRef(["#6ba1ff", "#d56bff", "#ff6b6b", "#ffab6b", "#ffe16b", "#70ff6b", "#6bebff"]);

    // #################################################
    //   PROVIDE DATA
    // #################################################

    return <Data.Provider value={{ colors }}>{children}</Data.Provider>;
};

export default DataProvider;
