import { useContext, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { AppContext } from "../context/useAppContext";
import { arrivalsData } from "../data/ArrivalsData";
import { supabase } from "../supabase/supabaseClient";

function ManageArrivalsPopup({
  show,
  onHide,
  round,
  renderHour,
  game,
  setGame,
  lobby,
  channel,
}) {
  const { activeUser } = useContext(AppContext);
  const getRand = () => {
    return Math.floor(Math.random() * 5);
  };

  const arrivalSources = [
    "Outside",
    "Welcome",
    "Session",
    "Interview",
    "GreatHall",
  ];

  const characterToDept = {
    becky: "Welcome",
    adam: "Session",
    theresa: "Interview",
    kenny: "GreatHall", 
  };

  const currentDept = characterToDept[activeUser.character];

  const maxArrivalsAllowed = Math.max(
    (game[currentDept]?.volunteers || 0) - (game[currentDept]?.students || 0),
    0
  );

  const fakeMaxArrivals = Math.max(
    (game[currentDept]?.tables || 0) - (game[currentDept]?.students || 0),
    0
  );

  const maxOutside = game[currentDept]?.outsideQueue ?? 0;
  const [outsideMax, setOutsideMax] = useState(maxOutside);

  useEffect(() => {
    const updatedMax = game[currentDept]?.outsideQueue ?? 0;
    setOutsideMax(updatedMax);
  }, [round, currentDept, game]);

  const internalSources = ["Welcome", "Session", "Interview", "GreatHall"];

  const getInternalMaxFromGame = () => {
    const maxes = {};
    internalSources.forEach((source) => {
      if (source !== currentDept) {
        maxes[source] = game[source]?.exitingTo?.[currentDept] ?? 0;
      }
    });
    return maxes;
  };

  const [internalMax, setInternalMax] = useState(getInternalMaxFromGame());

  useEffect(() => {
    setInternalMax(getInternalMaxFromGame());
  }, [game, round]);

  //get num selected from each department
  const [selected, setSelected] = useState({
    Outside: 0,
    Welcome: 0,
    Session: 0,
    Interview: 0,
    GreatHall: 0,
  });

  const increment = (source, maxVal) => {
    setSelected((prev) => {
      const currentTotal = Object.values(prev).reduce((a, b) => a + b, 0);
      if (currentTotal >= maxArrivalsAllowed) return prev;

      const newValue = Math.min(prev[source] + 1, maxVal);
      return { ...prev, [source]: newValue };
    });
  };

  const decrement = (source) => {
    setSelected((prev) => {
      const newValue = prev[source] - 1;
      return {
        ...prev,
        //make sure it doesn't go below 0
        [source]: newValue < 0 ? 0 : newValue,
      };
    });
  };

  const totalNumAccpeted = Object.values(selected).reduce(
    (acc, val) => acc + val,
    0
  );

  //get the max value for each department
  const getMaxValue = (source) => {
    if (source === "Outside") {
      //return maxOutside;
      return outsideMax;
    }
    return internalMax[source];
  };

  const isCurrentDepartment = (source) => {
    const map = {
      becky: "Welcome",
      adam: "Session",
      theresa: "Interview",
      kenny: "GreatHall",
    };
    return map[activeUser.character] === source;
  };

  //function to handle when the user presses confirm
  const handleConfirm = () => {
    const newInternalMax = { ...internalMax };

    //update the values from other departments
    Object.keys(selected).forEach((key) => {
      if (key !== "Outside") {
        newInternalMax[key] = Math.max(newInternalMax[key] - selected[key], 0);
      }
    });


    //send the selected values to the game via socket
    const totalAccepted = Object.values(selected).reduce(
      (acc, val) => acc + val,
      0
    );

    //make sure we have enough room
    const newTotalStudents = game[currentDept].students + totalAccepted;

    if (newTotalStudents > game[currentDept].volunteers) {
      alert("Not enough volunteers for all students!");
      return;
    }

    setGame((prev) => {
      const newGame = { ...prev };
    
      // Add students to the current department
      newGame[currentDept].students += totalAccepted;
    
      // Subtract transferred students from source departments
      Object.keys(selected).forEach((key) => {
        if (key !== "Outside") {
          newGame[key].exitingTo[currentDept] -= selected[key];
          newGame[key].students -= selected[key]; // ✅ FIX: remove students from source
        }
      });
    
      // Update the outside queue
      newGame[currentDept].outsideQueue = Math.max(
        newGame[currentDept].outsideQueue - selected["Outside"],
        0
      );
    
      return newGame;
    });

    channel.send({
      type: "broadcast",
      event: "manage_arrivals",
      payload: {
        department: currentDept,
        newStudents: game[currentDept].students,
      },
    });

    //reset the accepted arrival counts
    setInternalMax(newInternalMax);
    const newOutsideMax = Math.max(outsideMax - selected["Outside"], 0);
    setOutsideMax(newOutsideMax);

    setSelected({
      Outside: 0,
      Welcome: 0,
      Session: 0,
      Interview: 0,
      GreatHall: 0,
    });

    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Manage Arrivals - {renderHour(round)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <strong>Number of empty rooms: </strong>
          {fakeMaxArrivals}
        </div>

        <div className="row fw-bold mb-2">
          <div className="col">Number of Arrivals</div>
          <div className="col">Arrivals Accepted</div>
        </div>

        {arrivalSources.map((source) => {
          if (source !== "Outside" && isCurrentDepartment(source)) return null;

          const maxVal = getMaxValue(source);
          return (
            <div key={source} className="row align-items-center mb-2">
              {/* Left: Number of arrivals */}
              <div className="col">
                <strong>{source}:</strong> {maxVal}
              </div>

              {/* Right: Selected + buttons */}
              <div className="col d-flex align-items-center">
                <strong className="me-2">{source}</strong>
                <span className="mx-2">{selected[source]}</span>
                <button
                  className="btn btn-sm btn-outline-secondary mx-1"
                  onClick={() => increment(source, maxVal)}
                >
                  ▲
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary mx-1"
                  onClick={() => decrement(source)}
                >
                  ▼
                </button>
              </div>
            </div>
          );
        })}

        <div className="text-end mt-3">
          <strong>Total Accepted:</strong> {totalNumAccpeted}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={handleConfirm}>
          Confirm
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ManageArrivalsPopup;
