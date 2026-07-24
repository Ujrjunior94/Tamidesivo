import React, { useState, useRef, useEffect } from 'react';
import { StickerItem, StickerCustomizerState, VisualStyle } from '../types';
import { renderStickerToCanvas, downloadCanvasAsPng } from '../utils/stickerRenderer';
import { ALL_STYLES } from '../data/stickersData';
import {
  Download,
  Copy,
  X,
  Sparkles,
  Type,
  Palette,
  Layers,
  Sliders,
  Check,
  RotateCw,
  Sun,
  Shield,
  Smile,
  Crown,
  Heart,
  Flame,
  Zap,
  Cross,
  Coffee,
  CheckCircle2,
  RefreshCw,
  Syringe,
  Flower2,
  Orbit,
  CircleDot,
  Waves,
  Moon
} from 'lucide-react';

interface StickerStudioProps {
  sticker: StickerItem | null;
  onClose: () => void;
  onSaveCustomSticker?: (newSticker: StickerItem) => void;
}

export const StickerStudio: React.FC<StickerStudioProps> = ({ sticker, onClose, onSaveCustomSticker }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [state, setState] = useState<StickerCustomizerState>({
    text: sticker ? sticker.title : 'Harmonização & Elegância',
    subtext: sticker?.elements?.[0] || 'Tamiris Santana',
    fontFamily: sticker?.fontFamily || 'Script Elegante',
    fontSize: 100,
    textColor: sticker?.textColor || '#FFFFFF',
    gradientStart: sticker?.primaryColor || '#D4AF37',
    gradientEnd: '#5B1E2D',
    hasGradient: true,
    strokeColor: '#FFFFFF',
    strokeWidth: 18,
    glowColor: '#D4AF37',
    glowRadius: sticker?.style === 'Neon' ? 30 : 0,
    shadowColor: 'rgba(91, 30, 45, 0.25)',
    shadowOffsetY: 12,
    shadowBlur: 20,
    iconSymbol: sticker?.iconSymbol || 'Sparkles',
    iconPosition: 'top',
    iconSize: 110,
    styleEffect: sticker?.style || 'Traços Finos',
    rotation: 0,
    glassOpacity: 0.22,
    aspectRatio: '1:1',
    exportResolution: '2048',
  });

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'style' | 'outline' | 'icon'>('text');

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 1200;

    renderStickerToCanvas(ctx, 1200, 1200, state);
  }, [state]);

  const handleDownload = (res: '1080' | '2048' | '4096') => {
    setDownloading(true);
    const size = parseInt(res, 10);
    const offscreen = document.createElement('canvas');
    offscreen.width = size;
    offscreen.height = size;
    const ctx = offscreen.getContext('2d');
    if (ctx) {
      renderStickerToCanvas(ctx, size, size, { ...state, exportResolution: res });
      downloadCanvasAsPng(offscreen, `tamiris-santana-sticker-${state.text.toLowerCase().replace(/\s+/g, '-')}-${res}p.png`);
    }
    setTimeout(() => setDownloading(false), 800);
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      setCopied(true);
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        } catch (err) {
          console.log('Clipboard fallback');
        }
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const fonts = [
    'Script Elegante',
    'Cursiva Calligraphy',
    'Cursiva Delicada',
    'Handwritten Script',
    'Luxury Serif',
    'Minimalist Clean',
    'Handwritten Cute',
  ];

  const iconOptions = [
    { name: 'Sparkles', icon: <Sparkles className="w-4 h-4 text-[#D4AF37]" /> },
    { name: 'Crown', icon: <Crown className="w-4 h-4 text-[#D4AF37]" /> },
    { name: 'Spiral', icon: <Orbit className="w-4 h-4 text-[#D4AF37]" /> },
    { name: 'Circle', icon: <CircleDot className="w-4 h-4 text-[#D4AF37]" /> },
    { name: 'Wave', icon: <Waves className="w-4 h-4 text-[#D4AF37]" /> },
    { name: 'Shadow', icon: <Moon className="w-4 h-4 text-[#D4AF37]" /> },
    { name: 'Heart', icon: <Heart className="w-4 h-4 text-[#D4AF37]" /> },
    { name: 'Flower2', icon: <Flower2 className="w-4 h-4 text-[#D4AF37]" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2B2B]/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#F8F6F3] border border-[#D4AF37]/40 rounded-[32px] w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col lg:flex-row my-auto max-h-[90vh]">
        
        {/* Left Side: Canvas Preview Stage */}
        <div className="lg:w-1/2 bg-[#EFE8DF] p-6 flex flex-col justify-between items-center relative border-b lg:border-b-0 lg:border-r border-[#D4AF37]/25">
          
          <div className="w-full flex items-center justify-between text-[#5B1E2D] text-xs font-serif font-bold uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Estúdio Caligráfico HD
            </span>
            <span className="text-[10px] text-[#6E6E6E]">Fundo Alpha Transparente</span>
          </div>

          {/* Checkerboard Backdrop Stage */}
          <div className="relative aspect-square w-full max-w-[360px] rounded-2xl bg-white border border-[#D4AF37]/30 flex items-center justify-center p-6 my-auto shadow-md overflow-hidden">
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#5B1E2D 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            <canvas ref={canvasRef} className="w-full h-full object-contain filter drop-shadow-md relative z-10" />
          </div>

          {/* Export Bar */}
          <div className="w-full space-y-2 mt-4">
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                  copied ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white border-[#D4AF37]/30 text-[#2B2B2B] hover:bg-[#5B1E2D] hover:text-[#D4AF37]'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
                <span>{copied ? 'Copiado!' : 'Copiar PNG Transparente'}</span>
              </button>

              <button
                onClick={() => handleDownload('2048')}
                disabled={downloading}
                className="flex-1 py-3 px-4 rounded-xl bg-[#5B1E2D] hover:bg-[#8B2D44] text-[#D4AF37] font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all border border-[#D4AF37]/50"
              >
                <Download className="w-4 h-4" />
                <span>Baixar 4K PNG</span>
              </button>
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#6E6E6E] px-1 font-light">
              <span>Qualidade do Export:</span>
              <div className="flex gap-2 font-bold text-[#5B1E2D]">
                <button onClick={() => handleDownload('1080')} className="hover:underline">1080p</button>
                <span>•</span>
                <button onClick={() => handleDownload('2048')} className="text-[#D4AF37] underline">2048p 4K</button>
                <span>•</span>
                <button onClick={() => handleDownload('4096')} className="hover:underline">4096p 8K</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Customizer Controls */}
        <div className="lg:w-1/2 p-6 flex flex-col justify-between overflow-y-auto bg-white">
          
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
              <h2 className="text-lg font-serif-title font-bold text-[#5B1E2D] flex items-center gap-2">
                Customizador Tamiris Santana
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#F8F6F3] text-[#5B1E2D] hover:bg-[#5B1E2D] hover:text-[#D4AF37] border border-[#D4AF37]/30 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customizer Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-[#F8F6F3] p-1.5 rounded-xl my-4 border border-[#D4AF37]/25 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('text')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'text' ? 'bg-[#5B1E2D] text-[#D4AF37] font-bold shadow-sm' : 'text-[#2B2B2B] hover:text-[#5B1E2D]'
                }`}
              >
                <Type className="w-3.5 h-3.5" /> Texto
              </button>
              <button
                onClick={() => setActiveTab('style')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'style' ? 'bg-[#5B1E2D] text-[#D4AF37] font-bold shadow-sm' : 'text-[#2B2B2B] hover:text-[#5B1E2D]'
                }`}
              >
                <Palette className="w-3.5 h-3.5" /> Estilo
              </button>
              <button
                onClick={() => setActiveTab('outline')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'outline' ? 'bg-[#5B1E2D] text-[#D4AF37] font-bold shadow-sm' : 'text-[#2B2B2B] hover:text-[#5B1E2D]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> Borda
              </button>
              <button
                onClick={() => setActiveTab('icon')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'icon' ? 'bg-[#5B1E2D] text-[#D4AF37] font-bold shadow-sm' : 'text-[#2B2B2B] hover:text-[#5B1E2D]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Ícone
              </button>
            </div>

            {/* Tab 1: Text & Fonts */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#2B2B2B] block mb-1">Frase Principal</label>
                  <input
                    type="text"
                    value={state.text}
                    onChange={(e) => setState({ ...state, text: e.target.value })}
                    className="w-full bg-[#F8F6F3] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5B1E2D]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2B2B] block mb-1">Subtexto (Opcional)</label>
                  <input
                    type="text"
                    value={state.subtext || ''}
                    onChange={(e) => setState({ ...state, subtext: e.target.value })}
                    className="w-full bg-[#F8F6F3] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5B1E2D]"
                  />
                </div>

                {/* Geometric Layout Selector */}
                <div>
                  <label className="text-xs font-semibold text-[#2B2B2B] flex items-center justify-between mb-1.5">
                    <span>Disposição & Layout Geométrico</span>
                    <span className="text-[10px] text-[#6E6E6E] font-light">Sem bordas externas</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      onClick={() => setState({ ...state, textLayout: 'Reto' })}
                      className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                        !state.textLayout || state.textLayout === 'Reto'
                          ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-sm'
                          : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                      }`}
                    >
                      <Type className="w-3.5 h-3.5" />
                      <span>Reto</span>
                    </button>

                    <button
                      onClick={() =>
                        setState({
                          ...state,
                          textLayout: 'Espiral',
                          strokeWidth: 0,
                          styleEffect: 'Sem Borda',
                        })
                      }
                      className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                        state.textLayout === 'Espiral'
                          ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-sm'
                          : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                      }`}
                    >
                      <Orbit className="w-3.5 h-3.5" />
                      <span>Espiral</span>
                    </button>

                    <button
                      onClick={() =>
                        setState({
                          ...state,
                          textLayout: 'Circular',
                          strokeWidth: 0,
                          styleEffect: 'Sem Borda',
                        })
                      }
                      className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                        state.textLayout === 'Circular'
                          ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-sm'
                          : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                      }`}
                    >
                      <CircleDot className="w-3.5 h-3.5" />
                      <span>Circular</span>
                    </button>

                    <button
                      onClick={() =>
                        setState({
                          ...state,
                          textLayout: 'Curva',
                          strokeWidth: 0,
                          styleEffect: 'Sem Borda',
                        })
                      }
                      className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                        state.textLayout === 'Curva'
                          ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-sm'
                          : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                      }`}
                    >
                      <Waves className="w-3.5 h-3.5" />
                      <span>Curva</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2B2B] block mb-1">Tipografia</label>
                  <div className="grid grid-cols-2 gap-2">
                    {fonts.map((f) => (
                      <button
                        key={f}
                        onClick={() => setState({ ...state, fontFamily: f })}
                        className={`p-2 rounded-xl text-xs font-medium text-left border transition-all ${
                          state.fontFamily === f
                            ? 'bg-[#5B1E2D] border-[#D4AF37] text-[#D4AF37] font-bold shadow-sm'
                            : 'bg-[#F8F6F3] border-[#D4AF37]/20 text-[#2B2B2B] hover:bg-[#EFE8DF]'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2B2B2B] mb-1">
                    <span>Tamanho do Texto: {state.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    value={state.fontSize}
                    onChange={(e) => setState({ ...state, fontSize: parseInt(e.target.value, 10) })}
                    className="w-full accent-[#5B1E2D]"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Visual Style */}
            {activeTab === 'style' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#2B2B2B] block mb-2">Efeito de Estilo</label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                    {ALL_STYLES.map((st) => (
                      <button
                        key={st}
                        onClick={() => setState({ ...state, styleEffect: st })}
                        className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
                          state.styleEffect === st
                            ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-sm'
                            : 'bg-[#F8F6F3] border-[#D4AF37]/20 text-[#2B2B2B] hover:bg-[#EFE8DF]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#2B2B2B] block mb-1">Cor Primária</label>
                    <input
                      type="color"
                      value={state.gradientStart}
                      onChange={(e) => setState({ ...state, gradientStart: e.target.value, textColor: e.target.value })}
                      className="w-full h-9 rounded-xl bg-[#F8F6F3] border border-[#D4AF37]/30 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#2B2B2B] block mb-1">Cor Secundária</label>
                    <input
                      type="color"
                      value={state.gradientEnd}
                      onChange={(e) => setState({ ...state, gradientEnd: e.target.value })}
                      className="w-full h-9 rounded-xl bg-[#F8F6F3] border border-[#D4AF37]/30 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Outline & Glow */}
            {activeTab === 'outline' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2B2B2B] mb-2">
                    <span>Espessura da Borda</span>
                    <span className="text-[#5B1E2D] font-bold">{state.strokeWidth === 0 ? 'Sem Borda' : `${state.strokeWidth}px`}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      onClick={() => setState({ ...state, strokeWidth: 0, styleEffect: 'Sem Borda' })}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                        state.strokeWidth === 0
                          ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37]'
                          : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/30 hover:bg-[#EFE8DF]'
                      }`}
                    >
                      Sem Borda
                    </button>
                    <button
                      onClick={() => setState({ ...state, strokeWidth: 8 })}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                        state.strokeWidth === 8
                          ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37]'
                          : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/30 hover:bg-[#EFE8DF]'
                      }`}
                    >
                      Fina (8px)
                    </button>
                    <button
                      onClick={() => setState({ ...state, strokeWidth: 18 })}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                        state.strokeWidth === 18
                          ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37]'
                          : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/30 hover:bg-[#EFE8DF]'
                      }`}
                    >
                      Clássica (18px)
                    </button>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="35"
                    value={state.strokeWidth}
                    onChange={(e) => setState({ ...state, strokeWidth: parseInt(e.target.value, 10) })}
                    className="w-full accent-[#5B1E2D]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2B2B2B] mb-1">
                    <span>Brilho Glow: {state.glowRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={state.glowRadius}
                    onChange={(e) => setState({ ...state, glowRadius: parseInt(e.target.value, 10) })}
                    className="w-full accent-[#5B1E2D]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2B2B2B] mb-1">
                    <span>Rotação: {state.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={state.rotation}
                    onChange={(e) => setState({ ...state, rotation: parseInt(e.target.value, 10) })}
                    className="w-full accent-[#5B1E2D]"
                  />
                </div>
              </div>
            )}

            {/* Tab 4: Icon */}
            {activeTab === 'icon' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#2B2B2B] block mb-2">Símbolo Caligráfico</label>
                  <div className="grid grid-cols-4 gap-2">
                    {iconOptions.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setState({ ...state, iconSymbol: item.name })}
                        className={`p-3 rounded-xl flex items-center justify-center border transition-all ${
                          state.iconSymbol === item.name
                            ? 'bg-[#5B1E2D] border-[#D4AF37]'
                            : 'bg-[#F8F6F3] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                        }`}
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2B2B2B] mb-1">
                    <span>Tamanho do Ícone: {state.iconSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="180"
                    value={state.iconSize}
                    onChange={(e) => setState({ ...state, iconSize: parseInt(e.target.value, 10) })}
                    className="w-full accent-[#5B1E2D]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#D4AF37]/20 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#5B1E2D] hover:bg-[#8B2D44] text-[#D4AF37] font-serif font-bold text-xs rounded-xl transition-all shadow-md border border-[#D4AF37]/40"
            >
              Concluir Edição
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

