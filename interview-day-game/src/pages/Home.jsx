import React from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <Button colorScheme="teal" size="lg" onClick={() => navigate("/login")}>
          Login
        </Button>
        {/* nav to setings */}
        <Button
          colorScheme="teal"
          size="lg"
          onClick={() => navigate("/settings")}
        >
          Settings
        </Button>
      </div>
    </div>
  );
}

export default Home;
