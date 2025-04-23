import { useEffect, useContext, useState, useCallback, act } from "react";
// import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { arrivalsData } from "../data/ArrivalsData";

function Game() {
  const { lobby } = useParams();
  const hoursInDay = 7;
  const channel = supabase.channel(lobby + "changes");
  const { activeUser, setActiveUser, players, setPlayers } =
    useContext(AppContext);
  const [scoreCardModal, setScoreCardModal] = useState(false);
  const [settingsModalShow, setSettingsModalShow] = useState(false);
  const [arrivalsPopup, setArrivalsPopup] = useState(false);
  const [round, setRound] = useState(0);
  const [game, setGame] = useState({
    GreatHall: {
      tables: 16,
      students: 14,
      volunteers: 14,
      exits: 1,
      exiting: 0,
      staffNotAvailable: 0,
      extraStaff: 0,
      studentsWaiting: 0,
    },
    Session: {
      tables: 8,
      students: 8,
      volunteers: 8,
      exits: 3,
      exiting: 0,
      staffNotAvailable: 0,
      extraStaff: 0,
      studentsWaiting: 0,
    },
    Interview: {
      tables: 4,
      students: 4,
      volunteers: 4,
      exits: 2,
      exiting: 0,
      staffNotAvailable: 0,
      extraStaff: 0,
      studentsWaiting: 0,
    },
    Welcome: {
      tables: 12,
      students: 10,
      volunteers: 10,
      exits: 4,
      exiting: 0,
      staffNotAvailable: 0,
      extraStaff: 0,
      studentsWaiting: 0,
    },
  });

  const [incomingsToWelcome, setIncomingsToWelcome] = useState([
    {
      Outside: 0,
    },
  ])

  const [incomingsToSession, setIncomingsToSession] = useState([
    {
      Outside: 0,
      Welcome: 0,
    },
  ])

  const [incomingsToInterview, setIncomingsToInterview] = useState([
    {
      Outside: 0,
      Session: 0,
      Welcome: 0,
    },
  ])

  const [incomingsToLunch, setIncomingsToLunch] = useState([
    {
      Outside: 0,
      Welcome: 0,
      Session: 0,
      Interview: 0,
    },
  ])

  const [scoreCard, setScoreCard] = useState([
    {
      hour: 0,
      parentDiversions: 0,
      studentsInWaiting: 0,
      extraStaff: 0,
    },
  ]);

  const [diversions, setDiversions] = useState([
    0
  ])

  const [welcomeExtraVolunteers, setWelcomeExtraVolunteers] = useState([
    {
      volunteersOff: 0,
      extraVolunteers: 0,
      requestedVolunteers: 0
    },
  ])

  const [sessionExtraVolunteers, setSessionExtraVolunteers] = useState([
    {
      volunteersOff: 0,
      extraVolunteers: 0,
      requestedVolunteers: 0
    },
  ])

  const [interviewExtraVolunteers, setInterviewExtraVolunteers] = useState([
    {
      volunteersOff: 0,
      extraVolunteers: 0,
      requestedVolunteers: 0
    },
  ])

  const [lunchExtraVolunteers, setLunchExtraVolunteers] = useState([
    {
      volunteersOff: 0,
      extraVolunteers: 0,
      requestedVolunteers: 0
    },
  ])

  function updateBoard(gameBoard) {
    console.log("updateBoard", gameBoard);
    channel.send({
      type: "broadcast",
      event: "update-board",
      payload: gameBoard,
    });
  }

  function increaseRound() {
    channel.send({
      type: "broadcast",
      event: "increase-round",
      payload: {},
    });
  }

  function endOfRoundClientUpdate(sender) {
    if (sender == "welcome") {
      setWelcomeExtraVolunteers((prev) => [
        {
          ...prev[0],
          extraVolunteers: prev[0].extraVolunteers + prev[0].requestedVolunteers,
          requestedVolunteers: 0,
        },
      ]);
    } else if (sender == "session") {
      setSessionExtraVolunteers((prev) => [
        {
          ...prev[0],
          extraVolunteers: prev[0].extraVolunteers + prev[0].requestedVolunteers,
          requestedVolunteers: 0,
        },
      ]);
    } else if (sender == "interview") {
      setInterviewExtraVolunteers((prev) => [
        {
          ...prev[0],
          extraVolunteers: prev[0].extraVolunteers + prev[0].requestedVolunteers,
          requestedVolunteers: 0,
        },
      ]);
    } else if (sender == "lunch") {
      setLunchExtraVolunteers((prev) => [
        {
          ...prev[0],
          extraVolunteers: prev[0].extraVolunteers + prev[0].requestedVolunteers,
          requestedVolunteers: 0,
        },
      ]);
    }
    // let payload;
    // if (sender == "session") {
    //   payload = {
    //     newVolunteers: requestedVolunteers
    //   }
    // }
    // else if (sender == "welcome") {
    //   payload = {
    //     newVolunteers: requestedVolunteers
    //   }
    // }
    // else if (sender == "interview") {
    //   payload = {
    //     newVolunteers: requestedVolunteers
    //   }
    // }
    // else if (sender == "lunch") {
    //   payload = {
    //     newVolunteers: requestedVolunteers
    //   }
    // }


    channel.send({
      type: "broadcast",
      event: "round-update-" + sender,
      payload: payload
    })
  }


  function endOfRoundHostUpdate() {
    const process = (area) => {
      return [
        {
          ...area[0],
          extraVolunteers: area[0].extraVolunteers + area[0].requestedVolunteers,
          requestedVolunteers: 0,
        },
      ];
    };

    const payload = {
      welcomeExtraVolunteers: process(welcomeExtraVolunteers),
      sessionExtraVolunteers: process(sessionExtraVolunteers),
      interviewExtraVolunteers: process(interviewExtraVolunteers),
      lunchExtraVolunteers: process(lunchExtraVolunteers),
      diversions: diversions,
    }

    channel.send({
      type: "broadcast",
      event: "end-of-round-update",
      payload: payload
    })
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
      setRound((prev) => {
        return prev + 1;
      });
      console.log(round);
    });

    channel.on("broadcast", { event: "end-of-round-update" }, (payload) => {
      setWelcomeExtraVolunteers(payload.payload.welcomeExtraVolunteers),
        setSessionExtraVolunteers(payload.payload.sessionExtraVolunteers),
        setInterviewExtraVolunteers(payload.payload.interviewExtraVolunteers),
        setLunchExtraVolunteers(payload.payload.lunchExtraVolunteers)
    });

    channel.on("broadcast", { event: "round-update-welcome" }, (payload) => {
      if (activeUser.role == "Host") {
        setWelcomeExtraVolunteers(payload.payload.welcomeExtraVolunteers)
      }

    });

    channel.on("broadcast", { event: "round-update-session" }, (payload) => {
      if (activeUser.role == "Host") {
        setSessionExtraVolunteers(payload.payload.sessionExtraVolunteers)
      }
    });

    channel.on("broadcast", { event: "round-update-interview" }, (payload) => {
      if (activeUser.role == "Host") {
        setInterviewExtraVolunteers(payload.payload.interviewExtraVolunteers)
      }
    });

    channel.on("broadcast", { event: "round-update-lunch" }, (payload) => {
      if (activeUser.role == "Host") {
        setLunchExtraVolunteers(payload.payload.lunchExtraVolunteers)
      }
    });

  }, [lobby]);



  useEffect(() => {
    if (round > 12) {
      alert("Game Over");
    }
    setArrivalsPopup(true)
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
    <div className="pt-2">
      <div className="position-absolute top-0 start-0 p-2 d-flex flex-column gap-2">
        <button
          className="btn btn-secondary"
          onClick={() => setScoreCardModal(true)}
        >
          ScoreCard
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setSettingsModalShow(true)}
        >
          Settings
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setArrivalsPopup(true)}
        >
          Arrivals
        </button>
        <h1>{renderHour(round)}</h1>
      </div>
      <Board game={game}></Board>
      <Actions
        updateBoard={updateBoard}
        increaseRound={increaseRound}
        game={game}
        setGame={setGame}
      ></Actions>
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
      <ScoreCardModal
        scoreCard={scoreCard}
        show={scoreCardModal}
        onHide={() => setScoreCardModal(false)}
      />
    </div>
  );
}

export default Game;

function Actions({ updateBoard, game, setGame, increaseRound }) {
  const { activeUser, players } = useContext(AppContext);
  function buyVolunteer(character) {
    if (character === "becky") {
      const local = {
        ...game,
        Welcome: {
          ...game.Welcome,
          requestedVolunteers: game.Welcome.requestedVolunteers + 1,
        },
      };
      setGame(local);
      updateBoard(local);
    } else if (character === "adam") {
      const local = {
        ...game,
        Session: {
          ...game.Session,
          requestedVolunteers: game.Session.requestedVolunteers + 1,
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
            requestedVolunteers: prev.Interview.requestedVolunteers + 1,
          },
        };
      });
    } else if (character === "kenny") {
      setGame((prev) => {
        return {
          ...prev,
          GreatHall: {
            ...prev.GreatHall,
            requestedVolunteers: prev.GreatHall.requestedVolunteers + 1,
          },
        };
      });
    }
  }

  return (
    <div className="d-flex flex-row w-100 card justify-content-between h-25 gap-2 p-2 mt-2">
      {activeUser && <div className="card d-flex p-2">
        {activeUser.character === "becky" && (
          <div>
            <img
              src="https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-becky-barnard.jpg?itok=d8fal0xg"
              alt="beckey"
              className="rounded-circle"
              style={{ width: "75px", height: "100px", objectFit: "cover" }}
            />
            <h3>Welcome</h3>
          </div>
        )}
        {activeUser.character === "adam" && (
          <div>
            <img
              src="https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-adam-britten.jpg?itok=fAYbnhXs"
              alt="adam"
              className="rounded-circle"
              style={{ width: "75px", height: "100px", objectFit: "cover" }}
            />
            <h3>Session</h3>
          </div>
        )}
        {activeUser.character === "theresa" && (
          <div>
            <img
              src="https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-theresa-luensmann.jpg?itok=unLlsXcF"
              alt="Theresa"
              className="rounded-circle"
              style={{ width: "75px", height: "100px", objectFit: "cover" }}
            />
            <h3>Interview</h3>
          </div>
        )}
        {activeUser.character === "kenny" && (
          <div>
            <img
              src="https://media.licdn.com/dms/image/v2/D5603AQFJz9OJXxUNsQ/profile-displayphoto-shrink_400_400/B56ZRMqLRMH0Ao-/0/1736452912894?e=2147483647&v=beta&t=uhRnWRaaN4llVldNwHHS8qzxZgX0wUtQtaoS0iLqTrQ"
              alt="kenny"
              className="rounded-circle"
              style={{ width: "75px", height: "100px", objectFit: "cover" }}
            />
            <h3>Great Hall</h3>
          </div>
        )}
      </div>}

      <div>
        <button
          className="btn btn-secondary"
          onClick={(e) => {
            e.preventDefault();
            buyVolunteer(activeUser.character);
          }}
        >
          buy a volunteer
        </button>

        {activeUser.role === "Host" && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              increaseRound();
            }}
          >
            Next Round
          </button>
        )}
      </div>
      <div></div>
      <div></div>
      <div></div>
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

function Board({ game }) {
  return (
    <div className="d-flex flex-column text-center align-content-center gap-3">
      <GreatHall game={game}></GreatHall>
      <div className="d-flex justify-content-between">
        <Session game={game}></Session>
        <Welcome game={game}></Welcome>
        <Interview game={game}></Interview>
      </div>
    </div>
  );
}

function GreatHall({ game }) {
  const tables = 16;
  const students = 14;
  const volunteers = 14;
  const exits = 1;
  const exiting = 0;
  const staffNotAvailable = 0;
  const extraStaff = 0;
  const studentsWaiting = 0;
  return (
    <div
      className="w-75 card mx-auto d-flex flex-column"
      style={{ height: "300px" }}
    >
      <div>Great Hall </div>
      <div className="d-flex justify-content-between">
        <div>exit {exiting + "/" + exits}</div>
        <div>volunteers {volunteers}</div>
        <div>students Waiting {studentsWaiting}</div>
        <div>extra volunteers {extraStaff}</div>
        <div> staffNotAvailable {staffNotAvailable}</div>
        <div>students {students + "/" + tables}</div>
      </div>
    </div>
  );
}

function Session({ game }) {
  const tables = 8;
  const students = 8;
  const exits = 3;
  const exiting = 0;
  const staffNotAvailable = 0;
  const extraStaff = 0;
  const studentsWaiting = 0;
  return (
    <div className="w-25 card" style={{ height: "400px" }}>
      Session
      <div className="d-flex flex-column justify-content-between">
        <div>exit {exiting + "/" + exits}</div>
        <div>volunteers {game.Session.volunteers}</div>
        <div>students Waiting {studentsWaiting}</div>
        <div>extra volunteers {extraStaff}</div>
        <div> staffNotAvailable {staffNotAvailable}</div>
        <div>students {students + "/" + tables}</div>
      </div>
    </div>
  );
}

function Interview({ game }) {
  const tables = 4;
  const students = 4;
  const volunteers = 4;
  const exits = 2;
  const exiting = 0;
  const staffNotAvailable = 0;
  const extraStaff = 0;
  const studentsWaiting = 0;
  return (
    <div className="w-25 card " style={{ height: "400px" }}>
      Interview
      <div className="d-flex flex-column justify-content-between">
        <div>exit {exiting + "/" + exits}</div>
        <div>volunteers {volunteers}</div>
        <div>students Waiting {studentsWaiting}</div>
        <div>extra volunteers {extraStaff}</div>
        <div> staffNotAvailable {staffNotAvailable}</div>
        <div>students {students + "/" + tables}</div>
      </div>
    </div>
  );
}

function Welcome({ game }) {
  const tables = 16;
  return (
    <div className="w-50 card" style={{ height: "200px" }}>
      Welcome
      <div className="d-flex flex-wrap justify-content-between">
        <div>exit {game.Welcome.exiting + "/" + game.Welcome.exits}</div>
        <div>volunteers {game.Welcome.volunteers}</div>
        <div>students Waiting {game.Welcome.studentsWaiting}</div>
        <div>extra volunteers {game.Welcome.extraStaff}</div>
        <div> staffNotAvailable {game.Welcome.staffNotAvailable}</div>
        <div>students {game.Welcome.students + "/" + tables}</div>
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


function ArrivalsPopup({ show, onHide, round, renderHour }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Arrivals - {renderHour(round)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>New students or parents have arrived!</p>
        <p> Welcome: {arrivalsData.Welcome[round]} </p>
        <p> Session: {arrivalsData.Session[round]} </p>
        <p> Interview: {arrivalsData.Interview[round]} </p>
        <p> Lunch: {arrivalsData.Lunch[round]} </p>
        {/* You can add any custom info or logic here */}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={onHide}>
          Continue
        </button>
      </Modal.Footer>
    </Modal>
  );
}


