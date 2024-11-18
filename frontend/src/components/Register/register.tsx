import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormFieldProps } from '../Form/FormField/FormField';
import Form from '../Form/Form';
import { useCourse } from '../../context/CourseContext';
import './Register.css';
import { iOption } from '../../services/formService';
import { registerUser } from '../../services/userService';

const genderMapping: { [key: string]: string } = {
    1: 'male',
    2: 'female',
    3: 'trans_male',
    4: 'trans_female',
    5: 'non_binary',
    6: 'other'
};

const ethnicityMapping: { [key: string]: string } = {
    1: 'white',
    2: 'black',
    3: 'brown',
    4: 'yellow',
    5: 'indigenous',
    6: 'not_declared'
};

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { courses } = useCourse();

    const handleSubmit = async (formData: { [key: string]: string | string[] }) => {
        try {
            const gender = genderMapping[formData.gender as string];
            const ethnicity = ethnicityMapping[formData.ethnicity as string];
            
            const userData = {
                ...formData,
                gender,
                ethnicity,
                course_id: Number(formData.course)
            };

            const response = await registerUser(userData); 
            console.info('Usuário registrado com sucesso:', response);
            navigate('/');
        } catch (error) {
            console.error('Erro ao registrar o usuário:', error);
        }
    };

    const graduationYearArray: iOption[] = Array.from({ length: new Date().getFullYear() - 2016 }, (_, i) => ({ id: i + 2017, text: (i + 2017).toString() }));

    const fields: FormFieldProps[] = [
        {
            type: 'text',
            label: 'Nome Completo',
            required: true,
            name: 'name'
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
            name: 'password'
        },
        {
            type: 'date',
            label: 'Data de Nascimento',
            required: true,
            name: 'birthdate'
        },
        {
            type: 'single_choice',
            label: 'Gênero',
            required: true,
            name: 'gender',
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
            name: 'ethnicity',
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
            name: 'course',
            options: courses.map(course => ({ id: course.id, text: course.name }))
        },
        {
            type: 'single_choice',
            label: 'Ano de Graduação',
            name: 'graduation_year',
            options: graduationYearArray,
            required: true,
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
