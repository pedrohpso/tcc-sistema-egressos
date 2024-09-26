import { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import './YearRangeSelector.css';

export const YearRangeSelector: React.FC<{ minYear: number, maxYear: number, onChange: (range: number[]) => void }> = ({ minYear, maxYear, onChange }) => {
  const [values, setValues] = useState([minYear, maxYear]);
  
  return (
    <div>
      <Range
        values={values}
        step={1}
        min={minYear}
        max={maxYear}
        onChange={(newValues) => {
          setValues(newValues);
          onChange(newValues);
        }}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '6px',
              width: '100%',
              background: getTrackBackground({
                values,
                colors: ['#b8d8ba', '#17882c', '#b8d8ba'],
                min: minYear,
                max: maxYear
              })
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '24px',
              width: '24px',
              backgroundColor: '#FFF',
              border: '1px solid #17882c'
            }}
          />
        )}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px' }}>
        <span>{values[0]}</span>
        <span>{values[1]}</span>
      </div>
    </div>
  );
};
