import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

// 1. Create a Context
export const AppContext = createContext(null);

// 2. Create a Provider component
export function AppProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [session, setSession] = useState(null);
  const [activePlayer, setActivePlayer] = useState(0);

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
        activePlayer,
        setActivePlayer,
        session,
        setSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
