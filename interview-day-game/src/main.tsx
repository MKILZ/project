import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "@/components/ui/provider"
import { supabase } from "./supabase/supabaseClient";
import {UserProvider} from "./context/useUserContext.jsx";

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <UserProvider>
        <App />
      </UserProvider>
    </Provider>
  </StrictMode>,
)
