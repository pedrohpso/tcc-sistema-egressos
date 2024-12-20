import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFormAnswersByUser } from '../../services/formService';
import './UserAnswersPage.css';

interface Answer {
  question: string;
  answer: string | string[];
}

const UserAnswersPage: React.FC = () => {
  const { formId, userId } = useParams<{ formId: string; userId: string }>();
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await getFormAnswersByUser(Number(formId), Number(userId));
        setAnswers(response);
      } catch (error) {
        console.error('Erro ao buscar respostas do aluno:', error);
      }
    };
    fetchAnswers();
  }, [formId, userId]);

  return (
    <div className="user-answers-page">
      <h2>Respostas do Aluno</h2>
      <ul className="answers-list">
        {answers.map((answer, index) => (
          <li key={index} className="answer-item">
            <strong>{answer.question}</strong>: {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserAnswersPage;
