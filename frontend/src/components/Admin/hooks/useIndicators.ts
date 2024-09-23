import { useState, useEffect } from 'react';

export const useIndicators = (year: string) => {
  const [indicators, setIndicators] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (year) {
      setIsLoading(true);
      fetchIndicators(year).then(fetchedIndicators => {
        setIndicators(fetchedIndicators);
        setIsLoading(false);
      });
    }
  }, [year]);

  return { indicators, isLoading };
};

async function fetchIndicators(_year: string): Promise<string[]> {
  // Implementar a lógica de fazer a query pro backend
  return new Promise(resolve => setTimeout(() => resolve(['Cursou pós graduação', 'Estado atual', 'Satisfação com a Profissão']), 1000));
}

