import React from 'react';
import './Homepage.css';
import { useUser } from '../../context/UserContext';

const Homepage: React.FC = () => {
  const { user } = useUser();

  return (
    <div>
      {!user ?
        <div className="homepage">
          <h2>Boas-vindas ao Sistema de Egressos do IFSP - Campus Campinas!</h2>
          <p>Se você ainda não tem uma conta, registre-se.</p>
        </div>
        : 
        <div className='box'>
          {user.is_admin ? <p>Admin</p>: <p>Aluno</p>}
        </div>
      }
    </div> 
  );
};

export default Homepage;