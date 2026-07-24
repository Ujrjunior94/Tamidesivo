import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, Syringe, Crown, Heart, Camera, Check, RefreshCw, Palette, Type, HelpCircle } from 'lucide-react';

interface HighlightCoverTemplate {
  id: string;
  title: string;
  subtitle: string;
  icon: 'syringe' | 'crown' | 'heart' | 'sparkles' | 'camera';
  badge: string;
}

const PRESET_TEMPLATES: HighlightCoverTemplate[] = [
  { id: 'antes-depois', title: 'Antes & Depois', subtitle: 'Resultados Reais', icon: 'camera', badge: 'ESTÉTICA' },
  { id: 'procedimentos', title: 'Procedimentos', subtitle: 'Harmonização Facial', icon: 'syringe', badge: 'SERVIÇOS' },
  { id: 'feedbacks', title: 'Feedbacks', subtitle: 'Depoimentos de Clientes', icon: 'crown', badge: 'FEEDBACK' },
  { id: 'duvidas', title: 'Dúvidas Frequentes', subtitle: 'Perguntas & Respostas', icon: 'sparkles', badge: 'INFO' },
];

export const HighlightLogoCreator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Customization States
  const [selectedItem, setSelectedItem] = useState<'logo' | 'cover-1' | 'cover-2' | 'cover-3' | 'cover-4'>('logo');
  const [titleText, setTitleText] = useState('TAMIRIS SANTANA');
  const [subtitleText, setSubtitleText] = useState('Estética Avançada & Harmonização');
  const [bgColor, setBgColor] = useState('#5B1E2D'); // Deep Burgundy default
  const [textColor, setTextColor] = useState('#D4AF37'); // Gold default
  const [outlineColor, setOutlineColor] = useState('#D4AF37');
  const [isCircleLayout, setIsCircleLayout] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState<'syringe' | 'crown' | 'heart' | 'sparkles' | 'camera'>('crown');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Sync state when template/selection shifts
  useEffect(() => {
    if (selectedItem === 'logo') {
      setTitleText('TAMIRIS SANTANA');
      setSubtitleText('Estética Avançada');
      setSelectedIcon('crown');
    } else {
      const idx = parseInt(selectedItem.split('-')[1], 10) - 1;
      const t = PRESET_TEMPLATES[idx] || PRESET_TEMPLATES[0];
      setTitleText(t.title);
      setSubtitleText(t.subtitle);
      setSelectedIcon(t.icon);
    }
  }, [selectedItem]);

  // Render Logic
  const drawOnCanvas = (ctx: CanvasRenderingContext2D, size: number) => {
    const scale = size / 1000;
    const cx = size / 2;
    const cy = size / 2;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Subtle Radial Background Glow
    const glow = ctx.createRadialGradient(cx, cy, 20 * scale, cx, cy, size * 0.5);
    glow.addColorStop(0, 'rgba(212, 175, 55, 0.15)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Outer Circle Border (Instagram Safe Area)
    if (isCircleLayout) {
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = Math.max(2, 4 * scale);
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.38, 0, Math.PI * 2);
      ctx.stroke();

      // Thin inner circle accent
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.lineWidth = Math.max(1, 1.5 * scale);
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (selectedItem === 'logo') {
      // 1. RENDER BRAND LOGO
      ctx.save();
      // Draw Central Monogram "TS"
      ctx.font = `italic 140 * ${scale}px "Playfair Display", "Cormorant Garamond", serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Shadow for Monogram
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 10 * scale;
      ctx.shadowOffsetY = 4 * scale;
      ctx.fillText('TS', cx, cy - 50 * scale);
      ctx.restore();

      // Divider Lines
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = Math.max(1, 1.5 * scale);
      ctx.beginPath();
      ctx.moveTo(cx - 150 * scale, cy + 30 * scale);
      ctx.lineTo(cx + 150 * scale, cy + 30 * scale);
      ctx.stroke();

      // Main Text (Brand Name)
      ctx.font = `bold ${32 * scale}px "Poppins", sans-serif`;
      ctx.letterSpacing = '5px';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(titleText.toUpperCase(), cx, cy + 75 * scale);

      // Subtext
      ctx.font = `italic ${28 * scale}px "Dancing Script", "Sacramento", cursive`;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(subtitleText, cx, cy + 125 * scale);

      // Sparkle Accents
      drawSparkleIcon(ctx, cx - 180 * scale, cy - 40 * scale, 15 * scale);
      drawSparkleIcon(ctx, cx + 180 * scale, cy - 40 * scale, 12 * scale);
    } else {
      // 2. RENDER INSTAGRAM HIGHLIGHT COVER
      // Draw Icon in the middle
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 15 * scale;
      ctx.shadowOffsetY = 6 * scale;
      
      drawSelectedIcon(ctx, selectedIcon, cx, cy - 35 * scale, 110 * scale, textColor);
      ctx.restore();

      // Title Text
      ctx.font = `bold ${34 * scale}px "Poppins", sans-serif`;
      ctx.letterSpacing = '2px';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(titleText, cx, cy + 85 * scale);

      // Subtitle
      ctx.font = `italic ${24 * scale}px "Dancing Script", "Sacramento", cursive`;
      ctx.fillStyle = textColor;
      ctx.fillText(subtitleText, cx, cy + 130 * scale);
    }
  };

  const drawSparkleIcon = (ctx: CanvasRenderingContext2D, sx: number, sy: number, r: number) => {
    ctx.fillStyle = textColor;
    ctx.beginPath();
    ctx.moveTo(sx, sy - r);
    ctx.quadraticCurveTo(sx, sy, sx + r, sy);
    ctx.quadraticCurveTo(sx, sy, sx, sy + r);
    ctx.quadraticCurveTo(sx, sy, sx - r, sy);
    ctx.quadraticCurveTo(sx, sy, sx, sy - r);
    ctx.fill();
  };

  const drawSelectedIcon = (ctx: CanvasRenderingContext2D, icon: string, x: number, y: number, sz: number, color: string) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = sz * 0.08;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (icon === 'syringe') {
      // Elegant stylized Syringe SVG drawing on Canvas
      ctx.beginPath();
      // Needle
      ctx.moveTo(x - sz * 0.3, y + sz * 0.3);
      ctx.lineTo(x - sz * 0.5, y + sz * 0.5);
      ctx.stroke();

      // Barrel
      ctx.beginPath();
      ctx.moveTo(x - sz * 0.2, y + sz * 0.2);
      ctx.lineTo(x + sz * 0.2, y - sz * 0.2);
      ctx.lineWidth = sz * 0.15;
      ctx.stroke();

      // Plunger
      ctx.beginPath();
      ctx.moveTo(x + sz * 0.18, y - sz * 0.18);
      ctx.lineTo(x + sz * 0.4, y - sz * 0.4);
      ctx.lineWidth = sz * 0.06;
      ctx.stroke();

      // Plunger top
      ctx.beginPath();
      ctx.moveTo(x + sz * 0.32, y - sz * 0.45);
      ctx.lineTo(x + sz * 0.45, y - sz * 0.32);
      ctx.lineWidth = sz * 0.08;
      ctx.stroke();
    } else if (icon === 'crown') {
      ctx.beginPath();
      ctx.moveTo(x - sz * 0.4, y + sz * 0.25);
      ctx.lineTo(x - sz * 0.5, y - sz * 0.15);
      ctx.lineTo(x - sz * 0.2, y - sz * 0.02);
      ctx.lineTo(x, y - sz * 0.3);
      ctx.lineTo(x + sz * 0.2, y - sz * 0.02);
      ctx.lineTo(x + sz * 0.5, y - sz * 0.15);
      ctx.lineTo(x + sz * 0.4, y + sz * 0.25);
      ctx.closePath();
      ctx.fill();
    } else if (icon === 'heart') {
      ctx.beginPath();
      ctx.moveTo(x, y + sz * 0.3);
      ctx.bezierCurveTo(x - sz * 0.45, y - sz * 0.15, x - sz * 0.35, y - sz * 0.5, x, y - sz * 0.25);
      ctx.bezierCurveTo(x + sz * 0.35, y - sz * 0.5, x + sz * 0.45, y - sz * 0.15, x, y + sz * 0.3);
      ctx.fill();
    } else if (icon === 'camera') {
      ctx.beginPath();
      ctx.roundRect(x - sz * 0.42, y - sz * 0.25, sz * 0.84, sz * 0.55, sz * 0.08);
      ctx.stroke();
      // Lens
      ctx.beginPath();
      ctx.arc(x, y + sz * 0.03, sz * 0.18, 0, Math.PI * 2);
      ctx.stroke();
      // Flash/Top
      ctx.beginPath();
      ctx.arc(x + sz * 0.25, y - sz * 0.12, sz * 0.05, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Sparkles
      drawSparkleIcon(ctx, x, y - sz * 0.15, sz * 0.32);
      drawSparkleIcon(ctx, x - sz * 0.25, y + sz * 0.15, sz * 0.2);
      drawSparkleIcon(ctx, x + sz * 0.25, y + sz * 0.15, sz * 0.18);
    }
  };

  // Re-draw preview canvas on load or change
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 480;
    canvas.height = 480;
    drawOnCanvas(ctx, 480);
  }, [selectedItem, titleText, subtitleText, bgColor, textColor, outlineColor, isCircleLayout, selectedIcon]);

  const handleDownload4K = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        const offscreen = document.createElement('canvas');
        offscreen.width = 2048;
        offscreen.height = 2048;
        const ctx = offscreen.getContext('2d');
        if (ctx) {
          drawOnCanvas(ctx, 2048);
          const link = document.createElement('a');
          const cleanName = titleText.toLowerCase().replace(/\s+/g, '-');
          link.download = `tamiris-santana-destaque-${cleanName}-4k.png`;
          link.href = offscreen.toDataURL('image/png');
          link.click();
          setToastMessage('Imagem exportada em Ultra 4K!');
          setTimeout(() => setToastMessage(null), 3000);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-sticker-fade-in" id="brand-creator-section">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-[#5B1E2D] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-serif font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Branding Estética Avançada</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif-title font-bold text-[#5B1E2D] tracking-tight">
          Estúdio de Identidade Visual
        </h1>
        <p className="text-sm text-[#6E6E6E] leading-relaxed font-light">
          Crie imagens profissionais, capas para Destaques do Instagram e logotipos personalizados no champagne gold e bordeaux para sua clínica de Harmonização Facial.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Template Selection & Live Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#D4AF37]/25 rounded-3xl p-6 shadow-md space-y-5">
            <h3 className="text-base font-serif font-bold text-[#5B1E2D] flex items-center gap-2 border-b border-[#D4AF37]/20 pb-3">
              <Camera className="w-5 h-5 text-[#D4AF37]" />
              Visualização ao Vivo & Seleção de Template
            </h3>

            {/* Template Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <button
                onClick={() => setSelectedItem('logo')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  selectedItem === 'logo'
                    ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/35'
                    : 'bg-[#F8F6F3] border-[#D4AF37]/15 hover:bg-[#EFE8DF] text-[#2B2B2B]'
                }`}
              >
                <Crown className="w-5 h-5" />
                <span className="text-[10px] font-bold">Logo Oficial</span>
              </button>

              {PRESET_TEMPLATES.map((t, idx) => {
                const itemCode = `cover-${idx + 1}` as any;
                const isSelected = selectedItem === itemCode;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedItem(itemCode)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/35'
                        : 'bg-[#F8F6F3] border-[#D4AF37]/15 hover:bg-[#EFE8DF] text-[#2B2B2B]'
                    }`}
                  >
                    {t.icon === 'syringe' && <Syringe className="w-5 h-5" />}
                    {t.icon === 'crown' && <Crown className="w-5 h-5" />}
                    {t.icon === 'heart' && <Heart className="w-5 h-5" />}
                    {t.icon === 'camera' && <Camera className="w-5 h-5" />}
                    {t.icon === 'sparkles' && <Sparkles className="w-5 h-5" />}
                    <span className="text-[10px] font-bold line-clamp-1">{t.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Canvas Preview Container */}
            <div className="flex flex-col items-center justify-center bg-[#F8F6F3] border border-[#D4AF37]/15 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-4 left-4 bg-[#5B1E2D] text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border border-[#D4AF37]/40 shadow-xs">
                Prévia Instagram
              </div>
              
              {/* Highlight Circle Guideline */}
              <div className="relative border-2 border-dashed border-[#D4AF37]/30 rounded-full p-2.5 shadow-inner">
                <canvas
                  ref={canvasRef}
                  className="rounded-full shadow-2xl bg-stone-900 overflow-hidden w-64 h-64 md:w-80 md:h-80 border-4 border-[#5B1E2D]/20 transition-all duration-300"
                />
              </div>

              <span className="text-[11px] text-[#6E6E6E] mt-3 italic font-light">
                ✦ O círculo tracejado indica o corte circular exato do Destaque do Instagram.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customizers */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#D4AF37]/25 rounded-3xl p-6 shadow-md space-y-5">
            <h3 className="text-base font-serif font-bold text-[#5B1E2D] flex items-center gap-2 border-b border-[#D4AF37]/20 pb-3">
              <Palette className="w-5 h-5 text-[#D4AF37]" />
              Painel de Personalização
            </h3>

            {/* Colors */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#2B2B2B] block">Cores da Identidade Visual</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#6E6E6E] font-medium block">Fundo de Marca</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {['#5B1E2D', '#B76E79', '#1A1A1A', '#FAF9F6', '#A3D9C9', '#D2B48C'].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setBgColor(c);
                          if (c === '#FAF9F6') {
                            setTextColor('#5B1E2D');
                            setOutlineColor('#5B1E2D');
                          } else {
                            setTextColor('#D4AF37');
                            setOutlineColor('#D4AF37');
                          }
                        }}
                        className={`w-6 h-6 rounded-full border shadow-xs transition-all ${
                          bgColor === c ? 'ring-2 ring-[#5B1E2D] scale-110 border-white' : 'border-stone-300'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-6 h-6 p-0 rounded-full border border-stone-300 cursor-pointer overflow-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#6E6E6E] font-medium block">Detalhes & Detalhes Ouro</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {['#D4AF37', '#B76E79', '#5B1E2D', '#FFFFFF', '#4A6B5D', '#8B5A2B'].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setTextColor(c);
                          setOutlineColor(c);
                        }}
                        className={`w-6 h-6 rounded-full border shadow-xs transition-all ${
                          textColor === c ? 'ring-2 ring-[#5B1E2D] scale-110 border-white' : 'border-stone-300'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => {
                        setTextColor(e.target.value);
                        setOutlineColor(e.target.value);
                      }}
                      className="w-6 h-6 p-0 rounded-full border border-stone-300 cursor-pointer overflow-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography and Texts */}
            <div className="space-y-4">
              <label className="text-xs font-semibold text-[#2B2B2B] block">Informações e Títulos</label>
              
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#6E6E6E]">Título Principal</span>
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  className="w-full bg-[#F8F6F3] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#5B1E2D]"
                  placeholder="Ex: Tamiris Santana"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#6E6E6E]">Subtítulo ou Slogan</span>
                <input
                  type="text"
                  value={subtitleText}
                  onChange={(e) => setSubtitleText(e.target.value)}
                  className="w-full bg-[#F8F6F3] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#5B1E2D]"
                  placeholder="Ex: Harmonização Labial"
                />
              </div>
            </div>

            {/* Layout options */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-[#2B2B2B] block">Configuração de Grid</label>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F6F3] border border-[#D4AF37]/25">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#5B1E2D]">Moldura Circular de Destaque</span>
                  <p className="text-[10px] text-[#6E6E6E]">Ativa a demarcação ouro para o círculo do Instagram</p>
                </div>
                <button
                  onClick={() => setIsCircleLayout(!isCircleLayout)}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${
                    isCircleLayout ? 'bg-[#5B1E2D] flex justify-end' : 'bg-stone-300 flex justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#D4AF37] shadow-md" />
                </button>
              </div>
            </div>

            {/* Icon Picker (if cover selected) */}
            {selectedItem !== 'logo' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-[#2B2B2B] block">Ícone Central do Destaque</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'syringe', icon: <Syringe className="w-4 h-4" /> },
                    { id: 'crown', icon: <Crown className="w-4 h-4" /> },
                    { id: 'heart', icon: <Heart className="w-4 h-4" /> },
                    { id: 'camera', icon: <Camera className="w-4 h-4" /> },
                    { id: 'sparkles', icon: <Sparkles className="w-4 h-4" /> },
                  ].map((i) => (
                    <button
                      key={i.id}
                      onClick={() => setSelectedIcon(i.id as any)}
                      className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                        selectedIcon === i.id
                          ? 'bg-[#5B1E2D] border-[#D4AF37] text-[#D4AF37]'
                          : 'bg-[#F8F6F3] border-[#D4AF37]/15 text-[#6E6E6E] hover:bg-[#EFE8DF]'
                      }`}
                    >
                      {i.icon}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Download Actions */}
            <div className="pt-4 border-t border-[#D4AF37]/20">
              <button
                onClick={handleDownload4K}
                disabled={isExporting}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:opacity-95 text-[#5B1E2D] font-serif font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg border border-[#D4AF37]/40 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Processando Resolução 4K...' : 'Exportar Imagem Ultra 4K PNG'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#5B1E2D] text-[#D4AF37] border-2 border-[#D4AF37] px-4.5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-sticker-scale-up">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-serif font-bold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
