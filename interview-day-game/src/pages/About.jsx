import React from "react";
import MKHeadshot from "../assets/MKheadshot.jpg";
import LucyHeadshot from "../assets/lucy_headshot.jpg";
// TODO: get headshots for each group member

function About() {
  return (
    <div>
      className="about"
      <div>
        className="header"
        <h1> About Us </h1>
        <p> Who are we? </p>
        <img>src={MKHeadshot}</img>
        <img>src={LucyHeadshot}</img>
        {/* TODO: put in headshot for each group member */}
      </div>
    </div>
  );
}

export default About;
