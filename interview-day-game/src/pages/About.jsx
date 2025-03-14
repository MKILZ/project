import React from "react";
import { Text, Image, Heading, Stack, Box, SimpleGrid, Center } from "@chakra-ui/react"
import zakrab from "../../public/zakrab.png"



function About() {
  return (
    <div style = {{ backgroundColor: '#622A2A', width: '100vw', height: '100vh', padding: "2rem" }}>
      <div>
      <Center>
          {/* Heading */}
          <Stack spacing={4} textAlign="Center">
            <Heading as="h1" size="xl" fontWeight="bold" color="white">
              About Us
            </Heading>
            <Heading as="h2" size="lg" fontWeight="semibold" color="white">
              Who are we?
            </Heading>
          </Stack>
        </Center>

        {/* introductions of each person */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4}} spacing={8} mt={8} justifyItems="center">
          <Box display="flex" flexDirection="column" alignItems="Center" textAlign="Center">
            <Heading as="h3" size="lg" mt={3} color="white"> 
              {/* mb={2} ml={3} */}
              Ian Kuchar
            </Heading>
            <Image
              src={"https://media.licdn.com/dms/image/v2/D5603AQEPQAt1bXEh-A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1694104002893?e=1746662400&v=beta&t=d0pLDh1XINoJPW3S1m-xkZnkvh6yrZTgTLEeBE5KuQc"
              }
              boxSize="200px"
              borderRadius="full"
              fit="cover"
              alt="Ian Headshot"
            />
          <Text textStyle="md" color="white"> 
            Ian is a sophomore computer science major in the Raikes School from Bloomfield, NE. 
          </Text>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="Center" textAlign="Center">
            <Heading as="h3" size="lg" mt={3} color="white"> 
              Mary Kate Nussrallah
            </Heading>
            <Image
              src={"https://media.licdn.com/dms/image/v2/D4E03AQGs1UWJY1jRSg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1695250451964?e=1746662400&v=beta&t=r_bsLDZdeAw0MLaX5lBADgy-pU05KYcCk0fi4rqWUjI"
              }
              boxSize="200px"
              borderRadius="full"
              fit="cover"
              alt="MK Headshot"
            />
          <Text textStyle="md" color="white"> 
            Mary Kate is a sophomore biochemistry major in the Raikes School from Omaha, NE. 
          </Text>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="Center" textAlign="Center">
            <Heading as="h3" size="lg" mt={3} color="white"> 
              Lucy Salyer
            </Heading>
            <Image
              src={"https://media.licdn.com/dms/image/v2/D5603AQH8y1jdo8U0hg/profile-displayphoto-shrink_400_400/B56ZSwRCtzHEAg-/0/1738124045816?e=1746662400&v=beta&t=lAT4IGTBu7XbKc-64mYp4KOVeX98ZEqxWV1I0qBq3r8"
              }
              boxSize="200px"
              borderRadius="full"
              fit="cover"
              alt="Lucy Headshot"
            />
          <Text textStyle="md" color="white"> 
            Lucy is a sophomore computer science major in the Raikes School from Elko, NV. 
          </Text>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="Center" textAlign="Center">
            <Heading as="h3" size="lg" mt={3} color="white"> 
              Zak Rab
            </Heading>
            <Image
              src="/zakrab.png"
              boxSize="200px"
              borderRadius="full"
              objectFit="cover"
              alt="Zak Headshot"
            />
          <Text textStyle="md" color="white"> 
            Zak is a sophomore computer science major in the Raikes School from Omaha, NE. 
          </Text>
          </Box>
        </SimpleGrid>

        <Box textAlign="center" mt={12}>
          <Heading as="h3" size="lg" fontStyle="semibold" color="white"> 
            Why we are doing this
          </Heading>
          <Text textStyle="md" color="white" textAlign="Center"> 
          As college freshmen, the four of us participated in a team-building exercise that left a lasting impact. It was more than just a game—it challenged us, pushed us to think critically, and helped us grow both as individuals and as a team. Through that experience, we gained invaluable lessons about communication, problem-solving, and collaboration.

          Now, as students who have come so far in our journey at the Raikes School, we wanted to create something that not only pays tribute to the game that shaped us but also to the place where we first played it. The Raikes School has been instrumental in our growth, and we owe part of our development to that very first exercise.

          With Interview Day at the Raikes School, we hope to recreate the same sense of challenge, camaraderie, and discovery that we experienced. Our goal is for you to walk away having learned as much as we did—about problem-solving, teamwork, and maybe even yourself. Thank you for playing, and welcome to an experience that has meant so much to us. 
          </Text>
        </Box>

      </div>
    </div>
  );
}

export default About;
