import React, { useState } from 'react';

export interface FormFieldProps {
  label: string;
  type: 'text' | 'single_choice' | 'multiple_choice' | 'date' | 'email' | 'password';
  name: string; 
  options?: string[];
  dependency?: { field: string; value: string };
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, type, name, options, dependency, required }) => {
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const renderInput = () => {
    if (dependency && formValues[dependency.field] !== dependency.value) {
      return null;
    }

    switch (type) {
      case 'text':
        return <input type="text" name={name} required={required} onChange={handleChange} />;
      case 'date':
        return <input type="date" name={name} required={required} onChange={handleChange} />;
    case 'single_choice':
      return (
        <div>
        {options?.map(option => (
          <label key={option}>
            <input
            type="radio"
            name={name}
            value={option}
            onChange={handleChange}
            required={required && formValues[name] === undefined}
            />
            {option}
          </label>
        ))}
        </div>
      );
      case 'multiple_choice':
        return (
          <div>
            {options?.map(option => (
              <label key={option}>
                <input 
                type="checkbox"
                name={name} 
                value={option} 
                onChange={handleChange}
                required={required && formValues[name] === undefined}
                />
                {option}
              </label>
            ))}
          </div>
        );
      case 'email':
        return <input type="email" name={name} required={required} onChange={handleChange} />;
      case 'password':
        return <input type="password" name={name} required={required} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <label>{label}</label>
      <br/>{renderInput()}
    </div>
  );
};

export default FormField;