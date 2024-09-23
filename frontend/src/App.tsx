import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header/Header';
import './App.css';
import Footer from './components/Footer/Footer';

import { routes } from './routes';

const App: React.FC = () => {
  return (
      <Router>
        <div className="app-container">
          <Header />
          <main className="content">
            {routes()}
          </main>
          <Footer />
        </div>
      </Router>
  );
};

export default App;