import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sparkles, Download, Smartphone, Sliders, Check, Layers, Image as ImageIcon, Eye, RefreshCw, Copy } from 'lucide-react';
import { StickerItem } from '../types';
import { IconSymbol } from './IconSymbol';

interface StoryEffectsCatalogProps {
  allStickers: StickerItem[];
  onSelectStickerForStory?: (sticker: StickerItem) => void;
}

export interface ShadowPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  category: string;
  defaultOpacity: number;
  defaultBlur: number;
  defaultOffsetY: number;
  type:
    | 'gradient-bottom'
    | 'gradient-top'
    | 'oval-drop'
    | 'spotlight'
    | 'diffuse-360'
    | 'card-3d'
    | 'gold-glow'
    | 'side-directional'
    | 'neon-rosegold'
    | 'glassmorphism-blur'
    | 'double-shadow'
    | 'polaroid-frame'
    | 'washi-tape'
    | 'dual-gradient-topbottom'
    | 'mirror-reflection'
    | 'sunbeam-window';
}

const SHADOW_PRESETS: ShadowPreset[] = [
  {
    id: 'sombra-inferior',
    name: 'Sombra Degradê Inferior',
    badge: 'Mais Popular',
    description: 'Gradiente escuro suave no rodapé. Garante 100% de leitura para legendas e textos sobre fotos claras.',
    category: 'Stories Legendas',
    defaultOpacity: 0.75,
    defaultBlur: 20,
    defaultOffsetY: 40,
    type: 'gradient-bottom',
  },
  {
    id: 'neon-rosegold',
    name: 'Aura Neon Rose Gold (Glow Chic)',
    badge: 'Novo Efeito',
    description: 'Brilho neon rosado de alta intensidade projetado em 360° para engajamento rápido em Stories.',
    category: 'Neon & Brilho',
    defaultOpacity: 0.90,
    defaultBlur: 35,
    defaultOffsetY: 0,
    type: 'neon-rosegold',
  },
  {
    id: 'glassmorphism-blur',
    name: 'Placa de Vidro Fosco (Glassmorphism)',
    badge: 'Tendência 2026',
    description: 'Fundo jateado transparente com iluminação nas bordas e sombra de elevação profunda.',
    category: 'Efeitos Luxo',
    defaultOpacity: 0.60,
    defaultBlur: 28,
    defaultOffsetY: 12,
    type: 'glassmorphism-blur',
  },
  {
    id: 'vinheta-superior',
    name: 'Vinheta Superior Contraste',
    badge: 'Topo Story',
    description: 'Gradiente escuro no topo do Story para destacar horários, títulos e enquetes do Instagram.',
    category: 'Stories Topo',
    defaultOpacity: 0.70,
    defaultBlur: 15,
    defaultOffsetY: -30,
    type: 'gradient-top',
  },
  {
    id: 'oval-drop-shadow',
    name: 'Sombra Oval Flutuante (Drop Shadow)',
    badge: 'Efeito 3D',
    description: 'Sombra oval projetada abaixo do sticker, criando sensação realista de elemento suspenso.',
    category: 'Elevação 3D',
    defaultOpacity: 0.65,
    defaultBlur: 25,
    defaultOffsetY: 35,
    type: 'oval-drop',
  },
  {
    id: 'double-shadow',
    name: 'Sombra Dupla Editorial (Dual Layer)',
    badge: 'Revista Moda',
    description: 'Camada dupla de sombra deslocada (ouro + preto), dando visual gráfico moderno.',
    category: 'Editorial Moda',
    defaultOpacity: 0.70,
    defaultBlur: 18,
    defaultOffsetY: 15,
    type: 'double-shadow',
  },
  {
    id: 'polaroid-frame',
    name: 'Moldura Polaroid Vintage + Sombra',
    badge: 'Nostalgia Chic',
    description: 'Moldura fotográfica clássica com reflexo suave e sombra de papel levitado.',
    category: 'Molduras & Fotos',
    defaultOpacity: 0.50,
    defaultBlur: 22,
    defaultOffsetY: 20,
    type: 'polaroid-frame',
  },
  {
    id: 'washi-tape',
    name: 'Fita Adesiva Transparente (Washi Tape)',
    badge: 'Handmade Luxo',
    description: 'Efeito de fita adesiva semi-transparente fixando a figurinha no story.',
    category: 'Efeitos Artesanais',
    defaultOpacity: 0.55,
    defaultBlur: 14,
    defaultOffsetY: -35,
    type: 'washi-tape',
  },
  {
    id: 'dual-gradient-topbottom',
    name: 'Proteção Dupla 360° (Topo + Rodapé)',
    badge: 'Contraste Total',
    description: 'Gradientes escuros simultâneos no topo e no rodapé para máxima nitidez.',
    category: 'Stories Legendas',
    defaultOpacity: 0.80,
    defaultBlur: 20,
    defaultOffsetY: 0,
    type: 'dual-gradient-topbottom',
  },
  {
    id: 'mirror-reflection',
    name: 'Reflexo Espelhado Mágico',
    badge: 'Reflexo 3D',
    description: 'Projeção espelhada invertida na base com atenuação de opacidade estilo vitrine.',
    category: 'Elevação 3D',
    defaultOpacity: 0.45,
    defaultBlur: 10,
    defaultOffsetY: 30,
    type: 'mirror-reflection',
  },
  {
    id: 'sunbeam-window',
    name: 'Fresta de Luz de Janela (Persiana)',
    badge: 'Atmosférico',
    description: 'Projeção cinematográfica de frestas de luz e sombra atravessando a cena.',
    category: 'Cinematográfico',
    defaultOpacity: 0.65,
    defaultBlur: 16,
    defaultOffsetY: 0,
    type: 'sunbeam-window',
  },
  {
    id: 'spotlight-central',
    name: 'Spotlight Radial Central',
    badge: 'Foco Dramático',
    description: 'Vinha central em degradê radial que escurece os cantos e projeta holofote no sticker.',
    category: 'Destaque Central',
    defaultOpacity: 0.80,
    defaultBlur: 30,
    defaultOffsetY: 0,
    type: 'spotlight',
  },
  {
    id: 'diffuse-360',
    name: 'Sombra Difusa 360° (Glow Escuro)',
    badge: 'Contorno Suave',
    description: 'Borda difusa e macia ao redor de todo o formato do sticker, sem alterar a cor do fundo.',
    category: 'Contorno Sutil',
    defaultOpacity: 0.60,
    defaultBlur: 18,
    defaultOffsetY: 0,
    type: 'diffuse-360',
  },
  {
    id: 'card-3d',
    name: 'Sombra de Cartão Elevado (Glass)',
    badge: 'Design Editorial',
    description: 'Sombra retangular suave para cartões de aviso, tabelas de valores e frases de efeito.',
    category: 'Cartões & Frases',
    defaultOpacity: 0.50,
    defaultBlur: 22,
    defaultOffsetY: 15,
    type: 'card-3d',
  },
  {
    id: 'gold-glow',
    name: 'Luz de Fundo Dourada Luxo',
    badge: 'Glow Dourado',
    description: 'Iluminação ambiente quente em tom Ouro Champagne para stickers e assinaturas de luxo.',
    category: 'Estética Premium',
    defaultOpacity: 0.85,
    defaultBlur: 35,
    defaultOffsetY: 0,
    type: 'gold-glow',
  },
  {
    id: 'side-directional',
    name: 'Sombra de Estúdio Lateral',
    badge: 'Editorial Moda',
    description: 'Sombra projetada na diagonal estilo iluminação profissional de estúdio fotográfico.',
    category: 'Editorial Moda',
    defaultOpacity: 0.55,
    defaultBlur: 20,
    defaultOffsetY: 20,
    type: 'side-directional',
  },
];

const PREVIEW_BACKGROUNDS = [
  { id: 'bg-clinica', name: 'Foto Clara (Clínica)', color: 'from-[#F5F0EB] via-[#EAE0D5] to-[#DFD3C3]' },
  { id: 'bg-procedimento', name: 'Pele / Estética', color: 'from-[#FDF3F0] via-[#F8E3DD] to-[#F1D1C8]' },
  { id: 'bg-dark', name: 'Dark Luxo', color: 'from-[#2B2B2B] via-[#1A1A1A] to-[#0D0D0D]' },
  { id: 'bg-marrom', name: 'Bordeaux Tamiris', color: 'from-[#5B1E2D] via-[#4A1824] to-[#2E0E16]' },
];

export const StoryEffectsCatalog: React.FC<StoryEffectsCatalogProps> = ({
  allStickers,
  onSelectStickerForStory,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ShadowPreset>(SHADOW_PRESETS[0]);
  const [selectedSticker, setSelectedSticker] = useState<StickerItem>(allStickers[0] || {
    id: 'default',
    title: 'Harmonização Facial',
    category: 'estetica-facial',
    style: 'Luxo',
    tags: ['harmonizacao'],
    iconSymbol: 'Sparkles',
  });
  const [selectedBg, setSelectedBg] = useState<string>('bg-clinica');

  // Adjustable Real-time Parameters
  const [shadowOpacity, setShadowOpacity] = useState<number>(SHADOW_PRESETS[0].defaultOpacity);
  const [shadowBlur, setShadowBlur] = useState<number>(SHADOW_PRESETS[0].defaultBlur);
  const [shadowOffsetY, setShadowOffsetY] = useState<number>(SHADOW_PRESETS[0].defaultOffsetY);

  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update slider defaults when preset changes
  const handleSelectPreset = (preset: ShadowPreset) => {
    setSelectedPreset(preset);
    setShadowOpacity(preset.defaultOpacity);
    setShadowBlur(preset.defaultBlur);
    setShadowOffsetY(preset.defaultOffsetY);
  };

  // Render High-Res Canvas with Shadow Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Draw Selected Shadow Preset
    ctx.save();
    const alpha = shadowOpacity;

    if (selectedPreset.type === 'gradient-bottom') {
      const grad = ctx.createLinearGradient(0, height * 0.35, 0, height);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.6, `rgba(0, 0, 0, ${alpha * 0.7})`);
      grad.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (selectedPreset.type === 'gradient-top') {
      const grad = ctx.createLinearGradient(0, 0, 0, height * 0.65);
      grad.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
      grad.addColorStop(0.7, `rgba(0, 0, 0, ${alpha * 0.4})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (selectedPreset.type === 'dual-gradient-topbottom') {
      const gradTop = ctx.createLinearGradient(0, 0, 0, height * 0.45);
      gradTop.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
      gradTop.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradTop;
      ctx.fillRect(0, 0, width, height * 0.45);

      const gradBot = ctx.createLinearGradient(0, height * 0.55, 0, height);
      gradBot.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradBot.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
      ctx.fillStyle = gradBot;
      ctx.fillRect(0, height * 0.55, width, height * 0.45);
    } else if (selectedPreset.type === 'neon-rosegold') {
      const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, width * 0.48);
      grad.addColorStop(0, `rgba(232, 140, 160, ${alpha})`);
      grad.addColorStop(0.5, `rgba(183, 110, 121, ${alpha * 0.5})`);
      grad.addColorStop(1, 'rgba(183, 110, 121, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, width * 0.48, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedPreset.type === 'glassmorphism-blur') {
      ctx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
      ctx.shadowBlur = shadowBlur * 2;
      ctx.shadowOffsetY = shadowOffsetY * 2;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(cx - 380, cy - 160, 760, 320, 40);
      ctx.fill();
      ctx.stroke();
    } else if (selectedPreset.type === 'double-shadow') {
      // Layer 1: Gold Shadow
      ctx.shadowColor = `rgba(212, 175, 55, ${alpha * 0.8})`;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = -15;
      ctx.shadowOffsetY = 15;
      ctx.fillStyle = 'rgba(91, 30, 45, 0.9)';
      ctx.beginPath();
      ctx.roundRect(cx - 360, cy - 120, 720, 240, 36);
      ctx.fill();

      // Layer 2: Deep Dark Shadow
      ctx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
      ctx.shadowBlur = shadowBlur * 1.5;
      ctx.shadowOffsetX = 20;
      ctx.shadowOffsetY = 20;
      ctx.fill();
    } else if (selectedPreset.type === 'polaroid-frame') {
      ctx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
      ctx.shadowBlur = shadowBlur * 2;
      ctx.shadowOffsetY = shadowOffsetY * 2;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(cx - 400, cy - 200, 800, 400, 20);
      ctx.fill();
    } else if (selectedPreset.type === 'washi-tape') {
      ctx.save();
      ctx.fillStyle = 'rgba(245, 240, 235, 0.85)';
      ctx.shadowColor = `rgba(0, 0, 0, ${alpha * 0.6})`;
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.beginPath();
      ctx.roundRect(cx - 120, cy - 160, 240, 45, 6);
      ctx.fill();
      ctx.restore();
    } else if (selectedPreset.type === 'sunbeam-window') {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.18})`;
      ctx.beginPath();
      ctx.moveTo(cx - 500, 0);
      ctx.lineTo(cx - 200, 0);
      ctx.lineTo(cx + 200, height);
      ctx.lineTo(cx - 100, height);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx - 100, 0);
      ctx.lineTo(cx + 200, 0);
      ctx.lineTo(cx + 600, height);
      ctx.lineTo(cx + 300, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (selectedPreset.type === 'oval-drop') {
      const dropY = cy + shadowOffsetY * 5;
      const grad = ctx.createRadialGradient(cx, dropY, 20, cx, dropY, width * 0.38);
      grad.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
      grad.addColorStop(0.5, `rgba(0, 0, 0, ${alpha * 0.4})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, dropY, width * 0.38, height * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedPreset.type === 'spotlight') {
      const grad = ctx.createRadialGradient(cx, cy, 50, cx, cy, width * 0.52);
      grad.addColorStop(0, `rgba(0, 0, 0, ${alpha * 0.85})`);
      grad.addColorStop(0.6, `rgba(0, 0, 0, ${alpha * 0.45})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (selectedPreset.type === 'gold-glow') {
      const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, width * 0.42);
      grad.addColorStop(0, `rgba(212, 175, 55, ${alpha})`);
      grad.addColorStop(0.6, `rgba(212, 175, 55, ${alpha * 0.3})`);
      grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, width * 0.42, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedPreset.type === 'diffuse-360') {
      ctx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
      ctx.shadowBlur = shadowBlur * 2.5;
      ctx.fillStyle = `rgba(0,0,0,${alpha * 0.5})`;
      ctx.beginPath();
      ctx.roundRect(cx - 320, cy - 140, 640, 280, 48);
      ctx.fill();
    } else if (selectedPreset.type === 'card-3d') {
      ctx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
      ctx.shadowBlur = shadowBlur * 2;
      ctx.shadowOffsetY = shadowOffsetY * 2;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.beginPath();
      ctx.roundRect(cx - 380, cy - 160, 760, 320, 40);
      ctx.fill();
    } else if (selectedPreset.type === 'side-directional') {
      const grad = ctx.createRadialGradient(cx + 150, cy + 150, 20, cx, cy, width * 0.45);
      grad.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx + 80, cy + 80, width * 0.38, height * 0.22, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Render Foreground Sticker Text / Design
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sticker Backdrop Box if not card-3d
    if (selectedPreset.type !== 'card-3d') {
      ctx.fillStyle = 'rgba(91, 30, 45, 0.88)';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(cx - 360, cy - 120, 720, 240, 36);
      ctx.fill();
      ctx.stroke();
    }

    // Title Text
    ctx.font = 'bold 52px "Cinzel", serif';
    ctx.fillStyle = selectedPreset.type === 'card-3d' ? '#5B1E2D' : '#D4AF37';
    ctx.fillText(selectedSticker.title, cx, cy);

    ctx.restore();
  }, [selectedPreset, selectedSticker, shadowOpacity, shadowBlur, shadowOffsetY]);

  // Download High-Res PNG with shadow applied
  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Sticker-Sombra-${selectedPreset.id}-${selectedSticker.id}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleTestInStory = () => {
    if (onSelectStickerForStory) {
      onSelectStickerForStory(selectedSticker);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#5B1E2D] via-[#7B283E] to-[#5B1E2D] border border-[#D4AF37]/50 rounded-[32px] p-6 sm:p-8 shadow-2xl text-[#F8F6F3] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#D4AF37] text-[#5B1E2D] text-[10px] font-bold tracking-widest uppercase rounded-full shadow-sm">
                CATÁLOGO DE EFEITOS
              </span>
              <span className="text-xs text-[#EFE8DF] font-light">Especial Stories & Reels</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#F8F6F3]">
              Catálogo de Efeitos & Sombras para Stories
            </h1>
            <p className="text-xs sm:text-sm text-[#EFE8DF]/90 font-light max-w-2xl">
              Aplique sombras degradê inferiores, vinhetas de topo e drop shadows 3D instantaneamente aos seus adesivos com preview em tempo real e exportação em 4K.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadPNG}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#5B1E2D] font-serif font-bold text-xs flex items-center gap-2 transition-all shadow-lg hover:scale-105 border border-[#D4AF37]"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PNG 4K</span>
            </button>

            {onSelectStickerForStory && (
              <button
                onClick={handleTestInStory}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#F8F6F3] border border-white/20 font-serif font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                <span>Testar no Simulador</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Catalog List vs Real-time Interactive Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Shadow Preset Catalog Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
            <h2 className="text-base font-serif-title font-bold text-[#5B1E2D] flex items-center gap-2">
              <Moon className="w-5 h-5 text-[#D4AF37]" /> Sombras Pré-Definidas ({SHADOW_PRESETS.length})
            </h2>
            <span className="text-xs text-[#6E6E6E]">Clique para testar</span>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {SHADOW_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border flex items-start gap-3.5 shadow-sm ${
                    isSelected
                      ? 'bg-[#5B1E2D] text-[#F8F6F3] border-[#D4AF37] shadow-lg ring-2 ring-[#D4AF37]/40'
                      : 'bg-white hover:bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/30'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-[#D4AF37] text-[#5B1E2D]' : 'bg-[#5B1E2D] text-[#D4AF37]'}`}>
                    <Moon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-serif-title font-bold ${isSelected ? 'text-[#D4AF37]' : 'text-[#2B2B2B]'}`}>
                        {preset.name}
                      </h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' : 'bg-[#5B1E2D]/10 text-[#5B1E2D]'
                      }`}>
                        {preset.badge}
                      </span>
                    </div>

                    <p className={`text-xs font-light leading-relaxed ${isSelected ? 'text-[#EFE8DF]' : 'text-[#6E6E6E]'}`}>
                      {preset.description}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[10px]">
                      <span className={isSelected ? 'text-[#D4AF37]/80' : 'text-[#8B2D44] font-medium'}>
                        Categoria: {preset.category}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[#D4AF37] font-bold">
                          <Check className="w-3 h-3" /> Ativo
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Real-time Interactive Preview Workbench */}
        <div className="lg:col-span-7 bg-white border border-[#D4AF37]/30 rounded-[32px] p-6 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
            <div>
              <h2 className="text-lg font-serif-title font-bold text-[#5B1E2D] flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#D4AF37]" /> Visualização & Ajustes em Tempo Real
              </h2>
              <p className="text-xs text-[#6E6E6E]">
                Testando: <span className="font-bold text-[#5B1E2D]">{selectedPreset.name}</span>
              </p>
            </div>

            {/* Background Switcher Pill */}
            <div className="flex items-center gap-1 bg-[#F8F6F3] p-1 rounded-xl border border-[#D4AF37]/20">
              {PREVIEW_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setSelectedBg(bg.id)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                    selectedBg === bg.id
                      ? 'bg-[#5B1E2D] text-[#D4AF37] shadow-sm'
                      : 'text-[#6E6E6E] hover:text-[#2B2B2B]'
                  }`}
                >
                  {bg.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Canvas Preview Frame */}
          <div className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/40 flex items-center justify-center">
            
            {/* Background Layer */}
            <div className={`absolute inset-0 bg-gradient-to-b ${PREVIEW_BACKGROUNDS.find(b => b.id === selectedBg)?.color}`} />

            {/* Hidden Canvas element for 4K PNG exporting */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Live Interactive UI Layer */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-6">
              
              {/* Dynamic Shadow Overlay */}
              {selectedPreset.type === 'gradient-bottom' && (
                <div
                  className="absolute inset-x-0 bottom-0 pointer-events-none transition-all duration-200"
                  style={{
                    height: '60%',
                    background: `linear-gradient(to top, rgba(0,0,0,${shadowOpacity}), transparent)`,
                  }}
                />
              )}

              {selectedPreset.type === 'gradient-top' && (
                <div
                  className="absolute inset-x-0 top-0 pointer-events-none transition-all duration-200"
                  style={{
                    height: '60%',
                    background: `linear-gradient(to bottom, rgba(0,0,0,${shadowOpacity}), transparent)`,
                  }}
                />
              )}

              {selectedPreset.type === 'dual-gradient-topbottom' && (
                <>
                  <div
                    className="absolute inset-x-0 top-0 pointer-events-none transition-all duration-200"
                    style={{
                      height: '40%',
                      background: `linear-gradient(to bottom, rgba(0,0,0,${shadowOpacity}), transparent)`,
                    }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 pointer-events-none transition-all duration-200"
                    style={{
                      height: '40%',
                      background: `linear-gradient(to top, rgba(0,0,0,${shadowOpacity}), transparent)`,
                    }}
                  />
                </>
              )}

              {selectedPreset.type === 'neon-rosegold' && (
                <div
                  className="absolute pointer-events-none rounded-full transition-all duration-200"
                  style={{
                    width: '85%',
                    height: '85%',
                    background: `radial-gradient(circle at center, rgba(232,140,160,${shadowOpacity}), rgba(183,110,121,${shadowOpacity * 0.4}) 60%, transparent 80%)`,
                    filter: `blur(${shadowBlur * 0.8}px)`,
                  }}
                />
              )}

              {selectedPreset.type === 'sunbeam-window' && (
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-200 opacity-60 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, transparent 20%, rgba(255,255,255,${shadowOpacity * 0.4}) 25%, transparent 30%, rgba(255,255,255,${shadowOpacity * 0.4}) 45%, transparent 50%)`,
                  }}
                />
              )}

              {selectedPreset.type === 'spotlight' && (
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-200"
                  style={{
                    background: `radial-gradient(circle at center, rgba(0,0,0,${shadowOpacity * 0.9}), transparent 70%)`,
                  }}
                />
              )}

              {selectedPreset.type === 'oval-drop' && (
                <div
                  className="absolute pointer-events-none rounded-full transition-all duration-200"
                  style={{
                    width: '75%',
                    height: '25%',
                    bottom: `${20 - shadowOffsetY * 0.3}%`,
                    background: `radial-gradient(ellipse at center, rgba(0,0,0,${shadowOpacity}), transparent 70%)`,
                    filter: `blur(${shadowBlur * 0.5}px)`,
                  }}
                />
              )}

              {selectedPreset.type === 'gold-glow' && (
                <div
                  className="absolute pointer-events-none rounded-full transition-all duration-200"
                  style={{
                    width: '80%',
                    height: '80%',
                    background: `radial-gradient(circle at center, rgba(212,175,55,${shadowOpacity * 0.75}), transparent 70%)`,
                    filter: `blur(${shadowBlur * 0.8}px)`,
                  }}
                />
              )}

              {selectedPreset.type === 'washi-tape' && (
                <div
                  className="absolute z-30 pointer-events-none bg-white/70 backdrop-blur-xs border border-white/40 shadow-sm rounded-xs"
                  style={{
                    width: '100px',
                    height: '22px',
                    top: '25%',
                    transform: 'rotate(-6deg)',
                    boxShadow: `0 4px 8px rgba(0,0,0,${shadowOpacity * 0.4})`,
                  }}
                />
              )}

              {/* Active Sticker Visual Element */}
              <div
                className="relative z-20 transition-all duration-200 max-w-full"
                style={{
                  transform: `translateY(${shadowOffsetY * 0.2}px)`,
                  filter:
                    selectedPreset.type === 'diffuse-360'
                      ? `drop-shadow(0px 0px ${shadowBlur}px rgba(0,0,0,${shadowOpacity}))`
                      : selectedPreset.type === 'side-directional'
                      ? `drop-shadow(12px 16px ${shadowBlur}px rgba(0,0,0,${shadowOpacity}))`
                      : selectedPreset.type === 'double-shadow'
                      ? `drop-shadow(-8px 8px ${shadowBlur * 0.5}px rgba(212,175,55,${shadowOpacity})) drop-shadow(12px 12px ${shadowBlur}px rgba(0,0,0,${shadowOpacity}))`
                      : selectedPreset.type === 'mirror-reflection'
                      ? `drop-shadow(0px 10px ${shadowBlur * 0.8}px rgba(0,0,0,${shadowOpacity}))`
                      : 'none',
                }}
              >
                <div
                  className={`px-6 py-4 text-center shadow-xl border transition-all ${
                    selectedPreset.type === 'card-3d'
                      ? 'bg-white/95 text-[#5B1E2D] rounded-3xl border-[#D4AF37]/50'
                      : selectedPreset.type === 'glassmorphism-blur'
                      ? 'bg-white/20 text-[#F8F6F3] backdrop-blur-xl rounded-3xl border-white/40 shadow-2xl'
                      : selectedPreset.type === 'polaroid-frame'
                      ? 'bg-white text-[#2B2B2B] rounded-lg border-b-8 border-white p-6 shadow-2xl'
                      : 'bg-[#5B1E2D]/90 text-[#F8F6F3] backdrop-blur-md rounded-3xl border-[#D4AF37]/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {selectedSticker.iconSymbol && (
                      <IconSymbol
                        name={selectedSticker.iconSymbol}
                        className={`w-5 h-5 ${selectedPreset.type === 'polaroid-frame' ? 'text-[#5B1E2D]' : 'text-[#D4AF37]'}`}
                      />
                    )}
                    <span
                      className={`font-serif-title font-bold text-lg ${
                        selectedPreset.type === 'polaroid-frame' ? 'text-[#5B1E2D]' : 'text-[#D4AF37]'
                      }`}
                    >
                      {selectedSticker.title}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-widest font-light block ${
                      selectedPreset.type === 'polaroid-frame' ? 'text-[#6E6E6E]' : 'text-[#EFE8DF]'
                    }`}
                  >
                    {selectedSticker.style} • Tamiris Santana
                  </span>
                </div>

                {/* Mirror Reflection Effect */}
                {selectedPreset.type === 'mirror-reflection' && (
                  <div className="mt-1 opacity-30 transform scale-y-[-1] blur-[1px] pointer-events-none select-none mask-gradient-to-t">
                    <div className="px-6 py-4 rounded-3xl text-center bg-[#5B1E2D]/90 text-[#F8F6F3]">
                      <span className="font-serif-title font-bold text-lg text-[#D4AF37]">
                        {selectedSticker.title}
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Sticker Selector Carousel */}
          <div className="space-y-2">
            <span className="text-xs font-serif font-bold text-[#5B1E2D] block">
              Selecione o Adesivo para Testar com a Sombra:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {allStickers.slice(0, 15).map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => setSelectedSticker(sticker)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedSticker.id === sticker.id
                      ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-md'
                      : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                  }`}
                >
                  {sticker.title}
                </button>
              ))}
            </div>
          </div>

          {/* Fine-Tuning Sliders */}
          <div className="bg-[#F8F6F3] border border-[#D4AF37]/25 rounded-2xl p-4 space-y-4">
            <h3 className="text-xs font-serif-title font-bold text-[#5B1E2D] flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#D4AF37]" /> Controles de Personalização da Sombra
              </span>
              <button
                onClick={() => handleSelectPreset(selectedPreset)}
                className="text-[10px] text-[#8B2D44] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Redefinir Padrão
              </button>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Opacity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-[#2B2B2B]">
                  <span>Opacidade</span>
                  <span className="text-[#5B1E2D] font-bold">{Math.round(shadowOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={shadowOpacity}
                  onChange={(e) => setShadowOpacity(parseFloat(e.target.value))}
                  className="w-full accent-[#5B1E2D]"
                />
              </div>

              {/* Blur Radius Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-[#2B2B2B]">
                  <span>Desfocagem (Blur)</span>
                  <span className="text-[#5B1E2D] font-bold">{shadowBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={shadowBlur}
                  onChange={(e) => setShadowBlur(parseInt(e.target.value, 10))}
                  className="w-full accent-[#5B1E2D]"
                />
              </div>

              {/* Offset Y Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-[#2B2B2B]">
                  <span>Posição / Elevação</span>
                  <span className="text-[#5B1E2D] font-bold">{shadowOffsetY}px</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="2"
                  value={shadowOffsetY}
                  onChange={(e) => setShadowOffsetY(parseInt(e.target.value, 10))}
                  className="w-full accent-[#5B1E2D]"
                />
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleDownloadPNG}
              className="flex-1 py-3 px-4 rounded-xl bg-[#5B1E2D] hover:bg-[#8B2D44] text-[#D4AF37] font-serif font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md border border-[#D4AF37]/40"
            >
              <Download className="w-4 h-4" />
              <span>Aplicar e Baixar PNG 4K</span>
            </button>

            {onSelectStickerForStory && (
              <button
                onClick={handleTestInStory}
                className="py-3 px-4 rounded-xl bg-[#F8F6F3] text-[#5B1E2D] hover:bg-[#EFE8DF] font-serif font-bold text-xs flex items-center justify-center gap-2 transition-all border border-[#D4AF37]/30"
              >
                <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                <span>Usar no Simulador</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
