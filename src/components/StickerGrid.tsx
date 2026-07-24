import React from 'react';
import { StickerItem, CategoryId, VisualStyle } from '../types';
import { StickerCard } from './StickerCard';
import { CATEGORIES } from '../data/stickersData';
import { BigCategoryCards } from './BigCategoryCards';
import { FeaturedBannerCarousel } from './FeaturedBannerCarousel';
import { Sparkles, SearchX, Crown, Star } from 'lucide-react';

interface StickerGridProps {
  stickers: StickerItem[];
  selectedCategory: CategoryId | 'all' | 'favorites';
  selectedStyle: VisualStyle | 'all';
  onSelectCategory: (cat: CategoryId | 'all' | 'favorites') => void;
  onEditSticker: (sticker: StickerItem) => void;
  onTestInStory: (sticker: StickerItem) => void;
  onOpenPromptMaster: () => void;
  favoritesList?: string[];
  onToggleFavorite?: (id: string) => void;
}

export const StickerGrid: React.FC<StickerGridProps> = ({
  stickers,
  selectedCategory,
  selectedStyle,
  onSelectCategory,
  onEditSticker,
  onTestInStory,
  onOpenPromptMaster,
  favoritesList = [],
  onToggleFavorite,
}) => {
  const currentCategoryInfo = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* 1. Rotating Feature Banner */}
      <FeaturedBannerCarousel
        onOpenAIPrompt={onOpenPromptMaster}
        onSelectCategory={(cat) => onSelectCategory(cat as any)}
      />

      {/* 2. Big Luxury Category Cards */}
      <BigCategoryCards
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* 3. Selected Category Header Info (if filtered) */}
      {currentCategoryInfo && selectedCategory !== 'all' && (
        <div className="relative overflow-hidden rounded-[28px] bg-[#5B1E2D] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-xl text-[#F8F6F3]">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-[90px] pointer-events-none" />
          <div className="relative z-10 space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D4AF37] text-[#5B1E2D] font-body">
                Coleção Exclusiva
              </span>
              <span className="text-xs text-[#D4AF37] font-semibold">
                {stickers.length} Adesivos em Alta Resolução 4K
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#F8F6F3]">
              {currentCategoryInfo.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#EFE8DF] font-light leading-relaxed">
              {currentCategoryInfo.description}
            </p>
            {currentCategoryInfo.samplePhrases && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-[#D4AF37]">Sugestões de Frases:</span>
                {currentCategoryInfo.samplePhrases.map((phrase) => (
                  <span
                    key={phrase}
                    className="text-xs bg-white/10 text-[#F8F6F3] px-3 py-1 rounded-full border border-[#D4AF37]/30"
                  >
                    "{phrase}"
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Section Title for Grid */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
        <div>
          <h2 className="text-xl font-serif-title font-bold text-[#2B2B2B] flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#D4AF37]" />
            {selectedCategory === 'favorites' ? 'Seus Adesivos Favoritos' : 'Galeria de Adesivos & Letterings'}
          </h2>
          <p className="text-xs text-[#6E6E6E] font-light">
            Exibindo {stickers.length} adesivos com acabamento em transparência alpha
          </p>
        </div>

        <button
          onClick={onOpenPromptMaster}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#5B1E2D] text-[#D4AF37] hover:bg-[#8B2D44] font-serif text-xs font-bold transition-all shadow-sm border border-[#D4AF37]/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Criar com IA</span>
        </button>
      </div>

      {/* 5. Grid of Stickers */}
      {stickers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {stickers.map((sticker) => (
            <StickerCard
              key={sticker.id}
              sticker={sticker}
              onEdit={onEditSticker}
              onTestInStory={onTestInStory}
              isFavorite={favoritesList.includes(sticker.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#FFFFFF] border border-[#D4AF37]/30 rounded-[32px] p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-[#EFE8DF] border border-[#D4AF37]/30 rounded-2xl flex items-center justify-center mx-auto text-[#5B1E2D]">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-serif-title font-bold text-[#2B2B2B]">Nenhum adesivo encontrado</h3>
          <p className="text-xs text-[#6E6E6E] font-light leading-relaxed">
            Não encontramos nenhum adesivo para o filtro selecionado. Use a nossa Inteligência Artificial Tamiris Santana para criar o adesivo exclusivo dos seus sonhos!
          </p>
          <button
            onClick={onOpenPromptMaster}
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-[#5B1E2D] hover:bg-[#8B2D44] text-[#D4AF37] font-serif font-bold text-xs rounded-full shadow-lg border border-[#D4AF37]/40 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Criar Adesivo Personalizado com IA</span>
          </button>
        </div>
      )}
    </div>
  );
};

