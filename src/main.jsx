import React from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./context/useAppContext.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <AppProvider>
      <App />
    </AppProvider>
  </>
);
