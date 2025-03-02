import { Heading, HStack, IconButton, Input, Stack } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import React from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <Stack 
          align="center">

          {/* Heading */}
          <Heading 
            fontSize={100} 
            fontFamily="inter" 
            align="center"
            padding={50}>
              Interview Day
          </Heading>
          <Heading 
            fontSize={100} 
            fontFamily="inter" 
            align="center" 
            padding={50}>
              At
          </Heading>
          <Heading 
            fontSize={100} 
            fontFamily="inter" 
            align="center" 
            padding={50}>
              The Raikes School
          </Heading>

          {/* Room Code Input */}
          <HStack 
            spacing={10}
            paddingTop={20}
            paddingBottom={0}>
            <Input 
              size="2xl" 
              placeholder="Enter The Room Code" 
              maxWidth={250}/>

            <Button 
              colorPalette="green"
               size="lg"
               rounded="md"
               variant="subtle">
              Join Room
            </Button>
          </HStack>

          <Heading 
            size="5xl"
            padding={10}>
            Or
          </Heading>

          {/* nav to login */}
          <Button 
            colorScheme="teal" 
            size="lg" 
            onClick={() => navigate("/login")}>
              Login as a Host
          </Button>

          {/* nav to setings */}
          <Button 
            colorScheme="teal"
            size="lg"
            onClick={() => navigate("/settings")}
          >
            Settings
          </Button>
        </Stack>
      </div>
    </div>
  );
}

export default Home;
