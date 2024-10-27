import React, { useState } from 'react';
import './AddFieldModal.css';
import { iField, FieldType, CreateFormFieldInput } from '../../../services/formService';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: Omit<CreateFormFieldInput, 'position'>) => void;
  existingFields: iField[];
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingFields
}) => {
  const [question, setQuestion] = useState('');
  const [type, setType] = useState<FieldType>(FieldType.TEXT);
  const [options, setOptions] = useState<{ text: string }[]>([{ text: '' }, { text: '' }]);
  const [indicator, setIndicator] = useState('');
  const [hasDependency, setHasDependency] = useState(false);
  const [dependencyFieldId, setDependencyFieldId] = useState<number | null>(null);
  const [dependencyOptionIds, setDependencyOptionIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const handleSave = () => {
    if (!validate()) return;

    const newField: Omit<CreateFormFieldInput, 'position'> = {
      question,
      type,
      options: type !== FieldType.TEXT && type !== FieldType.DATE ? options : undefined,
      indicator: type !== FieldType.TEXT && type !== FieldType.DATE ? indicator : undefined,
      dependencies: hasDependency && dependencyFieldId
      ? [{ fieldId: dependencyFieldId, optionIds: dependencyOptionIds }]
      : undefined
    };

    onSave(newField);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setQuestion('');
    setType(FieldType.TEXT);
    setOptions([]);
    setIndicator('');
    setHasDependency(false);
    setDependencyFieldId(null);
    setDependencyOptionIds([]);
    setErrors({});
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, { text: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, idx) => idx !== index);
    setOptions(updatedOptions);
  };

  const handleDependencyChange = (fieldId: number) => {
    setDependencyFieldId(fieldId);
    setDependencyOptionIds([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="add-field-modal-content">
        <h2>Adicionar nova questão</h2>

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
                {errors[`option_${idx}`] && <p className="error-text">{errors[`option_${idx}`]}</p>}
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
          <Button label="Cancelar" onClick={onClose} />
          <Button label="Adicionar" onClick={handleSave} />
        </div>
      </div>
    </Modal>
  );
};

export default AddFieldModal;
