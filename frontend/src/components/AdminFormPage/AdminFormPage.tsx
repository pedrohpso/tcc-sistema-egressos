import React, { useState, useEffect } from 'react';
import { useCourse } from '../../context/CourseContext';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import './AdminFormPage.css';
import { getMockFormData, iForm } from '../AlumniForm/mockFormData';
import { useNavigate } from 'react-router-dom';

const AdminFormPage: React.FC = () => {
  const { selectedCourse } = useCourse();
  const [forms, setForms] = useState<iForm[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      const mockForms = await getMockFormData();
      setForms([mockForms]);
    };
    fetchForms();
  }, [selectedCourse]);

  const handleAddForm = () => {
    if (newFormTitle.trim() === '') return;
    const newForm: iForm = {
      id: forms.length + 1,
      title: newFormTitle,
      status: 'draft',
      fields: [],
    };
    setForms([newForm, ...forms]);
    setIsModalOpen(false);
    setNewFormTitle('');
  };

  const handleEditForm = (formId: number) => {
    navigate(`/admin/forms/${formId}`);
  };

  return (
    <div className="admin-form-page">
      <div className="admin-form-page-header">
        <h1>Formulários do Curso {selectedCourse?.shortname}</h1>
        <Button label="Adicionar Formulário" onClick={() => setIsModalOpen(true)} />
      </div>
      {forms.length === 0 ? (
        <p>O curso ainda não possui nenhum formulário.</p>
      ) : (
        <ul className="form-list">
          {forms.map((form) => (
            <li key={form.id} className={form.status === 'published' ? 'form-item published' : 'form-item'}>
              <div className="form-item-title">{form.title}</div>
              {form.status === 'draft' ? (
                <div className="form-item-actions">
                  <Button
                    label="Editar"
                    onClick={() => handleEditForm(form.id)}
                  />
                </div>
              ) : (
                <div className="form-item-status">Publicado</div>
              )}
            </li>
          ))}
        </ul>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Adicionar novo formulário</h2>
        <input
          type="text"
          value={newFormTitle}
          onChange={(e) => setNewFormTitle(e.target.value)}
          placeholder="Digite o título do formulário"
        />
        <Button label="Adicionar" onClick={handleAddForm} />
      </Modal>
    </div>
  );
};

export default AdminFormPage;
