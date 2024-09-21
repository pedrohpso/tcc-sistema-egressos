import React, { useEffect } from 'react';
import './Header.css';
import Button from '../Button/button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userContext';

const Header: React.FC = () => {
  const { user, setUser } = useUser();
  
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  }

  const handleLogoutClick = () => {
    setUser(null);
    navigate('/');
  }

  const handleHomeClick = () => {
    navigate('/');
  }

  useEffect(() => {
    if(!user){
      navigate("/");
    };
  }, []);

  return (
    <header className="header">
      <h3>IFSP - Campus Campinas</h3>
      <h1 className="title" onClick={handleHomeClick}>Sistema de Egressos</h1>
      {user && <p className="username">Boas vindas, {user.name}!</p>}
      <div className="bar">
        { !user ? <div><Button onClick={handleLoginClick} label="Login"/> <Button onClick={handleRegisterClick} label="Registrar"/> </div>: <Button onClick={handleLogoutClick} label="Logout"/> }
      </div>
    </header>
  );
};

export default Header;