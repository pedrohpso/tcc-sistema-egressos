import React, { useState, useEffect } from 'react';
import { useCourse } from '../../context/CourseContext';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import './AdminFormPage.css';
import { iForm, createForm, getFormsByCourseId } from '../AlumniForm/mockFormData';
import { useNavigate } from 'react-router-dom';

const AdminFormPage: React.FC = () => {
  const { selectedCourse } = useCourse();
  const [forms, setForms] = useState<iForm[]>([]);
  const [isAddFormModalOpen, setIsAddFormModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        if (!selectedCourse) return;
        const mockForms = await getFormsByCourseId(selectedCourse!.id);
        setForms(mockForms);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };
    fetchForms();
  }, [selectedCourse]);

  const handleAddForm = async () => {
    if (newFormTitle.trim() === '') return;
    try {
      const newForm = await createForm(newFormTitle)
      setForms([newForm, ...forms]);
    } catch (error) {
      console.error('Error creating new form:', error);
    }
    setIsAddFormModalOpen(false);
    setNewFormTitle('');
  };

  const closeAddForModal = () => {
    setIsAddFormModalOpen(false);
    setNewFormTitle('');
  }

  const handleEditForm = (formId: number) => {
    navigate(`/admin/forms/${formId}`);
  };

  return (
    <div className="admin-form-page">
      <div className="admin-form-page-header">
        <h1>Formulários do Curso {selectedCourse?.shortname}</h1>
        <Button label="Adicionar Formulário" onClick={() => setIsAddFormModalOpen(true)} />
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
      <Modal isOpen={isAddFormModalOpen} onClose={() => closeAddForModal()}>
        <h2 className='add-form-modal-title'>Adicionar novo formulário</h2>
        <input className='add-form-modal-input'
          type="text"
          value={newFormTitle}
          onChange={(e) => setNewFormTitle(e.target.value)}
          placeholder="Digite o título do formulário"
        />
        <Button className='add-form-modal-button' label="Adicionar" onClick={handleAddForm} />
      </Modal>
    </div>
  );
};

export default AdminFormPage;
