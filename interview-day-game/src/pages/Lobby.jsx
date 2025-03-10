import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
function Lobby() {
  const { lobby } = useParams();
  const room = supabase.channel(lobby);
  useEffect(() => {
    room
      .on("presence", { event: "sync" }, () => {
        const newState = room.presenceState();
        console.log("sync", newState);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("join", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
      })
      .subscribe();
  }, []);

  return (
    <div>
      Lobby <div>{lobby}</div>
    </div>
  );
}

export default Lobby;
