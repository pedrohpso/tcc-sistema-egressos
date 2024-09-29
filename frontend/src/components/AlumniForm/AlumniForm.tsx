import React, { useEffect, useState } from 'react';
import Form from '../Form/Form'; 
import { getMockFormData, iForm, iField, iOption } from '../../mockFormData';
import './AlumniForm.css';
import { useNavigate } from 'react-router-dom';

const AlumniForm: React.FC = () => {
  const [formData, setFormData] = useState<iForm | null>(null);
  const navigate = useNavigate();

  const saveAnswer = (answers: { [key: string]: string | string[] }) => {
    console.log('Form Answers: ', answers);
    navigate('/alumni');
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await getMockFormData();
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
