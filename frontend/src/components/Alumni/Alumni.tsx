import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Alumni.css';
import { getUserForms } from '../../services/formService';

interface Form {
  id: number;
  title: string;
  status: 'pending' | 'answered';
}

const Alumni: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const userForms = await getUserForms();
        setForms(userForms);
      } catch (error) {
        console.error('Erro ao buscar formulários:', error);
      }
    };
    fetchForms();
  }, []);

  const handleFormClick = (id: number) => {
    navigate(`/form/${id}`);
  };

  return (
    <div className='box'>
      <div className="alumni-container">
        <h1>Formulários</h1>
        <div className="forms-list">
          {forms.map((form) => (
            <div
              key={form.id}
              className={`form-item ${form.status}`}
              onClick={() => form.status === 'pending' && handleFormClick(form.id)}
            >
              <h2>{form.title}</h2>
              <p>Status: {form.status === 'pending' ? 'Pendente' : 'Preenchido'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alumni;