import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { AppContext } from "../context/useAppContext";
import Button from "react-bootstrap/Button";

export default function ReadyToExitPopup({
  show,
  onHide,
  round,
  renderHour,
  game,
  setGame,
}) {
  const arrivalSources = [
    "Welcome",
    "Session",
    "Interview",
    "GreatHall",
    "Exit",
  ];
  const { activeUser } = useContext(AppContext);

  const currentDept =
    activeUser?.character === "becky"
      ? "Welcome"
      : activeUser?.character === "adam"
      ? "Session"
      : activeUser?.character === "theresa"
      ? "Interview"
      : "GreatHall";

  const exitingTo = game?.[currentDept]?.exitingTo || {};
  const maxExit = exitingTo?.Exit || 0;
  const [studentsToExit, setStudentsToExit] = useState(0);

  const incrementExit = () => {
    if (studentsToExit < maxExit) {
      setStudentsToExit((prev) => prev + 1);
    }
  };

  const decrementExit = () => {
    if (studentsToExit > 0) {
      setStudentsToExit((prev) => prev - 1);
    }
  };

  const handleConfirm = () => {
    if (studentsToExit === 0) return;

    setGame((prev) => {
      const newGame = { ...prev };
      newGame[currentDept].students -= studentsToExit;
      newGame[currentDept].exitingTo.Exit -= studentsToExit;
      return newGame;
    });

    setStudentsToExit(0);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Manage Ready to Exit Students – {renderHour(round)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {arrivalSources.map((destination) => {
          if (destination === currentDept || destination === "Exit")
            return null;

          return (
            <div key={destination} className="row align-items-center mb-2">
              <div className="col">
                <strong>{destination}: </strong>
                {exitingTo[destination] || 0}
              </div>
            </div>
          );
        })}

        {/* Exit Box */}
        <hr />
        <div className="mb-2">
          <strong>Students Leaving Campus:</strong>
          <div className="d-flex align-items-center gap-2 mt-1">
            <Button variant="outline-secondary" onClick={decrementExit}>
              −
            </Button>
            <span>{studentsToExit}</span>
            <Button variant="outline-secondary" onClick={incrementExit}>
              +
            </Button>
            <span className="text-muted">/ {maxExit}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
