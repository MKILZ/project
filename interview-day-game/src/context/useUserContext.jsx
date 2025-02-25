// import { useContext, createContext, useState } from "react";
// import { supabase } from "../supabase/supabaseClient";

// export const UserContext = createContext(null);
// export function useUserContext() {
//   return useContext(UserContext);
// }

// export function UserProvider(props) {
//   const [user, setUser] = useState("Ian");

//   return (
//     <UserProvider.Provider
//       value={{
//         user,
//         setUser,
//       }}
//     >
//       {props.children}
//     </UserProvider.Provider>
//   );
// }

import React, { createContext, useContext, useState } from "react";

// 1. Create a Context
export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

// 2. Create a Provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
