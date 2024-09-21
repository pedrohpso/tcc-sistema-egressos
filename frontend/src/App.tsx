import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import Header from './components/Header/header';
import Homepage from './components/Homepage/homepage';
import Register from './components/Register/register';
import Login from './components/Login/login';

const App: React.FC = () => {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};
export default App;