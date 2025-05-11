import React, { useEffect, useContext } from "react";
import { AppContext } from "../context/useAppContext";

function Actions({
  updateBoard,
  game,
  setGame,
  readyUp,
  isReady,
  setIsReady,
  setManageArrivalsPopup,
  setReadyToExitPopup,
}) {
  const { activeUser } = useContext(AppContext);
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
        Session: {
          ...game.Session,
          volunteers: game.Session.volunteers + 1,
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
          GreatHall: {
            ...prev.GreatHall,
            volunteers: prev.GreatHall.volunteers + 1,
          },
        };
      });
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      switch (e.key) {
        case "1":
          if (!isReady) buyVolunteer(activeUser.character);
          break;
        case "2":
          if (!isReady && activeUser.role !== "Host") {
            readyUp();
            setIsReady(true);
          }
          break;
        case "3":
          if (activeUser.role !== "Host") {
            setManageArrivalsPopup(true);
          }
          break;
        case "4":
          if (activeUser.role !== "Host") {
            setReadyToExitPopup(true);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isReady,
    activeUser,
    buyVolunteer,
    readyUp,
    setIsReady,
    setManageArrivalsPopup,
    setReadyToExitPopup,
  ]);
  return (
    <div className="d-flex flex-column align-items-center gap-3 w-100">
      {activeUser && (
        <div className="d-flex flex-column align-items-center text-center">
          <img
            src={
              activeUser.role === "Host"
                ? "https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_1920x1920/public/node/person/photo/2024-07/people-headshot-steve-cooper.jpg?itok=ibY7HHY5"
                : activeUser.character === "becky"
                ? "https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-becky-barnard.jpg?itok=d8fal0xg"
                : activeUser.character === "adam"
                ? "https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-adam-britten.jpg?itok=fAYbnhXs"
                : activeUser.character === "theresa"
                ? "https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-theresa-luensmann.jpg?itok=unLlsXcF"
                : "https://media.licdn.com/dms/image/v2/D5603AQHSXRUVk33t0A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1726530605597?e=1752105600&v=beta&t=Gl5KfaDnVkxlDObX_AZL2kzfxDqhlpdoc0S8H6eLl5s"
            }
            alt={activeUser.character}
            style={{
              width: "190px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "0.75rem",
              border: "2px solid #ccc",
            }}
          />
          <h4 className="mt-2">
            {activeUser.role === "Host"
              ? "Host"
              : {
                  becky: "Welcome",
                  adam: "Session",
                  theresa: "Interview",
                  kenny: "Great Hall",
                }[activeUser.character]}
          </h4>
        </div>
      )}

      <button
        className="btn btn-pressable btn-secondary w-100"
        onClick={() => buyVolunteer(activeUser.character)}
        disabled={isReady}
      >
        Buy a Volunteer 🔺 (1)
      </button>

      {activeUser.role !== "Host" && (
        <>
          <button
            className={`btn btn-pressable w-100 ${
              isReady ? "btn-success" : "btn-secondary"
            }`}
            onClick={() => {
              readyUp();
              setIsReady(true);
            }}
            disabled={isReady}
          >
            {isReady ? "Ready!" : "Ready Up! (2)"}
          </button>

          <button
            className="btn btn-pressable btn-secondary w-100"
            onClick={() => setManageArrivalsPopup(true)}
          >
            Manage Arriving Students (3)
          </button>

          <button
            className="btn btn-pressable btn-secondary w-100"
            onClick={() => setReadyToExitPopup(true)}
          >
            Manage Exits (4)
          </button>
        </>
      )}
    </div>
  );
}

export default Actions;
