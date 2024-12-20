import React from 'react';
import './FormField.css';

export interface Option {
  id: number;
  text: string;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'date' | 'single_choice' | 'multiple_choice';
  value?: string | string[];
  options?: Option[];
  required?: boolean;
  dependencies?: { fieldId: number, optionIds: number[] }[];
  onChange?: (name: string, value: string | string[]) => void;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, type, value, options, required, onChange }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange?.(name, e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkedValue = e.target.value;
    let updatedValue: string[] = [];

    if (Array.isArray(value)) {
      updatedValue = e.target.checked
        ? [...value, checkedValue]
        : value.filter(v => v !== checkedValue);
    } else {
      updatedValue = [checkedValue];
    }
    onChange?.(name, updatedValue);
  };

  const renderInput = () => {
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'date':
        return <input type={type} name={name} value={value as string} required={required} onChange={handleChange} />;
      case 'single_choice':
        return (
          <select name={name} value={value as string} required={required} onChange={handleChange}>
            <option value="">Selecione</option>
            {options?.map(option => (
              <option key={option.id} value={option.id}>{option.text}</option>
            ))}
          </select>
        );
      case 'multiple_choice':
        return (
          <div className='checkbox-container'>
            {options?.map(option => (
              <label key={option.id}>
                <input
                  type="checkbox"
                  name={name}
                  value={String(option.id)}
                  checked={Array.isArray(value) && value.includes(String(option.id))}
                  onChange={handleCheckboxChange}
                />
                {option.text}
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="form-field">
      <label>{label}</label>
      {renderInput()}
    </div>
  );
};

export default FormField;
