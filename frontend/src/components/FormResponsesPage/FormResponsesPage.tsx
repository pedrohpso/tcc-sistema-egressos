import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUsersFromPublishedForm } from '../../services/formService';
import Button from '../Button/Button';
import './FormResponsesPage.css';

interface User {
  id: number;
  name: string;
  email: string;
}

const FormResponsesPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsersFromPublishedForm(Number(formId));
        setUsers(response);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };
    fetchUsers();
  }, [formId]);

  const handleViewUserAnswers = (userId: number) => {
    navigate(`/admin/forms/${formId}/responses/${userId}`);
  };

  return (
    <div className="form-responses-page">
      <h2>Selecione um aluno para visualizar as respostas</h2>
      {users.length === 0 ? (
        <p>Nenhum aluno respondeu a este formulário ainda.</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className="user-item">
              <span>{user.name} ({user.email})</span>
              <Button label="Ver Respostas" onClick={() => handleViewUserAnswers(user.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormResponsesPage;
