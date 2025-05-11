import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";
import { useNavigate } from "react-router-dom";

import CarouselComp from "../components/CarouselComp";
function Lobby() {
  const { lobby } = useParams();
  const { activeUser, players, setPlayers } = useContext(AppContext);
  const navigate = useNavigate();

  // Function to copy text to clipboard
  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  const channel = supabase.channel(lobby + "changes");

  const audioRef = useRef(null);

  // Function to play audio
  const playAudio = (src) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.play().catch((e) => {
        console.warn("Audio play failed:", e);
      });
    }
  };

  // Function to start the game
  function startGame() {
    channel.send({
      type: "broadcast",
      event: "start-game",
      payload: { message: "begin!!" },
    });
  }

  useEffect(() => {
    // Check if the user is logged in if not redirect to home page
    if (!activeUser) {
      navigate("/");
    }

    // Fetch players from the database
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

    // Add the current user to the lobby
    const addSelf = async () => {
      const { data, error } = await supabase.rpc("add_player_to_lobby", {
        lobby_id_input: lobby,
        new_player: activeUser.userName,
      });

      if (error) {
        console.error(error);
      } else {
        fetchPlayers();
      }
    };

    fetchPlayers();

    if (activeUser.role !== "Host" && !players.includes(activeUser.userName)) {
      addSelf();
    }

    // Listen for changes in the players list
    channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: "lobby=eq." + lobby,
        },
        (payload) => {
          setPlayers(payload.new.players);
        }
      )
      .on("broadcast", { event: "start-game" }, (payload) => {
        navigate("/game/" + lobby);
      })
      .subscribe();
  }, [lobby]);

  return (
    <div className="d-flex justify-content-center h-100 w-50 gap-5 mx-auto">
      <audio ref={audioRef} preload="auto" />

      <div className="card p-5 bg-gray-100 mt-5">
        <div className="d-flex justify-content-between">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-copy"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
              />
            </svg>
          </h1>

          {activeUser.role === "Host" ? (
            <button
              // disabled={players.length !== 4} // uncomment in in production
              className="btn btn-secondary"
              onClick={() => {
                startGame();
                navigate("/game/" + lobby);
              }}
            >
              Start Game! {players.length === 4 ? "" : players.length + "/4"}
            </button>
          ) : (
            <h3>{players.length === 4 ? "" : players.length + "/4"}</h3>
          )}
        </div>
        <div className="d-flex gap-3 pt-5">
          <div className="d-flex flex-column gap-3 " style={{ width: "18rem" }}>
            {players.map((player, idx) => {
              return (
                <div className="card p-3 d-flex">
                  <div>{idx + 1 + " " + player}</div>
                  <div></div>
                </div>
              );
            })}
          </div>
          <div id="carouselExample" className="card" style={{ width: "30rem" }}>
            <CarouselComp playAudio={playAudio}></CarouselComp>
            <div className="card-body">
              <h5 className="card-title">Character roster</h5>
              <p className="card-text">
                Each character has a unique role played in the interview day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
