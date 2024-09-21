import React from 'react';
import './Homepage.css';
import { useUser } from '../../context/userContext';

const Homepage: React.FC = () => {
  const { user } = useUser();

  return (
    <main>
      {!user ?
        <div className="homepage">
          <h2>Boas-vindas!</h2>
          <p>Aqui você poderá se cadastrar e acessar suas informações.</p>
          <p>Clique no botão de registro se ainda não tiver uma conta.</p>
        </div>
        : 
        <div>
          <h2>Oque gostaria de fazer hoje, {user.name}?</h2>
        </div>
      }
    </main> 
  );
};

export default Homepage;