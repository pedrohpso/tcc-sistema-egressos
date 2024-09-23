import { useState, useEffect } from 'react';

export const useYears = (course: string) => {
  const [years, setYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(course) {
      setIsLoading(true);
      fetchYears(course).then(fetchedYears => {
        setYears(fetchedYears);
        setIsLoading(false);
      });
    }
  }, [course]);

  return { years, isLoading };
};

async function fetchYears(_course: string): Promise<string[]> {
  // Implementar a lógica de fazer a query pro backend
  return new Promise(resolve => setTimeout(() => resolve(['2020', '2021', '2022']), 1000));
}

