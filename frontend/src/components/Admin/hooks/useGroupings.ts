import { useState, useEffect } from 'react';

export const useGroupings = (indicator: string) => {
  const [groupings, setGroupings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (indicator) {
      setIsLoading(true);
      fetchGroupings(indicator).then(fetchedGroupings => {
        setGroupings(fetchedGroupings);
        setIsLoading(false);
      });
    }
  }, [indicator]);

  return { groupings, isLoading };
};

async function fetchGroupings(_indicator: string): Promise<string[]> {
  // Implementar a lógica de fazer a query pro backend
  return new Promise(resolve => setTimeout(() => resolve(['Por gênero', 'Por idade', 'Por região']), 1000));
}

