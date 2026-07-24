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
  Moon,
  Video,
  Play,
  Film
} from 'lucide-react';

export const ANIMATION_PRESETS = [
  { id: 'scale-up', name: 'Scale Up Elastic', className: 'animate-sticker-scale-up', desc: 'Entrada com zoom elástico marcante.', icon: '⚡' },
  { id: 'rotate-spring', name: 'Giratório Mola', className: 'animate-sticker-rotate-spring', desc: 'Giro gracioso com efeito mola.', icon: '🌀' },
  { id: 'float-pulse', name: 'Flutuante Pulse', className: 'animate-sticker-float-pulse', desc: 'Flutuação contínua e aveludada em loop.', icon: '🎈' },
  { id: 'shimmer-glow', name: 'Brilho Champagne', className: 'animate-sticker-shimmer-glow', desc: 'Pulse de luz reluzente no contorno.', icon: '✨' },
  { id: 'slide-up', name: 'Slide Up Soft', className: 'animate-sticker-slide-up', desc: 'Elevação vertical suave.', icon: '⬆️' },
  { id: 'fade-in', name: 'Fade In Delicado', className: 'animate-sticker-fade-in', desc: 'Surgimento gradual e elegante.', icon: '🌸' },
];


interface StickerStudioProps {
  sticker: StickerItem | null;
  onClose: () => void;
  onSaveCustomSticker?: (newSticker: StickerItem) => void;
}

const AESTHETIC_FILTERS = [
  { id: 'Normal', name: 'Original / Normal', desc: 'Sem nenhum filtro de matriz de cor aplicado.', bgPreview: 'bg-stone-200 text-stone-700', icon: '✦' },
  { id: 'Dourado Glow', name: 'Dourado Glow', desc: 'Aquecimento ouro champagne com realce de luminosidade.', bgPreview: 'bg-amber-100 text-amber-800 border border-amber-300', icon: '✨' },
  { id: 'Vintage Matte', name: 'Vintage Matte', desc: 'Efeito fosco muted suave e tom sépia editorial.', bgPreview: 'bg-stone-300 text-stone-800 border border-stone-400', icon: '📷' },
  { id: 'Crystal Contrast', name: 'Crystal Contrast', desc: 'Contraste prateado cristalino com matiz frio.', bgPreview: 'bg-sky-100 text-sky-800 border border-sky-300', icon: '💎' },
  { id: 'Bordeaux Chic', name: 'Bordeaux Chic', desc: 'Matiz vinho nobre profundo e alta saturação.', bgPreview: 'bg-rose-100 text-rose-950 border border-rose-300', icon: '🍷' },
  { id: 'Rose Gold Soft', name: 'Rose Gold Soft', desc: 'Tom rosé romântico com brilho aveludado.', bgPreview: 'bg-pink-100 text-pink-800 border border-pink-300', icon: '🌸' },
  { id: 'Nude Minimal', name: 'Nude Minimal', desc: 'Estética minimalista com tons nude quentes.', bgPreview: 'bg-orange-100 text-amber-900 border border-amber-200', icon: '🐚' },
];

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
    aestheticFilter: 'Normal',
    rotation: 0,
    glassOpacity: 0.22,
    aspectRatio: '1:1',
    exportResolution: '2048',
  });

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [animatedPreview, setAnimatedPreview] = useState(true);
  const [animationPreset, setAnimationPreset] = useState<string>('scale-up');
  const [animKey, setAnimKey] = useState(1);
  const [activeTab, setActiveTab] = useState<'text' | 'style' | 'filters' | 'animation' | 'outline' | 'icon'>('text');

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 1200;

    renderStickerToCanvas(ctx, 1200, 1200, state);
  }, [state]);

  const handleExportWebM = () => {
    if (!canvasRef.current) return;
    setRecordingVideo(true);
    setAnimKey((prev) => prev + 1);

    try {
      const canvas = canvasRef.current;
      const stream = canvas.captureStream ? canvas.captureStream(30) : null;
      if (!stream) {
        alert('Seu navegador não suporta captura direta de vídeo do Canvas.');
        setRecordingVideo(false);
        return;
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `adesivo-animado-${state.text.toLowerCase().replace(/\s+/g, '-')}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setRecordingVideo(false);
      };

      mediaRecorder.start();

      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }, 3000);
    } catch (err) {
      console.error(err);
      setRecordingVideo(false);
    }
  };

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
            <button
              onClick={() => setAnimatedPreview(!animatedPreview)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all border ${
                animatedPreview
                  ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37]/40 shadow-xs'
                  : 'bg-white/80 text-[#6E6E6E] border-stone-300'
              }`}
            >
              <Film className="w-3 h-3 text-[#D4AF37]" />
              <span>{animatedPreview ? 'Pré-visualização Animada ON' : 'Estático'}</span>
            </button>
          </div>

          {/* Checkerboard Backdrop Stage */}
          <div className="relative aspect-square w-full max-w-[360px] rounded-2xl bg-white border border-[#D4AF37]/30 flex flex-col items-center justify-center p-6 my-auto shadow-md overflow-hidden group">
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#5B1E2D 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            
            {/* Replay Overlay Control */}
            {animatedPreview && (
              <button
                onClick={() => setAnimKey((prev) => prev + 1)}
                title="Replay Animação"
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-[#5B1E2D]/85 text-[#D4AF37] hover:bg-[#5B1E2D] backdrop-blur-md shadow-md border border-[#D4AF37]/40 transition-all hover:scale-105"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Animation Wrapper */}
            <div
              key={animKey}
              className={`w-full h-full flex items-center justify-center ${
                animatedPreview
                  ? ANIMATION_PRESETS.find((p) => p.id === animationPreset)?.className || 'animate-sticker-scale-up'
                  : ''
              }`}
            >
              <canvas ref={canvasRef} className="w-full h-full object-contain filter drop-shadow-md relative z-10" />
            </div>
          </div>

          {/* Export & Animation Action Bar */}
          <div className="w-full space-y-2 mt-4">
            {/* WebM Video Export Button for Stories */}
            <button
              onClick={handleExportWebM}
              disabled={recordingVideo}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#5B1E2D] via-[#8B2D44] to-[#5B1E2D] text-[#D4AF37] font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all border border-[#D4AF37]/60 hover:opacity-95"
            >
              <Video className="w-4 h-4 text-[#D4AF37]" />
              <span>
                {recordingVideo ? 'Gravando Vídeo WebM (3s)...' : 'Exportar Vídeo WebM (Instagram Stories)'}
              </span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                  copied ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white border-[#D4AF37]/30 text-[#2B2B2B] hover:bg-[#5B1E2D] hover:text-[#D4AF37]'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                <span>{copied ? 'Copiado!' : 'Copiar PNG'}</span>
              </button>

              <button
                onClick={() => handleDownload('2048')}
                disabled={downloading}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-[#F8F6F3] text-[#5B1E2D] font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all border border-[#D4AF37]/40"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Baixar 4K PNG</span>
              </button>
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#6E6E6E] px-1 font-light">
              <span>Resolução do PNG:</span>
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
            <div className="grid grid-cols-6 gap-1 bg-[#F8F6F3] p-1.5 rounded-xl my-4 border border-[#D4AF37]/25 text-[11px] font-semibold">
              <button
                onClick={() => setActiveTab('text')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'text' ? 'bg-[#5B1E2D] text-[#D4AF37] font-bold shadow-sm' : 'text-[#2B2B2B] hover:text-[#5B1E2D]'
                }`}
              >
                <Type className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Texto</span>
              </button>
              <button
                onClick={() => setActiveTab('style')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'style' ? 'bg-[#5B1E2D] text-[#D4AF37] font-bold shadow-sm' : 'text-[#2B2B2B] hover:text-[#5B1E2D]'
                }`}
              >
                <Palette className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Estilo</span>
              </button>
              <button
                onClick={() => setActiveTab('filters')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'filters' ? 'bg-[#5B1E2D] text-[#D4AF37] font-bold shadow-sm' : 'text-[#2B2B2B] hover:text-[#5B1E2D]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Filtros</span>
              </button>
              <button
                onClick={() => setActiveTab('animation')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'animation' ? 'bg-[#5B1E2D] text-[#D4AF37] font-bold shadow-sm' : 'text-[#2B2B2B] hover:text-[#5B1E2D]'
                }`}
              >
                <Film className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Animação</span>
              </button>
              <button
                onClick={() => setActiveTab('outline')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'outline' ? 'bg-[#5B1E2D] text-[#D4AF37] font-bold shadow-sm' : 'text-[#2B2B2B] hover:text-[#5B1E2D]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Borda</span>
              </button>
              <button
                onClick={() => setActiveTab('icon')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === 'icon' ? 'bg-[#5B1E2D] text-[#D4AF37] font-bold shadow-sm' : 'text-[#2B2B2B] hover:text-[#5B1E2D]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Ícone</span>
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

            {/* Tab 3: Estética Avançada Filters */}
            {activeTab === 'filters' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#2B2B2B]">
                      Filtros Estética Avançada (Correção de Cor)
                    </label>
                    <span className="text-[9px] font-bold bg-[#D4AF37] text-[#5B1E2D] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Canvas 4K
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E6E6E] font-light mb-3">
                    Aplique ajustes de tonalidade, temperatura e luminosidade em tempo real diretamente na renderização do canvas.
                  </p>

                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                    {AESTHETIC_FILTERS.map((f) => {
                      const isSelected = (state.aestheticFilter || 'Normal') === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setState({ ...state, aestheticFilter: f.id as any })}
                          className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 shadow-sm ${
                            isSelected
                              ? 'bg-[#5B1E2D] text-[#F8F6F3] border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/40'
                              : 'bg-[#F8F6F3] hover:bg-[#EFE8DF] border-[#D4AF37]/20 text-[#2B2B2B]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold shadow-inner ${f.bgPreview}`}>
                            {f.icon}
                          </div>

                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-serif-title font-bold ${isSelected ? 'text-[#D4AF37]' : 'text-[#2B2B2B]'}`}>
                                {f.name}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-bold text-[#D4AF37] flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Aplicado
                                </span>
                              )}
                            </div>
                            <p className={`text-[10px] font-light leading-normal ${isSelected ? 'text-[#EFE8DF]' : 'text-[#6E6E6E]'}`}>
                              {f.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Animação & Exportação de Vídeo WebM */}
            {activeTab === 'animation' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#2B2B2B]">
                      Efeitos de Animação (Entrada & Loop)
                    </label>
                    <span className="text-[9px] font-bold bg-[#D4AF37] text-[#5B1E2D] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Instagram Stories
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E6E6E] font-light mb-3">
                    Escolha um efeito de entrada ou movimento contínuo para transformar seu adesivo estático em um vídeo animado pronto para Reels e Stories.
                  </p>

                  <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                    {ANIMATION_PRESETS.map((preset) => {
                      const isSelected = animationPreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => {
                            setAnimationPreset(preset.id);
                            setAnimatedPreview(true);
                            setAnimKey((prev) => prev + 1);
                          }}
                          className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 shadow-sm ${
                            isSelected
                              ? 'bg-[#5B1E2D] text-[#F8F6F3] border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/40'
                              : 'bg-[#F8F6F3] hover:bg-[#EFE8DF] border-[#D4AF37]/20 text-[#2B2B2B]'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#5B1E2D] shrink-0 flex items-center justify-center text-base font-bold shadow-inner border border-amber-300">
                            {preset.icon}
                          </div>

                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-serif-title font-bold ${isSelected ? 'text-[#D4AF37]' : 'text-[#2B2B2B]'}`}>
                                {preset.name}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-bold text-[#D4AF37] flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Ativo
                                </span>
                              )}
                            </div>
                            <p className={`text-[10px] font-light leading-normal ${isSelected ? 'text-[#EFE8DF]' : 'text-[#6E6E6E]'}`}>
                              {preset.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D4AF37]/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setAnimKey((prev) => prev + 1)}
                      className="py-2 px-3 rounded-xl bg-[#F8F6F3] hover:bg-[#EFE8DF] text-[#5B1E2D] border border-[#D4AF37]/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" /> Testar Animação Novamente
                    </button>

                    <button
                      onClick={() => setAnimatedPreview(!animatedPreview)}
                      className="text-xs font-semibold text-[#6E6E6E] hover:text-[#5B1E2D] underline"
                    >
                      {animatedPreview ? 'Desativar Animação' : 'Ativar Animação'}
                    </button>
                  </div>

                  <button
                    onClick={handleExportWebM}
                    disabled={recordingVideo}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#5B1E2D] via-[#8B2D44] to-[#5B1E2D] text-[#D4AF37] font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-lg border border-[#D4AF37]/60 transition-all hover:scale-[1.01]"
                  >
                    <Video className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      {recordingVideo ? 'Gravando Vídeo (3s)...' : 'Gravar & Exportar Vídeo WebM (3s Loop)'}
                    </span>
                  </button>
                </div>
              </div>
            )}


            {/* Tab 4: Outline & Glow */}
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

