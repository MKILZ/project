import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";
import Modal from "react-bootstrap/Modal";
import Login from "./Login.jsx";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../index.css";

export default function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [createModelShow, setCreateModelShow] = useState(false);
  const [settingsModalShow, setSettingsModalShow] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { session, setActiveUser, lobby, setLobby } = useContext(AppContext);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
      {/* White box around text and room code */}
      <div
        className="d-flex card flex-column justify-content-center align-items-center mt-5 min-vh-50 w-50"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "30px",
        }}
      >
        {/* Div with title to align join box */}
        <div className="d-inline-flex flex-column justify-content-center align-items-center">
          <h1 className="display-1 fw-bold text-dark pt-5">Interview Day At</h1>
          <h1 className="display-1 fw-bold text-dark">The Raikes School</h1>
          {/* Join code box */}
          <div className="card bg-gray-100 rounded-lg p-4 mt-5 mb-5 justify-content-center align-items-center w-100">
            <h3>Join a Room</h3>
            <input
              placeholder="Enter Your Name"
              className="form-control mb-2"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className="form-control mb-2"
              placeholder="Enter The Room Code"
              value={lobby}
              onChange={(e) => setLobby(e.target.value)}
            />
            <div className="d-flex flex-row-reverse gap-2">
              <button
                disabled={!lobby || !userName || lobby.length !== 6}
                className="btn btn-success"
                onClick={async () => {
                  // Check if the lobby exists in the database
                  const { data, error } = await supabase
                    .from("games")
                    .select("*")
                    .eq("lobby", lobby)
                    .single();

                  if (data) {
                    // Set the active user
                    setActiveUser({
                      role: "Player",
                      userName: userName,
                    });

                    navigate("/lobby/" + lobby);
                  } else {
                    Swal.fire({
                      title: "Lobby doesn't exist!",
                      icon: "error",
                      confirmButtonText: "Oh my bad",
                    });
                  }
                }}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Settings and Login Button */}
      <div className="position-absolute top-0 start-0 p-2 d-flex flex-column gap-2">
        {!session ? (
          <button
            className="btn btn-dark"
            onClick={() => {
              setShowAuthModal(true);
            }}
          >
            Login as a Host
          </button>
        ) : (
          <button
            className="btn btn-dark"
            onClick={() => setCreateModelShow(true)}
          >
            Host Game
          </button>
        )}
        <button
          className="btn btn-dark"
          onClick={() => setSettingsModalShow(true)}
        >
          Settings
        </button>
        <button
          className="btn btn-dark"
          onClick={() => navigate("/leaderboard")}
        >
          Leaderboard
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
      <AuthModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />
    </div>
  );
}

export function SettingsModal(props) {
  const { session, setSession } = useContext(AppContext);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {/** STRECTH GOAL TO HAVE MULITPLE COLOR THEMES TOGGLEABLE FROM SETTINGS **/}
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h4>Account</h4>
          <button
            className="btn btn-secondary"
            disabled={!session}
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
  const { session, setActiveUser } = useContext(AppContext);
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
          {/** STRECTH GOAL TO HAVE MULITPLE ROOMS HOSTED BY ONE HOST **/}
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
            onClick={async () => {
              props.onHide();

              // Create a new lobby random 6 digit number
              const lobbyCode = Math.floor(100000 + Math.random() * 900000);
              setActiveUser({
                role: "Host",
                id: session.user.id,
              });
              // Create a new lobby in the database
              const { data, error } = await supabase
                .from("games")
                .insert([
                  { lobby: lobbyCode, host: session.user.id, players: [] },
                ])
                .select();

              navigate("/lobby/" + lobbyCode);
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

function AuthModal(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Login />
      </Modal.Body>
    </Modal>
  );
}
