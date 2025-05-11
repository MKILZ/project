import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [session, setSession] = useState(null);
  const [activeUser, setActiveUser] = useState();
  const [players, setPlayers] = useState([]);
  const [lobby, setLobby] = useState();
  const [game, setGame] = useState({
    GreatHall: {
      tables: 18,
      students: 14,
      volunteers: 14,
      staffNotAvailable: 1,
      extraStaff: 0,
      outsideQueue: 0,
      exitingTo: {
        Session: 0,
        Interview: 0,
        Welcome: 0,
        Exit: 0,
      },
    },
    Session: {
      tables: 12,
      students: 8,
      volunteers: 8,
      exits: 3,
      exiting: 0,
      staffNotAvailable: 2,
      extraStaff: 0,
      studentsWaiting: 2,
      outsideQueue: 0,
      exitingTo: {
        Welcome: 0,
        Interview: 0,
        GreatHall: 0,
        Exit: 0,
      },
    },
    Interview: {
      tables: 6,
      students: 4,
      volunteers: 4,
      exits: 2,
      exiting: 0,
      staffNotAvailable: 3,
      extraStaff: 0,
      studentsWaiting: 3,
      outsideQueue: 0,
      exitingTo: {
        Session: 0,
        Welcome: 0,
        GreatHall: 0,
        Exit: 0,
      },
    },
    Welcome: {
      tables: 13,
      students: 10,
      volunteers: 10,
      exits: 4,
      exiting: 0,
      staffNotAvailable: 1,
      extraStaff: 0,
      studentsWaiting: 0,
      outsideQueue: 0,
      exitingTo: {
        Session: 0,
        Interview: 0,
        GreatHall: 0,
        Exit: 0,
      },
    },
  });

  // Function to fetch the active user from Supabase
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
        players,
        setPlayers,
        lobby,
        setLobby,
        game,
        setGame,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
