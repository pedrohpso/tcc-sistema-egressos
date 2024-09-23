import React from 'react';
import './Button.css';

interface ButtonProps {
  onClick?: () => void;
  label: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className, type = 'button', icon }) => {
  return (
    <button type={type} className={`custom-button ${className}`} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
};

export default Button;
