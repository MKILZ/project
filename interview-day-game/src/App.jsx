import "./App.css";
import { Button, Theme } from "@chakra-ui/react";
import { ThemeContext } from "./context/useUserContext";
import { useContext } from "react";
function App() {
  const { theme, setTheme } = useContext(ThemeContext);

  // const { user, setUser } = useContext();
  console.log(theme);
  return (
    <>
      <h1>{theme}</h1>
      <input type="text" onChange={(e) => setTheme(e.target.value)} />
      <Button>chuaoetuhsn</Button>
    </>
  );
}

export default App;
