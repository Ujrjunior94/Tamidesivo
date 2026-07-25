import React, { useState } from 'react';
import { CategoryId, VisualStyle, AIStickerPromptResult, StickerItem } from '../types';
import { CATEGORIES, ALL_STYLES } from '../data/stickersData';
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  Download,
  Edit3,
  RefreshCw,
  Layers,
  Palette,
  Type,
  ImageIcon,
  AlertCircle
} from 'lucide-react';

interface PromptMasterGeneratorProps {
  onAddGeneratedSticker: (sticker: StickerItem) => void;
  onEditSticker: (sticker: StickerItem) => void;
}

export const PromptMasterGenerator: React.FC<PromptMasterGeneratorProps> = ({
  onAddGeneratedSticker,
  onEditSticker,
}) => {
  const [phrase, setPhrase] = useState('Harmonização & Elegância');
  const [category, setCategory] = useState<CategoryId>('estetica-facial');
  const [style, setStyle] = useState<VisualStyle>('Traços Finos');
  const [elements, setElements] = useState('Caligrafia moderna em Dourado Champagne, traço ultra-fino de 1px');
  
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [promptResult, setPromptResult] = useState<AIStickerPromptResult | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [generatingPack, setGeneratingPack] = useState(false);

  // Generate Prompt Master via Gemini
  const handleGeneratePromptMaster = async () => {
    setLoadingPrompt(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/sticker-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase, category, style, elements, language: 'Português' }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPromptResult(data.data);
      } else {
        throw new Error(data.error || 'Falha ao gerar o prompt.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro de conexão com o Gemini AI.');
    } finally {
      setLoadingPrompt(false);
    }
  };

  // Generate AI Image Sticker via Gemini
  const handleGenerateAIImage = async () => {
    if (!promptResult?.englishPrompt && !phrase) return;
    setGeneratingImage(true);
    setErrorMsg(null);
    setIsSavedNotice(false);
    try {
      const activePrompt = promptResult?.englishPrompt || `A luxury hand-lettered graphic sticker of "${phrase}" in modern calligraphy, delicate 1px fine line strokes, die-cut white contour border`;
      const res = await fetch('/api/ai/generate-sticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: activePrompt, aspectRatio: '1:1' }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);

        // Add sticker item to user session
        const newSticker: StickerItem = {
          id: `ai-gen-${Date.now()}`,
          title: phrase || 'Adesivo IA Tamiris',
          category: category,
          style: style,
          tags: ['gerado-por-ia', category, style.toLowerCase()],
          primaryColor: promptResult?.colorPalette?.[0] || '#D4AF37',
          textColor: '#FFFFFF',
          fontFamily: promptResult?.recommendedFont || 'Script Elegante',
          badge: 'IA TAMIRIS',
          previewUrl: data.imageUrl,
          isCustomGenerated: true,
        };
        onAddGeneratedSticker(newSticker);
        setIsSavedNotice(true);
      } else {
        throw new Error(data.error || 'Não foi possível gerar a imagem.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao gerar adesivo IA com Gemini.');
    } finally {
      setGeneratingImage(false);
    }
  };

  // Generate Batch Pack of 6 AI Stickers
  const handleGenerateAIPack = async () => {
    setGeneratingPack(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/suggest-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, style }),
      });
      const data = await res.json();
      if (data.success && data.data?.pack) {
        for (let i = 0; i < data.data.pack.length; i++) {
          const item = data.data.pack[i];
          const newSticker: StickerItem = {
            id: `ai-pack-${Date.now()}-${i}`,
            title: item.title || item.phrase || `Adesivo IA ${i + 1}`,
            category: category,
            style: style,
            tags: ['pacote-ia', category, style.toLowerCase()],
            primaryColor: item.primaryColor || '#D4AF37',
            textColor: '#FFFFFF',
            fontFamily: item.fontFamily || 'Script Elegante',
            badge: 'PACOTE IA',
            isCustomGenerated: true,
          };
          onAddGeneratedSticker(newSticker);
        }
        setIsSavedNotice(true);
      } else {
        throw new Error(data.error || 'Falha ao sugerir pacote IA.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao gerar pacote de adesivos IA.');
    } finally {
      setGeneratingPack(false);
    }
  };

  const handleCopyPrompt = () => {
    if (!promptResult?.englishPrompt) return;
    navigator.clipboard.writeText(promptResult.englishPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5B1E2D] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-serif font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Inteligência Artificial Tamiris Santana</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#2B2B2B] tracking-tight">
          Prompt Master <span className="italic font-light text-[#5B1E2D]">– Caligrafia & Lettering IA</span>
        </h1>
        <p className="text-[#6E6E6E] text-xs sm:text-sm leading-relaxed font-light">
          Crie adesivos caligráficos exclusivos em Dourado Champagne e Traços Finos de 1px em alta fidelidade PNG transparente para Instagram Stories, Reels e Canva.
        </p>
      </div>

      {/* Main Generator Card */}
      <div className="bg-[#FFFFFF] border border-[#D4AF37]/35 rounded-[32px] p-6 sm:p-8 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Configuration Column */}
        <div className="space-y-5">
          <h2 className="text-lg font-serif-title font-bold text-[#5B1E2D] flex items-center gap-2 border-b border-[#D4AF37]/20 pb-3">
            <Wand2 className="w-5 h-5 text-[#D4AF37]" /> Configurar Frase ou Conceito
          </h2>

          <div>
            <label className="text-xs font-semibold text-[#2B2B2B] block mb-1.5">
              Frase ou Palavra Caligráfica em Português
            </label>
            <input
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="Ex: Harmonização Facial, Abençoada, Amor Próprio, Foco..."
              className="w-full bg-[#F8F6F3] border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-sm text-[#2B2B2B] placeholder-[#6E6E6E]/50 focus:outline-none focus:border-[#5B1E2D] focus:ring-1 focus:ring-[#5B1E2D] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#2B2B2B] block mb-1.5">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full bg-[#F8F6F3] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#2B2B2B] focus:outline-none focus:border-[#5B1E2D]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white text-[#2B2B2B]">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2B2B] block mb-1.5">Estilo Visual</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as VisualStyle)}
                className="w-full bg-[#F8F6F3] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#2B2B2B] focus:outline-none focus:border-[#5B1E2D]"
              >
                {ALL_STYLES.map((st) => (
                  <option key={st} value={st} className="bg-white text-[#2B2B2B]">
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#2B2B2B] block mb-1.5">
              Elementos & Acabamento Desejado
            </label>
            <input
              type="text"
              value={elements}
              onChange={(e) => setElements(e.target.value)}
              placeholder="Ex: Foil Dourado, floreios delicados, traço fino monoline..."
              className="w-full bg-[#F8F6F3] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 text-xs text-[#2B2B2B] placeholder-[#6E6E6E]/50 focus:outline-none focus:border-[#5B1E2D]"
            />
          </div>

          {/* Quick Presets by Category */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B1E2D] block">
              ✨ Presets Rápidos por Categoria (Caligrafia VIP):
            </span>
            
            <div className="space-y-1.5">
              {/* Estética */}
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-[10px] text-[#5B1E2D] font-bold w-14 shrink-0">Estética:</span>
                {['Harmonização', 'Glow', 'Skincare', 'Preenchimento', 'Beleza Natural', 'Botox', 'Pele Perfeita'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      setPhrase(w);
                      setStyle('Traços Finos');
                      setCategory('estetica-facial');
                      setElements('Luxury calligraphic script, Dourado Champagne foil, 1px fine line');
                    }}
                    className="text-[10px] bg-[#5B1E2D]/10 hover:bg-[#5B1E2D]/20 text-[#5B1E2D] px-2.5 py-0.5 rounded-md border border-[#5B1E2D]/20 font-medium transition-all"
                  >
                    {w}
                  </button>
                ))}
              </div>

              {/* Fé */}
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-[10px] text-[#D4AF37] font-bold w-14 shrink-0">Fé:</span>
                {['Fé', 'Gratidão', 'Deus é fiel', 'Amém', 'Abençoada', 'Confie', 'Propósito'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      setPhrase(w);
                      setStyle('Traços Finos');
                      setCategory('deus-e-fe');
                      setElements('Sacred thin script, cruz delicada monoline');
                    }}
                    className="text-[10px] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#5B1E2D] px-2.5 py-0.5 rounded-md border border-[#D4AF37]/30 font-medium transition-all"
                  >
                    {w}
                  </button>
                ))}
              </div>

              {/* Família */}
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-[10px] text-rose-800 font-bold w-14 shrink-0">Família:</span>
                {['Família', 'Nosso Lar', 'Amor', 'Juntos', 'União', 'Lar Doce Lar'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      setPhrase(w);
                      setStyle('Traços Finos');
                      setCategory('familia');
                      setElements('Handwritten signature, coração continuo, toque de amor');
                    }}
                    className="text-[10px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-900 px-2.5 py-0.5 rounded-md border border-rose-500/20 font-medium transition-all"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Generate Prompt Button */}
          <button
            onClick={handleGeneratePromptMaster}
            disabled={loadingPrompt}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#5B1E2D] hover:bg-[#8B2D44] text-[#D4AF37] font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 border border-[#D4AF37]/40"
          >
            {loadingPrompt ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                <span>O Gemini está gerando a caligrafia master...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Gerar Prompt de Caligrafia IA</span>
              </>
            )}
          </button>
        </div>

        {/* Output Results Column */}
        <div className="space-y-5 bg-[#F8F6F3] border border-[#D4AF37]/30 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 mb-4">
              <h3 className="text-xs font-serif-title font-bold text-[#5B1E2D] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4AF37]" /> Prompt Master Estruturado
              </h3>
              {promptResult && (
                <button
                  onClick={handleCopyPrompt}
                  className="text-xs text-[#5B1E2D] hover:text-[#8B2D44] font-bold flex items-center gap-1"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  <span>{copiedPrompt ? 'Copiado!' : 'Copiar Prompt'}</span>
                </button>
              )}
            </div>

            {promptResult ? (
              <div className="space-y-4">
                {/* English Prompt Box */}
                <div>
                  <span className="text-[10px] font-bold text-[#6E6E6E] uppercase tracking-widest block mb-1">
                    Prompt em Inglês (Para IA Geradora):
                  </span>
                  <div className="bg-white border border-[#D4AF37]/30 rounded-xl p-3 text-xs text-[#5B1E2D] font-mono leading-relaxed select-all shadow-inner">
                    {promptResult.englishPrompt}
                  </div>
                </div>

                {/* PT Summary */}
                <div>
                  <span className="text-[10px] font-bold text-[#6E6E6E] uppercase tracking-widest block mb-1">
                    Conceito Estético:
                  </span>
                  <p className="text-xs text-[#2B2B2B] leading-relaxed">
                    {promptResult.ptPromptSummary}
                  </p>
                </div>

                {/* Color Palette & Font */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#6E6E6E] uppercase tracking-widest block mb-1">Cores Harmoniosas:</span>
                    <div className="flex items-center gap-1.5">
                      {promptResult.colorPalette?.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-md border border-[#D4AF37]/40 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#6E6E6E] uppercase tracking-widest block mb-1">Estilo de Fonte:</span>
                    <span className="text-xs bg-[#5B1E2D] text-[#D4AF37] px-2.5 py-1 rounded-md font-serif font-bold border border-[#D4AF37]/30">
                      {promptResult.recommendedFont}
                    </span>
                  </div>
                </div>

                {/* Phrases */}
                {promptResult.suggestedPhrases?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-[#6E6E6E] uppercase tracking-widest block mb-1">Frases Sugeridas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {promptResult.suggestedPhrases.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPhrase(p)}
                          className="text-[11px] bg-white hover:bg-[#EFE8DF] text-[#5B1E2D] px-2.5 py-1 rounded-lg border border-[#D4AF37]/30 font-medium transition-all"
                        >
                          "{p}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-[#6E6E6E] space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-[#D4AF37]" />
                <p className="text-xs font-light">Preencha sua frase e clique no botão para estruturar o prompt exclusivo Tamiris Santana.</p>
              </div>
            )}
          </div>

          {/* AI Image Generation Buttons */}
          <div className="pt-4 border-t border-[#D4AF37]/20 space-y-2">
            <button
              onClick={handleGenerateAIImage}
              disabled={generatingImage || (!promptResult && !phrase)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#5B1E2D] font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 border border-[#D4AF37]"
            >
              {generatingImage ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#5B1E2D]" />
                  <span>Gerando Imagem do Adesivo em 4K...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 text-[#5B1E2D]" />
                  <span>Gerar Imagem de Adesivo com Gemini IA</span>
                </>
              )}
            </button>

            <button
              onClick={handleGenerateAIPack}
              disabled={generatingPack}
              className="w-full py-2.5 px-4 rounded-xl bg-[#5B1E2D] hover:bg-[#8B2D44] text-[#D4AF37] font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 border border-[#D4AF37]/30"
            >
              {generatingPack ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>Gerando Pacote de 6 Adesivos IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Gerar Pacote de 6 Adesivos IA nesta Categoria</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Saved Notice */}
      {isSavedNotice && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-900 font-serif font-bold flex items-center justify-between gap-3 animate-fadeIn max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Adesivo(s) gerado(s) e salvo(s) na sua Galeria e em Nuvem Firestore com sucesso!</span>
          </div>
        </div>
      )}

      {/* Generated Image Preview Card */}
      {generatedImageUrl && (
        <div className="bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-[32px] p-6 text-center space-y-4 max-w-md mx-auto shadow-xl">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#5B1E2D] flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Adesivo Gerado pela IA
            </span>
            <span className="text-xs font-bold text-[#D4AF37]">4K Alpha PNG</span>
          </div>

          <div className="aspect-square w-full rounded-2xl bg-[#F8F6F3] p-4 border border-[#D4AF37]/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#5B1E2D 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            <img src={generatedImageUrl} alt="Sticker IA" className="w-full h-full object-contain filter drop-shadow-md relative z-10" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <a
              href={generatedImageUrl}
              download={`tamiris-santana-sticker-ia-${phrase.toLowerCase().replace(/\s+/g, '-')}.png`}
              className="py-2.5 bg-[#5B1E2D] hover:bg-[#8B2D44] text-[#D4AF37] font-serif font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md border border-[#D4AF37]/50"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PNG</span>
            </a>

            <button
              onClick={() => {
                const newSticker: StickerItem = {
                  id: `ai-gen-studio-${Date.now()}`,
                  title: phrase || 'Adesivo IA Tamiris',
                  category: category,
                  style: style,
                  tags: ['gerado-por-ia'],
                  primaryColor: '#D4AF37',
                  textColor: '#FFFFFF',
                  fontFamily: 'Script Elegante',
                  badge: 'IA TAMIRIS',
                  previewUrl: generatedImageUrl,
                };
                onEditSticker(newSticker);
              }}
              className="py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#5B1E2D] font-serif font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md border border-[#D4AF37]"
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar no Estúdio</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

