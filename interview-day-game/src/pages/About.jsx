import React from "react";
import { Text } from "@chakra-ui/react"

function About() {
  return (
    <div>
      <h1> About Us </h1>
      <p> Who are we? </p>
      <img
        src={
          "https://media.licdn.com/dms/image/v2/D4E03AQGs1UWJY1jRSg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1695250451964?e=1746662400&v=beta&t=r_bsLDZdeAw0MLaX5lBADgy-pU05KYcCk0fi4rqWUjI"
        }
        alt="MK Headshot"
      />
      <Text> Mary Kate is a sophomore biochemistry major in the Raikes School from Omaha, NE. </Text>
      <img
        src={
          "https://media.licdn.com/dms/image/v2/D5603AQH8y1jdo8U0hg/profile-displayphoto-shrink_400_400/B56ZSwRCtzHEAg-/0/1738124045816?e=1746662400&v=beta&t=lAT4IGTBu7XbKc-64mYp4KOVeX98ZEqxWV1I0qBq3r8"
        }
        alt="Lucy Headshot"
      />
      <Text> Lucy is a sophomore computer science major in the Raikes School from Elko, NV. </Text>

      <img
        src={"https://media.licdn.com/dms/image/v2/D5603AQEPQAt1bXEh-A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1694104002893?e=1746662400&v=beta&t=d0pLDh1XINoJPW3S1m-xkZnkvh6yrZTgTLEeBE5KuQc"

        }
        alt="Ian Headshot"
      />
      <Text> Ian is a sophomore computer science major in the Raikes School from Bloomfield, NE. </Text>

      <img 
        src={""}
        alt="Zak Headshot"
      />
      <Text> Zak is a sophomore computer science major in the Raikes School from Omaha, NE. </Text>

    </div>
  );
}

export default About;
