import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "@/components/ui/provider";
import { supabase } from "./supabase/supabaseClient.js";
import { ThemeProvider } from "./context/useUserContext.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
