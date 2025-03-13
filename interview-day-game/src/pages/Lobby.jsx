import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";

function Lobby() {
  const { lobby } = useParams();
  const [players, setPlayers] = useState([]);
  const { session, setActiveUser, activeUser } = useContext(AppContext);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("games")
        .select("players")
        .eq("lobby", lobby);
      if (error) {
        console.error(error);
      } else {
        setPlayers(data[0].players);
      }
    };

    fetchPlayers();
  }, [lobby]);
  // const room = supabase.channel(lobby).on;

  // room.subscribe((status) => {
  //   // Wait for successful connection
  //   if (status !== "SUBSCRIBED") {
  //     return null;
  //   }
  //   // Send a message once the client is subscribed
  //   room.send({
  //     type: "broadcast",
  //     event: "test",
  //     payload: { message: "joined" },
  //   });
  // });

  // function messageReceived(payload) {
  //   console.log(payload);
  // }

  // // Subscribe to the Channel
  // room.on("broadcast", { event: "test" }, (payload) =>
  //   messageReceived(payload)
  // );

  return (
    <div>
      Lobby <div>{lobby}</div>
      players
      <div>
        {players.map((player, idx) => {
          return <div>player {idx + 1 + " " + player}</div>;
        })}
      </div>
    </div>
  );
}

export default Lobby;
