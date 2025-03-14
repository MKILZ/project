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

  const [scoreCard, setScoreCard] = useState([
    {
      hour: 0,
      parentDiversions: 0,
      studentsInWaiting: 0,
      extraStaff: 0,
    },
  ]);

  useEffect(() => {
    if (!activeUser) {
      // navigate("/");
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
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: "lobby=eq." + lobby,
        },
        (payload) => {
          setGame(payload.new);
        }
      )
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
      <Actions></Actions>
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

function Actions() {
  return (
    <div className="d-flex flex-row w-100 card justify-content-between h-25 gap-2 p-2 mt-2">
      <div className="card d-flex p-2">
        <img src />
      </div>
      <div>
        <button className="btn btn-secondary">buy a volunteer</button>
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
      <table class="table">
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

function Board() {
  return (
    <div className="d-flex flex-column text-center align-content-center gap-3">
      <GreatHall></GreatHall>
      <div className="d-flex justify-content-between">
        <Session></Session>
        <Welcome></Welcome>
        <Interview></Interview>
      </div>
    </div>
  );
}

function GreatHall() {
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

function Session() {
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

function Interview() {
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
function Welcome() {
  const tables = 12;
  const students = 10;
  const volunteers = 10;
  const exits = 4;
  const exiting = 0;
  const staffNotAvailable = 0;
  const extraStaff = 0;
  const studentsWaiting = 0;

  return (
    <div className="w-50 card" style={{ height: "200px" }}>
      Welcome
      <div className="d-flex flex-wrap justify-content-between">
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
