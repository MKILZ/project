import React from "react";

function About() {
  return (
    <div>
      className="about"
      <h1> About Us </h1>
      <p> Who are we? </p>
      <img
        src={
          "https://media.licdn.com/dms/image/v2/D4E03AQGs1UWJY1jRSg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1695250451964?e=1746662400&v=beta&t=r_bsLDZdeAw0MLaX5lBADgy-pU05KYcCk0fi4rqWUjI"
        }
        alt="MK Headshot"
      />
      <img
        src={
          "https://media.licdn.com/dms/image/v2/D5603AQH8y1jdo8U0hg/profile-displayphoto-shrink_400_400/B56ZSwRCtzHEAg-/0/1738124045816?e=1746662400&v=beta&t=lAT4IGTBu7XbKc-64mYp4KOVeX98ZEqxWV1I0qBq3r8"
        }
        alt="Lucy Headshot"
      />
    </div>
  );
}

export default About;
