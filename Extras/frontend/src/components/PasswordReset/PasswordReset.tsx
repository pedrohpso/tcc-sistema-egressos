import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Form from '../Form/Form';
import { FormFieldProps } from '../Form/FormField/FormField';
import './PasswordReset.css';
import { passwordReset } from '../../services/userService';

const PasswordReset: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  if (!token) {
    return <p>Token de recuperação não encontrado.</p>;
  }

  const handleSubmit = async (formData: { [key: string]: string | string[] }) => {
    const { newPassword } = formData;

    try {
      await passwordReset(token, newPassword as string);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao redefinir a senha:', error);
    }
  };

  const fields: FormFieldProps[] = [
    {
      type: 'password',
      label: 'Nova Senha',
      required: true,
      name: 'newPassword'
    }
  ];

  return (
    <div className='box'>
      <div className='password-reset-container'>
        <h2>Redefinir Senha</h2>
        <Form fields={fields} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default PasswordReset;
