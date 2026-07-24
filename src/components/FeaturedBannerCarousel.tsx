import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Crown, Award } from 'lucide-react';

interface FeaturedBannerCarouselProps {
  onOpenAIPrompt: () => void;
  onSelectCategory: (cat: string) => void;
}

const BANNERS = [
  {
    id: 'estetica-luxo',
    tag: 'NOVIDADE EXCLUSIVA VIP',
    title: 'Harmonização Facial & Estética de Luxo',
    subtitle: 'Mais de 100 adesivos em Caligrafia e Hand Lettering em Dourado Champagne',
    buttonText: 'Explorar Coleção Estética',
    category: 'estetica-facial',
    accentColor: 'from-[#5B1E2D] via-[#7B283E] to-[#5B1E2D]',
    goldTag: 'Coleção Tamiris Santana',
  },
  {
    id: 'prompt-ia',
    tag: 'TECNOLOGIA E CONTEÚDO',
    title: 'Prompt Master IA — Caligrafia Sob Medida',
    subtitle: 'Gere adesivos 4K instantâneos com a frase que quiser em traços ultra-finos de 1px',
    buttonText: 'Criar Meu Adesivo IA',
    category: 'prompt-master',
    accentColor: 'from-[#2B2B2B] via-[#4A1824] to-[#5B1E2D]',
    goldTag: 'Gerador IA 4K',
  },
  {
    id: 'fe-gratidao',
    tag: 'EM ALTA NOS STORIES',
    title: 'Kits de Fé, Gratidão & Versículos Sacros',
    subtitle: 'Design minimalista e elegante para fortalecer sua mensagem nos Stories diariamente',
    buttonText: 'Ver Coleção Fé',
    category: 'deus-e-fe',
    accentColor: 'from-[#5B1E2D] via-[#5B1E2D] to-[#8B2D44]',
    goldTag: 'Mais Baixados',
  },
];

export const FeaturedBannerCarousel: React.FC<FeaturedBannerCarouselProps> = ({
  onOpenAIPrompt,
  onSelectCategory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[currentIndex];

  const handleBannerAction = () => {
    if (banner.category === 'prompt-master') {
      onOpenAIPrompt();
    } else {
      onSelectCategory(banner.category);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[#D4AF37]/40 shadow-xl transition-all duration-500 bg-[#5B1E2D]">
      
      {/* Background Gradient & Pattern */}
      <div className={`absolute inset-0 bg-gradient-to-r ${banner.accentColor} transition-all duration-700 opacity-95`} />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative Gold Glow Orbs */}
      <div className="absolute top-[-40%] right-[-10%] w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Banner Content */}
      <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-[#D4AF37] text-[#5B1E2D] shadow-sm uppercase font-body">
              {banner.tag}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30 backdrop-blur-md">
              {banner.goldTag}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif-title font-bold text-[#F8F6F3] leading-tight tracking-wide">
            {banner.title}
          </h1>

          <p className="text-xs sm:text-sm text-[#EFE8DF] font-light leading-relaxed max-w-xl">
            {banner.subtitle}
          </p>

          <div className="pt-2">
            <button
              onClick={handleBannerAction}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#5B1E2D] font-serif font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-black/20 hover:scale-105 active:scale-95 border border-[#D4AF37]"
            >
              <span>{banner.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex md:flex-col gap-2 shrink-0 self-center">
          {BANNERS.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-8 h-2.5 bg-[#D4AF37]'
                  : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
