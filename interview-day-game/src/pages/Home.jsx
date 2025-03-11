import { Flex, Heading, HStack, IconButton, Input, Stack } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import React from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // ✅ Fixed Import
import { supabase } from "../supabase/supabaseClient";

function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: '#622A2A', width: '100vw', height: '100vh', paddingTop: "70px" }}>  {/* ✅ Added paddingTop */}
      
      
      <Header />

      <div>
        <Stack align="center">
          <Flex direction="row">
            <Flex direction="column" order="1" justify="center">
              {/* Heading */}
              <Flex order="1" justify="center">
                <Heading fontSize={100} fontFamily="inter" align="center" padding={50} color="white">
                  Interview Day
                </Heading>
              </Flex>
              <Flex order="2" justify="center">
                <Heading fontSize={100} fontFamily="inter" align="center" padding={50} color="white">
                  At
                </Heading>
              </Flex>
              <Flex order="3" justify="center">
                <Heading fontSize={100} fontFamily="inter" align="center" padding={50} color="white">
                  The Raikes School
                </Heading>
              </Flex>
            </Flex>

          </Flex>

          {/* Room Code Input */}
          <HStack spacing={10} paddingTop={20} paddingBottom={0}>
            <Input 
              size="2xl" 
              placeholder="Enter The Room Code" 
              maxWidth={250}
              maxHeight={50}
              variant='filled'
              color="white"
            />

            <Button 
              colorScheme="green"
              size="xl"
              rounded="md"
              variant="subtle"
              onClick={() => navigate("/game")}
            >
              Join Room
            </Button>
          </HStack>

          <Heading size="5xl" padding={10}>
            Or
          </Heading>

          {/* Login Button */}
          <Button  
            size="xl" 
            onClick={() => navigate("/login")}
            colorScheme="gray"
          >
            Login as a Host
          </Button>
        </Stack>
      </div>
    </div>
  );
}

export default Home;
