import { useContext, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { AppContext } from "../context/useAppContext";
import { arrivalsData } from "../data/ArrivalsData";
import { supabase } from "../supabase/supabaseClient";


function ManageArrivalsPopup({ show, onHide, round, renderHour, game}) {
    const { activeUser } = useContext(AppContext);
    const getRand = () => {
      return Math.floor(Math.random() * 5);
    }
  
    const arrivalSources = ["Outside", "Welcome", "Session", "Interview", "GreatHall"];
  
    const characterToDept = {
      becky: "Welcome",
      adam: "Session",
      theresa: "Interview",
      kenny: "GreatHall", // greathall or lunch??
    };
    
    const currentDept = characterToDept[activeUser.character];
    
    const maxOutside = arrivalsData[currentDept]?.[round] ?? 0;
    const [outsideMax, setOutsideMax] = useState(maxOutside);
  
    useEffect(() => {
      const updatedMax = arrivalsData[currentDept]?.[round] ?? 0;
      setOutsideMax(updatedMax);
    }, [round, currentDept]);
  
  
    //get random number for each other department arrivals
    const initialMaxInternal = {
      Welcome: activeUser.character !== "becky" ? getRand() : 0,
      Session: activeUser.character !== "adam" ? getRand() : 0,
      Interview: activeUser.character !== "theresa" ? getRand() : 0,
      GreatHall: activeUser.character !== "kenny" ? getRand() : 0,
    };
    
    const [internalMax, setInternalMax] = useState(initialMaxInternal);
  
    //get num selected from each department
    const [selected, setSelected] = useState({
      Outside: 0,
      Welcome: 0,
      Session: 0,
      Interview: 0,
      GreatHall: 0,
    });
  
    //FIX THIS
    //get the max number of students each department can accept
    {/* 
    const maxArrivalsAllowed = Math.max(
      game[currentDept].volunteers - game[currentDept].students, 0
    );
    */}
  
    const increment = (source, maxVal) => {
      setSelected((prev) => {
        const newValue = prev[source] + 1;
        const updatedTotal = totalNumAccpeted + 1;
  
        //check if the new value is greater than the max value
        {/*
        return {
          ...prev,
          [source]:
            newValue > maxVal || updatedTotal > maxArrivalsAllowed
              ? prev[source]
              : newValue,
        };
        */}
        //check if the new value is greater than the max value
        return {
          ...prev,
          //make sure it doesn't go above the max
          [source]: newValue > maxVal ? maxVal : newValue,
        };
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
    }
  
    const totalNumAccpeted = Object.values(selected).reduce((acc, val) => acc + val, 0);
  
    //get the max value for each department
    const getMaxValue = (source) => {
      if(source === "Outside") {
        //return maxOutside;
        return outsideMax;
      }
      return internalMax
      [source];
    }
    
  
    const isCurrentDepartment = (source) => {
      const map = {
        becky: "Welcome",
        adam: "Session",
        theresa: "Interview",
        kenny: "GreatHall",
      }
      return map[activeUser.character] === source;
    }
  
    //function to handle when the user presses confirm
    const handleConfirm = () => {
      const newInternalMax = {...internalMax};
  
      //update the values from other departments
      Object.keys(selected).forEach((key) => {
        if (key !== "Outside") {
          newInternalMax[key] = Math.max(newInternalMax[key] - selected[key], 0);
        }
      });
  
      //update the outside value
      const newOutsideMax = Math.max(outsideMax - selected["Outside"], 0);

      //send the selected values to the game via socket
      const totalAccepted = Object.values(selected).reduce((acc, val) => acc + val, 0);
      supabase.channel(lobby + "changes").send({
        type: "broadcast",
        event: "manage_arrivals",
        payload: {
            department: currentDept,
            newStudents: game[currentDept].students + totalAccepted,
        },
      });
      
  
      //reset the accepted arrival counts
      setInternalMax(newInternalMax);
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
            <strong>Max Students Allowed to Arrive: 3</strong>
            {/*{maxArrivalsAllowed}*/}
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
