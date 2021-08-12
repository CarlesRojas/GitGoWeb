import React, { createContext } from "react";

// Data Context
export const Data = createContext();

const DataProvider = ({ children }) => {
    // #################################################
    //   PROVIDE DATA
    // #################################################

    return <Data.Provider value={{}}>{children}</Data.Provider>;
};

export default DataProvider;
