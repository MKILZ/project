import "./App.css";
import { Button } from "@chakra-ui/react";
import { AppContext } from "./context/useAppContext";
import { useContext } from "react";
function App() {
  const { theme, setTheme } = useContext(AppContext);

  return (
    <>
      <h1>{theme}</h1>
      <input type="text" onChange={(e) => setTheme(e.target.value)} />
      <Button>chuaoetuhsn</Button>
    </>
  );
}

export default App;
