import { useEffect, useContext, useState, useCallback } from "react";
import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { arrivalsData } from "../data/ArrivalsData";
import { Presentation } from "lucide-react";
import{randomEventsData} from "../data/RandomEventsData";

function Game() {
  const { lobby } = useParams();
  const hoursInDay = 7;
  const channel = supabase.channel(lobby + "changes");
  const { activeUser, setActiveUser, players, setPlayers } = useContext(AppContext);
  const [scoreCardModal, setScoreCardModal] = useState(false);
  const [settingsModalShow, setSettingsModalShow] = useState(false);
  const [arrivalsPopup, setArrivalsPopup] = useState(false);
  const [manageArrivalsPopup, setManageArrivalsPopup] = useState(false);
  const [readyToExitPopup, setReadyToExitPopup] = useState(false);
  const [randomEventPopup, setRandomEventPopup] = useState(false);
  const [round, setRound] = useState(0);
  const [eventTriggered, setEventTriggered] = useState(false);
  const [randomEventIndex, setRandomEventIndex] = useState(0);
   {/* Hard coding data for each room */}
  const [game, setGame] = useState({
    Lunch: {
      tables: 16,
      students: 14,
      volunteers: 14,
      exits: 1,
      exiting: 0,
      staffNotAvailable: 0,
      extraStaff: 0,
      studentsWaiting: 0,
    },
    Presentations: {
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
 {/* Hard coding beginning stats for all of the score cards */}
  const [scoreCard, setScoreCard] = useState([
    {
      hour: 0,
      parentDiversions: 0,
      studentsInWaiting: 0,
      extraStaff: 0,
    },
  ]);
 {/* Sending data to the database about gameboard data and what round it is */}
  function updateBoard(gameBoard) {
    console.log("updateBoard", gameBoard);
    channel.send({
      type: "broadcast",
      event: "update-board",
      payload: gameBoard,
    });
  }

  function increaseRound() {
    channel.send({
      type: "broadcast",
      event: "increase-round",
      payload: {},
    });
  }

//   function eventOccurs(){
//     // Host triggers event
//   channel.send({
//     type: "broadcast",
//     event: "random-event",
//     payload: { triggeredAt: round }
// });



  useEffect(() => {
    if (!activeUser) {
      // navigate("/");
    }
    
     {/* Giving a character to each player depending on the order they join the room */}
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("games")
        .select("players")
        .eq("lobby", lobby);

      if (error) {
        console.error(error);
      } else {
        setPlayers(data[0].players);
      }
    };
    fetchPlayers();

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
 {/* Give each player a blank score card */}
    setScoreCard(
      [...Array(hoursInDay)].map((_, i) => ({
        hour: i,
        parentDiversions: 0,
        studentsInWaiting: 0,
        extraStaff: 0,
      }))
    );
 {/* Grabbing data from the database */}
    channel
      .on("broadcast", { event: "update-board" }, (payload) => {
        console.log("update-board:", payload.payload);
        setGame(payload.payload);
      })
      .subscribe();

    channel.on("broadcast", { event: "increase-round" }, () => {
      setRound((prev) => {
        return prev + 1;
      });
      console.log(round);
    });
    channel.on('broadcast', { event: 'random-event' }, (payload) => {
      // setRandomEventIndex(() => {
      //   return Math.floor(Math.random() * randomEventsData.length);
      // });
      setRandomEventIndex(payload.payload.index);
      console.log("Random event index: " + randomEventIndex);
      // setRandomEventPopup(true);
    });
  }, [lobby]);

 {/* There are only 12 rounds in a game so greater than 12 is game over
  and each player gets their personalized stats breakdown */}
  useEffect(() => {
    if (round > 12) {
      alert("Game Over");
    }
    else if (round === 2) {
      setArrivalsPopup(false)
    }
     else{
      setArrivalsPopup(true)
    }
   
  }, [round]);

  useEffect(() => {
    if (round === 2 && !eventTriggered) {
      setEventTriggered(true);
  
      if (activeUser.role === "Host") {
        const randomIndex = Math.floor(Math.random() * 5);
        console.log("Random index chosen by host:", randomIndex);  // should show different values over games
        
  
        channel.send({
          type: "broadcast",
          event: "random-event",
          payload: { index: randomIndex }
        });
      }
      // setRandomEventPopup(true);
    }
  }, [round, eventTriggered, activeUser]);
  useEffect(() => {
    if (randomEventIndex !== null && round === 2) {
      setRandomEventPopup(true);
    }
  }, [randomEventIndex, round]);
 {/* Hard coding the rounds which are times in 30 min increments */}
  const renderHour = useCallback((round) => {
    const time = [
      "7:30",
      "8:00",
      "8:30",
      "9:00",
      "9:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "1:00",
    ];
    return time[round];
  });
  {/* Setting the buttons in the top left, scorecard, settings, and arrivals */}
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
        <button
          className="btn btn-secondary"
          onClick={() => setArrivalsPopup(true)}
        >
          Arrivals
        </button>
        <h1>{renderHour(round)}</h1>
      </div>
      <Board game={game}></Board>
      {/* Updating data that we grabbed from the database */}
      <Actions
        updateBoard={updateBoard}
        increaseRound={increaseRound}
        // eventOccurs={eventOccurs}
        game={game}
        setGame={setGame}
        setManageArrivalsPopup={setManageArrivalsPopup}
        setReadyToExitPopup={setReadyToExitPopup}
      ></Actions>
      {/* Creating popups for settings, arrivals, managing arrivals, ready to exit students, and score card */}
      <SettingsModal
        show={settingsModalShow}
        onHide={() => setSettingsModalShow(false)}
      />
      <ArrivalsPopup
        round = {round}
        show={arrivalsPopup}
        onHide={() => setArrivalsPopup(false)}
        renderHour={renderHour}
      />
      <ManageArrivalsPopup
        show={manageArrivalsPopup}
        onHide={() => setManageArrivalsPopup(false)}
        round={round}
        renderHour={renderHour}
        game={game}
      />
      <ReadyToExitPopup
        show={readyToExitPopup}
        onHide={() => setReadyToExitPopup(false)}
        round={round}
        renderHour={renderHour}
        game={game}
      />
      <ScoreCardModal
        scoreCard={scoreCard}
        show={scoreCardModal}
        onHide={() => setScoreCardModal(false)}
      />
      <RandomEventPopup
        round = {round}
        show={randomEventPopup}
        onHide={() => setRandomEventPopup(false)}
        renderHour={renderHour}
        eventIndex={randomEventIndex}
      />
    </div>
  );
}

export default Game;

function Actions({ updateBoard, game, setGame, increaseRound, setManageArrivalsPopup, setReadyToExitPopup }) {
  {/* When you click the buy volunteer button adding a volunteer to the count specific to your character. The host cannot do this. */}
  const { activeUser, players } = useContext(AppContext);
  function buyVolunteer(character) {
    if (character === "becky") {
      const local = {
        ...game,
        Welcome: {
          ...game.Welcome,
          volunteers: game.Welcome.volunteers + 1,
        },
      };
      setGame(local);
      updateBoard(local);
    } else if (character === "adam") {
      const local = {
        ...game,
        Presentations: {
          ...game.Presentations,
          volunteers: game.Presentations.volunteers + 1,
        },
      };
      setGame(local);
      updateBoard(local);
    } else if (character === "theresa") {
      setGame((prev) => {
        return {
          ...prev,
          Interview: {
            ...prev.Interview,
            volunteers: prev.Interview.volunteers + 1,
          },
        };
      });
    } else if (character === "kenny") {
      setGame((prev) => {
        return {
          ...prev,
          Lunch: {
            ...prev.Lunch,
            volunteers: prev.Lunch.volunteers + 1,
          },
        };
      });
    }
  }

  {/* Adding the pictures on the screen of your character */}
  return (
    <div className="d-flex flex-row w-100 card justify-content-between h-25 gap-2 p-2 mt-2">
     {activeUser && <div className="card d-flex p-2">
        {activeUser.character === "becky" && (
          <div>
            <img
              src="https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-becky-barnard.jpg?itok=d8fal0xg"
              alt="beckey"
              className="rounded-circle"
              style={{ width: "75px", height: "100px", objectFit: "cover" }}
            />
            <h3>Welcome</h3>
          </div>
        )}
        {activeUser.character === "adam" && (
          <div>
            <img
              src="https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-adam-britten.jpg?itok=fAYbnhXs"
              alt="adam"
              className="rounded-circle"
              style={{ width: "75px", height: "100px", objectFit: "cover" }}
            />
            <h3>Presentations</h3>
          </div>
        )}
        {activeUser.character === "theresa" && (
          <div>
            <img
              src="https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-theresa-luensmann.jpg?itok=unLlsXcF"
              alt="Theresa"
              className="rounded-circle"
              style={{ width: "75px", height: "100px", objectFit: "cover" }}
            />
            <h3>Interview</h3>
          </div>
        )}
        {activeUser.character === "kenny" && (
          <div>
            <img
              src="https://media.licdn.com/dms/image/v2/D5603AQFJz9OJXxUNsQ/profile-displayphoto-shrink_400_400/B56ZRMqLRMH0Ao-/0/1736452912894?e=2147483647&v=beta&t=uhRnWRaaN4llVldNwHHS8qzxZgX0wUtQtaoS0iLqTrQ"
              alt="kenny"
              className="rounded-circle"
              style={{ width: "75px", height: "100px", objectFit: "cover" }}
            />
            <h3>Lunch</h3>
          </div>
        )}
      </div>}
{/* Adding the button to buy a volunteer */}
      <div>
        <button
          className="btn btn-secondary"
          onClick={(e) => {
            e.preventDefault();
            buyVolunteer(activeUser.character);
          }}
        >
          buy a volunteer
        </button>
{/* Adding the button to go to the next round. Only the host can do this when all of the players are ready */}
        {activeUser.role === "Host" && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              increaseRound();
            }}
          >
            Next Round
          </button>
        )}
{/* Everyone except the host can see the manage arrivals button and click it to get a popup */}
        {activeUser.role !== "Host" && (
        <button
          className="btn btn-secondary"
          onClick={() => setManageArrivalsPopup(true)}
        >
          Manage Arriving Students 
        </button>
        )}
{/* Everyone except the host can see the ready to exit button and click it to see a popup */}
        {activeUser.role !== "Host" && (
        <button
          className="btn btn-secondary"
          onClick={() => setReadyToExitPopup(true)}
        >
          Ready to Exit 
        </button>
        )}

      </div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
{/* Updating the scorecard */}
function ScoreCard() {
  let hours = [0, 0, 0, 0, 0, 0, 0];
  return (
    <div className="d-flex w-100">
      <table className="table">
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

{/* Making the scorecard popup look good */}
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

function Board({ game }) {
  return (
    <div className="d-flex flex-column text-center align-content-center gap-3">
      <Lunch game={game}></Lunch>
      <div className="d-flex justify-content-between">
        <Presentations game={game}></Presentations>
        <Welcome game={game}></Welcome>
        <Interview game={game}></Interview>
      </div>
    </div>
  );
}

function Lunch({ game }) {
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
      <div>Lunch </div>
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

function Presentations({ game }) {
  const tables = 8;
  const students = 8;
  const exits = 3;
  const exiting = 0;
  const staffNotAvailable = 0;
  const extraStaff = 0;
  const studentsWaiting = 0;
  return (
    <div className="w-25 card" style={{ height: "400px" }}>
      Presentations
      <div className="d-flex flex-column justify-content-between">
        <div>exit {exiting + "/" + exits}</div>
        <div>volunteers {game.Presentations.volunteers}</div>
        <div>students Waiting {studentsWaiting}</div>
        <div>extra volunteers {extraStaff}</div>
        <div> staffNotAvailable {staffNotAvailable}</div>
        <div>students {students + "/" + tables}</div>
      </div>
    </div>
  );
}

function Interview({ game }) {
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

function Welcome({ game }) {
  const tables = 16;
  return (
    <div className="w-50 card" style={{ height: "200px" }}>
      Welcome
      <div className="d-flex flex-wrap justify-content-between">
        <div>exit {game.Welcome.exiting + "/" + game.Welcome.exits}</div>
        <div>volunteers {game.Welcome.volunteers}</div>
        <div>students Waiting {game.Welcome.studentsWaiting}</div>
        <div>extra volunteers {game.Welcome.extraStaff}</div>
        <div> staffNotAvailable {game.Welcome.staffNotAvailable}</div>
        <div>students {game.Welcome.students + "/" + tables}</div>
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


function ArrivalsPopup({ show, onHide, round, renderHour }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Arrivals - {renderHour(round)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>New students or parents have arrived!</p>
        <p> Welcome: {arrivalsData.Welcome[round]} </p>
        <p> Presentations: {arrivalsData.Presentations[round]} </p>
        <p> Interview: {arrivalsData.Interview[round]} </p>
        <p> Lunch: {arrivalsData.Lunch[round]} </p>
        {/* You can add any custom info or logic here */}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={onHide}>
          Continue
        </button>
      </Modal.Footer>
    </Modal>
  );
}

function ManageArrivalsPopup({ show, onHide, round, renderHour, game}) {
  const { activeUser } = useContext(AppContext);
  const getRand = () => {
    return Math.floor(Math.random() * 5);
  }

  const arrivalSources = ["Outside", "Welcome", "Presentations", "Interview", "Lunch"];

  const characterToDept = {
    becky: "Welcome",
    adam: "Presentations",
    theresa: "Interview",
    kenny: "Lunch", 
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
    Presentations: activeUser.character !== "adam" ? getRand() : 0,
    Interview: activeUser.character !== "theresa" ? getRand() : 0,
    Lunch: activeUser.character !== "kenny" ? getRand() : 0,
  };
  
  const [internalMax, setInternalMax] = useState(initialMaxInternal);

  //get num selected from each department
  const [selected, setSelected] = useState({
    Outside: 0,
    Welcome: 0,
    Presentations: 0,
    Interview: 0,
    Lunch: 0,
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
      adam: "Presentations",
      theresa: "Interview",
      kenny: "Lunch",
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
    setInternalMax(newInternalMax);
    setOutsideMax(newOutsideMax);

    //reset the accepted arrival counts
    setSelected({
      Outside: 0,
      Welcome: 0,
      Presentations: 0,
      Interview: 0,
      Lunch: 0,
    });

    //FIX THIS
    //update the game board
    {/* 
    const currentDept = characterToDept[activeUser.character];
    const totalAccepted = Object.values(selected).reduce((acc, val) => acc + val, 0);
    const updatedGame = {
      ...game,
      [currentDept]: {
        ...game[currentDept],
        students: game[currentDept].students + totalAccepted,
      },
    };
    setGame(updatedGame);
    */}

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

function ReadyToExitPopup({ show, onHide, round, renderHour }) {
  const arrivalSources = ["Outside", "Welcome", "Presentations", "Interview", "Lunch"];
  const { activeUser } = useContext(AppContext);
  const getRand = () => {
    return Math.floor(Math.random() * 5);
  }

  const characterToDept = {
    becky: "Welcome",
    adam: "Presentations",
    theresa: "Interview",
    kenny: "Lunch", 
  };
  
  const currentDept = characterToDept[activeUser.character];;

  const isCurrentDepartment = (source) => {
    const map = {
      becky: "Welcome",
      adam: "Presentations",
      theresa: "Interview",
      kenny: "Lunch",
    }
    return map[activeUser.character] === source;
  }
  
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Manage Ready to Exit Students - {renderHour(round)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {arrivalSources.map((source) => {
          if (source !== "Outside" && isCurrentDepartment(source)) return null;

          return (
            <div key={source} className="row align-items-center mb-2">
              <div className="col">
                <strong>{source}: </strong>{ getRand()}
              </div>
            </div>
          );
        })}
      </Modal.Body>
      </Modal>

  );
}

function RandomEventPopup({ show, onHide, round, renderHour, eventIndex }) {
  // const getRand = () => {
  //   return Math.floor(Math.random() * 5);
  // }
  // const eventRound = getRand();
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Event! - {renderHour(round)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <p> {randomEventsData[eventIndex]} </p> */}
        <p>
          {eventIndex !== null && eventIndex >= 0
            ? randomEventsData[eventIndex]
            : "Loading event..."}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={onHide}>
          Continue
        </button>
      </Modal.Footer>
    </Modal>
  );
}
