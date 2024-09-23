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
    localStorage.setItem(name, JSON.stringify(value));
  } else {
    localStorage.setItem(name, value);
  }
};

const removeDataFromLocalStorage = (name: string) => {
  localStorage.removeItem(name);
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
            acc[field.name] = Array.isArray(parsedValue) ? parsedValue : savedValue;
          } catch {
            acc[field.name] = savedValue;
          }
        }
        return acc;
      }, {});
      setFormData(savedData);
    }
  }, [fields, saveToLocalStorage]);

  useEffect(() => {
    if (saveToLocalStorage) {
      Object.keys(formData).forEach(name => saveDataToLocalStorage(name, formData[name]));
    }
  }, [formData, saveToLocalStorage]);

  const checkDependencies = (fieldName: string) => {
    const field = fields.find(f => f.name === fieldName);
    if (!field || !field.dependencies) return true;

    return field.dependencies.some(dep => {
      const dependentValue = formData[dep.fieldId];
      if (Array.isArray(dependentValue)) {
        return dep.optionIds.some(optionId => dependentValue.includes(String(optionId)));
      }
      return dep.optionIds.includes(Number(dependentValue));
    });
  };

  const handleChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fields.forEach(field => {
      if (!checkDependencies(field.name) && formData[field.name]) {
        setFormData(prev => {
          const updated = { ...prev };
          delete updated[field.name];
          removeDataFromLocalStorage(field.name);
          return updated;
        });
      }
    });
  }, [fields, formData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    if (saveToLocalStorage) {
      Object.keys(formData).forEach(name => removeDataFromLocalStorage(name));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field, index) => {
        if (!checkDependencies(field.name)) return null;
        return (
          <FormField
            key={index}
            {...field}
            value={formData[field.name] || ''}
            onChange={handleChange}
          />
        );
      })}
      <button type="submit">Enviar</button>
    </form>
  );
};

export default Form;
