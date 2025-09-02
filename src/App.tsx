
//import Dashboard from './pages/Dashboard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashSim from './pages/DashSim';
const App = () => {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<DashSim/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App