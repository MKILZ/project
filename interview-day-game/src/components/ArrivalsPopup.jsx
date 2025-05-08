import Modal from "react-bootstrap/Modal";
import { arrivalsData } from "../data/ArrivalsData";

export default function ArrivalsPopup({ show, onHide, round, renderHour }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header className="justify-content-center">
        <Modal.Title>Incoming Students!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="arrivals-grid">
          <div className="arrival-box">
            <p>
              <strong>Welcome: {arrivalsData.Welcome[round]}</strong>
            </p>
            <div className="circle-container">
              {Array.from({ length: arrivalsData.Welcome[round] }).map(
                (_, i) => (
                  <div className="circle student" key={`w-${i}`}></div>
                )
              )}
            </div>
          </div>

          <div className="arrival-box">
            <p>
              <strong>Session: {arrivalsData.Session[round]}</strong>
            </p>
            <div className="circle-container">
              {Array.from({ length: arrivalsData.Session[round] }).map(
                (_, i) => (
                  <div className="circle student" key={`s-${i}`}></div>
                )
              )}
            </div>
          </div>

          <div className="arrival-box">
            <p>
              <strong>Interview: {arrivalsData.Interview[round]}</strong>
            </p>
            <div className="circle-container">
              {Array.from({ length: arrivalsData.Interview[round] }).map(
                (_, i) => (
                  <div className="circle student" key={`i-${i}`}></div>
                )
              )}
            </div>
          </div>

          <div className="arrival-box">
            <p>
              <strong>Lunch: {arrivalsData.Lunch[round]}</strong>
            </p>
            <div className="circle-container">
              {Array.from({ length: arrivalsData.Lunch[round] }).map((_, i) => (
                <div className="circle student" key={`l-${i}`}></div>
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-primary" onClick={onHide}>
          Continue
        </button>
      </Modal.Footer>
    </Modal>
  );
}
