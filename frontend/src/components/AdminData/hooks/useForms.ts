import { useState, useEffect } from 'react';
import { getPublishedFormsByCourse } from '../../../services/formService';

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
      getPublishedFormsByCourse(courseId).then(fetchedForms => {
        setForms(fetchedForms);
        setIsLoading(false);
      });
    }
  }, [courseId]);

  return { forms, isLoading };
};

