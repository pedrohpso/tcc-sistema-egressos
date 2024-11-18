import React, { useState } from 'react';
import Form from '../Form/Form';
import { FormFieldProps } from '../Form/FormField/FormField';
import './PasswordRecovery.css';
import { requestPasswordReset } from '../../services/userService';

const PasswordRecovery: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (formData: { [key: string]: string | string[] }) => {
    const email = formData['Email'] as string;
    await requestPasswordReset(email);
    setEmailSent(true);
  };

  const fields: FormFieldProps[] = [
    {
      type: 'email',
      label: 'Email',
      required: true,
      name: 'Email',
    }
  ];

  return (
    <div className='box'>
      <div className='password-recovery-container'>
        <h2>Recuperar Senha</h2>
        {emailSent ? (
          <p className="success-message">Um link de recuperação foi enviado para o seu e-mail.</p>
        ) : (
          <Form fields={fields} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default PasswordRecovery;
