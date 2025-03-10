import React from "react";
import { Flex, Heading, Button, IconButton, Spacer } from "@chakra-ui/react";
import { FiHome, FiSettings, FiBook } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <Flex 
      bg="rgba(0, 0, 0, 0.3)" 
      color="white" 
      p={4} 
      align="center" 
      width="100%" 
      position="fixed" 
      top="0" 
      left="0"
      zIndex="1000"
    >
      
      <Heading size="md">Interview Day at the Raikes School</Heading>
      
      <Spacer /> 

      {/* Home Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate("/home")}
        mr={5}
        _hover={{ bg: "gray.600" }}
        color="white"
      >
        Home
      </Button>

      {/* Rules Button */}
      <Button 
        variant="ghost" 
        onClick={() => window.open("/rules", "_blank")}
        mr={5}
        color="white"
        _hover={{ bg: "gray.600" }}
      >
        Rules
      </Button>

      {/* Settings Button */}
      <Button 
        variant="ghost" 
        color="white"
        _hover={{ bg: "gray.600" }}
        onClick={() => window.open("/settings", "_blank")}
        mr={5}
      >
        Settings
      </Button>

    </Flex>
  );
}

export default Header;
