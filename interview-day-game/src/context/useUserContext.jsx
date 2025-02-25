import { useContext, createContext, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export const UserContext = createContext(null);
export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState("Ian Kuchar");

  return (
    <UserProvider
      value={{
        user,
        setUser,
      }}
    >
      {props.children}
    </UserProvider>
  );
}
