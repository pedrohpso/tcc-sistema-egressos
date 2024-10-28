import React, { useState, useEffect } from 'react';
import './EditFieldModal.css';
import { iField, FieldType, iEditableOption, UpdateFieldInput } from '../../../services/formService';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';

interface EditFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: iField;
  onSave: (updateFieldInput: UpdateFieldInput) => void;
  existingFields: iField[];
}

const EditFieldModal: React.FC<EditFieldModalProps> = ({
  isOpen,
  onClose,
  field,
  onSave,
  existingFields,
}) => {
  const [question, setQuestion] = useState(field.question);
  const [type, setType] = useState<FieldType>(field.type);
  const [options, setOptions] = useState<iEditableOption[]>(field.options || []);
  const [indicator, setIndicator] = useState(field.indicator || '');
  const [hasDependency, setHasDependency] = useState(field.dependencies ? true : false);
  const [dependencyFieldId, setDependencyFieldId] = useState<number | null>(
    field.dependencies && field.dependencies.length ? field.dependencies[0].fieldId : null
  );
  const [dependencyOptionIds, setDependencyOptionIds] = useState<number[]>(
    field.dependencies && field.dependencies.length ? field.dependencies[0].optionIds : []
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setQuestion(field.question);
    setType(field.type);
    setOptions(field.options || []);
    setIndicator(field.indicator || '');
    setHasDependency(field.dependencies && field.dependencies.length ? true : false);
    setDependencyFieldId(field.dependencies && field.dependencies.length ? field.dependencies[0].fieldId : null);
    setDependencyOptionIds(field.dependencies && field.dependencies.length ? field.dependencies[0].optionIds : []);
  }, [field]);

  const validate = () => {
    let validationErrors: { [key: string]: string } = {};
    if (!question.trim()) {
      validationErrors.question = 'O texto da questão é obrigatório.';
    }

    if ([FieldType.SINGLE_CHOICE, FieldType.MULTIPLE_CHOICE].includes(type)) {
      if (!indicator.trim()) {
        validationErrors.indicator = 'O indicador é obrigatório para questões de escolha única ou múltipla.';
      }

      if (options.filter(opt => opt.text.trim()).length < 2) {
        validationErrors.options = 'É necessário adicionar pelo menos duas opções.';
      }

      options.forEach((option, idx) => {
        if (!option.text.trim()) {
          validationErrors[`option_${idx}`] = `A opção ${idx + 1} não pode estar vazia.`;
        }
      });
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  useEffect(() => {
    if (!hasDependency) {
      setDependencyFieldId(null);
      setDependencyOptionIds([]);
    }
  }, [hasDependency]);

  const handleSave = () => {
    if (!validate()) return;
  
    const updatedInput: UpdateFieldInput = {};

    if (question !== field.question) {
      updatedInput.question = question;
    }
    if (type !== field.type) {
      updatedInput.type = type;
    }
    if (type !== FieldType.TEXT && type !== FieldType.DATE) {
      if (options !== field.options) {
        updatedInput.options = options;
      }
      if (indicator !== field.indicator) {
        updatedInput.indicator = indicator;
      }
    }
    if (hasDependency) {
      const newDependencies = dependencyFieldId && [{ fieldId: dependencyFieldId, optionIds: dependencyOptionIds }];
      if (JSON.stringify(newDependencies) !== JSON.stringify(field.dependencies)) {
        updatedInput.dependencies = newDependencies ? newDependencies : undefined;
      }
    } else if (field.dependencies && field.dependencies.length) {
      updatedInput.dependencies = [];
    }
  
    onSave(updatedInput);
    onClose();
  };
  

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, { id: undefined,  text: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, idx) => idx !== index);
    setOptions(updatedOptions);
  };

  const handleDependencyChange = (fieldId: number) => {
    setDependencyFieldId(fieldId);
    setDependencyOptionIds([]);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="edit-field-modal-content">
        <h2>Editar questão</h2>

        <label>Questão</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Digite a questão"
        />
        {errors.question && <p className="error-text">{errors.question}</p>}

        <label>Tipo</label>
        <select value={type} onChange={(e) => setType(e.target.value as FieldType)}>
          <option value={FieldType.TEXT}>Texto</option>
          <option value={FieldType.SINGLE_CHOICE}>Escolha Única</option>
          <option value={FieldType.MULTIPLE_CHOICE}>Múltipla Escolha</option>
          <option value={FieldType.DATE}>Data</option>
        </select>

        {(type !== FieldType.TEXT && type !== FieldType.DATE) && (
          <>
            <label>Indicador</label>
            <input
              type="text"
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
              placeholder="Digite o indicador"
            />
            {errors.indicator && <p className="error-text">{errors.indicator}</p>}

            <label>Opções</label>
            {options.map((option, idx) => (
              <div className="option-row" key={idx}>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Opção ${idx + 1}`}
                />
                <button className="remove-option-button" onClick={() => handleRemoveOption(idx)}>
                  X
                </button>
              </div>
            ))}
            <Button label="Adicionar Opção" onClick={handleAddOption} />
            {errors.options && <p className="error-text">{errors.options}</p>}
          </>
        )}

        <label>
          <input
            type="checkbox"
            checked={hasDependency}
            onChange={(e) => setHasDependency(e.target.checked)}
          />
          Esta questão depende de outra
        </label>

        {hasDependency && (
          <>
            <label>Questão da qual depende</label>
            <select
              value={dependencyFieldId || ''}
              onChange={(e) => handleDependencyChange(Number(e.target.value))}
            >
              <option value="">Selecione uma questão</option>
              {existingFields
                .filter(field => field.type === 'single_choice' || field.type === 'multiple_choice')
                .map(field => (
                  <option key={field.id} value={field.id}>
                    {field.question}
                  </option>
                ))}
            </select>

            {dependencyFieldId && (
              <>
                <label>Opções da qual depende</label>
                {existingFields
                  .find(field => field.id === dependencyFieldId)?.options?.map(option => (
                    <div key={option.id}>
                      <label>
                        <input
                          type="checkbox"
                          value={option.id}
                          checked={dependencyOptionIds.includes(option.id)}
                          onChange={(e) => {
                            const optionId = Number(e.target.value);
                            if (e.target.checked) {
                              setDependencyOptionIds([...dependencyOptionIds, optionId]);
                            } else {
                              setDependencyOptionIds(dependencyOptionIds.filter(id => id !== optionId));
                            }
                          }}
                        />
                        {option.text}
                      </label>
                    </div>
                  ))}
              </>
            )}
          </>
        )}

        <div className="modal-buttons">
          <Button label="Salvar" onClick={handleSave} />
          <Button label="Cancelar" onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
};

export default EditFieldModal;
