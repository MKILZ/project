import './App.css'
import Board from './components/Board.jsx'
import { Button,  } from "@chakra-ui/react"
import { useUserContext } from './context/useUserContext'
function App() {
  
  const { user, setUser } = useUserContext();

  return (
    <>
      <h1>{user}</h1>
      <input type="text" onChange={(e) => setUser(e.target.value)} />
      <Board></Board>
      <Button>chuaoetuhsn</Button>
    </>
  )
}

export default App
