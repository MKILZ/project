import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

function EndOfRoundStats({ show, onHide, statsLog }) {
  const navigate = useNavigate();

  // Calculate total stats
  const totalStats = {
    totalStudentsWaiting: 0,
    totalExtraHours: 0,
    departmentStats: {
      Welcome: { studentsWaiting: 0, extraHours: 0 },
      Session: { studentsWaiting: 0, extraHours: 0 },
      Interview: { studentsWaiting: 0, extraHours: 0 },
      GreatHall: { studentsWaiting: 0, extraHours: 0 },
    },
  };

  statsLog.forEach((round) => {
    ["Welcome", "Session", "Interview", "GreatHall"].forEach((dept) => {
      totalStats.totalStudentsWaiting += round[dept].studentsWaiting;
      totalStats.totalExtraHours += round[dept].extraHours;
      totalStats.departmentStats[dept].studentsWaiting += round[dept].studentsWaiting;
      totalStats.departmentStats[dept].extraHours += round[dept].extraHours;
    });
  });

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Game Over</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Check out your statistics:</p>

        <h5>Total Stats</h5>
        <p>Students in Waiting: {totalStats.totalStudentsWaiting}</p>
        <p>Extra Staff Hours: {totalStats.totalExtraHours}</p>

        <h5 className="mt-3">Per Department:</h5>
        {Object.keys(totalStats.departmentStats).map((dept) => (
          <p key={dept}>
            {dept}: {totalStats.departmentStats[dept].studentsWaiting} students waiting, {totalStats.departmentStats[dept].extraHours} extra staff hours
          </p>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Continue
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default EndOfRoundStats;
