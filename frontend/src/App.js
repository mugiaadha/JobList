import { BrowserRouter, Routes,Route } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
import JobDetail from "./components/JobDetail"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Login />}/>
        <Route path="register" element={<Register/>}/>
        <Route path="dashboard" element={<><Navbar/><Dashboard/></>}/>
        <Route path="detail/:id" element={<><Navbar/><JobDetail/></>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App