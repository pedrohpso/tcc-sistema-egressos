import React from 'react';
import './Button.css';

interface ButtonProps {
  onClick?: () => void; 
  label: string;       
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className, type='button' }) => {
  return (
    <button type={type} className={`custom-button ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
