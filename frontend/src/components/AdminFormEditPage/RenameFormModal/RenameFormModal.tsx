import React, { useState } from 'react';
import './RenameFormModal.css';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';
import { iForm, renameForm } from '../../../mockFormData';

interface RenameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  currentFormId: number;
  setCurrentForm: React.Dispatch<React.SetStateAction< iForm | null>>;
}

const RenameFormModal: React.FC<RenameFormModalProps> = ({ isOpen, onClose, currentTitle, currentFormId, setCurrentForm }) => {
  const [newTitle, setNewTitle] = useState(currentTitle);
  const [error, setError] = useState('');

  const handleRename = async () => {
    if (newTitle.trim() === '') {
      setError('O título do formulário é obrigatório');
      return;
    }

    if(newTitle === currentTitle) {
      onClose();
      return;
    }

    try {
      // requisição para renomear o formulário no backend
      await renameForm(currentFormId, newTitle);
      setCurrentForm((prevForm) =>
        prevForm ? { ...prevForm, title: newTitle } : prevForm
      );
      onClose();
    } catch (err) {
      setError('Ocorreu um erro ao renomear o formulário');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Renomear Formulário</h2>
      <input
        type="text"
        value={newTitle}
        onChange={handleInputChange}
        placeholder="Digite o novo nome do formulário"
        className="rename-form-input"
      />
      {error && <p className="error-message">{error}</p>}
      <div className="modal-buttons">
        <Button label="Cancelar" onClick={onClose} />
        <Button label="Salvar" onClick={handleRename} />
      </div>
    </Modal>
  );
};

export default RenameFormModal;
