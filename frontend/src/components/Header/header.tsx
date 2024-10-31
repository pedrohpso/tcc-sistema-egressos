import React from 'react';
import './Header.css';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCourse } from '../../context/CourseContext';

const Header: React.FC = () => {
  const { user, setUser } = useUser();
  const { courses, selectedCourse, setSelectedCourse } = useCourse();

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  }

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  }

  const handleHomeClick = () => {
    navigate('/');
  }

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="header">
      <div className='header-container'>
        <div className='title-container'>
          <h1 className="title" onClick={handleHomeClick}>Sistema de Egressos</h1>
        </div>
        <div className="image-container">
          <img src='/marca_if_campinas.png' alt='Logo' className='header-image' />
        </div>
      </div>
      <div className="bar">
        {!user ?
          <div>
            <Button className="bar-button" onClick={handleLoginClick} label="Login" />
            <Button className="bar-button" onClick={handleRegisterClick} label="Registrar" />
          </div>
          :
          <div className='user-header'>
            <div className="course-selector">
              {user.is_admin ? courses.map(course => (
                <Button
                  key={course.id}
                  label={course.name}
                  onClick={() => setSelectedCourse(course)}
                  className={selectedCourse?.id === course.id ? 'selected' : ''}
                />
              )) : (
                <p>Olá, {user.name}!</p>
              )}
            </div>
            <div>
              <Button className="bar-button" onClick={handleHomeClick} label="Início" />
              <Button className="bar-button" onClick={handleProfileClick} label="Perfil" />
              <Button className="bar-button" onClick={handleLogoutClick} label="Logout" />
            </div>
          </div>
        }
      </div>
    </header>
  );
};

export default Header;