import React, { useState, useEffect } from 'react';
import FormField, { FormFieldProps } from '../FormField/FormField';
import './Form.css';

interface FormProps {
  fields: FormFieldProps[];
  onSubmit: (formData: { [key: string]: string | string[] }) => void;
  initialValues?: { [key: string]: string | string[] };
  saveToLocalStorage?: boolean;
}


const saveDataToLocalStorage = (name: string, value: string | string[]) => {
  if (Array.isArray(value)) {
    localStorage.setItem(name, JSON.stringify(value)); // Salva o array como string JSON
  } else {
    localStorage.setItem(name, value); // Salva strings normalmente
  }
};

const Form: React.FC<FormProps> = ({ fields, onSubmit, initialValues = {}, saveToLocalStorage = false }) => {
  const [formData, setFormData] = useState<{ [key: string]: string | string[] }>(initialValues);

  useEffect(() => {
    if (saveToLocalStorage) {
      const savedData = fields.reduce((acc: { [key: string]: string | string[] }, field) => {
        const savedValue = localStorage.getItem(field.name);
        if (savedValue) {
          try {
            const parsedValue = JSON.parse(savedValue);
            if (Array.isArray(parsedValue)) {
              acc[field.name] = parsedValue;
            } else {
              acc[field.name] = savedValue;
            }
          } catch (e) {
            acc[field.name] = savedValue; 
          }
        }
        return acc;
      }, {} as { [key: string]: string });
      setFormData(savedData);
    }
  }, [fields, saveToLocalStorage]);

  useEffect(() => {
    if (saveToLocalStorage) {
      Object.keys(formData).forEach(name => {
        saveDataToLocalStorage(name, formData[name]);
      });
    }
  }, [formData, saveToLocalStorage]);

  useEffect(() => {
    let updatedFormData = { ...formData };
    let hasChanges = false;
  
    fields.forEach(field => {
      if (field.dependencies && Array.isArray(field.dependencies)) {
        const isFieldVisible = field.dependencies.some(dep => {
          const dependentValue = formData[dep.fieldId];
          if (Array.isArray(dependentValue)) {
            return dep.optionIds.some(optionId => dependentValue.includes(String(optionId)));
          }
          return dep.optionIds.includes(Number(dependentValue));
        });
  
        if (!isFieldVisible && formData[field.name]) {
          delete updatedFormData[field.name];
          hasChanges = true;
          if (saveToLocalStorage) {
            localStorage.removeItem(field.name);
          }
        }
      }
    });
  
    // Atualiza o estado somente se houver mudanças no formData
    if (hasChanges) {
      setFormData(updatedFormData);
    }
  }, [fields, formData, saveToLocalStorage]);
  

  const handleChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
    if (saveToLocalStorage) {
      Object.keys(formData).forEach(name => localStorage.removeItem(name)); 
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field, index) => (
        <FormField
          key={index}
          {...field}
          value={formData[field.name] || ''}
          onChange={handleChange}
          formData={formData}
        />
      ))}
      <button type="submit">Enviar</button>
    </form>
  );
};

export default Form;
