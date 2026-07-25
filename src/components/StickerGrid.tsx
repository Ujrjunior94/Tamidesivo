import React, { useState, useMemo } from 'react';
import { StickerItem, CategoryId, VisualStyle } from '../types';
import { StickerCard } from './StickerCard';
import { CATEGORIES } from '../data/stickersData';
import { BigCategoryCards } from './BigCategoryCards';
import { FeaturedBannerCarousel } from './FeaturedBannerCarousel';
import { renderStickerToCanvas } from '../utils/stickerRenderer';
import JSZip from 'jszip';
import {
  Sparkles,
  SearchX,
  Crown,
  CheckSquare,
  Square,
  Archive,
  RefreshCw,
  X,
  Check,
  Download,
  ArrowUpDown,
  Clock,
  Flame,
  SortAsc,
} from 'lucide-react';

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
  onUpdateSticker?: (updatedSticker: StickerItem) => void;
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
  onUpdateSticker,
}) => {
  const currentCategoryInfo = CATEGORIES.find((c) => c.id === selectedCategory);

  // Sorting state
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'alphabetical'>('recent');

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Sorted stickers list
  const sortedStickers = useMemo(() => {
    const list = [...stickers];
    if (sortBy === 'alphabetical') {
      return list.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }));
    } else if (sortBy === 'popular') {
      return list.sort((a, b) => {
        const aFav = favoritesList.includes(a.id) ? 1 : 0;
        const bFav = favoritesList.includes(b.id) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;
        const aBadge = a.badge ? 1 : 0;
        const bBadge = b.badge ? 1 : 0;
        if (aBadge !== bBadge) return bBadge - aBadge;
        return a.title.localeCompare(b.title, 'pt-BR');
      });
    } else {
      // 'recent' - custom generated or newest first
      return list.sort((a, b) => {
        const aCustom = a.isCustomGenerated ? 1 : 0;
        const bCustom = b.isCustomGenerated ? 1 : 0;
        if (aCustom !== bCustom) return bCustom - aCustom;
        return 0;
      });
    }
  }, [stickers, sortBy, favoritesList]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === stickers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(stickers.map((s) => s.id));
    }
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleExportSelectedZip = async () => {
    if (selectedIds.length === 0) return;

    setIsExporting(true);
    setExportProgress('Iniciando empacotamento ZIP...');

    try {
      const selectedStickers = stickers.filter((s) => selectedIds.includes(s.id));
      const zip = new JSZip();
      const folder = zip.folder('Tamiris-Santana-Colecao-Adesivos-4K') || zip;

      for (let i = 0; i < selectedStickers.length; i++) {
        const sticker = selectedStickers[i];
        setExportProgress(`Processando ${i + 1}/${selectedStickers.length}: "${sticker.title}"...`);

        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 2048;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          renderStickerToCanvas(ctx, 2048, 2048, {
            text: sticker.title,
            fontFamily: sticker.fontFamily || 'Script Elegante',
            fontSize: sticker.title.length > 15 ? 210 : 260,
            textColor: sticker.textColor || '#FFFFFF',
            gradientStart: sticker.primaryColor || '#D4AF37',
            gradientEnd: sticker.primaryColor ? '#5B1E2D' : '#D4AF37',
            hasGradient: true,
            strokeColor: '#FFFFFF',
            strokeWidth: 0,
            glowColor: sticker.primaryColor || '#D4AF37',
            glowRadius: sticker.style === 'Neon' ? 80 : 0,
            shadowColor: 'rgba(91, 30, 45, 0.3)',
            shadowOffsetY: 30,
            shadowBlur: 45,
            iconSymbol: sticker.iconSymbol || 'Sparkles',
            iconPosition: 'top',
            iconSize: 260,
            styleEffect: sticker.style,
            rotation: 0,
            glassOpacity: 0.22,
            aspectRatio: '1:1',
            exportResolution: '2048',
          });

          const dataUrl = canvas.toDataURL('image/png');
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          const safeFileName = `${i + 1}-${sticker.title.toLowerCase().replace(/[^a-z0-9]/gi, '-')}-4k.png`;
          folder.file(safeFileName, base64Data, { base64: true });
        }
      }

      setExportProgress('Gerando arquivo ZIP final...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tamiris-santana-${selectedStickers.length}-adesivos-4k.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setToastNotice(`✨ Pacote ZIP baixado com sucesso contendo ${selectedStickers.length} adesivos em 4K!`);
      setTimeout(() => setToastNotice(null), 4000);
    } catch (err) {
      console.error('Error generating ZIP:', err);
      alert('Ocorreu um erro ao gerar o arquivo ZIP dos adesivos.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  const allSelected = stickers.length > 0 && selectedIds.length === stickers.length;

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

      {/* Toast Notice Banner */}
      {toastNotice && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-400 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-md animate-sticker-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{toastNotice}</span>
          </div>
          <button onClick={() => setToastNotice(null)} className="text-emerald-700 font-bold hover:text-emerald-900 text-sm">
            ×
          </button>
        </div>
      )}

      {/* 4. Section Title & Batch Selection Controls for Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
        <div>
          <h2 className="text-xl font-serif-title font-bold text-[#2B2B2B] flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#D4AF37]" />
            {selectedCategory === 'favorites' ? 'Seus Adesivos Favoritos' : 'Galeria de Adesivos & Letterings'}
          </h2>
          <p className="text-xs text-[#6E6E6E] font-light">
            Exibindo {stickers.length} adesivos • Selecione múltiplos adesivos para exportação de lote em ZIP
          </p>
        </div>

        {/* Multi-Select & Sorting Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ordenação / Sorting Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-[#D4AF37]/50 rounded-xl px-3 py-1.5 shadow-xs transition-all hover:border-[#5B1E2D]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#5B1E2D]" />
            <span className="text-xs font-bold text-[#5B1E2D] hidden sm:inline">Ordernar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'alphabetical')}
              className="bg-transparent text-xs font-serif font-bold text-[#5B1E2D] outline-none cursor-pointer pr-1 focus:ring-0"
            >
              <option value="recent">Mais Recentes</option>
              <option value="popular">Mais Populares</option>
              <option value="alphabetical">A-Z (Ordem Alfabética)</option>
            </select>
          </div>

          {stickers.length > 0 && (
            <button
              onClick={handleSelectAll}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                allSelected
                  ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37]'
                  : 'bg-white text-[#2B2B2B] border-[#D4AF37]/40 hover:border-[#5B1E2D]'
              }`}
            >
              {allSelected ? (
                <CheckSquare className="w-4 h-4 text-[#D4AF37]" />
              ) : (
                <Square className="w-4 h-4 text-[#5B1E2D]" />
              )}
              <span>{allSelected ? 'Desmarcar Todos' : `Selecionar Todos (${stickers.length})`}</span>
            </button>
          )}

          {selectedIds.length > 0 && (
            <button
              onClick={handleDeselectAll}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition-all flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={onOpenPromptMaster}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-[#5B1E2D] text-[#D4AF37] hover:bg-[#8B2D44] font-serif text-xs font-bold transition-all shadow-sm border border-[#D4AF37]/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Criar com IA</span>
          </button>
        </div>
      </div>

      {/* 5. Grid of Stickers */}
      {sortedStickers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {sortedStickers.map((sticker) => (
            <StickerCard
              key={sticker.id}
              sticker={sticker}
              onEdit={onEditSticker}
              onTestInStory={onTestInStory}
              isFavorite={favoritesList.includes(sticker.id)}
              onToggleFavorite={onToggleFavorite}
              isSelected={selectedIds.includes(sticker.id)}
              onToggleSelect={handleToggleSelect}
              onUpdateSticker={onUpdateSticker}
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

      {/* 6. Floating Batch Action Bar (for Designer Workflow) */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] sm:w-full bg-[#5B1E2D] text-[#F8F6F3] border-2 border-[#D4AF37] rounded-full p-2.5 px-5 shadow-2xl flex items-center justify-between gap-3 animate-sticker-scale-up">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-[#5B1E2D] font-extrabold text-xs flex items-center justify-center shadow-sm">
              {selectedIds.length}
            </span>
            <div className="text-xs">
              <p className="font-serif font-bold text-[#D4AF37]">
                {selectedIds.length === 1 ? '1 Adesivo Selecionado' : `${selectedIds.length} Adesivos Selecionados`}
              </p>
              <p className="text-[10px] text-[#EFE8DF] font-light hidden sm:block">
                Exportação em Lote PNG 4K Transparente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSelectedZip}
              disabled={isExporting}
              className="py-2 px-4 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#5B1E2D] font-serif font-bold text-xs flex items-center gap-2 shadow-lg border border-white/40 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 text-[#5B1E2D] animate-spin" />
                  <span className="hidden sm:inline">{exportProgress || 'Gerando ZIP...'}</span>
                  <span className="sm:hidden">ZIP...</span>
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4 text-[#5B1E2D]" />
                  <span>Baixar Lote ZIP (4K)</span>
                </>
              )}
            </button>

            <button
              onClick={handleDeselectAll}
              className="p-2 rounded-full hover:bg-white/10 text-[#EFE8DF] transition-all"
              title="Cancelar seleção"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


