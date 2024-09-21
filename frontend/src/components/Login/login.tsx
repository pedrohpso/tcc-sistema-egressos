import React, { useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Form from '../Form/Form';
import { FormFieldProps } from '../FormField/FormField';

const Login: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Substituir aqui pela lógica de autenticação
    // Precisa implementar o token JWT.
    const form = event.target as HTMLFormElement;
    const email = form.elements.namedItem('Email') as HTMLInputElement;
    const name = email.value.split('@')[0];
    const isAdmin = name === 'admin' ? true : false;

    setUser({ name: email.value.split('@')[0], email: email.value, is_admin: isAdmin });
    navigate('/');
  };

  useEffect(() => {
    if(user){
      navigate('/');
    }
  }, []);

  const fields: FormFieldProps[] = [
    {
      type: 'email',
      label: 'Email',
      required: true,
      name: 'Email'
    },
    {
      type: 'password',
      label: 'Senha',
      required: true,
      name: 'Senha'
    }
  ];

  return (
    <div className='box'>
      <h2>Login</h2>
      <Form fields={fields} onSubmit={handleSubmit}/>
    </div>
  );
};

export default Login;
