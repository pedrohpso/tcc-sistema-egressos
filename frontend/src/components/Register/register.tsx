import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormFieldProps } from '../Form/FormField/FormField';
import Form from '../Form/Form';
import { useCourse } from '../../context/CourseContext';
import './Register.css';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { courses } = useCourse();

    const handleSubmit = (formData: { [key: string]: string | string[] }) => {
        console.log('Form Data: ', formData);
        // TODO: Implementar lógica de cadastro
        navigate('/');
    };

    const fields: FormFieldProps[] = [
        {
            type: 'text',
            label: 'Nome Completo',
            required: true,
            name: 'nome'
        },
        {
            type: 'email',
            label: 'E-mail',
            required: true,
            name: 'email'
        },
        {
            type: 'password',
            label: 'Senha',
            required: true,
            name: 'senha'
        },
        {
            type: 'date',
            label: 'Data de Nascimento',
            required: true,
            name: 'data_nascimento'
        },
        {
            type: 'single_choice',
            label: 'Gênero',
            required: true,
            name: 'genero',
            options: [
                { id: 1, text: 'Masculino' },
                { id: 2, text: 'Feminino' },
                { id: 3, text: 'Trans Masculino' },
                { id: 4, text: 'Trans Feminino' },
                { id: 5, text: 'Não Binário' },
                { id: 6, text: 'Outro' },
                { id: 7, text: 'Prefiro não declarar' }
            ]
        },
        {
            type: 'single_choice',
            label: 'Etnia',
            required: true,
            name: 'etnia',
            options: [
                { id: 1, text: 'Branca' },
                { id: 2, text: 'Preta' },
                { id: 3, text: 'Parda' },
                { id: 4, text: 'Amarela' },
                { id: 5, text: 'Indígena' },
                { id: 6, text: 'Prefiro não declarar' }
            ]
        },
        {
            type: 'single_choice',
            label: 'Curso',
            required: true,
            name: 'curso',
            options: courses.map(course => ({ id: course.id, text: course.fullname }))
        }
    ];

    return (

        <div className='box'>
            <div className='register-container'>
                <h2>Registro</h2>
                <Form fields={fields} onSubmit={handleSubmit} />
            </div>    
        </div>    
    );
};

export default Register;
