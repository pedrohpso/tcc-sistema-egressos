import { useState, useEffect } from 'react';

export interface IndicatorData {
  id: number;
  text: string;
  questionId: number;
}

export const useIndicators = (formId: number | null) => {
  const [indicators, setIndicators] = useState<IndicatorData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formId) {
      setIsLoading(true);
      fetchIndicators(formId).then(fetchedIndicators => {
        setIndicators(fetchedIndicators);
        setIsLoading(false);
      });
    }
  }, [formId]);

  return { indicators, isLoading };
};

async function fetchIndicators(_formId: number): Promise<IndicatorData[]> {
  return new Promise(resolve => setTimeout(() => resolve([
    { id: 1, text: 'Cursou pós-graduação', questionId: 1 }, 
    { id: 2, text: 'Estado atual', questionId: 2 },
    { id: 3, text: 'Satisfação com a Profissão', questionId: 3 }]), 1000));
}
