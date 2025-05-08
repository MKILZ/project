import { useEffect, useContext, useState, useCallback } from "react";
import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { arrivalsData } from "../data/ArrivalsData";
import { useNavigate } from "react-router-dom";
import EndOfRoundStats from "../components/EndOfRoundStats";
import ArrivalsPopup from "../components/ArrivalsPopup";
import ManageArrivalsPopup from "../components/ManageArrivalsPopup";
import Department from "../components/Department";
import { exitingData } from "../data/TransferData";
import ReadyToExitPopup from "../components/ReadyToExitPopup";
import steveAudio from "../assets/Steve.mp3";
import wilson2Audio from "../assets/wilson2.m4a";
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
  const [endOfRoundStats, setEndOfRoundStats] = useState(false);
  const [statsLog, setStatsLog] = useState([]);
  const [round, setRound] = useState(0);
  {
    /* Hard coding data for each room */
  }
  const [isReady, setIsReady] = useState(false);
  const [showRoundOverlay, setShowRoundOverlay] = useState(round);

  const [readyPlayers, setReadyPlayers] = useState([]);
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

  //have to change this if we update number of volunteers in each department
  //needed for stats calculations
  const [startingVolunteers] = useState({
    GreatHall: 14,
    Session: 8,
    Interview: 4,
    Welcome: 10,
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
    kenny: "Great Hall",
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
    const audio = new window.Audio(steveAudio);
    audio.play().catch((e) => {
      console.warn("Autoplay blocked:", e);
    });

    {
      /* Giving a character to each player depending on the order they join the room */
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
    {
      /* Give each player a blank score card */
    }
    setScoreCard(
      [...Array(hoursInDay)].map((_, i) => ({
        hour: i,
        parentDiversions: 0,
        studentsInWaiting: 0,
        extraStaff: 0,
      }))
    );
    {
      /* Grabbing data from the database */
    }
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
  {
    /* There are only 12 rounds in a game so greater than 12 is game over
  and each player gets their personalized stats breakdown */
  }
  useEffect(() => {
    const departments = ["Welcome", "Session", "Interview", "GreatHall"];

    setGame((prevGame) => {
      const updatedGame = { ...prevGame };

      departments.forEach((dept) => {
        const roundExits = exitingData[dept]?.[round] || {
          Welcome: 0,
          Session: 0,
          Interview: 0,
          GreatHall: 0,
          Exit: 0,
        };

        const newOutside = arrivalsData[dept]?.[round] || 0;

        updatedGame[dept] = {
          ...updatedGame[dept],

          outsideQueue: (updatedGame[dept].outsideQueue || 0) + newOutside,
          studentsWaiting:
            (updatedGame[dept].studentsWaiting || 0) + newOutside,

          exitingTo: {
            Welcome:
              (updatedGame[dept].exitingTo?.Welcome || 0) +
              (roundExits.Welcome || 0),
            Session:
              (updatedGame[dept].exitingTo?.Session || 0) +
              (roundExits.Session || 0),
            Interview:
              (updatedGame[dept].exitingTo?.Interview || 0) +
              (roundExits.Interview || 0),
            GreatHall:
              (updatedGame[dept].exitingTo?.GreatHall || 0) +
              (roundExits.GreatHall || 0),
            Exit:
              (updatedGame[dept].exitingTo?.Exit || 0) + (roundExits.Exit || 0),
          },
        };
      });

      return updatedGame;
    });

    if (round >= 12) {
      console.log("Game Over");
      const audio = new window.Audio(wilson2Audio);
      audio.play().catch((e) => {
        console.warn("Autoplay blocked:", e);
      });
      setEndOfRoundStats(true);
    } else {
      setShowRoundOverlay(round);
      const timeout = setTimeout(() => {
        setShowRoundOverlay(null);
        const timeout2 = setTimeout(() => {
          setArrivalsPopup(true);
        }, 100);
        return () => {
          clearTimeout(timeout2);
        };
      }, 1500); // match animation duration
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [round]);

  useEffect(() => {
    if (round === 0) return; // skip the first round rende
    console.log("Capturing stats at the end of round", round - 1);

    setStatsLog((prev) => [
      ...prev,
      {
        round: round - 1,
        Welcome: {
          studentsWaiting: game.Welcome.studentsWaiting,
          volunteers: game.Welcome.volunteers,
          extraHours: Math.max(
            0,
            game.Welcome.volunteers - startingVolunteers.Welcome
          ),
        },
        Session: {
          studentsWaiting: game.Session.studentsWaiting,
          volunteers: game.Session.volunteers,
          extraHours: Math.max(
            0,
            game.Session.volunteers - startingVolunteers.Session
          ),
        },
        Interview: {
          studentsWaiting: game.Interview.studentsWaiting,
          volunteers: game.Interview.volunteers,
          extraHours: Math.max(
            0,
            game.Interview.volunteers - startingVolunteers.Interview
          ),
        },
        GreatHall: {
          studentsWaiting: game.GreatHall.studentsWaiting,
          volunteers: game.GreatHall.volunteers,
          extraHours: Math.max(
            0,
            game.GreatHall.volunteers - startingVolunteers.GreatHall
          ),
        },
      },
    ]);
  }, [round]);
  {
    /* Hard coding the rounds which are times in 30 min increments */
  }
  useEffect(() => {
    console.log("Stats log updated:", statsLog);
  }, [statsLog]);

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
  {
    /* Setting the buttons in the top left, scorecard, settings, and arrivals */
  }
  return (
    <div className="pt-2 d-flex h-100">
      <RoundOverlay round={showRoundOverlay} renderHour={renderHour} />
      <div className="w-75 h-100">
        <Board currentDept={currentDept} game={game}></Board>
      </div>
      {/* Right: Player Panel */}
      <div className="w-25 d-flex flex-column align-items-center gap-3 p-3 bg-white rounded-5 m-3">
        <h2>{renderHour(round)}</h2>
        <h4 className="text-center">Your Station</h4>
        {/* Updating data that we grabbed from the database */}
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
      {/* Creating popups for settings, arrivals, managing arrivals, ready to exit students, and score card */}
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
        setGame={setGame}
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
        setGame={setGame}
      />
      <ScoreCardModal
        scoreCard={scoreCard}
        show={scoreCardModal}
        onHide={() => setScoreCardModal(false)}
      />
      <EndOfRoundStats
        show={endOfRoundStats}
        onHide={() => setEndOfRoundStats(false)}
        statsLog={statsLog}
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
  {
    /* When you click the buy volunteer button adding a volunteer to the count specific to your character. The host cannot do this. */
  }
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

  {
    /* Adding the pictures on the screen of your character */
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
                : "https://media.licdn.com/dms/image/v2/D5603AQHSXRUVk33t0A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1726530605597?e=1752105600&v=beta&t=Gl5KfaDnVkxlDObX_AZL2kzfxDqhlpdoc0S8H6eLl5s"
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
            Manage Exits
          </button>
        </>
      )}
    </div>
  );
}
{
  /* Updating the scorecard */
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

{
  /* Making the scorecard popup look good */
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
