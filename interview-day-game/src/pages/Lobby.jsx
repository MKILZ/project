import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const { lobby } = useParams();
  const [players, setPlayers] = useState([]);
  const { session, setActiveUser, activeUser } = useContext(AppContext);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  useEffect(() => {
    if (!activeUser) {
      navigate("/");
    }
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

    const addSelf = async () => {
      const { data, error } = await supabase.rpc("add_player_to_lobby", {
        lobby_id_input: lobby,
        new_player: activeUser.userName,
      });

      if (error) {
        console.error(error);
      } else {
        setPlayers(players.concat(activeUser.userName));
      }
    };

    if (activeUser) {
      fetchPlayers();
    }
    if (activeUser.role !== "Host") {
      addSelf();
    }
    const games = supabase
      .channel(lobby + "playerchanges")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: "lobby=eq." + lobby,
        },
        (payload) => {
          console.log("Change received!");
          console.log(payload);
          setPlayers(payload.new.players);
        }
      )
      .subscribe();
  }, [lobby]);

  return (
    <div className="d-flex justify-content-center h-100 w-50 gap-5 mx-auto">
      <div className="card p-5 bg-gray-100 mt-5">
        <h1
          className=""
          onClick={
            //onclick copy the lobby code to clipboard
            () => {
              copyTextToClipboard(lobby);
            }
          }
        >
          Lobby: {lobby}
        </h1>

        <div>
          {players.map((player, idx) => {
            return <div>player {idx + 1 + " " + player}</div>;
          })}
        </div>
        {activeUser.role === "Host" && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              navigate("/game/" + lobby);
            }}
          >
            Start Game!
          </button>
        )}
      </div>
    </div>
  );
}

export default Lobby;
