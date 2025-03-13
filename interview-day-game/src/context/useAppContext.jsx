import React, { createContext, useContext, useState } from "react";

// 1. Create a Context
export const AppContext = createContext(null);

// 2. Create a Provider component
export function AppProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [activePlayer, setActivePlayer] = useState(0);

  return (
    <AppContext.Provider
      value={{ theme, setTheme, activePlayer, setActivePlayer }}
    >
      {children}
    </AppContext.Provider>
  );
}
