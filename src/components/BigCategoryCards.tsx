import React from 'react';
import { CategoryId } from '../types';
import {
  Sparkles,
  Cross,
  Heart,
  Flower2,
  Syringe,
  Dumbbell,
  Coffee,
  Instagram,
  Pencil,
  Crown,
  Star
} from 'lucide-react';

interface BigCategoryCardsProps {
  selectedCategory: CategoryId | 'all' | 'favorites';
  onSelectCategory: (cat: CategoryId | 'all' | 'favorites') => void;
}

export const BIG_CATEGORY_ITEMS = [
  {
    id: 'deus-e-fe' as CategoryId,
    title: 'Fé & Gratidão',
    icon: Cross,
    emoji: '✨',
    desc: 'Versículos, cruzes e caligrafia sacra',
    bg: 'bg-gradient-to-br from-[#5B1E2D] to-[#8B2D44]',
    textColor: 'text-[#D4AF37]',
    badge: '120+ stickers',
  },
  {
    id: 'familia' as CategoryId,
    title: 'Família & Amor',
    icon: Heart,
    emoji: '🤍',
    desc: 'Nosso lar, união e afeto em traços finos',
    bg: 'bg-gradient-to-br from-[#EFE8DF] to-[#F8F6F3]',
    textColor: 'text-[#5B1E2D]',
    badge: '85+ stickers',
  },
  {
    id: 'autoestima' as CategoryId,
    title: 'Autoestima & Mindset',
    icon: Flower2,
    emoji: '🌸',
    desc: 'Frases de poder e amor próprio',
    bg: 'bg-gradient-to-br from-[#F5F5F5] to-[#EFE8DF]',
    textColor: 'text-[#5B1E2D]',
    badge: '95+ stickers',
  },
  {
    id: 'estetica-facial' as CategoryId,
    title: 'Estética Facial',
    icon: Syringe,
    emoji: '💉',
    desc: 'Harmonização, skincare & procedimentos',
    bg: 'bg-gradient-to-br from-[#5B1E2D] via-[#702538] to-[#D4AF37]',
    textColor: 'text-[#F8F6F3]',
    badge: 'Lançamento VIP',
  },
  {
    id: 'treino' as CategoryId,
    title: 'Treino & Workout',
    icon: Dumbbell,
    emoji: '🏋️',
    desc: 'Foco, constância e disciplina diária',
    bg: 'bg-gradient-to-br from-[#2B2B2B] to-[#1A1A1A]',
    textColor: 'text-[#D4AF37]',
    badge: '60+ stickers',
  },
  {
    id: 'lifestyle' as CategoryId,
    title: 'Lifestyle & Rotina',
    icon: Coffee,
    emoji: '💕',
    desc: 'Bom dia, café, rotina de planner',
    bg: 'bg-gradient-to-br from-[#EFE8DF] to-[#E5DCD0]',
    textColor: 'text-[#5B1E2D]',
    badge: '110+ stickers',
  },
  {
    id: 'instagram' as CategoryId,
    title: 'Instagram & Stories',
    icon: Instagram,
    emoji: '📷',
    desc: 'Caixinha de perguntas, link na bio',
    bg: 'bg-gradient-to-br from-[#5B1E2D] to-[#D4AF37]',
    textColor: 'text-[#F8F6F3]',
    badge: 'Em Alta',
  },
  {
    id: 'elementos-decorativos' as CategoryId,
    title: 'Lettering & Assinatura',
    icon: Pencil,
    emoji: '✍️',
    desc: 'Caligrafia moderna e traços delicados',
    bg: 'bg-gradient-to-br from-[#F8F6F3] to-[#EFE8DF]',
    textColor: 'text-[#2B2B2B]',
    badge: 'Assinatura 1px',
  },
  {
    id: 'frases-motivacionais' as CategoryId,
    title: 'Coleção Premium',
    icon: Crown,
    emoji: '👑',
    desc: 'Kits exclusivos em Dourado Champagne',
    bg: 'bg-gradient-to-br from-[#D4AF37] to-[#F3E5AB]',
    textColor: 'text-[#5B1E2D]',
    badge: 'Coleção de Luxo',
  },
  {
    id: 'favorites' as any,
    title: 'Meus Favoritos',
    icon: Star,
    emoji: '⭐',
    desc: 'Seus adesivos salvos para acesso rápido',
    bg: 'bg-gradient-to-br from-[#5B1E2D] to-[#3B131D]',
    textColor: 'text-[#D4AF37]',
    badge: 'Acesso Rápido',
  },
];

export const BigCategoryCards: React.FC<BigCategoryCardsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif-title font-bold text-[#2B2B2B]">
            Categorias de Luxo
          </h2>
          <p className="text-xs text-[#6E6E6E] font-light">
            Selecione uma coleção temática para filtrar os adesivos em PNG transparente 4K
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {BIG_CATEGORY_ITEMS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedCategory === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className={`group relative rounded-[20px] p-4 text-left transition-all duration-300 border flex flex-col justify-between h-36 shadow-sm hover:shadow-xl hover:-translate-y-1 ${item.bg} ${
                isSelected
                  ? 'ring-2 ring-[#D4AF37] border-[#D4AF37] shadow-lg scale-[1.02]'
                  : 'border-[#D4AF37]/25 hover:border-[#D4AF37]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-current border border-white/20">
                  {item.badge}
                </span>
              </div>

              <div>
                <h3 className={`font-serif-title font-bold text-sm leading-snug ${item.textColor}`}>
                  {item.title}
                </h3>
                <p className={`text-[10px] opacity-80 line-clamp-1 mt-0.5 ${item.textColor}`}>
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
