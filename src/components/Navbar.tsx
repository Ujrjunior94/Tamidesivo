import React, { useState } from 'react';
import { Sparkles, Download, Smartphone, Layers, Search, Bell, Heart, User, Image as ImageIcon, Sparkle, Moon, Share2, Check, Copy, ExternalLink, X, Globe, MessageCircle, Crown, Box } from 'lucide-react';
import { getPublicShareUrl } from '../utils/shareUtils';

interface NavbarProps {
  activeTab: 'library' | 'studio' | 'prompt-master' | 'pranchas' | 'stories-mockup' | 'favorites' | 'profile' | 'efeitos-story' | 'destaques-logo' | 'simulador-3d';
  setActiveTab: (tab: 'library' | 'studio' | 'prompt-master' | 'pranchas' | 'stories-mockup' | 'favorites' | 'profile' | 'efeitos-story' | 'destaques-logo' | 'simulador-3d') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalStickersCount: number;
  favoritesCount: number;
  onOpenAIPrompt: () => void;
  onDownloadAllZip: () => void;
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  totalStickersCount,
  favoritesCount,
  onOpenAIPrompt,
  onDownloadAllZip,
  onOpenTour,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const PUBLIC_SHARE_URL = getPublicShareUrl();
  const DEV_SHARE_URL = typeof window !== 'undefined' ? window.location.href : PUBLIC_SHARE_URL;

  const handleCopyUrl = async (urlToCopy: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = urlToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Fallback copy error:', err);
      const textArea = document.createElement('textarea');
      textArea.value = urlToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShareApp = () => {
    handleCopyUrl(PUBLIC_SHARE_URL);
    setShowShareModal(true);
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tamiris Santana - Galeria e Estúdio de Adesivos Stories 4K',
          text: 'Acesse a coleção exclusiva de adesivos e estúdio de Stories 4K para harmonização facial e estética de luxo.',
          url: PUBLIC_SHARE_URL,
        });
      } catch (e) {
        console.log('Share canceled or not supported');
      }
    } else {
      handleCopyUrl(PUBLIC_SHARE_URL);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#5B1E2D] border-b border-[#D4AF37]/30 text-white shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Profile Avatar */}
          <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => setActiveTab('library')}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] p-0.5 shadow-md shadow-black/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#5B1E2D] rounded-full flex items-center justify-center font-serif text-lg font-bold text-[#D4AF37]">
                  TS
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#5B1E2D] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-title font-bold text-lg sm:text-xl tracking-wide text-[#F8F6F3] group-hover:text-[#D4AF37] transition-colors">
                  Tamiris Santana
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 rounded-full">
                  VIP LUXO
                </span>
              </div>
              <p className="text-[11px] font-light tracking-wider text-[#D4AF37]/90 hidden sm:block">
                Harmonização Facial • Adesivos Stories 4K
              </p>
            </div>
          </div>

          {/* Search Input (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por preenchimento, fé, frases, estética..."
              className="w-full bg-[#4A1824] border border-[#D4AF37]/30 rounded-full pl-10 pr-10 py-2 text-xs text-[#F8F6F3] placeholder-[#EFE8DF]/50 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#D4AF37] hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Share App Button */}
            <button
              onClick={handleShareApp}
              className="px-3 py-1.5 rounded-full bg-[#4A1824] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#5B1E2D] transition-all text-xs font-serif font-bold flex items-center gap-1.5 shadow-sm"
              title="Copiar Link para Compartilhar"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline text-emerald-300">Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden sm:inline">Compartilhar</span>
                </>
              )}
            </button>

            {/* Tour Guiado Button */}
            {onOpenTour && (
              <button
                onClick={onOpenTour}
                className="px-3 py-1.5 rounded-full bg-[#4A1824] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#5B1E2D] transition-all text-xs font-serif font-bold flex items-center gap-1.5 shadow-sm"
                title="Tour de Novidades & Recursos"
              >
                <Sparkle className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Tour Guiado</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full bg-[#4A1824] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all relative"
                title="Notificações"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#D4AF37] rounded-full animate-ping" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#D4AF37] rounded-full" />
              </button>

              {/* Notification Popup */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-[#5B1E2D] border border-[#D4AF37]/40 rounded-2xl shadow-2xl p-4 text-xs text-[#F8F6F3] z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2 mb-2">
                    <span className="font-serif font-bold text-[#D4AF37]">Novidades Tamiris Santana</span>
                    <button onClick={() => setShowNotifications(false)} className="text-[10px] text-[#EFE8DF]/60 hover:text-white">Fechar</button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-[#4A1824] rounded-xl border border-[#D4AF37]/15">
                      <p className="font-semibold text-[#D4AF37]">✨ Nova Coleção Lançada!</p>
                      <p className="text-[10px] text-[#EFE8DF]/80">50 novos letterings de Estética Facial e Harmonização em Dourado Champagne.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Tab Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#D4AF37] text-[#5B1E2D] border-white font-bold shadow-lg'
                  : 'bg-[#4A1824] text-[#D4AF37] border-[#D4AF37]/30 hover:bg-[#D4AF37]/20'
              }`}
              title="Meu Perfil"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Download Master ZIP Button */}
            <button
              onClick={onDownloadAllZip}
              className="px-3.5 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#5B1E2D] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-black/20 border border-[#D4AF37]/50"
              title="Baixar Pacote Completo PNG 4K"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline font-serif">Baixar 4K</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-t border-[#D4AF37]/20 py-2.5 overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
                activeTab === 'library'
                  ? 'bg-[#D4AF37] text-[#5B1E2D] border-[#D4AF37] font-bold shadow-md'
                  : 'bg-[#4A1824]/50 text-[#F8F6F3]/80 border-[#D4AF37]/20 hover:bg-[#4A1824] hover:text-[#D4AF37]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Início</span>
            </button>

            <button
              onClick={() => setActiveTab('prompt-master')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border ${
                activeTab === 'prompt-master'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#5B1E2D] border-[#D4AF37] shadow-md'
                  : 'bg-[#4A1824]/50 text-[#D4AF37] border-[#D4AF37]/30 hover:bg-[#4A1824]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Prompt Master IA</span>
            </button>

            <button
              onClick={() => setActiveTab('pranchas')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
                activeTab === 'pranchas'
                  ? 'bg-[#D4AF37] text-[#5B1E2D] border-[#D4AF37] font-bold'
                  : 'bg-[#4A1824]/50 text-[#F8F6F3]/80 border-[#D4AF37]/20 hover:bg-[#4A1824] hover:text-[#D4AF37]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pranchas</span>
            </button>

            <button
              onClick={() => setActiveTab('efeitos-story')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border ${
                activeTab === 'efeitos-story'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#5B1E2D] border-[#D4AF37] shadow-md'
                  : 'bg-[#4A1824]/50 text-[#D4AF37] border-[#D4AF37]/30 hover:bg-[#4A1824]'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Efeitos Story</span>
            </button>

            <button
              onClick={() => setActiveTab('stories-mockup')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
                activeTab === 'stories-mockup'
                  ? 'bg-[#D4AF37] text-[#5B1E2D] border-[#D4AF37] font-bold'
                  : 'bg-[#4A1824]/50 text-[#F8F6F3]/80 border-[#D4AF37]/20 hover:bg-[#4A1824] hover:text-[#D4AF37]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulador Story</span>
            </button>

            <button
              onClick={() => setActiveTab('destaques-logo')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border ${
                activeTab === 'destaques-logo'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#5B1E2D] border-[#D4AF37] shadow-md'
                  : 'bg-[#4A1824]/50 text-[#D4AF37] border-[#D4AF37]/30 hover:bg-[#4A1824]'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Destaques & Logo</span>
            </button>

            <button
              onClick={() => setActiveTab('simulador-3d')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border ${
                activeTab === 'simulador-3d'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#5B1E2D] border-[#D4AF37] shadow-md'
                  : 'bg-[#4A1824]/50 text-[#D4AF37] border-[#D4AF37]/30 hover:bg-[#4A1824]'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Simulador 3D (Three.js)</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
                activeTab === 'favorites'
                  ? 'bg-[#D4AF37] text-[#5B1E2D] border-[#D4AF37] font-bold'
                  : 'bg-[#4A1824]/50 text-[#F8F6F3]/80 border-[#D4AF37]/20 hover:bg-[#4A1824] hover:text-[#D4AF37]'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-300" />
              <span>Favoritos ({favoritesCount})</span>
            </button>
          </div>

          <div className="text-[11px] font-serif text-[#D4AF37] hidden lg:block italic">
            Tamiris Santana • Harmonização & Estética
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar adesivos e frases..."
              className="w-full bg-[#4A1824] border border-[#D4AF37]/30 rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#EFE8DF]/50 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

      </div>

      {/* Share App & Platform Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] text-[#2B2B2B] rounded-3xl border border-[#D4AF37]/40 max-w-md w-full p-6 shadow-2xl relative space-y-5 animate-fadeIn">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#5B1E2D] hover:bg-[#5B1E2D]/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#D4AF37]/20 pb-3">
              <div className="w-10 h-10 rounded-full bg-[#5B1E2D] text-[#D4AF37] flex items-center justify-center font-bold shadow-md shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-title font-bold text-base text-[#5B1E2D]">
                  Compartilhar Plataforma
                </h3>
                <p className="text-xs text-[#6E6E6E] font-light">
                  Tamiris Santana • Galeria & Estúdio Stories 4K
                </p>
              </div>
            </div>

            {/* Public Link Card */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#5B1E2D] flex items-center justify-between">
                <span>Link Público Direto (Modo Apresentação):</span>
                {copiedLink && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Link Copiado!
                  </span>
                )}
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={PUBLIC_SHARE_URL}
                  className="flex-1 bg-white border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-xs font-mono text-[#2B2B2B] select-all focus:outline-none shadow-xs"
                />
                <button
                  onClick={() => handleCopyUrl(PUBLIC_SHARE_URL)}
                  className="px-4 py-2 bg-[#5B1E2D] hover:bg-[#3D141E] text-[#D4AF37] rounded-xl text-xs font-serif font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0 border border-[#D4AF37]/40"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Action Share Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Confira a coleção exclusiva de adesivos Stories 4K e o Estúdio de Design de Tamiris Santana: ${PUBLIC_SHARE_URL}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={handleWebShare}
                className="py-2.5 px-3 rounded-xl bg-[#5B1E2D] hover:bg-[#3D141E] text-[#D4AF37] font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all border border-[#D4AF37]/40"
              >
                <Globe className="w-4 h-4" />
                <span>Enviar Via...</span>
              </button>
            </div>

            {/* External Open Button */}
            <div className="pt-2 border-t border-[#D4AF37]/20 flex justify-between items-center text-xs text-[#6E6E6E]">
              <span className="text-[11px]">Abrir em nova aba:</span>
              <a
                href={PUBLIC_SHARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5B1E2D] font-bold hover:underline flex items-center gap-1"
              >
                <span>Acessar Link Direto</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

