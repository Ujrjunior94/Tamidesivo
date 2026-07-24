import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { StickerGrid } from './components/StickerGrid';
import { StickerStudio } from './components/StickerStudio';
import { PromptMasterGenerator } from './components/PromptMasterGenerator';
import { StoriesSimulator } from './components/StoriesSimulator';
import { PranchasSheetView } from './components/PranchasSheetView';
import { UserProfileView } from './components/UserProfileView';
import { OnboardingTour } from './components/OnboardingTour';
import { StoryEffectsCatalog } from './components/StoryEffectsCatalog';
import { STICKERS_DATA } from './data/stickersData';
import { CategoryId, VisualStyle, StickerItem } from './types';
import { renderStickerToCanvas } from './utils/stickerRenderer';
import JSZip from 'jszip';
import { Sparkles, Crown, Heart, CloudCheck } from 'lucide-react';
import { ensureAuth } from './lib/firebase';
import {
  subscribeToCustomStickers,
  saveCustomStickerToCloud,
  subscribeToFavorites,
  syncFavoritesToCloud,
} from './lib/firestoreService';
import { User } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<'library' | 'studio' | 'prompt-master' | 'pranchas' | 'stories-mockup' | 'favorites' | 'profile' | 'efeitos-story'>('library');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all' | 'favorites'>('all');
  const [selectedStyle, setSelectedStyle] = useState<VisualStyle | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoritesList, setFavoritesList] = useState<string[]>([]);

  const [allStickers, setAllStickers] = useState<StickerItem[]>(STICKERS_DATA);
  const [editingSticker, setEditingSticker] = useState<StickerItem | null>(null);
  const [storySticker, setStorySticker] = useState<StickerItem | null>(null);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Initialize Firebase Auth and real-time Firestore listeners
  useEffect(() => {
    let unsubscribeFavs: () => void = () => {};

    ensureAuth((user) => {
      setCurrentUser(user);
      setIsCloudSynced(true);

      unsubscribeFavs = subscribeToFavorites(user.uid, (cloudFavs) => {
        setFavoritesList(cloudFavs);
      });
    }).catch((err) => {
      console.error('Firebase Auth Error:', err);
    });

    const unsubscribeStickers = subscribeToCustomStickers((cloudStickers) => {
      if (cloudStickers.length > 0) {
        setAllStickers((prev) => {
          const existingIds = new Set(cloudStickers.map((s) => s.id));
          const localOnly = STICKERS_DATA.filter((s) => !existingIds.has(s.id));
          return [...cloudStickers, ...localOnly];
        });
      }
    });

    return () => {
      unsubscribeFavs();
      unsubscribeStickers();
    };
  }, []);

  const handleToggleFavorite = (id: string) => {
    const updatedFavs = favoritesList.includes(id)
      ? favoritesList.filter((item) => item !== id)
      : [...favoritesList, id];

    setFavoritesList(updatedFavs);

    if (currentUser) {
      syncFavoritesToCloud(currentUser.uid, updatedFavs);
    }
  };

  // Filter stickers based on category, favorites, visual style, and search query
  const filteredStickers = useMemo(() => {
    return allStickers.filter((sticker) => {
      let matchesCategory = true;
      if (selectedCategory === 'favorites') {
        matchesCategory = favoritesList.includes(sticker.id);
      } else if (selectedCategory !== 'all') {
        matchesCategory = sticker.category === selectedCategory;
      }

      const matchesStyle = selectedStyle === 'all' || sticker.style === selectedStyle;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        sticker.title.toLowerCase().includes(query) ||
        sticker.category.toLowerCase().includes(query) ||
        sticker.style.toLowerCase().includes(query) ||
        (sticker.tags && sticker.tags.some((t) => t.toLowerCase().includes(query)));

      return matchesCategory && matchesStyle && matchesSearch;
    });
  }, [allStickers, selectedCategory, favoritesList, selectedStyle, searchQuery]);

  const handleAddGeneratedSticker = (newSticker: StickerItem) => {
    setAllStickers((prev) => [newSticker, ...prev]);
    saveCustomStickerToCloud(newSticker, currentUser?.uid);
  };

  const handleEditSticker = (sticker: StickerItem) => {
    setEditingSticker(sticker);
  };

  const handleTestInStory = (sticker: StickerItem) => {
    setStorySticker(sticker);
    setActiveTab('stories-mockup');
  };

  const handleDownloadMasterZip = async () => {
    try {
      const zip = new JSZip();
      const folder = zip.folder('Tamiris-Santana-Adesivos-4K-Alpha') || zip;

      // Export all stickers in filtered selection without limitation
      const itemsToExport = filteredStickers;

      for (let i = 0; i < itemsToExport.length; i++) {
        const sticker = itemsToExport[i];
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 2048;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          renderStickerToCanvas(ctx, 2048, 2048, {
            text: sticker.title,
            fontFamily: sticker.fontFamily || 'Script Elegante',
            fontSize: sticker.title.length > 15 ? 210 : 260,
            textColor: sticker.textColor || '#FFFFFF',
            gradientStart: sticker.primaryColor || '#D4AF37',
            gradientEnd: sticker.primaryColor ? '#5B1E2D' : '#D4AF37',
            hasGradient: true,
            strokeColor: '#FFFFFF',
            strokeWidth: 45,
            glowColor: sticker.primaryColor || '#D4AF37',
            glowRadius: sticker.style === 'Neon' ? 80 : 0,
            shadowColor: 'rgba(91, 30, 45, 0.3)',
            shadowOffsetY: 30,
            shadowBlur: 45,
            iconSymbol: sticker.iconSymbol || 'Sparkles',
            iconPosition: 'top',
            iconSize: 260,
            styleEffect: sticker.style,
            rotation: 0,
            glassOpacity: 0.22,
            aspectRatio: '1:1',
            exportResolution: '2048',
          });

          const dataUrl = canvas.toDataURL('image/png');
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          folder.file(`${i + 1}-${sticker.title.toLowerCase().replace(/\s+/g, '-')}-4k.png`, base64Data, {
            base64: true,
          });
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `tamiris-santana-stickers-4k-alpha.zip`;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] text-[#2B2B2B] flex flex-col font-body selection:bg-[#5B1E2D] selection:text-[#D4AF37] relative overflow-x-hidden">
      
      {/* Background Subtle Gradient Accents */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5B1E2D]/15 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/20 rounded-full blur-[140px]"></div>
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col flex-1 min-h-screen">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalStickersCount={allStickers.length}
          favoritesCount={favoritesList.length}
          onOpenAIPrompt={() => setActiveTab('prompt-master')}
          onDownloadAllZip={handleDownloadMasterZip}
          onOpenTour={() => setIsTourOpen(true)}
        />

        {/* Main Tab Views */}
        <main className="flex-1 pb-12">
          {activeTab === 'library' && (
            <>
              <CategoryBar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                totalResultsCount={filteredStickers.length}
              />

              <StickerGrid
                stickers={filteredStickers}
                selectedCategory={selectedCategory}
                selectedStyle={selectedStyle}
                onSelectCategory={setSelectedCategory}
                onEditSticker={handleEditSticker}
                onTestInStory={handleTestInStory}
                onOpenPromptMaster={() => setActiveTab('prompt-master')}
                favoritesList={favoritesList}
                onToggleFavorite={handleToggleFavorite}
              />
            </>
          )}

          {activeTab === 'favorites' && (
            <>
              <CategoryBar
                selectedCategory="favorites"
                setSelectedCategory={setSelectedCategory}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                totalResultsCount={allStickers.filter((s) => favoritesList.includes(s.id)).length}
              />

              <StickerGrid
                stickers={allStickers.filter((s) => favoritesList.includes(s.id))}
                selectedCategory="favorites"
                selectedStyle={selectedStyle}
                onSelectCategory={setSelectedCategory}
                onEditSticker={handleEditSticker}
                onTestInStory={handleTestInStory}
                onOpenPromptMaster={() => setActiveTab('prompt-master')}
                favoritesList={favoritesList}
                onToggleFavorite={handleToggleFavorite}
              />
            </>
          )}

          {activeTab === 'prompt-master' && (
            <PromptMasterGenerator
              onAddGeneratedSticker={handleAddGeneratedSticker}
              onEditSticker={handleEditSticker}
            />
          )}

          {activeTab === 'pranchas' && <PranchasSheetView />}

          {activeTab === 'stories-mockup' && (
            <StoriesSimulator
              initialSticker={storySticker}
              allStickers={allStickers}
            />
          )}

          {activeTab === 'efeitos-story' && (
            <StoryEffectsCatalog
              allStickers={allStickers}
              onSelectStickerForStory={(s) => {
                setStorySticker(s);
                setActiveTab('stories-mockup');
              }}
            />
          )}

          {activeTab === 'profile' && (
            <UserProfileView
              totalStickersCount={allStickers.length}
              favoritesCount={favoritesList.length}
              allStickers={allStickers}
              favoritesList={favoritesList}
              currentUserId={currentUser?.uid}
              onGoToLibrary={() => {
                setActiveTab('library');
                setSelectedCategory('all');
              }}
              onGoToAIPrompt={() => setActiveTab('prompt-master')}
              onDownloadAllZip={handleDownloadMasterZip}
              onRestoreBackup={(updatedStickers, updatedFavs) => {
                setAllStickers(updatedStickers);
                setFavoritesList(updatedFavs);
              }}
            />
          )}
        </main>

        {/* Interactive Studio Modal */}
        {editingSticker && (
          <StickerStudio
            sticker={editingSticker}
            onClose={() => setEditingSticker(null)}
            onSaveCustomSticker={(newSticker) => {
              handleAddGeneratedSticker(newSticker);
              setEditingSticker(null);
            }}
          />
        )}

        {/* Onboarding Tour Modal */}
        <OnboardingTour
          isOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'library') setSelectedCategory('all');
          }}
        />

        {/* Footer */}
        <footer className="bg-[#5B1E2D] text-[#F8F6F3] border-t border-[#D4AF37]/30 py-6 text-center text-xs mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-serif-title font-bold text-[#D4AF37] tracking-wider uppercase text-xs">
                Tamiris Santana
              </span>
              <span className="text-[#EFE8DF]/70 font-light">• Harmonização Facial & Estética Avançada</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3D141E] border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-medium">
                <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Firebase Cloud Sincronizado</span>
              </div>
              <p className="text-[#EFE8DF]/80 font-light hidden md:block">
                Adesivos PNG Transparentes 4K em Nuvem
              </p>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}

