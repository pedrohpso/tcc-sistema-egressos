import { useState, useEffect } from 'react';
import { getIndicatorsByForm } from '../../../services/formService';

export interface IndicatorData {
  id: number;
  text: string;
  fieldId: number;
}

export const useIndicators = (formId: number | null) => {
  const [indicators, setIndicators] = useState<IndicatorData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formId) {
      setIsLoading(true);
      getIndicatorsByForm(formId).then(fetchedIndicators => {
        setIndicators(fetchedIndicators);
        setIsLoading(false);
      });
    }
  }, [formId]);

  return { indicators, isLoading };
};
