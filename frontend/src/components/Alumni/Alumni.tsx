import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Alumni.css';

interface Form {
  id: number;
  title: string;
  status: 'pending' | 'answered';
}

const Alumni: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setForms([
      {
        id: 1,
        title: "Formulário de Egressos TADS Edição 2024",
        status: 'pending',
      },
      {
        id: 2,
        title: "Formulário de Egressos TADS Edição 2023",
        status: 'answered',
      },
    ]);
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