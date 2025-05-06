import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import Modal from "react-bootstrap/Modal";
import backgroundMusic from "/Users/marykatenussrallah/project/interview-day-game/src/assets/Local Elevator - Kevin MacLeod.mp3";


function Lobby() {
  const audioRef = useRef(null);
  const { lobby } = useParams();
  const { activeUser, players, setPlayers } = useContext(AppContext);
  const navigate = useNavigate();
  const [showLobbyFullModal, setShowLobbyFullModal] = useState(false);
  const [showDuplicateNameModal, setShowDuplicateNameModal] = useState(false);


  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }
  const channel = supabase.channel(lobby + "changes");

  function startGame() {
    channel.send({
      type: "broadcast",
      event: "start-game",
      payload: { message: "begin!!" },
    });
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.play().catch((e) => {
        console.warn("Autoplay failed:", e);
      });
    }
    if (!activeUser) {
      navigate("/");
    }
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("games")
        .select("players")
        .eq("lobby", lobby);
      // .single();

      if (error) {
        console.error("Error fetching players:", error);
        return [];
      }

      setPlayers(data[0]?.players || []);
      return data[0]?.players || [];
      // setPlayers(data.players);
      // return data.players;
      // if (error) {
      //   console.error(error);
      // } else {
      //   setPlayers(data[0].players);
      // }
    };

    const addSelf = async () => {
      const currentPlayers = await fetchPlayers();
      // If there are already 4 players in a lobby, don't let more join - have a popup alert the player trying to join
      if (currentPlayers.length >= 4) {
        setShowLobbyFullModal(true);
        return;
      }

      // If there is already a player with the name a new player is trying to use to join - alert the new player they need to use a different name
      if (currentPlayers.includes(activeUser.userName)) {
        setShowDuplicateNameModal(true);
        return;
      }

      const { error } = await supabase.rpc("add_player_to_lobby", {
        lobby_id_input: lobby,
        new_player: activeUser.userName,
      });

      // const { data, error } = await supabase.rpc("add_player_to_lobby", {
      //   lobby_id_input: lobby,
      //   new_player: activeUser.userName,
      // });

      if (error) {
        console.error("Error adding self:", error);
      } else {
        await fetchPlayers();
        //setPlayers(players.concat(activeUser.userName));
      }
    };

    fetchPlayers();

    if (activeUser.role !== "Host" && !players.includes(activeUser.userName)) {
      addSelf();
    }

    // channel
    const channelSubscription = channel
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
        console.log("Start game event received:", payload);
        navigate("/game/" + lobby);
      })
      .subscribe();

    return () => {
      channelSubscription.unsubscribe();
    }
  }, [lobby, activeUser?.userName]);

  return (
    <>
      <audio ref={audioRef} loop autoPlay>
        <source src={backgroundMusic} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="d-flex justify-content-center h-100 w-50 gap-5 mx-auto">
        <div className="card p-5 bg-gray-100 mt-5">
          <div className="d-flex justify-content-between">
            <h1
              className=""
              style={{ cursor: "pointer" }}
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
              <CarouselComp></CarouselComp>
              <div className="card-body">
                <h5 className="card-title">Character roster</h5>
                <p className="card-text">
                  Each character has a unique role played in the interview day.
                </p>
                {/* <div
                href="#"
                className="btn btn-secondary"
                onClick={() => {
                  assignCharacter(players[index], lobby);
                }}
              >
                Ready Up!
              </div> */}
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={showLobbyFullModal}
          onHide={() => {
            setShowLobbyFullModal(false);
            navigate("/");
          }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Lobby Full</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Sorry! There are already 4 players in the game.
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowLobbyFullModal(false);
                navigate("/");
              }}
            >
              OK
            </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showDuplicateNameModal}
          onHide={() => {
            setShowDuplicateNameModal(false);
            navigate("/");
          }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Name Taken</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            There's already a player with that name, try a different one :)
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowDuplicateNameModal(false);
                navigate("/");
              }}
            >
              OK
            </button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showDuplicateNameModal}
          onHide={() => {
            setShowDuplicateNameModal(false);
            navigate("/");
          }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Name Taken</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            There's already a player with that name, try a different one
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowDuplicateNameModal(false);
                navigate("/");
              }}
            >
              OK
            </button>
          </Modal.Footer>
        </Modal>

      </div>
    </>
  );
}

export default Lobby;

function CarouselComp() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          src="https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-adam-britten.jpg?itok=fAYbnhXs"
          className="d-block w-100"
          alt="adam"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-becky-barnard.jpg?itok=d8fal0xg"
          className="d-block w-100"
          alt="Bekey"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-theresa-luensmann.jpg?itok=unLlsXcF"
          className="d-block w-100"
          alt="theresa"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="https://media.licdn.com/dms/image/v2/D5603AQFJz9OJXxUNsQ/profile-displayphoto-shrink_400_400/B56ZRMqLRMH0Ao-/0/1736452912894?e=2147483647&v=beta&t=uhRnWRaaN4llVldNwHHS8qzxZgX0wUtQtaoS0iLqTrQ"
          className="d-block w-100"
          alt="kenny"
        />
      </Carousel.Item>
    </Carousel>
  );
}
