import React, { createContext, useRef } from "react";

// Data Context
export const Data = createContext();

const DataProvider = ({ children }) => {
    // Colors for branches
    const colors = useRef(["#82b4ff", "#de82ff", "#ff8282", "#ffb882", "#82ffa1"]);

    // #################################################
    //   PROVIDE DATA
    // #################################################

    return <Data.Provider value={{ colors }}>{children}</Data.Provider>;
};

export default DataProvider;
