import React from "react";
import { Text } from "@chakra-ui/react"
import { Image } from "@chakra-ui/react"
import { Heading } from "@chakra-ui/react"


function About() {
  return (
    <div style = {{ backgroundColor: '#622A2A', width: '100vw', height: '100vh' }}>
      <div>
        <Stack>
          <Heading 
            as="h1" size="xl" fontWeight="bold"> 
            About Us
          </Heading>
          <Heading as="h2" size="lg" fontWeight="semibold">
            Who are we?
          </Heading>
        </Stack>
        <Image
          // height="200px"
          src={"https://media.licdn.com/dms/image/v2/D5603AQEPQAt1bXEh-A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1694104002893?e=1746662400&v=beta&t=d0pLDh1XINoJPW3S1m-xkZnkvh6yrZTgTLEeBE5KuQc"
          }
          boxSize="200px"
          borderRadius="full"
          fit="cover"
          alt="Ian Headshot"
        />
        <Text> Ian is a sophomore computer science major in the Raikes School from Bloomfield, NE. </Text>
        <Image
          // height="200px"
          src={
            "https://media.licdn.com/dms/image/v2/D4E03AQGs1UWJY1jRSg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1695250451964?e=1746662400&v=beta&t=r_bsLDZdeAw0MLaX5lBADgy-pU05KYcCk0fi4rqWUjI"
          }
          boxSize="200px"
          borderRadius="full"
          fit="cover"
          alt="MK Headshot"
        />
        <Text> Mary Kate is a sophomore biochemistry major in the Raikes School from Omaha, NE. </Text>
        <Image
          // height="200px"
          src={
            "https://media.licdn.com/dms/image/v2/D5603AQH8y1jdo8U0hg/profile-displayphoto-shrink_400_400/B56ZSwRCtzHEAg-/0/1738124045816?e=1746662400&v=beta&t=lAT4IGTBu7XbKc-64mYp4KOVeX98ZEqxWV1I0qBq3r8"
          }
          boxSize="200px"
          borderRadius="full"
          fit="cover"
          alt="Lucy Headshot"
        />
        <Text> Lucy is a sophomore computer science major in the Raikes School from Elko, NV. </Text>

        <Image
          // height="200px"
          src={"https://drive.google.com/file/d/12tQaswIam1EJubX429nnNQaeg-g7BmVY/view"}
          boxSize="200px"
          borderRadius="full"
          fit="cover"
          alt="Zak Headshot"
        />
        <Text> Zak is a sophomore computer science major in the Raikes School from Omaha, NE. </Text>

        <h2> Why we are doing this </h2>
        <Text> 
        As college freshmen, the four of us participated in a team-building exercise that left a lasting impact. It was more than just a game—it challenged us, pushed us to think critically, and helped us grow both as individuals and as a team. Through that experience, we gained invaluable lessons about communication, problem-solving, and collaboration.

        Now, as students who have come so far in our journey at the Raikes School, we wanted to create something that not only pays tribute to the game that shaped us but also to the place where we first played it. The Raikes School has been instrumental in our growth, and we owe part of our development to that very first exercise.

        With Interview Day at the Raikes School, we hope to recreate the same sense of challenge, camaraderie, and discovery that we experienced. Our goal is for you to walk away having learned as much as we did—about problem-solving, teamwork, and maybe even yourself. Thank you for playing, and welcome to an experience that has meant so much to us. 
        </Text>

      </div>
    </div>
  );
}

export default About;
