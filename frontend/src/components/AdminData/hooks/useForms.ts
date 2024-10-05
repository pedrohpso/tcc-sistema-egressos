import { useState, useEffect } from 'react';

export interface FormData {
  id: number;
  title: string;
  status: string;
}

export const useForms = (courseId: number | null) => {
  const [forms, setForms] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      setIsLoading(true);
      fetchForms(courseId).then(fetchedForms => {
        setForms(fetchedForms);
        setIsLoading(false);
      });
    }
  }, [courseId]);

  return { forms, isLoading };
};

async function fetchForms(_courseId: number): Promise<FormData[]> {
  return new Promise(resolve => setTimeout(() => resolve([
    { id: 1, title: 'Formulário de Egressos TADS Edição 2024', status: 'published' }, 
  ]), 1000));
}
