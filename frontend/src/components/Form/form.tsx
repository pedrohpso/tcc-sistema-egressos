import React, { useState } from 'react';

const FormEgresso: React.FC = () => {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState<number | string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, course, year };
    console.log('Formulário enviado: ', data);
  };

  return (
    <div>
      <h2>Preencha o formulário de egresso</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Curso"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Ano de conclusão"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default FormEgresso;