import React from 'react';
import { CATEGORIES, ALL_STYLES } from '../data/stickersData';
import { CategoryId, VisualStyle } from '../types';
import {
  Cross,
  HeartHandshake,
  Sparkles,
  Dumbbell,
  Flower2,
  Coffee,
  Instagram,
  Smile,
  Pencil,
  Palette,
  Check,
  Grid,
  Syringe,
  Crown,
  Moon,
  CircleDot
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: CategoryId | 'all' | 'favorites';
  setSelectedCategory: (cat: CategoryId | 'all' | 'favorites') => void;
  selectedStyle: VisualStyle | 'all';
  setSelectedStyle: (style: VisualStyle | 'all') => void;
  totalResultsCount: number;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedStyle,
  setSelectedStyle,
  totalResultsCount,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cross':
        return <Cross className="w-4 h-4" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Dumbbell':
        return <Dumbbell className="w-4 h-4" />;
      case 'Flower2':
        return <Flower2 className="w-4 h-4" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4" />;
      case 'Smile':
        return <Smile className="w-4 h-4" />;
      case 'Pencil':
        return <Pencil className="w-4 h-4" />;
      case 'Palette':
        return <Palette className="w-4 h-4" />;
      case 'Moon':
        return <Moon className="w-4 h-4" />;
      case 'CircleDot':
        return <CircleDot className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-[#EFE8DF] border-b border-[#D4AF37]/20 py-3 px-4 sm:px-6 lg:px-8 space-y-2.5 shadow-2xs">
      {/* Categories Row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-xs font-bold'
              : 'bg-white/80 text-[#5B1E2D] border-[#D4AF37]/30 hover:bg-[#5B1E2D]/10'
          }`}
        >
          <Grid className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Todas ({totalResultsCount})</span>
        </button>

        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                isActive
                  ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-xs font-bold'
                  : 'bg-white/80 text-[#2B2B2B] border-[#D4AF37]/30 hover:bg-[#5B1E2D]/10 hover:text-[#5B1E2D]'
              }`}
            >
              <span className={isActive ? 'text-[#D4AF37]' : 'text-[#5B1E2D]'}>
                {getCategoryIcon(cat.icon)}
              </span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Visual Styles Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1.5 border-t border-[#D4AF37]/15">
        <span className="text-[10px] font-bold text-[#5B1E2D] uppercase tracking-widest shrink-0 mr-1 flex items-center gap-1">
          <Palette className="w-3.5 h-3.5 text-[#D4AF37]" /> Estilo:
        </span>

        <button
          onClick={() => setSelectedStyle('all')}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all border cursor-pointer ${
            selectedStyle === 'all'
              ? 'bg-[#5B1E2D] text-[#F8F6F3] border-[#5B1E2D] font-bold shadow-2xs'
              : 'bg-white/80 text-[#6E6E6E] border-[#D4AF37]/20 hover:bg-[#EFE8DF] hover:text-[#2B2B2B]'
          }`}
        >
          Todos
        </button>

        {ALL_STYLES.map((style) => {
          const isActive = selectedStyle === style;
          const isTracosFinos = style === 'Traços Finos';
          return (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all border flex items-center gap-1 cursor-pointer ${
                isActive
                  ? 'bg-[#D4AF37] text-[#5B1E2D] border-[#5B1E2D] font-bold shadow-2xs'
                  : isTracosFinos
                  ? 'bg-[#5B1E2D]/10 text-[#5B1E2D] border-[#5B1E2D]/30 hover:bg-[#5B1E2D]/20 font-bold'
                  : 'bg-white/80 text-[#6E6E6E] border-[#D4AF37]/20 hover:bg-[#EFE8DF] hover:text-[#2B2B2B]'
              }`}
            >
              {isTracosFinos && <Sparkles className="w-3 h-3 text-[#D4AF37]" />}
              <span>{style}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

