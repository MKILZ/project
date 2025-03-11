import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
function Lobby() {
  const { lobby } = useParams();
  const room = supabase.channel(lobby, {
    config: {
      broadcast: { self: true },
    },
  });
  // useEffect(() => {
  //   room
  //     .on("presence", { event: "sync" }, () => {
  //       const newState = room.presenceState();
  //       console.log("sync", newState);
  //     })
  //     .on("presence", { event: "join" }, ({ key, newPresences }) => {
  //       console.log("join", key, newPresences);
  //     })
  //     .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
  //       console.log("leave", key, leftPresences);
  //     })
  //     .subscribe();
  // }, []);

  room.subscribe((status) => {
    // Wait for successful connection
    if (status !== "SUBSCRIBED") {
      return null;
    }
    // Send a message once the client is subscribed
    room.send({
      type: "broadcast",
      event: "test",
      payload: { message: "joined" },
    });
  });

  function messageReceived(payload) {
    console.log(payload);
  }

  // Subscribe to the Channel
  room.on("broadcast", { event: "test" }, (payload) =>
    messageReceived(payload)
  );

  console.log(lobby);
  return (
    <div>
      Lobby <div>{lobby}</div>
    </div>
  );
}

export default Lobby;
