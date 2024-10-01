import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../../mockData';
import { useCourse } from '../../context/CourseContext';
import './Dashboard.css'; // Estilos do grid e layout

const Dashboard: React.FC = () => {
  const { selectedCourse } = useCourse();
  const [formCount, setFormCount] = useState<number>(0);
  const [indicatorCount, setIndicatorCount] = useState<number>(0);
  const [alumniCount, setAlumniCount] = useState<number>(0);
  const [lastPublishedFormTitle, setLastPublishedFormTitle] = useState<string>('');
  const [formReachAverage, setFormReachAverage] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCourse) return;
      try {
        const {
          publishedFormsAmount,
          indicatorsAmount,
          registeredAlumniAmount,
          lastPublishedFormTitle,
          formReachAverage,
        } = await getDashboardData(selectedCourse.id);

        setFormCount(publishedFormsAmount);
        setIndicatorCount(indicatorsAmount);
        setAlumniCount(registeredAlumniAmount);
        setLastPublishedFormTitle(lastPublishedFormTitle);
        setFormReachAverage(formReachAverage); 
      } catch (error) {
        console.error('Erro ao buscar os dados do dashboard:', error);
      }
    };

    fetchData();
  }, [selectedCourse]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        {selectedCourse && <p className="course-name">{selectedCourse.fullname}</p>}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Formulários Publicados</h2>
          <p>{formCount}</p>
        </div>
        <div className="dashboard-card">
          <h2>Indicadores</h2>
          <p>{indicatorCount}</p>
        </div>
        <div className="dashboard-card">
          <h2>Egressos Cadastrados</h2>
          <p>{alumniCount}</p>
        </div>
        <div className="dashboard-card">
          <h2>Último Formulário Publicado</h2>
          <p>{lastPublishedFormTitle}</p>
        </div>
        <div className="dashboard-card">
          <h2>Média de alcance dos Formulários</h2>
          <p>{formReachAverage.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
