import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Orbit, Moon, Check, ChevronRight, ChevronLeft, X, Zap } from 'lucide-react';

interface Step {
  title: string;
  categoryBadge: string;
  description: string;
  icon: React.ReactNode;
  highlightText: string;
}

const TOUR_STEPS: Step[] = [
  {
    title: 'Acervo 100% Liberado',
    categoryBadge: 'Acesso Ilimitado',
    description: 'Aproveite todas as coleções de adesivos 4K, letterings de harmonização facial, fé e lifestyle sem nenhuma trava de plano básico ou premium.',
    icon: <Crown className="w-6 h-6 text-[#D4AF37]" />,
    highlightText: 'Todos os +300 adesivos disponíveis para download em PNG Alpha transparente.',
  },
  {
    title: 'Espirais, Círculos & Curvas (Sem Borda)',
    categoryBadge: 'Novo Formato',
    description: 'Explore os novos desenhos geométricos e traços caligráficos orgânicos em formatos de espirais, anéis e curvas fluidas, criados 100% sem borda.',
    icon: <Orbit className="w-6 h-6 text-[#D4AF37]" />,
    highlightText: 'Perfeitos para contornar rostos e destacar elementos na estética avançada.',
  },
  {
    title: 'Sombras para Stories & Reels',
    categoryBadge: 'Recurso Exclusivo',
    description: 'Adicione sombras degradê inferiores, vinhetas superiores e sombras ovoides no simulador para legibilidade máxima dos seus textos nos Stories.',
    icon: <Moon className="w-6 h-6 text-[#D4AF37]" />,
    highlightText: 'Garanta 100% de contraste e profissionalismo em fotos com fundos claros.',
  },
  {
    title: 'Criador com IA & Estúdio HD',
    categoryBadge: 'Personalização',
    description: 'Gere novos adesivos exclusivos em segundos digitando sua frase no Prompt Master IA ou edite cores, fontes e brilhos no Estúdio Caligráfico.',
    icon: <Sparkles className="w-6 h-6 text-[#D4AF37]" />,
    highlightText: 'Exportação imediata em alta definição 2048p 4K.',
  },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: 'library' | 'prompt-master' | 'stories-mockup') => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleAction = () => {
    if (currentStep === 1 && onNavigateTab) {
      onNavigateTab('library');
    } else if (currentStep === 2 && onNavigateTab) {
      onNavigateTab('stories-mockup');
    } else if (currentStep === 3 && onNavigateTab) {
      onNavigateTab('prompt-master');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2B2B]/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#F8F6F3] border border-[#D4AF37]/50 rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Decorator */}
        <div className="bg-gradient-to-r from-[#5B1E2D] via-[#7B283E] to-[#5B1E2D] p-6 text-[#F8F6F3] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-xl">
                {step.icon}
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#5B1E2D] font-body">
                  {step.categoryBadge}
                </span>
                <h3 className="text-xl font-serif-title font-bold text-[#F8F6F3] mt-0.5">
                  Tour Guiado • Tamiris Santana
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F8F6F3] border border-white/20 transition-all"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step Dots Indicator */}
          <div className="flex items-center gap-1.5 mt-4">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-8 bg-[#D4AF37]'
                    : idx < currentStep
                    ? 'w-2 bg-[#D4AF37]/60'
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-5 bg-white">
          <div className="space-y-2">
            <h4 className="text-lg font-serif-title font-bold text-[#5B1E2D]">
              {step.title}
            </h4>
            <p className="text-xs sm:text-sm text-[#2B2B2B] leading-relaxed font-light">
              {step.description}
            </p>
          </div>

          {/* Highlight Callout Box */}
          <div className="p-3.5 rounded-2xl bg-[#F8F6F3] border border-[#D4AF37]/30 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-[#5B1E2D] text-[#D4AF37] shrink-0 mt-0.5">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-[#5B1E2D] font-semibold leading-normal">
              {step.highlightText}
            </p>
          </div>

          {/* Step Actions Footer */}
          <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-3 py-2 text-xs font-semibold flex items-center gap-1 rounded-xl transition-all ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'text-[#6E6E6E] hover:text-[#5B1E2D] hover:bg-[#F8F6F3]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handleAction}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#5B1E2D] hover:bg-[#F8F6F3] border border-[#D4AF37]/30 transition-all"
                >
                  Ir para Funcionalidade
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-[#5B1E2D] hover:bg-[#8B2D44] text-[#D4AF37] font-serif font-bold text-xs flex items-center gap-1.5 transition-all shadow-md border border-[#D4AF37]/40"
              >
                <span>{isLast ? 'Concluir Tour' : 'Próximo'}</span>
                {isLast ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
