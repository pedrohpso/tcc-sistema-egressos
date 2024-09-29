import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import './AdminFormEditPage.css';
import { useParams } from 'react-router-dom';
import { createFormField, createFormFieldInput, getFormById, iForm } from '../AlumniForm/mockFormData';
import Modal from '../Modal/Modal';
import RenameFormModal from '../RenameFormModal/RenameFormModal';
import FieldItem from '../FieldItem/FieldItem';
import AddFieldModal from '../AddFieldModal/AddFieldModal';

const AdminFormEditPage: React.FC = () => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const { formId } = useParams();
  const [currentForm, setCurrentForm] = useState<iForm | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const fetchedForm = await getFormById(Number(formId));
        setCurrentForm(fetchedForm);
      } catch (error) {
        console.error('Erro ao buscar o formulário:', error);
      }
    };
    fetchForm();
  }, [formId]);

  const handleSaveField = async (newField: Omit<createFormFieldInput, 'position'>) => {
    if (currentForm) {
      const position = currentForm.fields.length + 1;

      const savedField = await createFormField(currentForm.id, { ...newField, position });

      setCurrentForm({
        ...currentForm,
        fields: [...currentForm.fields, savedField],
      });
    }
  };

  if (!currentForm) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="admin-form-edit-page">
      {currentForm && (<div className="admin-form-edit-page-header">
        <h2>{currentForm?.title}</h2>
        <div className="button-group">
          <Button label="Renomear Formulário" onClick={() => setIsRenameModalOpen(true)} />
          <Button label="Adicionar questão" onClick={() => setIsAddFieldModalOpen(true)} />
          <Button label="Alterar ordem" onClick={() => setIsReorderMode(!isReorderMode)} />
          <Button label="Enviar formulário" onClick={() => setIsConfirmModalOpen(true)} />
        </div>

        <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
          <p>Você tem certeza que deseja enviar o formulário? Uma vez enviado, não será possível editá-lo.</p>
          <Button label="Confirmar" onClick={() => console.log('Formulário enviado')} />
        </Modal>

        <RenameFormModal
            isOpen={isRenameModalOpen}
            onClose={() => setIsRenameModalOpen(false)}
            currentTitle={currentForm.title}
            currentFormId={currentForm.id}
            setCurrentForm={setCurrentForm}
          />
          
        <AddFieldModal
          isOpen={isAddFieldModalOpen}
          onClose={() => setIsAddFieldModalOpen(false)}
          onSave={handleSaveField}
          existingFields={currentForm.fields}
        />
      </div>
      )}

      <ul className="question-list">
        {currentForm?.fields.length === 0 ? (
          <p>O formulário ainda não tem nenhuma questão.</p>
        ) : (
          currentForm?.fields.map((field, index) => (
            <FieldItem
              key={field.id}
              field={field}
              position={index + 1}
              isReordering={isReorderMode}
              onEdit={() => console.log('Editando questão', field)}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminFormEditPage;
