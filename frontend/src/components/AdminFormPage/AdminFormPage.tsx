import React, { useState, useEffect } from 'react';
import { useCourse } from '../../context/CourseContext';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import './AdminFormPage.css';
import { useNavigate } from 'react-router-dom';
import { iForm, getFormsByCourse, createForm, deleteForm } from '../../services/formService';

const AdminFormPage: React.FC = () => {
  const { selectedCourse } = useCourse();
  const [forms, setForms] = useState<iForm[]>([]);
  const [isAddFormModalOpen, setIsAddFormModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<iForm | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        if (!selectedCourse) return;
        const mockForms = await getFormsByCourse(selectedCourse.id);
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
      const newForm = await createForm(newFormTitle, selectedCourse!.id);
      setForms([newForm, ...forms]);
    } catch (error) {
      console.error('Error creating new form:', error);
    }
    setIsAddFormModalOpen(false);
    setNewFormTitle('');
  };

  const handleEditForm = (formId: number) => {
    navigate(`/admin/forms/${formId}`);
  };

  const handleDeleteForm = async () => {
    if (!formToDelete) return;
    try {
      await deleteForm(formToDelete.id);
      setForms(forms.filter((form) => form.id !== formToDelete.id));
      setIsDeleteModalOpen(false);
      setFormToDelete(null);
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  const openDeleteModal = (form: iForm) => {
    setFormToDelete(form);
    setIsDeleteModalOpen(true);
  };

  const closeAddFormModal = () => {
    setIsAddFormModalOpen(false);
    setNewFormTitle('');
  };

  return (
    <div className="admin-form-page">
      <div className="admin-form-page-header">
        <h1>Formulários do Curso {selectedCourse?.name}</h1>
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
                  <Button label="Editar" onClick={() => handleEditForm(form.id)} />
                  <Button label="Excluir" onClick={() => openDeleteModal(form)} />
                </div>
              ) : (
                <div className="form-item-status">Publicado</div>
              )}
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={isAddFormModalOpen} onClose={() => closeAddFormModal()}>
        <h2 className="add-form-modal-title">Adicionar novo formulário</h2>
        <input
          className="add-form-modal-input"
          type="text"
          value={newFormTitle}
          onChange={(e) => setNewFormTitle(e.target.value)}
          placeholder="Digite o título do formulário"
        />
        <Button className="add-form-modal-button" label="Adicionar" onClick={handleAddForm} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <h2>Excluir Formulário</h2>
        <p>Tem certeza que deseja excluir o formulário "{formToDelete?.title}"? Esta ação não pode ser desfeita.</p>
        <div className="modal-buttons">
          <Button label="Cancelar" onClick={() => setIsDeleteModalOpen(false)} />
          <Button label="Excluir" onClick={handleDeleteForm} />
        </div>
      </Modal>
    </div>
  );
};

export default AdminFormPage;
