import './App.css'
import { Route, Routes} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import MessagesPage from './pages/MessagesPage'
import MessagesView from './components/MessagesView'
import MakeFormTable from './components/MakeFormTable'

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<LoginPage/>}/>
      <Route path="/message" element={<MessagesPage/>}></Route>
      <Route path="/messageChat" element={<MessagesView/>}></Route>
      <Route path="/makeForm" element={<MakeFormTable/>}></Route>
    </Routes>
  )
}

export default App
