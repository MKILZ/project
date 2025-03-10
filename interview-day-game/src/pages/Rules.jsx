import React, { useState } from "react";
import { Container, Heading, Text, Box, Flex, Stack, Button } from "@chakra-ui/react";
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
        "-- 2) Click through the slides to read the rules in detail."
      ],
      video: "https://www.youtube.com/embed/YOUR_VIDEO_ID" 
    },
    {
      title: "Flow",
      content: [
        "During this game, potential students will arrive at different sections each simulated hour.",
        "Your task is to manage students and volunteers in your section while ensuring a smooth flow between departments.",
        "Some sections have arrows pointing from the edge of the board – this represents students arriving at the start of the day.",
        "Arrows between sections indicate how students can move.",
        "Players can only move students to sections with arrows pointing to them – simulating the real flow of students during Interview Day.",
        "Arrival Display: Shows which hour you are in and how many students are arriving."
      ]
    },
    {
      title: "Beads",
      content: [
        "Throughout the game, you will use three different beads.",
        "-- Blue Beads: Represent potential students needing guidance. Each department starts with a certain number.",
        "-- White Beads: Represent Raikes School volunteers helping students through the process.",
        "-- Clear Beads: Represent extra volunteers. You can only call in extra volunteers once per hour, and they take one hour to arrive."
      ]
    },
    {
      title: "Turn Steps",
      content: [
        "The following steps will guide you through each turn of the game. Follow them carefully to ensure an efficient interview day."
      ]
    },
    {
      title: "Step 1: Arrivals",
      content: [
        "At the start of each turn, check the Arrival Display to see how many students will be arriving at your section.",
        "Place the corresponding number of blue beads in the arrow pointing to your department.",
        "If you have available volunteers (white beads), you can match students with them immediately.",
        "On the first turn, everyone should have enough volunteers for the new students.",
        "If you do not have enough volunteers, leave the extra students on the arrival arrow."
      ]
    },
    {
      title: "Step 2: Exits",
      content: [
        "Each department has a different method for students to exit.",
        "-- Welcome Session: Students exit after a brief introduction.",
        "-- Lunch: Students exit after receiving their meal.",
        "-- Interview: Students exit once interviews are completed.",
        "-- Presentations: Students exit after their final presentations."
      ]
    },
    {
      title: "Step 3: Closed?",
      content: [
        "Departments can choose to close if they are full or unable to accept new students.",
        "Click the CLOSED button to indicate your department is not accepting more students.",
        "You can reopen your department at any time by unchecking the CLOSED status."
      ]
    },
    {
      title: "Step 4: Staffing",
      content: [
        "If you need extra volunteers, follow this procedure.",
        "-- Place clear beads in the Extra Volunteers Called area.",
        "-- Volunteers will arrive at the start of the next hour.",
        "-- You can send extra volunteers home at any time."
      ]
    },
    {
      title: "Step 5: Paperwork",
      content: [
        "Each department manager must fill out the paperwork form at the end of the hour.",
        "-- Log the number of students waiting in the arrivals area.",
        "-- Document the number of requests waiting to move into your department.",
        "-- Count the extra volunteers in your section and record them."
      ]
    },
    {
      title: "Performance Measures",
      content: [
        "Your team’s performance will be measured in three areas.",
        "-- Quality of Service: Keeping students moving efficiently.",
        "-- Financial Performance: Avoid unnecessary extra volunteers.",
        "-- Time Efficiency: Keep up with the expected game pace."
      ]
    },
    {
      title: "Begin the Game",
      content: [
        "Now that you have a basic understanding of the game, we will begin.",
        "You will have one hour to play followed by a discussion.",
        "Make sure to follow the steps and most importantly—have fun!"
      ]
    }
  ];

  return (
    <Flex 
      direction="column" 
      align="center" 
      justify="center" 
      minHeight="100vh" 
      bg="#622A2A" 
      color="white"
      padding={10}
    >
      {/* Page Title */}
      <Heading fontSize="5xl" fontFamily="Inter" textAlign="center" mb={8}>
        Rules of Interview Day at Kauffman
      </Heading>

      <Container maxW="900px" p={6} bg="rgba(255, 255, 255, 0.15)" borderRadius="lg" boxShadow="lg">
        <Stack spacing={6}>
          {/* Slide Content */}
          <Box>
            <Heading as="h2" size="lg" mb={2}>{sections[currentStep].title}</Heading>

            {/* Show YouTube Video on Introduction Page */}
            {sections[currentStep].video ? (
              <Flex justify="center" mb={4}>
                <iframe 
                  width="560" 
                  height="315" 
                  src={sections[currentStep].video} 
                  title="Game Rules Video"
                  frameBorder="0" 
                  allowFullScreen
                ></iframe>
              </Flex>
            ) : null}

            {sections[currentStep].content.map((paragraph, index) => (
              <Text key={index} mt={2}>{paragraph}</Text>
            ))}
          </Box>

          {/* Page Number Indicator */}
          <Text fontSize="md" textAlign="center" opacity={0.8}>
            {currentStep + 1} of {sections.length}
          </Text>

          {/* Navigation Buttons */}
          <Flex justify="space-between">
            <Button 
              colorScheme="gray" 
              size="lg" 
              onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))} // Fix for Previous button
              isDisabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <Button 
              colorScheme="gray" 
              size="lg" 
              onClick={() => setCurrentStep(prev => Math.min(prev + 1, sections.length - 1))} // Fix for Next button
              isDisabled={currentStep === sections.length - 1}
            >
              Next
            </Button>
          </Flex>

          {/* Home & Login Buttons */}
          <Flex justify="center" gap={6}>
            <Button colorScheme="gray" size="lg" onClick={() => navigate("/home")}>
              Home
            </Button>
            <Button colorScheme="gray" size="lg" onClick={() => navigate("/login")}>
              Login
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Flex>
  );
}

export default Rules;
