import React, { useRef, useEffect, useState } from 'react';
import { StickerItem } from '../types';
import { renderStickerToCanvas, downloadCanvasAsPng } from '../utils/stickerRenderer';
import { Download, Copy, Edit3, Smartphone, Check, Heart, Share2, Sparkles } from 'lucide-react';

interface StickerCardProps {
  sticker: StickerItem;
  onEdit: (sticker: StickerItem) => void;
  onTestInStory: (sticker: StickerItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export const StickerCard: React.FC<StickerCardProps> = ({
  sticker,
  onEdit,
  onTestInStory,
  isFavorite = false,
  onToggleFavorite,
  isSelected = false,
  onToggleSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadCount, setDownloadCount] = useState<number>(() => Math.floor(Math.random() * 800) + 120);
  const [fav, setFav] = useState(isFavorite);

  useEffect(() => {
    setFav(isFavorite);
  }, [isFavorite]);

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
        strokeWidth: 20,
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
          strokeWidth: 45,
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
      className={`group relative bg-[#FFFFFF] border rounded-[24px] p-4 transition-all duration-300 hover:shadow-xl hover:shadow-[#5B1E2D]/10 flex flex-col justify-between ${
        isSelected
          ? 'border-2 border-[#D4AF37] bg-[#5B1E2D]/5 shadow-lg shadow-[#D4AF37]/20 ring-2 ring-[#D4AF37]/50'
          : 'border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
      }`}
    >
      
      {/* Top Header info with Checkbox */}
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
    </div>
  );
};

