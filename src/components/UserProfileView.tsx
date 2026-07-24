import React from 'react';
import { Crown, CheckCircle2, Download, Sparkles, Layers, ShieldCheck, Heart, Zap, Star } from 'lucide-react';

interface UserProfileViewProps {
  totalStickersCount: number;
  favoritesCount: number;
  onGoToLibrary: () => void;
  onGoToAIPrompt: () => void;
  onDownloadAllZip: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  totalStickersCount,
  favoritesCount,
  onGoToLibrary,
  onGoToAIPrompt,
  onDownloadAllZip,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#5B1E2D] via-[#7B283E] to-[#5B1E2D] border border-[#D4AF37]/50 p-8 shadow-2xl text-[#F8F6F3]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] p-1 shadow-xl">
                <div className="w-full h-full bg-[#5B1E2D] rounded-full flex items-center justify-center font-serif-title text-3xl font-bold text-[#D4AF37]">
                  TS
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-[#D4AF37] text-[#5B1E2D] p-1.5 rounded-full shadow-md">
                <Crown className="w-4 h-4 fill-current" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#F8F6F3]">
                  Tamiris Santana
                </h1>
                <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-[#D4AF37] text-[#5B1E2D] rounded-full shadow-sm font-body">
                  ACERVO 100% LIBERADO
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#EFE8DF] font-light">
                Plano VIP Vitalício • Sem Nenhuma Limitação ou Bloqueio de Conteúdo
              </p>
            </div>
          </div>

          <button
            onClick={onDownloadAllZip}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#5B1E2D] font-serif font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg hover:scale-105 border border-[#D4AF37]"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Todo o Acervo (ZIP 4K)</span>
          </button>
        </div>
      </div>

      {/* Unlocked Access Status Banner */}
      <div className="bg-[#FFFFFF] border border-[#D4AF37]/30 rounded-[28px] p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
          <div>
            <h2 className="text-xl font-serif-title font-bold text-[#5B1E2D] flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37]" /> Status da Sua Conta: Acesso Total Ilimitado
            </h2>
            <p className="text-xs text-[#6E6E6E] font-light mt-0.5">
              Todos os recursos, downloads em alta resolução e coleções especiais estão totalmente desbloqueados.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Sem Limites Básico / Premium</span>
          </div>
        </div>

        {/* Unlocked Capabilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#F8F6F3] border border-[#D4AF37]/25 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#5B1E2D] text-[#D4AF37] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title font-bold text-sm text-[#2B2B2B]">+300 Adesivos 4K Liberados</h3>
            <p className="text-xs text-[#6E6E6E] font-light leading-relaxed">
              Acesso irrestrito a todos os adesivos e letterings de Harmonização Facial, Fé, Lifestyle e Instagram.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F6F3] border border-[#D4AF37]/25 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#5B1E2D] text-[#D4AF37] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title font-bold text-sm text-[#2B2B2B]">Prompt Master IA Ilimitado</h3>
            <p className="text-xs text-[#6E6E6E] font-light leading-relaxed">
              Crie quantos adesivos personalizados quiser via Inteligência Artificial Gemini sem restrições de créditos.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F6F3] border border-[#D4AF37]/25 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#5B1E2D] text-[#D4AF37] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title font-bold text-sm text-[#2B2B2B]">Pranchas & Pacotes ZIP</h3>
            <p className="text-xs text-[#6E6E6E] font-light leading-relaxed">
              Download em 1 clique de todas as pranchas organizadas em arquivos ZIP em resolução 4K PNG.
            </p>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="pt-4 flex flex-wrap gap-3 border-t border-[#D4AF37]/20">
          <button
            onClick={onGoToLibrary}
            className="px-5 py-2.5 rounded-xl bg-[#5B1E2D] text-[#D4AF37] font-serif font-bold text-xs hover:bg-[#8B2D44] transition-all border border-[#D4AF37]/40 shadow-sm"
          >
            Navegar no Acervo Completo ({totalStickersCount} itens)
          </button>
          
          <button
            onClick={onGoToAIPrompt}
            className="px-5 py-2.5 rounded-xl bg-[#F8F6F3] text-[#5B1E2D] font-serif font-bold text-xs hover:bg-[#EFE8DF] transition-all border border-[#D4AF37]/30"
          >
            Abrir Gerador de Adesivo IA
          </button>
        </div>
      </div>

    </div>
  );
};
