import React from 'react';
import './Button.css';

interface ButtonProps {
  onClick: () => void; 
  label: string;       
  className?: string;  
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className }) => {
  return (
    <button className={`custom-button ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
