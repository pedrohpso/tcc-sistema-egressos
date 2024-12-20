import React, { useEffect, useState } from 'react';
import Form from '../Form/Form'; 
import { iForm, iField, iOption, getFormById, saveAnswers } from '../../services/formService';
import './AlumniForm.css';
import { useNavigate, useParams } from 'react-router-dom';

const AlumniForm: React.FC = () => {
  const [formData, setFormData] = useState<iForm | null>(null);
  const navigate = useNavigate();

  const { id: formId } = useParams();

  const saveAnswer = async (answers: { [key: string]: string | string[] }) => {
    try {
      await saveAnswers(Number(formId!), answers);
      navigate('/alumni')
    } catch (error) {
      console.error('Erro ao salvar respostas:', error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await getFormById(Number(formId!));
      setFormData(data);
    };

    fetchData();
  }, []);

  if (!formData) {
    return <div>Loading...</div>;
  }

  const fields = formData.fields.map((field: iField) => ({
    label: field.question,
    name: String(field.id),
    type: field.type,
    options: field.options?.map((option: iOption) => ({
      id: option.id,
      text: option.text,
    })),
    dependencies: field.dependencies,
    required: true,
  }));

  return (
    <div id='alumni-form' className='box'>
      <h2>{formData.title}</h2>
      <Form
        fields={fields}
        onSubmit={saveAnswer}
        saveToLocalStorage={true}
      />
    </div>
  );
};

export default AlumniForm;
