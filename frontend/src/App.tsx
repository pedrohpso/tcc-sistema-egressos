import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Homepage from './components/Homepage/Homepage';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import './App.css';
import Footer from './components/Footer/Footer';
import Error from './components/Error/Error';

const App: React.FC = () => {
  return (
      <Router>
        <div className="app-container">
          <Header />
          <main className="content">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Error name="Página não encontrada" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
};

export default App;