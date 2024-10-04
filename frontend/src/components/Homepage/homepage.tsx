import React, { useEffect } from 'react';
import './Homepage.css';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Homepage: React.FC = () => {
  const { user } = useUser()
  const navigate =  useNavigate()

  useEffect(() => {
    if(user) {
      if(user.is_admin) {
        navigate('/admin/dashboard')
      }
      else{
        navigate('/alumni')
      }
    }
  })
  
  return (
        <div className="homepage">
          <h2>Boas-vindas ao Sistema de Egressos do IFSP - Campus Campinas!</h2>
          <p className="homepage-description">
          Estudo dos dados dos egressados do curso de Análise e Desenvolvimetno de Sistemas. A pesquisa visa mapear o perfil e trajetória profissional dos ex-alunos, coletando informações diretamente dos egressos.
          </p>
          <p className="homepage-description">
          O sistema auxilia no acompanhamento dos indicadores sobre empregabilidade e evolução acadêmica, oferecendo dados essenciais para melhorias no curso.
          </p>
        </div>
  );
};

export default Homepage;