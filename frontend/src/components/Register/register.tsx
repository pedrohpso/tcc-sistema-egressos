import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormFieldProps } from '../FormField/FormField';
import Form from '../Form/Form';

const Register: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (formData: { [key: string]: string | string[] }) => {
        console.log('Form Data: ', formData);
        //TODO: Implementar lógica de cadastro
        navigate('/')
    };

    // Campos temporários
    const fields: FormFieldProps[] = [
        {
            type: 'text',
            label: 'Name',
            required: true,
            name: 'Name'
        },
        {
            type: 'email',
            label: 'Email',
            required: true,
            name: 'Email'
        },
        {
            type: 'password',
            label: 'Password',
            required: true,
            name: 'Password'
        }
    ]

    return (
        <div className='box'>
            <h2>Registro</h2>
            <Form fields={fields} onSubmit={handleSubmit}/>
        </div>    
    );
};

export default Register;