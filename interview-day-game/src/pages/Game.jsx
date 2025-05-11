import { useEffect, useContext, useState, useCallback } from "react";

//Data
import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";
import { useParams } from "react-router-dom";
import { arrivalsData } from "../data/ArrivalsData";
import { exitingData } from "../data/TransferData";

// Components
import EndOfRoundStats from "../components/EndOfRoundStats";
import ArrivalsPopup from "../components/ArrivalsPopup";
import ManageArrivalsPopup from "../components/ManageArrivalsPopup";
import ReadyToExitPopup from "../components/ReadyToExitPopup";
import Board from "../components/Board";
import Actions from "../components/Actions";
import RoundOverlay from "../components/RoundOverlay";

//Assets
import steveAudio from "../assets/Steve.mp3";
import wilson2Audio from "../assets/wilson2.m4a";

function Game() {
  const { lobby } = useParams();
  const channel = supabase.channel(lobby + "changes");
  const { activeUser, setActiveUser, players, setPlayers, game, setGame } =
    useContext(AppContext);
  const [arrivalsPopup, setArrivalsPopup] = useState(false);
  const [manageArrivalsPopup, setManageArrivalsPopup] = useState(false);
  const [readyToExitPopup, setReadyToExitPopup] = useState(false);
  const [endOfRoundStats, setEndOfRoundStats] = useState(false);
  const [statsLog, setStatsLog] = useState([]);
  const [round, setRound] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showRoundOverlay, setShowRoundOverlay] = useState(round);
  const characterToDept = {
    becky: "Welcome",
    adam: "Session",
    theresa: "Interview",
    kenny: "Great Hall",
  };

  const currentDept = characterToDept[activeUser.character];

  //have to change this if we update number of volunteers in each department
  //needed for stats calculations
  const [startingVolunteers] = useState({
    GreatHall: 14,
    Session: 8,
    Interview: 4,
    Welcome: 10,
  });

  // Function to check if the current department is the one the user is in
  function isCurrentDepartment(source) {
    const map = {
      becky: "Welcome",
      adam: "Session",
      theresa: "Interview",
      kenny: "Great Hall",
    };
    return map[activeUser.character] === source;
  }

  // Function to update the game board
  function updateBoard(gameBoard) {
    channel.send({
      type: "broadcast",
      event: "update-board",
      payload: gameBoard,
    });
  }

  //function that adds the player to the readyPlayers array
  function readyUp() {
    channel.send({
      type: "broadcast",
      event: "ready-up",
      payload: { player: activeUser.userName },
    });
  }

  // Function to handle the increase round
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

    // refetch the players from the database
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

    // Set the initial game for the player character/department
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

    // Listen for the updaye board event
    channel
      .on("broadcast", { event: "update-board" }, (payload) => {
        setGame(payload.payload);
      })
      .subscribe();

    // Listen for the increase round event
    channel.on("broadcast", { event: "increase-round" }, () => {
      setRound((prev) => {
        return prev + 1;
      });
      setIsReady(false);
    });

    //Listen for player ready up if the player is the host
    channel.on("broadcast", { event: "ready-up" }, (payload) => {
      const newPlayer = payload.payload.player;

      if (activeUser.role === "Host") {
        const updated = [...new Set([...prev, newPlayer])];

        // Check after updating
        if (updated.length >= 2) {
          increaseRound();
          setIsReady(false);
          return []; // Reset
        }
      }
    });

    // Listen for changes in the arrivals data
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
    const departments = ["Welcome", "Session", "Interview", "GreatHall"];

    // Update the game state with the new arrivals and exits
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

    // Check if the round is 12 or more
    if (round >= 12) {
      const audio = new window.Audio(wilson2Audio);
      audio.play().catch((e) => {
        console.warn("Autoplay blocked:", e);
      });
      setEndOfRoundStats(true);
    } else {
      // Show the arrivals popup after a delay
      // with a slide-in animation for the hour
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

    if (round === 0) return; // skip the first round rende
    // Update the stats log with the current round's data
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

  // Function to render the hour based on the round
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
      {/** animation for the hour */}
      <RoundOverlay round={showRoundOverlay} renderHour={renderHour} />
      <div className="w-75 h-100">
        <Board currentDept={currentDept} game={game}></Board>
      </div>
      {/* Right: Player Panel */}
      <div className="w-25 d-flex flex-column align-items-center gap-3 p-3 bg-white rounded-5 m-3">
        <h2>{renderHour(round)}</h2>
        <h4 className="text-center">Your Station</h4>
        {/** Player's actions bar */}
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

      <ArrivalsPopup
        round={round}
        show={arrivalsPopup}
        onHide={() => setArrivalsPopup(false)}
        renderHour={renderHour}
      />
      {/** Popup for managing arrivals */}
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
      {/** Popup for exiting students */}
      <ReadyToExitPopup
        isCurrentDepartment={isCurrentDepartment}
        show={readyToExitPopup}
        onHide={() => setReadyToExitPopup(false)}
        round={round}
        renderHour={renderHour}
        game={game}
        setGame={setGame}
      />
      {/** End of Round Stats */}
      <EndOfRoundStats
        show={endOfRoundStats}
        onHide={() => setEndOfRoundStats(false)}
        statsLog={statsLog}
        players={players}
      />
    </div>
  );
}

export default Game;
