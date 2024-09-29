import React from 'react';
import './Button.css';

interface ButtonProps {
  onClick?: () => void;
  label: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className, type = 'button', icon, disabled }) => {
  return (
    <button type={type} className={`custom-button ${className}`} onClick={onClick} disabled={disabled}>
      {icon}
      {label}
    </button>
  );
};

export default Button;
