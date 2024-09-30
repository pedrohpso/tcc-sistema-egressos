import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import './AdminFormEditPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { createFormField, createFormFieldInput, deleteField, getFormById, iForm, submitForm, updateFormFieldOrder } from '../../mockFormData';
import Modal from '../Modal/Modal';
import RenameFormModal from '../RenameFormModal/RenameFormModal';
import FieldItem from '../FieldItem/FieldItem';
import AddFieldModal from '../AddFieldModal/AddFieldModal';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { iField } from '../../mockFormData';

const AdminFormEditPage: React.FC = () => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<iForm | null>(null);
  const [fields, setFields] = useState<iField[]>(currentForm?.fields || []);
  const [dependentFieldMessage, setDependentFieldMessage] = useState<string | null>(null);

  const { formId } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchForm = async () => {
      try {
        const fetchedForm = await getFormById(Number(formId));
        setCurrentForm(fetchedForm);
        setFields(fetchedForm.fields);
      } catch (error) {
        console.error('Erro ao buscar o formulário:', error);
      }
    };
    fetchForm();
  }, [formId]);

  const handleSaveField = async (newField: Omit<createFormFieldInput, 'position'>) => {
    if (currentForm) {
      const position = fields.length + 1;
      const savedField = await createFormField(currentForm.id, { ...newField, position });
      setFields([...fields, savedField]);
    }
  };

  const handleSubmitForm = async () => {
    if (currentForm) {
      try {
        await submitForm(currentForm.id);
        setIsConfirmModalOpen(false);
        navigate('/admin/forms');
      } catch (error) {
        console.error('Erro ao enviar o formulário:', error);
      }
    }
  };

  const handleReorderEnd = async () => {
    if (currentForm) {
      try {
        const updatedOrder = fields.map((field, index) => ({
          fieldId: field.id,
          position: index + 1
        }));
        await updateFormFieldOrder(currentForm.id, updatedOrder);
        setIsReorderMode(false);
      } catch (error) {
        console.error('Erro ao atualizar a ordem das questões:', error);
      }
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reorderedFields = Array.from(fields);
    const [removed] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, removed);

    const invalidMove = reorderedFields.some((field, index) => {
      if (field.dependencies) {
        return field.dependencies.some(dep => {
          const dependentFieldIndex = reorderedFields.findIndex(f => f.id === dep.fieldId);
          return dependentFieldIndex > index;
        });
      }
      return false;
    });

    if (invalidMove) {
      console.error('Movimento inválido! Não pode mover uma questão antes da questão da qual ela depende.');
      return;
    }

    setFields(reorderedFields);
  };

  const handleDeleteField = async (fieldId: number) => {
    const fieldHasDependencies = fields.some(f =>
      f.dependencies?.some(dep => dep.fieldId === fieldId)
    );

    if (fieldHasDependencies) {
      const dependentFields = fields.filter(f =>
        f.dependencies?.some(dep => dep.fieldId === fieldId)
      );
      const dependentFieldPositions = dependentFields.map(f => f.position).join(', ');
      setDependentFieldMessage(`A questão ${fieldId} é uma dependência das questões nas posições: ${dependentFieldPositions}. Remova essas dependências antes de excluir.`);
    } else {
      // Fazer o soft delete
      const updatedFields = fields.filter(f => f.id !== fieldId);
      setFields(updatedFields);
      // Aqui faria a requisição de soft delete para o backend
      await deleteField(fieldId);
    }
  };

  if (!currentForm) {
    return <p>Carregando...</p>;
  }

  const canSubmitForm = fields.length > 0;

  return (
    <div className="admin-form-edit-page">
      {currentForm && (
        <div className="admin-form-edit-page-header">
          <h2>{currentForm?.title}</h2>
          <div className="button-group">
            <Button label="Renomear Formulário" onClick={() => setIsRenameModalOpen(true)} />
            <Button label="Adicionar questão" onClick={() => setIsAddFieldModalOpen(true)} />
            <Button
              label="Alterar ordem"
              onClick={() => {
                if (isReorderMode) {
                  handleReorderEnd();
                }
                setIsReorderMode(!isReorderMode);
              }}
            />
            <Button label="Enviar formulário" onClick={() => setIsConfirmModalOpen(true)} disabled={!canSubmitForm} />
          </div>

          <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
            <p>Você tem certeza que deseja enviar o formulário? Uma vez enviado, não será possível editá-lo.</p>
            <Button label="Confirmar" onClick={handleSubmitForm} />
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
            existingFields={fields}
          />

          <Modal isOpen={!!dependentFieldMessage} onClose={() => setDependentFieldMessage(null)}>
            <p>{dependentFieldMessage}</p>
            <Button label="Fechar" onClick={() => setDependentFieldMessage(null)} />
          </Modal>
        </div>
      )}

      {isReorderMode ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="fields">
            {(provided) => (
              <ul className="field-list" {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map((field: iField, index: number) => (
                  <Draggable key={field.id} draggableId={`${field.id}`} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <FieldItem
                          field={field}
                          position={index + 1}
                          isReordering={isReorderMode}
                          onEdit={() => console.log('Editando questão', field)}
                          onDelete={() => handleDeleteField(field.id)}
                        />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <ul className="field-list">
          {fields.map((field, index) => (
            <li key={field.id}>
              <FieldItem
                field={field}
                position={index + 1}
                isReordering={false}
                onEdit={() => console.log('Editando questão', field)}
                onDelete={() => handleDeleteField(field.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminFormEditPage;
