import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Stack,
} from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import React from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { useState, useEffect } from "react";
function Home() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [lobby, setLobby] = useState();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div
      style={{ backgroundColor: "#622A2A", width: "100vw", height: "100vh" }}
    >
      <div>
        <Stack align="center">
          <Flex direction="row">
            <Flex direction="column" order="1" justify="center">
              {/* Heading */}
              <Flex order="1" justify="center">
                <Heading
                  fontSize={100}
                  fontFamily="inter"
                  align="center"
                  padding={50}
                  colorPalette="white"
                >
                  Interview Day
                </Heading>
              </Flex>
              <Flex order="2" justify="center">
                <Heading
                  fontSize={100}
                  fontFamily="inter"
                  align="center"
                  padding={50}
                  colorPalette="white"
                >
                  At
                </Heading>
              </Flex>
              <Flex order="3" justify="center">
                <Heading
                  fontSize={100}
                  fontFamily="inter"
                  align="center"
                  padding={50}
                  colorPalette="white"
                >
                  The Raikes School
                </Heading>
              </Flex>
            </Flex>

            {/* nav to setings */}
            <Flex order="2" justify="flex-end" gap="80">
              <IconButton
                aria-label="Settings"
                onClick={() => navigate("/settings")}
                rounded="full"
                size="xl"
                colorPalette="white"
              >
                <FiSettings />
              </IconButton>
            </Flex>
          </Flex>

          {/* Room Code Input */}
          <HStack spacing={10} paddingTop={20} paddingBottom={0}>
            <Input
              size="2xl"
              placeholder="Enter The Room Code"
              maxWidth={250}
              maxHeight={50}
              variant="filled"
              colorPalette="white"
              value={lobby}
              onChange={(e) => setLobby(e.target.value)}
            />

            <Button
              colorPalette="green"
              size="xl"
              rounded="md"
              variant="subtle"
              onClick={() => navigate("/lobby/" + lobby)}
            >
              Join Room
            </Button>
          </HStack>

          <Heading size="5xl" padding={10}>
            Or
          </Heading>

          {/* nav to login */}
          {!session ? (
            <Button
              size="xl"
              onClick={() => navigate("/login")}
              colorPalette="white"
            >
              Login as a Host
            </Button>
          ) : (
            <HStack spacing={10} paddingTop={20} paddingBottom={0}>
              <Button
                colorPalette="green"
                size="xl"
                rounded="md"
                variant="subtle"
                onClick={() =>
                  navigate("/lobby/" + Math.floor(Math.random() * 10000))
                }
              >
                Create Room
              </Button>
            </HStack>
          )}
        </Stack>
      </div>
    </div>
  );
}

export default Home;
