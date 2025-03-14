import { useEffect, useContext, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

function Game() {
  const { lobby } = useParams();
  const hoursInDay = 7;
  const channel = supabase.channel(lobby + "changes");
  const { activeUser, setActiveUser, players } = useContext(AppContext);
  const [scoreCardModal, setScoreCardModal] = useState(false);
  const [settingsModalShow, setSettingsModalShow] = useState(false);
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

  const [scoreCard, setScoreCard] = useState([
    {
      hour: 0,
      parentDiversions: 0,
      studentsInWaiting: 0,
      extraStaff: 0,
    },
  ]);

  function updateBoard() {
    console.log("updateBoard", game);
    channel.send({
      type: "broadcast",
      event: "update-board",
      payload: game,
    });
  }

  useEffect(() => {
    if (!activeUser) {
      // navigate("/");
    }

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
  }, [lobby]);

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
      </div>
      <Board game={game}></Board>
      {activeUser.role !== "Host" && (
        <Actions
          updateBoard={updateBoard}
          game={game}
          setGame={setGame}
        ></Actions>
      )}
      <SettingsModal
        show={settingsModalShow}
        onHide={() => setSettingsModalShow(false)}
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

function Actions({ updateBoard, game, setGame }) {
  const { activeUser, players } = useContext(AppContext);

  function buyVolunteer(character) {
    console.log("buyVolunteer", character);

    if (character === "becky") {
      console.log("becky");
      console.log(game);
      console.log(game);

      setGame((prev) => {
        return {
          ...prev,
          Welcome: {
            ...prev.Welcome,
            volunteers: prev.Welcome.volunteers + 1,
          },
        };
      });
      console.log(game);
    } else if (character === "adam") {
      setGame((prev) => {
        return {
          ...prev,
          Session: { ...prev.Session, volunteers: prev.Session.volunteers + 1 },
        };
      });
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

    updateBoard();
  }

  return (
    <div className="d-flex flex-row w-100 card justify-content-between h-25 gap-2 p-2 mt-2">
      <div className="card d-flex p-2"></div>
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
  const volunteers = 8;
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
        <div>volunteers {volunteers}</div>
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
