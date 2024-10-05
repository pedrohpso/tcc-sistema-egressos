import React, { useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Form from '../Form/Form';
import { FormFieldProps } from '../Form/FormField/FormField';
import './Login.css'; 

const Login: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (formData: { [key: string]: string | string[] }) => {
    const email = formData['Email'] as string;
    const name = email.split('@')[0];
    const isAdmin = name === 'admin';

    // Configura o usuário no contexto
    setUser({ name, email, is_admin: isAdmin });
    navigate('/');
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleForgotPassword = () => {
    navigate('/password-recovery');
  };

  const fields: FormFieldProps[] = [
    {
      type: 'email',
      label: 'Email',
      required: true,
      name: 'Email',
    },
    {
      type: 'password',
      label: 'Senha',
      required: true,
      name: 'Senha',
    }
  ];

  return (
    <div className='box'>
      <div className='login-container'>
        <h2>Login</h2>
        <Form fields={fields} onSubmit={handleSubmit} />
        <div className='forgot-password-container'>
          <a className='forgot-password-link' onClick={handleForgotPassword}>
            Esqueceu sua senha?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
