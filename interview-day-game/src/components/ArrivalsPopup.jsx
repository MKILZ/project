import Modal from "react-bootstrap/Modal";
import { arrivalsData } from "../data/ArrivalsData";

export default function ArrivalsPopup({ show, onHide, round, renderHour }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title centered>Arrivals</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="arrivals-grid">
          <div className="corner top-left">
            <strong>Welcome</strong>
            <div className="circle-group">
              {Array.from({ length: arrivalsData.Welcome[round] }).map(
                (_, i) => (
                  <div className="circle student" key={`w-${i}`}></div>
                )
              )}
            </div>
          </div>

          <div className="corner top-right">
            <strong>Session</strong>
            <div className="circle-group">
              {Array.from({ length: arrivalsData.Session[round] }).map(
                (_, i) => (
                  <div className="circle student" key={`s-${i}`}></div>
                )
              )}
            </div>
          </div>

          <div className="corner bottom-left">
            <strong>Interview</strong>
            <div className="circle-group">
              {Array.from({ length: arrivalsData.Interview[round] }).map(
                (_, i) => (
                  <div className="circle student" key={`i-${i}`}></div>
                )
              )}
            </div>
          </div>

          <div className="corner bottom-right">
            <strong>Lunch</strong>
            <div className="circle-group">
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
