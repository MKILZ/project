import Modal from "react-bootstrap/Modal";
import { arrivalsData } from "../data/ArrivalsData";

export default function ArrivalsPopup({ show, onHide, round, renderHour }) {
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
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={onHide}>
          Continue
        </button>
      </Modal.Footer>
    </Modal>
  );
}
