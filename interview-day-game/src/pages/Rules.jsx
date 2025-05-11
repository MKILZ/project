import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Rules() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const sections = [
    {
      title: "Introduction",
      content: [
        "Welcome to Interview Day at the Raikes School!",
        "You have two options to learn the rules of the game:",
        "-- 1) Watch this tutorial video.",
        "-- 2) Click through the slides to read the rules in detail.",
      ],
      video: "https://www.youtube.com/watch?v=V892k2bjBBs",
    },
    {
      title: "Flow",
      content: [
        "During this game, potential students will arrive at different sections each simulated hour.",
        "Your task is to manage students and volunteers in your section while ensuring a smooth flow between departments.",
        "Some sections have arrows pointing from the edge of the board – this represents students arriving at the start of the day.",
        "Arrows between sections indicate how students can move.",
      ],
    },
    // More sections here...
  ];

  return (
    <div className="container d-flex flex-column align-items-center vh-100 bg-dark text-white py-5">
      <h1 className="display-4 text-center mb-4">
        Rules of Interview Day at Kauffman
      </h1>
      <div
        className="card p-4 bg-secondary text-white"
        style={{ maxWidth: "800px" }}
      >
        <div className="card-body">
          <h2 className="card-title">{sections[currentStep].title}</h2>
          {sections[currentStep].video && (
            <div className="text-center my-3">
              <iframe
                width="100%"
                height="315"
                src={sections[currentStep].video}
                title="Game Rules Video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          )}
          {sections[currentStep].content.map((paragraph, index) => (
            <p key={index} className="mt-2">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="text-center mt-3">
          <p>
            {currentStep + 1} of {sections.length}
          </p>
        </div>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-light"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button
            className="btn btn-light"
            onClick={() =>
              setCurrentStep((prev) => Math.min(prev + 1, sections.length - 1))
            }
            disabled={currentStep === sections.length - 1}
          >
            Next
          </button>
        </div>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-light" onClick={() => navigate("/home")}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Rules;
