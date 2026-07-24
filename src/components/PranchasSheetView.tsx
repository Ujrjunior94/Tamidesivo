import React, { useState } from 'react';
import { PRANCHAS_PACKS } from '../data/stickersData';
import { renderStickerToCanvas } from '../utils/stickerRenderer';
import JSZip from 'jszip';
import { Layers, Download, Sparkles, CheckCircle2, FileArchive, RefreshCw, Crown } from 'lucide-react';

export const PranchasSheetView: React.FC = () => {
  const [downloadingPackId, setDownloadingPackId] = useState<string | null>(null);

  const handleDownloadPranchaZip = async (packId: string, packTitle: string) => {
    const pack = PRANCHAS_PACKS.find((p) => p.id === packId);
    if (!pack) return;

    setDownloadingPackId(packId);

    try {
      const zip = new JSZip();
      const folder = zip.folder(pack.title) || zip;

      for (let i = 0; i < pack.stickers.length; i++) {
        const sticker = pack.stickers[i];
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
          });

          const dataUrl = canvas.toDataURL('image/png');
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          folder.file(`${i + 1}-${sticker.title.toLowerCase().replace(/\s+/g, '-')}-4k.png`, base64Data, {
            base64: true,
          });
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `tamiris-santana-${packTitle.toLowerCase().replace(/\s+/g, '-')}-pack-4k.zip`;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingPackId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5B1E2D] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-serif font-bold shadow-md">
          <Crown className="w-4 h-4 text-[#D4AF37]" /> Pranchas e Pacotes Exclusivos
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#5B1E2D] tracking-tight">
          Pranchas Caligráficas Prontas
        </h1>
        <p className="text-[#6E6E6E] font-light text-sm leading-relaxed">
          Baixe coleções completas da marca Tamiris Santana organizadas em arquivos ZIP com imagens em alta resolução 4K PNG e transparência total (Canal Alpha).
        </p>
      </div>

      {/* Pranchas List */}
      <div className="space-y-8">
        {PRANCHAS_PACKS.map((pack) => {
          const isDownloading = downloadingPackId === pack.id;
          return (
            <div
              key={pack.id}
              className="bg-white border border-[#D4AF37]/30 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
                <div>
                  <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#D4AF37]">
                    Prancha Caligráfica ({pack.stickers.length} Adesivos)
                  </span>
                  <h2 className="text-xl font-serif-title font-bold text-[#5B1E2D] mt-0.5">{pack.title}</h2>
                  <p className="text-xs text-[#6E6E6E] font-light mt-1">{pack.description}</p>
                </div>

                <button
                  onClick={() => handleDownloadPranchaZip(pack.id, pack.title)}
                  disabled={isDownloading}
                  className="px-5 py-3 rounded-2xl bg-[#5B1E2D] hover:bg-[#8B2D44] text-[#D4AF37] font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0 disabled:opacity-50 border border-[#D4AF37]/40"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span>Gerando Pacote ZIP 4K...</span>
                    </>
                  ) : (
                    <>
                      <FileArchive className="w-4 h-4 text-[#D4AF37]" />
                      <span>Baixar Prancha Completa (ZIP 4K)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Grid preview of stickers in this prancha */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {pack.stickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    className="p-3 bg-[#F8F6F3] border border-[#D4AF37]/20 rounded-2xl text-center space-y-1.5 shadow-sm hover:border-[#5B1E2D] transition-all"
                  >
                    <span className="text-[9px] font-bold uppercase text-[#5B1E2D] bg-[#EFE8DF] px-2 py-0.5 rounded-full inline-block">
                      {sticker.style}
                    </span>
                    <p className="text-xs font-serif font-bold text-[#2B2B2B] line-clamp-1">{sticker.title}</p>
                    <div className="text-[10px] text-[#D4AF37] font-semibold">4K Alpha PNG</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

