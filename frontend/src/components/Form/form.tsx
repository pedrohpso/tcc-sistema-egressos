import React from 'react';
import FormField, { FormFieldProps } from '../FormField/FormField';
import Button from '../Button/Button'; 

interface FormProps {
  fields: FormFieldProps[];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; 
}

const Form: React.FC<FormProps> = ({ fields, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      {fields.map(field => (
        <FormField key={field.name} {...field} />
      ))}
      <Button className='form-button' label="Enviar" type='submit' /> {}
    </form>
  );
};

export default Form;
