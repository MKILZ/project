import "./App.css";
import { AppContext } from "./context/useAppContext";
import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Rules from "./pages/Rules";
import Settings from "./pages/Settings";
import About from "./pages/About";

function App() {
  const { theme, setTheme } = useContext(AppContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/lobby" element={<Lobby />} />
        <Route exact path="/game" element={<Game />} />
        <Route exact path="/rules" element={<Rules />} />
        <Route exact path="/settings" element={<Settings />} />
        <Route exact path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
