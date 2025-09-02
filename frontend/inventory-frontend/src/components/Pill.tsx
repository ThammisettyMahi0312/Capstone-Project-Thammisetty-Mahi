import React from 'react';

interface PillProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'amber' | 'gray' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

const Pill: React.FC<PillProps> = ({ children, color = 'gray', size = 'md' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    amber: 'bg-amber-100 text-amber-800',
    gray: 'bg-gray-100 text-gray-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClasses[color]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
};

export default Pill;