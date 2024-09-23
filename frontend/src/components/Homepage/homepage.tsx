import React, { useEffect } from 'react';
import './Homepage.css';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Homepage: React.FC = () => {
  const { user } = useUser()
  const navigate =  useNavigate()

  useEffect(() => {
    if(user) {
      if(user.is_admin) {
        navigate('/admin')
      }
      else{
        navigate('/alumni')
      }
    }
  })
  
  return (
    <div>
        <div className="homepage">
          <h2>Boas-vindas ao Sistema de Egressos do IFSP - Campus Campinas!</h2>
          <p>Se você ainda não tem uma conta, registre-se.</p>
        </div>
    </div> 
  );
};

export default Homepage;