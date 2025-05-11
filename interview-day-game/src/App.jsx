import "./App.css";
import { AppContext } from "./context/useAppContext";
import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Rules from "./pages/Rules";
import Leaderboard from "./pages/Leaderboard";

function App() {
  const { theme, setTheme } = useContext(AppContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/lobby/:lobby" element={<Lobby />} />
        <Route exact path="/game/:lobby" element={<Game />} />
        <Route exact path="/rules" element={<Rules />} />
        <Route exact path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
