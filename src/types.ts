export type CategoryId =
  | 'deus-e-fe'
  | 'familia'
  | 'autoestima'
  | 'treino'
  | 'estetica-facial'
  | 'lifestyle'
  | 'instagram'
  | 'emojis-premium'
  | 'elementos-decorativos'
  | 'estilos-visuais'
  | 'desenhos-formas'
  | 'sombras-story';

export type VisualStyle =
  | 'Minimalista'
  | 'Traços Finos'
  | 'Sem Borda'
  | 'Luxo'
  | 'Neon'
  | '3D'
  | 'Glassmorphism'
  | 'Aquarela'
  | 'Vintage'
  | 'Cartoon'
  | 'Holográfico'
  | 'Metal Cromado'
  | 'Gold'
  | 'Silver'
  | 'Black Edition'
  | 'Cyberpunk'
  | 'Kawaii';

export interface StickerItem {
  id: string;
  title: string;
  category: CategoryId;
  style: VisualStyle;
  tags: string[];
  iconSymbol?: string;
  elements?: string[];
  gradient?: string[];
  primaryColor?: string;
  textColor?: string;
  fontFamily?: string;
  badge?: string;
  customSvgPath?: string;
  isCustomGenerated?: boolean;
  previewUrl?: string;
}

export interface StickerCategoryInfo {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  count: number;
  badgeGradient: string;
  samplePhrases: string[];
  elementsList: string[];
}

export interface StickerCustomizerState {
  text: string;
  subtext?: string;
  textLayout?: 'Reto' | 'Espiral' | 'Circular' | 'Curva';
  fontFamily: string;
  fontSize: number;
  textColor: string;
  gradientStart: string;
  gradientEnd: string;
  hasGradient: boolean;
  strokeColor: string;
  strokeWidth: number; // 0 to 20px (Die-cut sticker border)
  glowColor: string;
  glowRadius: number;
  shadowColor: string;
  shadowOffsetY: number;
  shadowBlur: number;
  iconSymbol: string;
  iconPosition: 'top' | 'left' | 'right' | 'bottom' | 'background' | 'none';
  iconSize: number;
  styleEffect: VisualStyle;
  aestheticFilter?: 'Normal' | 'Dourado Glow' | 'Vintage Matte' | 'Crystal Contrast' | 'Bordeaux Chic' | 'Rose Gold Soft' | 'Nude Minimal';
  rotation: number;
  glassOpacity: number;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3';
  exportResolution: '1080' | '2048' | '4096';
}

export interface StoryMockupElement {
  id: string;
  sticker: StickerItem;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

export interface StickerSheetPrancha {
  id: string;
  title: string;
  category: CategoryId;
  description: string;
  stickers: StickerItem[];
  themeColor: string;
}

export interface AIStickerPromptResult {
  englishPrompt: string;
  ptPromptSummary: string;
  suggestedPhrases: string[];
  colorPalette: string[];
  recommendedFont: string;
}
