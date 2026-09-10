import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#0f121e]/90 border border-slate-800/80 rounded-xl transition-all duration-200 ${
        hoverEffect ? 'hover:border-slate-700 hover:bg-[#121626] cursor-pointer shadow-sm hover:shadow-md hover:shadow-black/40' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
