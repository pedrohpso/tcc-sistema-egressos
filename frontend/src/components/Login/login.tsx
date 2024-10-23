import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Form from '../Form/Form';
import { FormFieldProps } from '../Form/FormField/FormField';
import './Login.css'; 
import { loginUser } from '../../services/userService';

type LoginError = {
  response: {
    status: number;
    data: {
      error: string;
    };
  };
}
const Login: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: { [key: string]: string | string[] }) => {
    const email = formData['Email'] as string;
    const password = formData['Senha'] as string;

    try {
      const user = await loginUser(email, password);
      setUser(user);
      navigate('/');
    } catch (error ) {
      const e = error as LoginError;
      console.error('Erro no login:', error);
      
      if(e.response.status === 401) {
        setError(e.response.data.error);
      }else{
        setError('Erro ao fazer login');
      }
    }
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
        {error && <div className="error-message">{error}</div>}
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
