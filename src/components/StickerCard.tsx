import React, { useRef, useEffect, useState } from 'react';
import { StickerItem } from '../types';
import { renderStickerToCanvas, downloadCanvasAsPng } from '../utils/stickerRenderer';
import { Download, Copy, Edit3, Check, Heart, Share2, MoreVertical, Edit2, Palette, X, Sparkles } from 'lucide-react';

interface StickerCardProps {
  sticker: StickerItem;
  onEdit: (sticker: StickerItem) => void;
  onTestInStory: (sticker: StickerItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onUpdateSticker?: (updatedSticker: StickerItem) => void;
}

const COLOR_PRESETS = [
  { name: 'Dourado Luxo', primary: '#D4AF37', text: '#FFFFFF' },
  { name: 'Rose Gold', primary: '#B76E79', text: '#FFFFFF' },
  { name: 'Vinho Tamiris', primary: '#5B1E2D', text: '#D4AF37' },
  { name: 'Nude Mágico', primary: '#EFE8DF', text: '#5B1E2D' },
  { name: 'Branco Puro', primary: '#FFFFFF', text: '#5B1E2D' },
  { name: 'Preto Elegante', primary: '#1A1A1A', text: '#D4AF37' },
  { name: 'Esmeralda Luxo', primary: '#0F5257', text: '#FFFFFF' },
  { name: 'Bronze Nobre', primary: '#A0522D', text: '#FFFFFF' },
  { name: 'Coral Suave', primary: '#E07A5F', text: '#FFFFFF' },
  { name: 'Lilás Místico', primary: '#9B5DE5', text: '#FFFFFF' },
];

export const StickerCard: React.FC<StickerCardProps> = ({
  sticker,
  onEdit,
  onTestInStory,
  isFavorite = false,
  onToggleFavorite,
  isSelected = false,
  onToggleSelect,
  onUpdateSticker,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadCount, setDownloadCount] = useState<number>(() => Math.floor(Math.random() * 800) + 120);
  const [fav, setFav] = useState(isFavorite);

  // Context Menu & Quick Edit States
  const [showMenu, setShowMenu] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState(sticker.title);
  const [editedPrimaryColor, setEditedPrimaryColor] = useState(sticker.primaryColor || '#D4AF37');
  const [editedTextColor, setEditedTextColor] = useState(sticker.textColor || '#FFFFFF');

  useEffect(() => {
    setFav(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    setEditedTitle(sticker.title);
    setEditedPrimaryColor(sticker.primaryColor || '#D4AF37');
    setEditedTextColor(sticker.textColor || '#FFFFFF');
  }, [sticker]);

  // Close context menu on click outside or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.sticker-context-menu-container')) {
        setShowMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMenu(false);
        setShowRenameModal(false);
        setShowColorModal(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMenu]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render Preview Sticker (800x800)
    canvas.width = 800;
    canvas.height = 800;

    renderStickerToCanvas(
      ctx,
      800,
      800,
      {
        text: sticker.title,
        fontFamily: sticker.fontFamily || 'Bold Display 3D',
        fontSize: sticker.title.length > 15 ? 85 : 110,
        textColor: sticker.textColor || '#FFFFFF',
        gradientStart: sticker.primaryColor || '#D4AF37',
        gradientEnd: sticker.primaryColor ? '#5B1E2D' : '#D4AF37',
        hasGradient: sticker.style === 'Gold' || sticker.style === 'Holográfico' || sticker.style === '3D',
        strokeColor: '#FFFFFF',
        strokeWidth: 0,
        glowColor: sticker.primaryColor || '#D4AF37',
        glowRadius: sticker.style === 'Neon' ? 35 : 0,
        shadowColor: 'rgba(91, 30, 45, 0.25)',
        shadowOffsetY: 12,
        shadowBlur: 20,
        iconSymbol: sticker.iconSymbol || 'Sparkles',
        iconPosition: 'top',
        iconSize: 110,
        styleEffect: sticker.style,
        rotation: 0,
        glassOpacity: 0.22,
        aspectRatio: '1:1',
        exportResolution: '2048',
      }
    );
  }, [sticker]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(true);
  };

  const handleSaveRename = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editedTitle.trim()) return;
    const updated = {
      ...sticker,
      title: editedTitle.trim(),
    };
    if (onUpdateSticker) {
      onUpdateSticker(updated);
    }
    setShowRenameModal(false);
    setShowMenu(false);
  };

  const handleSaveColor = (primary: string, text?: string) => {
    const updated = {
      ...sticker,
      primaryColor: primary,
      ...(text ? { textColor: text } : {}),
    };
    setEditedPrimaryColor(primary);
    if (text) setEditedTextColor(text);
    if (onUpdateSticker) {
      onUpdateSticker(updated);
    }
    setShowColorModal(false);
    setShowMenu(false);
  };

  const handleCopyPng = async () => {
    if (!canvasRef.current) return;
    try {
      setCopied(true);
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
          } else {
            downloadCanvasAsPng(canvasRef.current!, `tamiris-santana-sticker-${sticker.title.toLowerCase().replace(/\s+/g, '-')}.png`);
          }
        } catch (err) {
          console.log('Clipboard fallback copy - downloading');
          downloadCanvasAsPng(canvasRef.current!, `tamiris-santana-sticker-${sticker.title.toLowerCase().replace(/\s+/g, '-')}.png`);
        }
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload4K = () => {
    setDownloading(true);
    setDownloadCount((prev) => prev + 1);
    const offscreen = document.createElement('canvas');
    offscreen.width = 2048;
    offscreen.height = 2048;
    const ctx = offscreen.getContext('2d');
    if (ctx) {
      renderStickerToCanvas(
        ctx,
        2048,
        2048,
        {
          text: sticker.title,
          fontFamily: sticker.fontFamily || 'Bold Display 3D',
          fontSize: sticker.title.length > 15 ? 210 : 260,
          textColor: sticker.textColor || '#FFFFFF',
          gradientStart: sticker.primaryColor || '#D4AF37',
          gradientEnd: sticker.primaryColor ? '#5B1E2D' : '#D4AF37',
          hasGradient: sticker.style === 'Gold' || sticker.style === 'Holográfico' || sticker.style === '3D',
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
        }
      );
      downloadCanvasAsPng(offscreen, `tamiris-santana-sticker-${sticker.id}-4k.png`);
    }
    setTimeout(() => setDownloading(false), 1000);
  };

  const handleShare = async () => {
    if (navigator.share && canvasRef.current) {
      try {
        canvasRef.current.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], `${sticker.title}.png`, { type: 'image/png' });
          await navigator.share({
            title: `Adesivo ${sticker.title} - Tamiris Santana`,
            text: `Adesivo exclusivo Tamiris Santana: ${sticker.title}`,
            files: [file],
          });
        });
      } catch (err) {
        console.log('Share canceled or not supported', err);
      }
    } else {
      handleCopyPng();
    }
  };

  const toggleFav = () => {
    setFav(!fav);
    if (onToggleFavorite) {
      onToggleFavorite(sticker.id);
    }
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className={`group relative bg-[#FFFFFF] border rounded-[24px] p-4 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl hover:shadow-[#5B1E2D]/10 flex flex-col justify-between sticker-context-menu-container ${
        isSelected
          ? 'border-2 border-[#D4AF37] bg-[#5B1E2D]/5 shadow-lg shadow-[#D4AF37]/20 ring-2 ring-[#D4AF37]/50'
          : 'border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
      }`}
    >
      
      {/* Top Header info with Checkbox and Context Menu Button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Checkbox selector */}
          {onToggleSelect && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(sticker.id);
              }}
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#5B1E2D] border-[#D4AF37] text-[#D4AF37] shadow-sm'
                  : 'bg-white/90 border-[#D4AF37]/50 hover:border-[#5B1E2D] text-transparent hover:text-stone-300'
              }`}
              title={isSelected ? 'Desmarcar adesivo' : 'Selecionar adesivo para exportação ZIP'}
            >
              <Check className={`w-4 h-4 stroke-[3] ${isSelected ? 'text-[#D4AF37]' : ''}`} />
            </button>
          )}

          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EFE8DF] text-[#5B1E2D] border border-[#D4AF37]/30 font-body">
            {sticker.category.replace('-', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#5B1E2D] text-[#D4AF37] border border-[#D4AF37]">
            {sticker.style}
          </span>

          <button
            onClick={toggleFav}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
              fav ? 'bg-rose-500 text-white' : 'bg-[#EFE8DF] text-[#6E6E6E] hover:text-rose-500'
            }`}
            title="Favoritar Sticker"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Context Menu Three Dots Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="w-7 h-7 rounded-full bg-[#F8F6F3] hover:bg-[#5B1E2D] hover:text-[#D4AF37] text-[#5B1E2D] border border-[#D4AF37]/30 flex items-center justify-center transition-all shadow-sm"
            title="Opções de edição rápida (Menu de Contexto)"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Die-Cut Sticker Canvas Preview Box */}
      <div className="relative aspect-square w-full rounded-2xl bg-[#F8F6F3] border border-[#D4AF37]/20 flex items-center justify-center p-3 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
        
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#5B1E2D 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain filter drop-shadow-md max-h-[180px] relative z-10"
        />

        {sticker.badge && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-[#5B1E2D] to-[#8B2D44] text-[#D4AF37] text-[9px] font-serif font-bold px-2.5 py-0.5 rounded-full shadow-md border border-[#D4AF37]/40">
            {sticker.badge}
          </div>
        )}

        <div className="absolute bottom-2 left-2 text-[9px] font-semibold text-[#6E6E6E] bg-white/80 px-2 py-0.5 rounded-full border border-[#D4AF37]/20">
          ⬇ {downloadCount} downloads
        </div>
      </div>

      {/* Sticker Title */}
      <div className="mt-3 mb-3 text-center">
        <h3 className="text-sm font-serif-title font-bold text-[#2B2B2B] group-hover:text-[#5B1E2D] transition-colors line-clamp-1">
          {sticker.title}
        </h3>
        {sticker.elements && sticker.elements.length > 0 && (
          <p className="text-[10px] text-[#6E6E6E] line-clamp-1 mt-0.5 font-light">
            {sticker.elements.join(' • ')}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D4AF37]/20">
        <button
          onClick={handleCopyPng}
          className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
            copied
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-[#F8F6F3] border-[#D4AF37]/30 text-[#2B2B2B] hover:bg-[#5B1E2D] hover:text-[#D4AF37]'
          }`}
          title="Copiar PNG Transparente"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
          <span>{copied ? 'Copiado!' : 'Copiar'}</span>
        </button>

        <button
          onClick={handleDownload4K}
          disabled={downloading}
          className="py-2 px-3 rounded-xl bg-[#5B1E2D] hover:bg-[#8B2D44] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm border border-[#D4AF37]/50"
          title="Baixar PNG em Alta Resolução 4K"
        >
          <Download className="w-3.5 h-3.5" />
          <span>4K PNG</span>
        </button>

        <button
          onClick={() => onEdit(sticker)}
          className="py-1.5 px-3 rounded-xl bg-[#F8F6F3] hover:bg-[#EFE8DF] text-[#5B1E2D] text-[11px] font-medium flex items-center justify-center gap-1 transition-all border border-[#D4AF37]/20"
        >
          <Edit3 className="w-3 h-3 text-[#D4AF37]" />
          <span>Editar</span>
        </button>

        <button
          onClick={handleShare}
          className="py-1.5 px-3 rounded-xl bg-[#F8F6F3] hover:bg-[#EFE8DF] text-[#5B1E2D] text-[11px] font-medium flex items-center justify-center gap-1 transition-all border border-[#D4AF37]/20"
          title="Compartilhar"
        >
          <Share2 className="w-3 h-3 text-[#5B1E2D]" />
          <span>Enviar</span>
        </button>
      </div>

      {/* CONTEXT MENU POPUP DROPDOWN */}
      {showMenu && (
        <div className="absolute top-12 right-3 z-50 w-52 bg-white rounded-2xl shadow-2xl border-2 border-[#D4AF37] p-2 text-xs space-y-1 animate-sticker-fade-in backdrop-blur-md">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#D4AF37]/20 px-2 pt-1">
            <span className="font-serif font-bold text-[#5B1E2D] text-[11px]">Opções Rápidas</span>
            <button
              onClick={() => setShowMenu(false)}
              className="text-[#6E6E6E] hover:text-[#5B1E2D] p-0.5 rounded-full hover:bg-stone-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              setShowRenameModal(true);
              setShowMenu(false);
            }}
            className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#5B1E2D]/10 text-[#2B2B2B] font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#5B1E2D]" />
            <span>Renomear Adesivo</span>
          </button>

          <button
            onClick={() => {
              setShowColorModal(true);
              setShowMenu(false);
            }}
            className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#5B1E2D]/10 text-[#2B2B2B] font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Alterar Cor do Adesivo</span>
          </button>

          <div className="border-t border-[#D4AF37]/20 my-1" />

          <button
            onClick={() => {
              setShowMenu(false);
              onEdit(sticker);
            }}
            className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#5B1E2D]/10 text-[#5B1E2D] font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Abrir no Estúdio Completo</span>
          </button>

          <button
            onClick={() => {
              setShowMenu(false);
              onTestInStory(sticker);
            }}
            className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#5B1E2D]/10 text-[#2B2B2B] font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5B1E2D]" />
            <span>Testar no Simulator Story</span>
          </button>
        </div>
      )}

      {/* RENAME MODAL INLINE OVERLAY */}
      {showRenameModal && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md rounded-[24px] p-4 flex flex-col justify-between border-2 border-[#D4AF37] shadow-2xl animate-sticker-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/30">
            <span className="font-serif font-bold text-[#5B1E2D] text-xs flex items-center gap-1.5">
              <Edit2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Renomear Adesivo</span>
            </span>
            <button
              onClick={() => setShowRenameModal(false)}
              className="text-[#6E6E6E] hover:text-[#5B1E2D] p-1 rounded-full hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveRename} className="space-y-3 my-auto">
            <div>
              <label className="text-[11px] font-semibold text-[#2B2B2B] block mb-1">Novo Nome do Adesivo:</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 rounded-xl border border-[#D4AF37]/50 focus:border-[#5B1E2D] focus:ring-2 focus:ring-[#5B1E2D]/20 text-xs font-serif font-bold text-[#5B1E2D] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowRenameModal(false)}
                className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#5B1E2D] hover:bg-[#8B2D44] text-[#D4AF37] font-serif font-bold text-xs transition-all shadow-sm border border-[#D4AF37]/40 flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* COLOR PICKER MODAL INLINE OVERLAY */}
      {showColorModal && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md rounded-[24px] p-3 flex flex-col justify-between border-2 border-[#D4AF37] shadow-2xl animate-sticker-fade-in overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/30">
            <span className="font-serif font-bold text-[#5B1E2D] text-xs flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Alterar Cor Direta</span>
            </span>
            <button
              onClick={() => setShowColorModal(false)}
              className="text-[#6E6E6E] hover:text-[#5B1E2D] p-1 rounded-full hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 my-1">
            <span className="text-[10px] font-semibold text-[#6E6E6E] block">Paletas de Luxo Prontas:</span>
            <div className="grid grid-cols-5 gap-1.5">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSaveColor(preset.primary, preset.text)}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center hover:scale-110 transition-transform relative group/swatch"
                  style={{ backgroundColor: preset.primary }}
                  title={preset.name}
                >
                  {editedPrimaryColor === preset.primary && (
                    <Check className="w-4 h-4 text-white drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold text-[#2B2B2B]">Cor Personalizada:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editedPrimaryColor}
                  onChange={(e) => setEditedPrimaryColor(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => handleSaveColor(editedPrimaryColor, editedTextColor)}
                  className="px-2.5 py-1 rounded-lg bg-[#5B1E2D] text-[#D4AF37] text-[10px] font-bold border border-[#D4AF37]/40"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowColorModal(false)}
            className="w-full py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-all mt-1"
          >
            Fechar
          </button>
        </div>
      )}

    </div>
  );
};


