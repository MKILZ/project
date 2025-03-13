import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";
import Modal from "react-bootstrap/Modal";

import { useState, useEffect } from "react";
function Home() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [lobby, setLobby] = useState();
  const [userName, setUserName] = useState();
  const [createModelShow, setCreateModelShow] = useState(false);
  const [settingsModalShow, setSettingsModalShow] = useState(false);
  const { theme, setTheme } = useContext(AppContext);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center ">
      <h1 className="mt-5">Interview day @ Kauffman</h1>
      <div className="d-flex card bg-gray-100 rounded-lg p-4 gap-3 mt-5">
        <h3>Join a Room</h3>
        <input
          placeholder="Enter Your Name"
          className="form-control w"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          className="form-control "
          placeholder="Enter The Room Code"
          value={lobby}
          onChange={(e) => setLobby(e.target.value)}
        />
        <div className="d-flex flex-row-reverse gap-2">
          <button
            disabled={!lobby || !userName}
            className="btn btn-secondary"
            onClick={() => {
              navigate("/lobby/" + lobby);
            }}
          >
            Join Room
          </button>
        </div>
      </div>
      <div className="position-absolute top-0 start-0 p-2 d-flex flex-row gap-2">
        {!session ? (
          <button onClick={() => navigate("/login")}>Login as a Host</button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={() => setCreateModelShow(true)}
          >
            Host Game
          </button>
        )}
        <button
          className="btn btn-secondary"
          onClick={() => setSettingsModalShow(true)}
        >
          Settings
        </button>
      </div>

      <CreateGameModal
        show={createModelShow}
        onHide={() => setCreateModelShow(false)}
      />
      <SettingsModal
        show={settingsModalShow}
        onHide={() => setSettingsModalShow(false)}
      />
    </div>
  );
}

export default Home;

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
          <button
            className="btn btn-secondary"
            onClick={() => {
              supabase.auth.signOut();
            }}
          >
            Sign Out
          </button>
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

function CreateGameModal(props) {
  const navigate = useNavigate();
  const [roomCount, setRoomCount] = useState(1);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Game
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column gap-3">
          <h4>Room count</h4>
          <input
            type="number"
            value={roomCount}
            onChange={(e) => {
              if (roomCount < 1) {
                setRoomCount(1);
              } else if (roomCount > 10) {
                setRoomCount(10);
              } else {
                setRoomCount(e.target.value);
              }
            }}
            className="form-control"
          ></input>
          <button
            className="btn btn-secondary"
            onClick={() => {
              props.onHide();
              navigate("/lobby/" + Math.floor(Math.random() * 10000));
            }}
          >
            Create Lobby
          </button>
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
