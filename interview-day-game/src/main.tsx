import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "@/components/ui/provider";
import { AppProvider } from "./context/useAppContext.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <AppProvider>
        <App />
      </AppProvider>
    </Provider>
  </StrictMode>
);
