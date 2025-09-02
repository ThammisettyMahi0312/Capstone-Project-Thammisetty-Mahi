import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${hover ? 'hover:shadow-lg transition-shadow duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;