import { useEffect, useContext, useState, useCallback } from "react";
import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { arrivalsData } from "../data/ArrivalsData";
import ArrivalsPopup from "../components/ArrivalsPopup";
import ManageArrivalsPopup from "../components/ManageArrivalsPopup";
import Department from "../components/Department";

function Game() {
  const { lobby } = useParams();
  const hoursInDay = 7;
  const channel = supabase.channel(lobby + "changes");
  const { activeUser, setActiveUser, players, setPlayers } =
    useContext(AppContext);
  const [scoreCardModal, setScoreCardModal] = useState(false);
  const [settingsModalShow, setSettingsModalShow] = useState(false);
  const [arrivalsPopup, setArrivalsPopup] = useState(false);
  const [manageArrivalsPopup, setManageArrivalsPopup] = useState(false);
  const [readyToExitPopup, setReadyToExitPopup] = useState(false);
  const [round, setRound] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showRoundOverlay, setShowRoundOverlay] = useState(round);

  const [readyPlayers, setReadyPlayers] = useState([]);
  const [game, setGame] = useState({
    GreatHall: {
      tables: 16,
      students: 14,
      volunteers: 14,
      exits: 1,
      exiting: 0,
      staffNotAvailable: 1,
      extraStaff: 0,
      studentsWaiting: 4,
    },
    Session: {
      tables: 8,
      students: 8,
      volunteers: 8,
      exits: 3,
      exiting: 0,
      staffNotAvailable: 2,
      extraStaff: 0,
      studentsWaiting: 2,
    },
    Interview: {
      tables: 4,
      students: 4,
      volunteers: 4,
      exits: 2,
      exiting: 0,
      staffNotAvailable: 3,
      extraStaff: 0,
      studentsWaiting: 3,
    },
    Welcome: {
      tables: 12,
      students: 10,
      volunteers: 10,
      exits: 4,
      exiting: 0,
      staffNotAvailable: 1,
      extraStaff: 0,
      studentsWaiting: 1,
    },
  });

  const [scoreCard, setScoreCard] = useState([
    {
      hour: 0,
      parentDiversions: 0,
      studentsInWaiting: 0,
      extraStaff: 0,
    },
  ]);

  const characterToDept = {
    becky: "Welcome",
    adam: "Session",
    theresa: "Interview",
    kenny: "Great Hall", // greathall or lunch??
  };

  const currentDept = characterToDept[activeUser.character];

  const isCurrentDepartment = (source) => {
    const map = {
      becky: "Welcome",
      adam: "Session",
      theresa: "Interview",
      kenny: "Great Hall",
    };
    return map[activeUser.character] === source;
  };

  function updateBoard(gameBoard) {
    console.log("updateBoard", gameBoard);
    channel.send({
      type: "broadcast",
      event: "update-board",
      payload: gameBoard,
    });
  }

  function readyUp() {
    //function that adds the player to the readyPlayers array
    channel.send({
      type: "broadcast",
      event: "ready-up",
      payload: { player: activeUser.userName },
    });
  }

  function increaseRound() {
    setRound((prev) => {
      return prev + 1;
    });
    channel.send({
      type: "broadcast",
      event: "increase-round",
      payload: {},
    });
  }

  useEffect(() => {
    if (!activeUser) {
      // navigate("/");
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
    fetchPlayers();

    if (players.indexOf(activeUser.userName) === 0) {
      setActiveUser((prev) => {
        return { ...prev, character: "becky" };
      });
    } else if (players.indexOf(activeUser.userName) === 1) {
      setActiveUser((prev) => {
        return { ...prev, character: "adam" };
      });
    } else if (players.indexOf(activeUser.userName) === 2) {
      setActiveUser((prev) => {
        return { ...prev, character: "theresa" };
      });
    } else if (players.indexOf(activeUser.userName) === 3) {
      setActiveUser((prev) => {
        return { ...prev, character: "kenny" };
      });
    }

    setScoreCard(
      [...Array(hoursInDay)].map((_, i) => ({
        hour: i,
        parentDiversions: 0,
        studentsInWaiting: 0,
        extraStaff: 0,
      }))
    );

    channel
      .on("broadcast", { event: "update-board" }, (payload) => {
        console.log("update-board:", payload.payload);
        setGame(payload.payload);
      })
      .subscribe();

    channel.on("broadcast", { event: "increase-round" }, () => {
      console.log("increase-round");
      setRound((prev) => {
        return prev + 1;
      });
      setReadyPlayers([]);
      setIsReady(false);
    });

    channel.on("broadcast", { event: "ready-up" }, (payload) => {
      const newPlayer = payload.payload.player;
      console.log("ready-up:", newPlayer);
      console.log("readyPlayers:", readyPlayers);
      let playersReady = 0;
      //if player is host add player to readyPlayers
      if (activeUser.role === "Host") {
        setReadyPlayers((prev) => {
          playersReady = prev.length + 1;
          return [...prev, newPlayer];
        });
        // check if all players are ready
        if (playersReady === 1) {
          increaseRound();
          setReadyPlayers([]);
          setIsReady(false);
        }
      }
    });

    channel.on("broadcast", { event: "manage_arrivals" }, (payload) => {
      const { department, newStudents } = payload.payload;
      setGame((prev) => ({
        ...prev,
        [department]: {
          ...prev[department],
          students: newStudents,
        },
      }));
    });
  }, [lobby]);

  useEffect(() => {
    if (round > 12) {
      alert("Game Over");
    }

    setShowRoundOverlay(round);
    const timeout = setTimeout(() => {
      setShowRoundOverlay(null);
      const timeout2 = setTimeout(() => {
        setArrivalsPopup(true);
      }, 500);
      return () => {
        clearTimeout(timeout2);
      };
    }, 1200); // match animation duration
    return () => {
      clearTimeout(timeout);
    };
  }, [round]);

  const renderHour = useCallback((round) => {
    const time = [
      "7:30",
      "8:00",
      "8:30",
      "9:00",
      "9:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "1:00",
    ];
    return time[round];
  });
  return (
    <div className="pt-2 d-flex h-100">
      <RoundOverlay round={showRoundOverlay} renderHour={renderHour} />
      <div className="w-75 h-100">
        <Board currentDept={currentDept} game={game}></Board>
      </div>
      {/* Right: Player Panel */}
      <div className="w-25 d-flex flex-column align-items-center gap-3 p-3">
        <h2>{renderHour(round)}</h2>
        <h4 className="text-center">Your Station</h4>
        <Actions
          updateBoard={updateBoard}
          increaseRound={increaseRound}
          readyUp={readyUp}
          game={game}
          setGame={setGame}
          setManageArrivalsPopup={setManageArrivalsPopup}
          setReadyToExitPopup={setReadyToExitPopup}
          setIsReady={setIsReady}
          isReady={isReady}
        />
      </div>

      <SettingsModal
        show={settingsModalShow}
        onHide={() => setSettingsModalShow(false)}
      />
      <ArrivalsPopup
        round={round}
        show={arrivalsPopup}
        onHide={() => setArrivalsPopup(false)}
        renderHour={renderHour}
      />
      <ManageArrivalsPopup
        show={manageArrivalsPopup}
        onHide={() => setManageArrivalsPopup(false)}
        round={round}
        renderHour={renderHour}
        game={game}
        lobby={lobby}
        channel={channel}
      />
      <ReadyToExitPopup
        isCurrentDepartment={isCurrentDepartment}
        show={readyToExitPopup}
        onHide={() => setReadyToExitPopup(false)}
        round={round}
        renderHour={renderHour}
        game={game}
      />
      <ScoreCardModal
        scoreCard={scoreCard}
        show={scoreCardModal}
        onHide={() => setScoreCardModal(false)}
      />
    </div>
  );
}

export default Game;

function Actions({
  updateBoard,
  game,
  setGame,
  readyUp,
  isReady,
  setIsReady,
  setManageArrivalsPopup,
  setReadyToExitPopup,
}) {
  const { activeUser, players } = useContext(AppContext);
  function buyVolunteer(character) {
    if (character === "becky") {
      const local = {
        ...game,
        Welcome: {
          ...game.Welcome,
          volunteers: game.Welcome.volunteers + 1,
        },
      };
      setGame(local);
      updateBoard(local);
    } else if (character === "adam") {
      const local = {
        ...game,
        Session: {
          ...game.Session,
          volunteers: game.Session.volunteers + 1,
        },
      };
      setGame(local);
      updateBoard(local);
    } else if (character === "theresa") {
      setGame((prev) => {
        return {
          ...prev,
          Interview: {
            ...prev.Interview,
            volunteers: prev.Interview.volunteers + 1,
          },
        };
      });
    } else if (character === "kenny") {
      setGame((prev) => {
        return {
          ...prev,
          GreatHall: {
            ...prev.GreatHall,
            volunteers: prev.GreatHall.volunteers + 1,
          },
        };
      });
    }
  }

  return (
    <div className="d-flex flex-column align-items-center gap-3 w-100">
      {activeUser && (
        <div className="d-flex flex-column align-items-center text-center">
          <img
            src={
              activeUser.role === "Host"
                ? "https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_1920x1920/public/node/person/photo/2024-07/people-headshot-steve-cooper.jpg?itok=ibY7HHY5"
                : activeUser.character === "becky"
                ? "https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-becky-barnard.jpg?itok=d8fal0xg"
                : activeUser.character === "adam"
                ? "https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-adam-britten.jpg?itok=fAYbnhXs"
                : activeUser.character === "theresa"
                ? "https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-theresa-luensmann.jpg?itok=unLlsXcF"
                : "https://media.licdn.com/dms/image/v2/D5603AQFJz9OJXxUNsQ/profile-displayphoto-shrink_400_400/B56ZRMqLRMH0Ao-/0/1736452912894?e=2147483647&v=beta&t=uhRnWRaaN4llVldNwHHS8qzxZgX0wUtQtaoS0iLqTrQ"
            }
            alt={activeUser.character}
            style={{
              width: "190px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "0.75rem",
              border: "2px solid #ccc",
            }}
          />
          <h4 className="mt-2">
            {activeUser.role === "Host"
              ? "Host"
              : {
                  becky: "Welcome",
                  adam: "Session",
                  theresa: "Interview",
                  kenny: "Great Hall",
                }[activeUser.character]}
          </h4>
        </div>
      )}

      <button
        className="btn btn-pressable btn-secondary w-100"
        onClick={() => buyVolunteer(activeUser.character)}
        disabled={isReady}
      >
        Buy a Volunteer 🔺
      </button>

      {activeUser.role !== "Host" && (
        <>
          <button
            className={`btn btn-pressable w-100 ${
              isReady ? "btn-success" : "btn-secondary"
            }`}
            onClick={() => {
              readyUp();
              setIsReady(true);
            }}
            disabled={isReady}
          >
            {isReady ? "Ready!" : "Ready Up!"}
          </button>

          <button
            className="btn btn-pressable btn-secondary w-100"
            onClick={() => setManageArrivalsPopup(true)}
          >
            Manage Arriving Students
          </button>

          <button
            className="btn btn-pressable btn-secondary w-100"
            onClick={() => setReadyToExitPopup(true)}
          >
            Ready to Exit
          </button>
        </>
      )}
    </div>
  );
}

function ScoreCard() {
  let hours = [0, 0, 0, 0, 0, 0, 0];
  return (
    <div className="d-flex w-100">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">hour</th>
            <th scope="col">Parent Diversions</th>
            <th scope="col">Students in Waiting</th>
            <th scope="col">Extra Staff</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((hour, idx) => {
            return (
              <tr>
                <th scope="row">{6 + idx + ":00"}</th>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ScoreCardModal(props) {
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">ScoreCard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ScoreCard scoreCard={props.scoreCard}></ScoreCard>
      </Modal.Body>
    </Modal>
  );
}

function Board({ game, currentDept }) {
  const departmentOrder = [
    { name: "Great Hall", data: game.GreatHall },
    { name: "Session", data: game.Session },
    { name: "Welcome", data: game.Welcome },
    { name: "Interview", data: game.Interview },
  ];

  // Move currentDept to index 1 (top-right)
  const sortedDepartments = (() => {
    const index = departmentOrder.findIndex((dep) => dep.name === currentDept);
    if (index === -1) return departmentOrder;

    const reordered = [...departmentOrder];
    const [current] = reordered.splice(index, 1);
    reordered.splice(1, 0, current);
    return reordered;
  })();

  return (
    <div className="p-3 h-100 w-100">
      <div className="d-grid board-grid gap-3 h-100">
        {sortedDepartments.map((dep) => (
          <Department
            key={dep.name}
            name={dep.name}
            isCurrent={currentDept === dep.name}
            {...dep.data}
          />
        ))}
      </div>
    </div>
  );
}

function SettingsModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h4>Account</h4>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={props.onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

function ReadyToExitPopup({
  show,
  onHide,
  round,
  renderHour,
  isCurrentDepartment,
}) {
  const arrivalSources = [
    "Outside",
    "Welcome",
    "Session",
    "Interview",
    "GreatHall",
  ];
  const { activeUser } = useContext(AppContext);
  const getRand = () => {
    return Math.floor(Math.random() * 5);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Manage Ready to Exit Students - {renderHour(round)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {arrivalSources.map((source) => {
          if (source !== "Outside" && isCurrentDepartment(source)) return null;

          return (
            <div key={source} className="row align-items-center mb-2">
              <div className="col">
                <strong>{source}: </strong>
                {getRand()}
              </div>
            </div>
          );
        })}
      </Modal.Body>
    </Modal>
  );
}

// RoundOverlay.jsx
import { AnimatePresence, motion } from "framer-motion";
function RoundOverlay({ round, renderHour }) {
  return (
    <AnimatePresence>
      {round !== null && (
        <motion.div
          key={round}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 1 }}
          className="round-overlay"
        >
          <h1 style={{ color: "black" }}>{renderHour(round)}</h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
