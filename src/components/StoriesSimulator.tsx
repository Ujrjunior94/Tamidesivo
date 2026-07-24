import React, { useState, useRef, useEffect } from 'react';
import { StickerItem, StoryMockupElement } from '../types';
import { IconSymbol } from './IconSymbol';
import {
  Smartphone,
  Image as ImageIcon,
  Plus,
  Trash2,
  Sparkles,
  Heart,
  Send,
  MoreHorizontal,
  RotateCw,
  Scaling,
  X,
  Move,
  MousePointer,
  Crown,
  Palette,
  Pipette,
  Check,
  Sliders
} from 'lucide-react';

interface PaletteSwatch {
  hex: string;
  label: string;
  isDark: boolean;
  lum?: number;
}

interface PaletteSuggestion {
  textColor: string;
  outlineColor: string;
  accentColor: string;
  bgColor: string;
  swatches: PaletteSwatch[];
}

const PRESET_PALETTES: { [id: string]: PaletteSuggestion } = {
  'ts-luxury': {
    textColor: '#D4AF37',
    outlineColor: '#F5E6E8',
    accentColor: '#F3E5AB',
    bgColor: '#5B1E2D',
    swatches: [
      { hex: '#5B1E2D', label: 'Vinho Tamiris', isDark: true },
      { hex: '#D4AF37', label: 'Ouro Champagne', isDark: false },
      { hex: '#F5E6E8', label: 'Rosé Soft', isDark: false },
      { hex: '#3D141E', label: 'Bordeaux Escuro', isDark: true },
    ],
  },
  'ts-nude': {
    textColor: '#5B1E2D',
    outlineColor: '#D4AF37',
    accentColor: '#8B5E3C',
    bgColor: '#F8F6F3',
    swatches: [
      { hex: '#F8F6F3', label: 'Nude Soft', isDark: false },
      { hex: '#5B1E2D', label: 'Vinho Chique', isDark: true },
      { hex: '#D4AF37', label: 'Ouro Nobre', isDark: false },
      { hex: '#EFE8DF', label: 'Areia Clínica', isDark: false },
    ],
  },
  'gold-chic': {
    textColor: '#D4AF37',
    outlineColor: '#FFFFFF',
    accentColor: '#8B2D44',
    bgColor: '#2B2B2B',
    swatches: [
      { hex: '#2B2B2B', label: 'Charcoal Ouro', isDark: true },
      { hex: '#D4AF37', label: 'Ouro Reluzente', isDark: false },
      { hex: '#8B2D44', label: 'Vinho Vibrante', isDark: true },
      { hex: '#F8F6F3', label: 'Branco Marfim', isDark: false },
    ],
  },
  'clinic-rose': {
    textColor: '#4A1824',
    outlineColor: '#D4AF37',
    accentColor: '#D5C3C6',
    bgColor: '#FAF3F0',
    swatches: [
      { hex: '#FAF3F0', label: 'Rosé Clínica', isDark: false },
      { hex: '#4A1824', label: 'Vinho Profundo', isDark: true },
      { hex: '#D4AF37', label: 'Ouro Champagne', isDark: false },
      { hex: '#D5C3C6', label: 'Nude Rosé', isDark: false },
    ],
  },
  'dark-marble': {
    textColor: '#D4AF37',
    outlineColor: '#FFFFFF',
    accentColor: '#E0E0E0',
    bgColor: '#1C1C1C',
    swatches: [
      { hex: '#1C1C1C', label: 'Preto Mármore', isDark: true },
      { hex: '#D4AF37', label: 'Ouro Real', isDark: false },
      { hex: '#FFFFFF', label: 'Branco Neve', isDark: false },
      { hex: '#4A4A4A', label: 'Cinza Estúdio', isDark: true },
    ],
  },
};

interface StoriesSimulatorProps {
  initialSticker?: StickerItem | null;
  allStickers: StickerItem[];
}

export const StoriesSimulator: React.FC<StoriesSimulatorProps> = ({ initialSticker, allStickers }) => {
  const [backgroundPreset, setBackgroundPreset] = useState<string>('ts-luxury');
  const [customBgImage, setCustomBgImage] = useState<string | null>(null);
  const [simulatorCategory, setSimulatorCategory] = useState<string>('all');
  const [extractedPalette, setExtractedPalette] = useState<PaletteSuggestion>(PRESET_PALETTES['ts-luxury']);
  const [appliedMsg, setAppliedMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Extract color palette from background photo or preset
  useEffect(() => {
    if (customBgImage) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const cvs = document.createElement('canvas');
        const ctx = cvs.getContext('2d');
        if (!ctx) return;
        cvs.width = 40;
        cvs.height = 40;
        ctx.drawImage(img, 0, 0, 40, 40);
        const data = ctx.getImageData(0, 0, 40, 40).data;

        const bins: { [hex: string]: { r: number; g: number; b: number; count: number } } = {};
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 100) continue;

          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1)}`;

          if (!bins[hex]) {
            bins[hex] = { r: qr, g: qg, b: qb, count: 0 };
          }
          bins[hex].count++;
        }

        const sorted = Object.values(bins).sort((a, b) => b.count - a.count);
        const top = sorted.slice(0, 4);

        const swatches: PaletteSwatch[] = top.map((c, idx) => {
          const hex = `#${((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1)}`;
          const lum = (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
          const labels = ['Fundo Principal', 'Tom Primário', 'Contraste Foto', 'Acento Imagem'];
          return {
            hex,
            label: labels[idx] || `Tom ${idx + 1}`,
            isDark: lum < 0.5,
            lum,
          };
        });

        const bgLum = swatches[0]?.lum ?? 0.5;
        let textC = bgLum > 0.55 ? '#5B1E2D' : '#D4AF37';
        let outlineC = bgLum > 0.55 ? '#D4AF37' : '#FFFFFF';
        let accentC = swatches[1]?.hex || (bgLum > 0.55 ? '#4A1824' : '#F3E5AB');

        setExtractedPalette({
          textColor: textC,
          outlineColor: outlineC,
          accentColor: accentC,
          bgColor: swatches[0]?.hex || '#5B1E2D',
          swatches,
        });
      };
      img.src = customBgImage;
    } else {
      setExtractedPalette(PRESET_PALETTES[backgroundPreset] || PRESET_PALETTES['ts-luxury']);
    }
  }, [customBgImage, backgroundPreset]);

  const handleApplyPaletteToSticker = (textC: string, primaryC: string) => {
    if (!selectedElementId) return;
    setPlacedStickers((prev) =>
      prev.map((item) => {
        if (item.id === selectedElementId) {
          return {
            ...item,
            sticker: {
              ...item.sticker,
              textColor: textC,
              primaryColor: primaryC,
            },
          };
        }
        return item;
      })
    );
    setAppliedMsg('Paleta harmonizada aplicada!');
    setTimeout(() => setAppliedMsg(null), 2500);
  };

  // Story Elements State
  const [placedStickers, setPlacedStickers] = useState<StoryMockupElement[]>(() => {
    if (initialSticker) {
      return [
        {
          id: `placed-${Date.now()}`,
          sticker: initialSticker,
          x: 50, // % from left
          y: 40, // % from top
          scale: 1,
          rotation: -5,
          zIndex: 1,
        },
      ];
    }
    return [
      {
        id: `placed-default`,
        sticker: allStickers[0] || {
          id: 'def-1',
          title: 'Harmonização Facial',
          category: 'harmonizacao',
          style: 'Traços Finos',
          fontFamily: 'Script Elegante',
          primaryColor: '#D4AF37',
          textColor: '#FFFFFF',
          tags: ['tamiris', 'beleza'],
          isNew: true,
          elements: ['Tamiris Santana']
        },
        x: 50,
        y: 40,
        scale: 1,
        rotation: -4,
        zIndex: 1,
      },
    ];
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(placedStickers[0]?.id || null);

  // Gesture State
  const [activeGesture, setActiveGesture] = useState<{
    type: 'drag' | 'resize' | 'rotate';
    elementId: string;
    startX: number;
    startY: number;
    initialElemX: number;
    initialElemY: number;
    initialScale: number;
    initialRotation: number;
    centerX: number;
    centerY: number;
  } | null>(null);

  const backgroundPresets = [
    {
      id: 'ts-luxury',
      name: 'Tamiris Wine Luxury',
      bgClass: 'bg-gradient-to-b from-[#5B1E2D] via-[#3D141E] to-[#220B10]',
    },
    {
      id: 'ts-nude',
      name: 'Nude Soft Glow',
      bgClass: 'bg-gradient-to-b from-[#F8F6F3] via-[#EFE8DF] to-[#D9CEBF]',
    },
    {
      id: 'gold-chic',
      name: 'Gold Elegance',
      bgClass: 'bg-gradient-to-br from-[#2B2B2B] via-[#5B1E2D] to-[#D4AF37]/40',
    },
    {
      id: 'clinic-rose',
      name: 'Clínica Rosé',
      bgClass: 'bg-gradient-to-b from-[#FAF3F0] via-[#F5E6E8] to-[#D5C3C6]',
    },
    {
      id: 'dark-marble',
      name: 'Mármore Nero',
      bgClass: 'bg-gradient-to-b from-[#1C1C1C] via-[#121212] to-[#000000]',
    },
  ];

  const handleAddSticker = (sticker: StickerItem) => {
    const newElement: StoryMockupElement = {
      id: `placed-${Date.now()}`,
      sticker,
      x: 35 + Math.random() * 30,
      y: 30 + Math.random() * 30,
      scale: 1,
      rotation: Math.floor(Math.random() * 20) - 10,
      zIndex: placedStickers.length + 1,
    };
    setPlacedStickers([...placedStickers, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleRemoveElement = (id: string) => {
    setPlacedStickers(placedStickers.filter((e) => e.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const selectedElement = placedStickers.find((e) => e.id === selectedElementId);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBgImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Start Gesture (Drag, Resize, Rotate)
  const handleStartGesture = (
    e: React.MouseEvent | React.TouchEvent,
    type: 'drag' | 'resize' | 'rotate',
    element: StoryMockupElement
  ) => {
    e.stopPropagation();
    setSelectedElementId(element.id);

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const centerX = rect.left + (element.x / 100) * rect.width;
    const centerY = rect.top + (element.y / 100) * rect.height;

    setActiveGesture({
      type,
      elementId: element.id,
      startX: clientX,
      startY: clientY,
      initialElemX: element.x,
      initialElemY: element.y,
      initialScale: element.scale,
      initialRotation: element.rotation,
      centerX,
      centerY,
    });
  };

  // Global mousemove/touchmove listener during active gestures
  useEffect(() => {
    if (!activeGesture) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!canvasRef.current || !activeGesture) return;
      const rect = canvasRef.current.getBoundingClientRect();

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const {
        type,
        elementId,
        startX,
        startY,
        initialElemX,
        initialElemY,
        initialScale,
        initialRotation,
        centerX,
        centerY,
      } = activeGesture;

      setPlacedStickers((prev) =>
        prev.map((item) => {
          if (item.id !== elementId) return item;

          if (type === 'drag') {
            const deltaX = ((clientX - startX) / rect.width) * 100;
            const deltaY = ((clientY - startY) / rect.height) * 100;
            const newX = Math.max(8, Math.min(92, initialElemX + deltaX));
            const newY = Math.max(12, Math.min(88, initialElemY + deltaY));
            return { ...item, x: newX, y: newY };
          }

          if (type === 'resize') {
            const initDist = Math.hypot(startX - centerX, startY - centerY) || 1;
            const currDist = Math.hypot(clientX - centerX, clientY - centerY);
            const rawScale = initialScale * (currDist / initDist);
            const newScale = Math.max(0.4, Math.min(2.5, Number(rawScale.toFixed(2))));
            return { ...item, scale: newScale };
          }

          if (type === 'rotate') {
            const startAngle = Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI);
            const currAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
            const deltaAngle = currAngle - startAngle;
            const newRot = Math.round((initialRotation + deltaAngle) % 360);
            return { ...item, rotation: newRot };
          }

          return item;
        })
      );
    };

    const handleEnd = () => {
      setActiveGesture(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [activeGesture]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif-title font-bold text-[#5B1E2D] flex items-center justify-center gap-2">
          <Smartphone className="w-8 h-8 text-[#D4AF37]" /> Simulador Instagram Stories & Reels
        </h1>
        <p className="text-[#6E6E6E] font-light text-sm max-w-xl mx-auto">
          Arraste, gire e redimensione os adesivos da Tamiris Santana diretamente na tela com o mouse ou gestos de toque.
        </p>
      </div>

      {/* Gesture Help Banner */}
      <div className="bg-[#5B1E2D] border border-[#D4AF37]/40 rounded-2xl p-3 flex items-center justify-center gap-2 text-xs text-[#F8F6F3] text-center shadow-md">
        <MousePointer className="w-4 h-4 text-[#D4AF37] animate-pulse shrink-0" />
        <span>
          <strong>Gestos Interativos:</strong> Clique e arraste para mover. Use o controle <strong>Dourado</strong> para girar e o controle 02 para redimensionar!
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Background Selection Card */}
          <div className="bg-white border border-[#D4AF37]/30 rounded-[32px] p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-serif-title font-bold text-[#5B1E2D] flex items-center gap-2 border-b border-[#D4AF37]/20 pb-2">
              <ImageIcon className="w-4 h-4 text-[#D4AF37]" /> Fundo do Story
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {backgroundPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setBackgroundPreset(preset.id);
                    setCustomBgImage(null);
                  }}
                  className={`h-16 rounded-xl p-2 text-left flex flex-col justify-end text-[10px] font-semibold text-white shadow-sm transition-all border ${
                    backgroundPreset === preset.id && !customBgImage
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40 scale-105'
                      : 'border-[#D4AF37]/20 opacity-80 hover:opacity-100'
                  } ${preset.bgClass}`}
                >
                  <span className="drop-shadow">{preset.name}</span>
                </button>
              ))}
            </div>

            {/* Custom Photo Upload */}
            <div className="pt-2">
              <label className="w-full py-2.5 px-4 rounded-xl bg-[#F8F6F3] hover:bg-[#EFE8DF] text-[#5B1E2D] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border border-[#D4AF37]/30 shadow-sm">
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Enviar Foto da Clínica / Procedimento</span>
                <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Color Palette Extractor & Suggestions Card */}
          <div className="bg-white border border-[#D4AF37]/30 rounded-[32px] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
              <h3 className="text-sm font-serif-title font-bold text-[#5B1E2D] flex items-center gap-2">
                <Pipette className="w-4 h-4 text-[#D4AF37]" />
                Paleta Extraída do Story
              </h3>
              <span className="text-[10px] font-bold bg-[#D4AF37]/20 text-[#5B1E2D] px-2 py-0.5 rounded-full uppercase">
                {customBgImage ? 'Foto Carregada' : 'Preset Ativo'}
              </span>
            </div>

            <p className="text-[11px] text-[#6E6E6E] font-light leading-snug">
              Cores extraídas da imagem de fundo. Use as sugestões de alto contraste para garantir legibilidade perfeita no seu story.
            </p>

            {/* Extracted Swatches Grid */}
            <div className="grid grid-cols-2 gap-2">
              {extractedPalette.swatches.map((swatch, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-[#F8F6F3] border border-[#D4AF37]/20 flex items-center gap-2 shadow-xs"
                >
                  <div
                    className="w-7 h-7 rounded-lg shrink-0 border border-black/10 shadow-inner"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#2B2B2B] block truncate">
                      {swatch.label}
                    </span>
                    <span className="text-[9px] font-mono text-[#6E6E6E] uppercase">
                      {swatch.hex}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Harmonized Suggestions */}
            <div className="p-3 bg-[#5B1E2D]/5 rounded-2xl border border-[#D4AF37]/25 space-y-2">
              <span className="text-[11px] font-bold text-[#5B1E2D] block flex items-center justify-between">
                <span>Sugestão de Harmonia:</span>
                {appliedMsg && (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> {appliedMsg}
                  </span>
                )}
              </span>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#6E6E6E]">Texto:</span>
                  <div
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: extractedPalette.textColor }}
                  />
                  <span className="font-mono text-[10px] font-bold text-[#2B2B2B]">
                    {extractedPalette.textColor}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#6E6E6E]">Fundo Adesivo:</span>
                  <div
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: extractedPalette.bgColor }}
                  />
                  <span className="font-mono text-[10px] font-bold text-[#2B2B2B]">
                    {extractedPalette.bgColor}
                  </span>
                </div>
              </div>

              {selectedElement ? (
                <button
                  onClick={() =>
                    handleApplyPaletteToSticker(extractedPalette.textColor, extractedPalette.bgColor)
                  }
                  className="w-full py-2 px-3 mt-1 rounded-xl bg-[#5B1E2D] text-[#D4AF37] hover:bg-[#3D141E] text-xs font-serif font-bold flex items-center justify-center gap-2 shadow-sm transition-all border border-[#D4AF37]/40"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Aplicar Paleta no Adesivo Selecionado</span>
                </button>
              ) : (
                <p className="text-[10px] text-[#6E6E6E] italic text-center pt-1">
                  Selecione um adesivo na tela para aplicar a paleta extraída.
                </p>
              )}
            </div>
          </div>

          {/* Add Stickers Palette */}
          <div className="bg-white border border-[#D4AF37]/30 rounded-[32px] p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-serif-title font-bold text-[#5B1E2D] flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Adicionar Adesivos ao Story
              </span>
              <span className="text-[10px] text-[#6E6E6E] font-light">Toque para inserir</span>
            </h3>

            {/* Quick Filter Buttons inside Simulator */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] font-bold">
              <button
                onClick={() => setSimulatorCategory('all')}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                  simulatorCategory === 'all'
                    ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37]'
                    : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSimulatorCategory('sombras-story')}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                  simulatorCategory === 'sombras-story'
                    ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37]'
                    : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                }`}
              >
                Sombras
              </button>
              <button
                onClick={() => setSimulatorCategory('desenhos-formas')}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                  simulatorCategory === 'desenhos-formas'
                    ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37]'
                    : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                }`}
              >
                Espirais & Formas
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {allStickers
                .filter((s) => simulatorCategory === 'all' || s.category === simulatorCategory)
                .slice(0, 24)
                .map((sticker) => (
                  <button
                    key={sticker.id}
                    onClick={() => handleAddSticker(sticker)}
                    className="p-2.5 rounded-xl bg-[#F8F6F3] border border-[#D4AF37]/20 hover:border-[#5B1E2D] text-left transition-all group shadow-sm flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-[#2B2B2B] group-hover:text-[#5B1E2D] line-clamp-1 block">
                      {sticker.title}
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] text-[#6E6E6E] uppercase font-light">{sticker.style}</span>
                      <Plus className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Selected Sticker Adjustments Sliders */}
          {selectedElement && (
            <div className="bg-white border border-[#D4AF37]/30 rounded-[32px] p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
                <h3 className="text-sm font-serif-title font-bold text-[#5B1E2D]">Ajustes Finos do Adesivo</h3>
                <button
                  onClick={() => handleRemoveElement(selectedElement.id)}
                  className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remover
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2B2B2B] mb-1">
                    <span>Tamanho (Escala): {Math.round(selectedElement.scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.5"
                    step="0.05"
                    value={selectedElement.scale}
                    onChange={(e) => {
                      const newScale = parseFloat(e.target.value);
                      setPlacedStickers(
                        placedStickers.map((item) =>
                          item.id === selectedElement.id ? { ...item, scale: newScale } : item
                        )
                      );
                    }}
                    className="w-full accent-[#5B1E2D]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2B2B2B] mb-1">
                    <span>Rotação: {selectedElement.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={selectedElement.rotation}
                    onChange={(e) => {
                      const newRot = parseInt(e.target.value, 10);
                      setPlacedStickers(
                        placedStickers.map((item) =>
                          item.id === selectedElement.id ? { ...item, rotation: newRot } : item
                        )
                      );
                    }}
                    className="w-full accent-[#5B1E2D]"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Phone Mockup Preview Column */}
        <div className="lg:col-span-7 flex justify-center">
          
          {/* Mobile Screen Frame 9:16 Aspect Ratio */}
          <div className="relative w-[340px] sm:w-[380px] h-[680px] sm:h-[720px] bg-[#2B2B2B] rounded-[48px] p-3 border-4 border-[#D4AF37]/50 shadow-2xl overflow-hidden flex flex-col justify-between select-none">
            
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2B2B2B] rounded-b-2xl z-30 flex items-center justify-center pointer-events-none">
              <div className="w-3 h-3 bg-white/20 rounded-full" />
            </div>

            {/* Story Content Canvas Area */}
            <div
              ref={canvasRef}
              className={`relative w-full h-full rounded-[38px] overflow-hidden flex flex-col justify-between p-4 ${
                customBgImage ? '' : backgroundPresets.find((p) => p.id === backgroundPreset)?.bgClass
              }`}
              style={
                customBgImage
                  ? { backgroundImage: `url(${customBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : {}
              }
            >
              
              {/* Instagram Story Top Header Overlay */}
              <div className="relative z-20 space-y-2 pt-2 pointer-events-none">
                {/* Progress bars */}
                <div className="grid grid-cols-3 gap-1">
                  <div className="h-0.5 bg-white rounded-full" />
                  <div className="h-0.5 bg-white/40 rounded-full" />
                  <div className="h-0.5 bg-white/40 rounded-full" />
                </div>

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] p-0.5 shadow">
                      <div className="w-full h-full bg-[#5B1E2D] rounded-full flex items-center justify-center text-[10px] font-bold text-[#D4AF37]">
                        TS
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold drop-shadow font-serif">@tamirissantana.harmonizacao</span>
                      <span className="text-[10px] text-white/80 block -mt-0.5">há 5 min</span>
                    </div>
                  </div>

                  <MoreHorizontal className="w-5 h-5 drop-shadow" />
                </div>
              </div>

              {/* Placed Interactive Stickers with Mouse Gestures */}
              <div className="absolute inset-0 z-10 overflow-hidden">
                {placedStickers.map((element) => {
                  const isSelected = element.id === selectedElementId;
                  const isGesturing = activeGesture?.elementId === element.id;

                  return (
                    <div
                      key={element.id}
                      onMouseDown={(e) => handleStartGesture(e, 'drag', element)}
                      onTouchStart={(e) => handleStartGesture(e, 'drag', element)}
                      className={`absolute group touch-none cursor-grab active:cursor-grabbing select-none transition-shadow ${
                        isSelected ? 'z-30' : 'z-10'
                      }`}
                      style={{
                        left: `${element.x}%`,
                        top: `${element.y}%`,
                        transform: `translate(-50%, -50%) scale(${element.scale}) rotate(${element.rotation}deg)`,
                      }}
                    >
                      {/* Bounding Box when Selected */}
                      <div
                        className={`relative p-3 rounded-2xl transition-all ${
                          isSelected
                            ? 'border-2 border-[#D4AF37] border-dashed bg-[#5B1E2D]/20 backdrop-blur-sm ring-4 ring-[#D4AF37]/30 shadow-2xl'
                            : 'hover:border hover:border-white/40'
                        }`}
                      >
                        {/* Live Floating Info Badge during Gestures */}
                        {isGesturing && (
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#5B1E2D] text-[#D4AF37] font-serif text-[10px] font-bold px-3 py-0.5 rounded-full border border-[#D4AF37] shadow-lg whitespace-nowrap z-50">
                            {Math.round(element.scale * 100)}% • {element.rotation}°
                          </div>
                        )}

                        {/* Top Rotate Handle */}
                        {isSelected && (
                          <button
                            type="button"
                            onMouseDown={(e) => handleStartGesture(e, 'rotate', element)}
                            onTouchStart={(e) => handleStartGesture(e, 'rotate', element)}
                            title="Arrastar para girar"
                            className="absolute -top-7 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#5B1E2D] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-grab active:cursor-grabbing border border-white z-40"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Top-Right Delete Handle */}
                        {isSelected && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveElement(element.id);
                            }}
                            title="Remover adesivo"
                            className="absolute -top-3 -right-3 w-6 h-6 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer border border-white z-40"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Bottom-Right Resize Handle */}
                        {isSelected && (
                          <button
                            type="button"
                            onMouseDown={(e) => handleStartGesture(e, 'resize', element)}
                            onTouchStart={(e) => handleStartGesture(e, 'resize', element)}
                            title="Arrastar para redimensionar"
                            className="absolute -bottom-3 -right-3 w-7 h-7 bg-[#5B1E2D] hover:bg-[#8B2D44] text-[#D4AF37] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-nwse-resize border border-[#D4AF37] z-40"
                          >
                            <Scaling className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Sticker Rendered Item */}
                        {element.sticker.category === 'sombras-story' || element.sticker.iconSymbol === 'Shadow' ? (
                          <div className="select-none pointer-events-none">
                            {element.sticker.title.toLowerCase().includes('inferior') || element.sticker.title.toLowerCase().includes('rodapé') ? (
                              <div className="w-72 h-36 bg-gradient-to-t from-black/95 via-black/60 to-transparent rounded-b-3xl flex items-end justify-center pb-2 text-[9px] text-white/40 uppercase tracking-widest font-mono">
                                Sombra Inferior Story
                              </div>
                            ) : element.sticker.title.toLowerCase().includes('superior') || element.sticker.title.toLowerCase().includes('vinheta') ? (
                              <div className="w-72 h-36 bg-gradient-to-b from-black/95 via-black/60 to-transparent rounded-t-3xl flex items-start justify-center pt-2 text-[9px] text-white/40 uppercase tracking-widest font-mono">
                                Sombra Superior Vinheta
                              </div>
                            ) : element.sticker.title.toLowerCase().includes('oval') || element.sticker.title.toLowerCase().includes('produto') ? (
                              <div className="w-52 h-20 bg-black/80 rounded-full blur-lg flex items-center justify-center text-[9px] text-white/40 font-mono">
                                Sombra Oval Drop
                              </div>
                            ) : (
                              <div className="w-60 h-60 bg-radial from-black/85 via-black/40 to-transparent rounded-full blur-xl flex items-center justify-center text-[9px] text-white/40 font-mono">
                                Spotlight Sombra
                              </div>
                            )}
                          </div>
                        ) : element.sticker.category === 'desenhos-formas' || element.sticker.style === 'Sem Borda' ? (
                          <div
                            className="px-3 py-1 text-center filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.7)] flex items-center justify-center gap-2 select-none pointer-events-none"
                            style={{ color: element.sticker.textColor || '#D4AF37' }}
                          >
                            {element.sticker.iconSymbol && (
                              <IconSymbol
                                name={element.sticker.iconSymbol}
                                className="w-6 h-6 shrink-0"
                                style={{ color: element.sticker.textColor || '#D4AF37' }}
                              />
                            )}
                            <span className="font-serif-title font-bold text-base sm:text-lg tracking-wide whitespace-nowrap">
                              {element.sticker.title}
                            </span>
                          </div>
                        ) : (
                          <div
                            className="px-4 py-2 rounded-2xl backdrop-blur-md text-center filter drop-shadow-2xl flex items-center justify-center gap-2 select-none pointer-events-none transition-all"
                            style={{
                              backgroundColor: `${element.sticker.primaryColor || '#5B1E2D'}DD`,
                              borderColor: `${element.sticker.textColor || '#D4AF37'}B0`,
                              color: element.sticker.textColor || '#F8F6F3',
                              borderWidth: '1px',
                            }}
                          >
                            {element.sticker.iconSymbol && (
                              <IconSymbol
                                name={element.sticker.iconSymbol}
                                className="w-5 h-5 shrink-0"
                                style={{ color: element.sticker.textColor || '#D4AF37' }}
                              />
                            )}
                            <span className="font-serif-title font-bold text-sm sm:text-base tracking-wide whitespace-nowrap">
                              {element.sticker.title}
                            </span>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instagram Story Bottom Footer Overlay */}
              <div className="relative z-20 flex items-center gap-3 pt-4 pointer-events-none">
                <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs text-white/90">
                  Enviar mensagem...
                </div>
                <Heart className="w-6 h-6 text-white drop-shadow" />
                <Send className="w-6 h-6 text-white drop-shadow" />
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};


