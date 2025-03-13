import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [session, setSession] = useState(null);
  const [activeUser, setActiveUser] = useState();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        activeUser,
        setActiveUser,
        session,
        setSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
