import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../Form/Form';
import './AdminRegister.css';
import { registerAdmin } from '../../services/userService';

const AdminRegister: React.FC = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const handleSubmit = async (formData: { [key: string]: string | string[] }) => {
        try {
            const adminData = {
                ...formData,
                is_admin: true
            };

            const response = await registerAdmin(adminData);
            console.info('Administrador registrado com sucesso:', response);
            setMessage('Administrador registrado com sucesso.');
        } catch (error: any) {
            console.error('Erro ao registrar o administrador:', error);
            setMessage('Erro ao registrar o administrador, cheque o console para mais informações.');
        }
    };

    const fields = [
        {
            type: 'text' as const,
            label: 'Nome Completo',
            required: true,
            name: 'name'
        },
        {
            type: 'email' as const,
            label: 'E-mail',
            required: true,
            name: 'email'
        },
        {
            type: 'password' as const,
            label: 'Senha',
            required: true,
            name: 'password'
        }
    ];

    return (
        <div className="admin-register-container">
            <h2>Registrar Administrador</h2>
            <Form fields={fields} onSubmit={handleSubmit} />
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default AdminRegister;
