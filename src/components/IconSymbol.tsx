import React from 'react';
import * as Icons from 'lucide-react';

interface IconSymbolProps {
  name?: string;
  className?: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const IconSymbol: React.FC<IconSymbolProps> = ({ name, className = 'w-5 h-5', size, color, style }) => {
  if (!name || name === 'none') return null;

  const IconComponent = (Icons as any)[name] || Icons.Sparkles;

  return <IconComponent className={className} size={size} color={color} style={style} />;
};
