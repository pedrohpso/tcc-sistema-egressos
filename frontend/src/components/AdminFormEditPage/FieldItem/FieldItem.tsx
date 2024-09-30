import React from 'react';
import { FaEdit, FaGripVertical, FaTrash } from 'react-icons/fa';
import './FieldItem.css';
import { iField } from '../../../mockFormData';

interface FieldItemProps {
  field: iField;
  position: number;
  isReordering: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const FieldItem: React.FC<FieldItemProps> = ({ field, position, isReordering, onEdit, onDelete }) => {
  const renderFieldType = () => {
    switch (field.type) {
      case 'text':
        return 'Texto';
      case 'single_choice':
        return 'Escolha Única';
      case 'multiple_choice':
        return 'Múltipla Escolha';
      case 'date':
        return 'Data';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="field-item">
      <div className="field-item-left">
        {isReordering && <FaGripVertical className="grip-icon" />}
        <span className="field-item-position">{position}.</span>
        <span className="field-item-title">{field.question}</span>
      </div>
      <div className="field-item-right">
        <span className="field-item-type">{renderFieldType()}</span>
        {['single_choice', 'multiple_choice'].includes(field.type) && (
          <>
            <span className="field-item-indicator">Indicador: {field.indicator || 'Nenhum'}</span>
            <span className="field-item-options">{field.options?.length || 0} opções</span>
          </>
        )}
        {!isReordering && (
          <>
            <FaEdit className="edit-icon" onClick={onEdit} />
            <FaTrash className="delete-icon" onClick={onDelete} />
          </>
        )}
      </div>
    </div>
  );
};

export default FieldItem;
