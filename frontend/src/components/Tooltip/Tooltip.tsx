import React, { useState } from 'react';
import './Tooltip.css';
import { FaQuestionCircle } from 'react-icons/fa';

interface TooltipProps {
  message: string;
}

const Tooltip: React.FC<TooltipProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ top: rect.top - 40, left: rect.left + rect.width / 2 });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <FaQuestionCircle className="tooltip-icon" />
      {isVisible && (
        <div className="tooltip-message" style={{ top: position.top, left: position.left }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
