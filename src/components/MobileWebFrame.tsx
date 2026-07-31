import React, { useState } from 'react';
import {
  Smartphone,
  RotateCw,
  X,
  Wifi,
  Battery,
  Maximize2,
  Minimize2,
  Sparkles,
  ChevronDown,
  Monitor,
  Tablet,
} from 'lucide-react';

interface MobileWebFrameProps {
  children: React.ReactNode;
  isMobileActive: boolean;
  onToggleMobileMode: () => void;
}

export type DeviceModel = 'iphone-16' | 'galaxy-s24' | 'iphone-se' | 'ipad-mini';

interface DeviceSpecs {
  name: string;
  width: number;
  height: number;
  radius: string;
  notchType: 'island' | 'hole' | 'bar';
}

const DEVICE_SPECS: Record<DeviceModel, DeviceSpecs> = {
  'iphone-16': {
    name: 'iPhone 16 Pro (393 × 852)',
    width: 393,
    height: 852,
    radius: '52px',
    notchType: 'island',
  },
  'galaxy-s24': {
    name: 'Galaxy S24 Ultra (412 × 915)',
    width: 412,
    height: 915,
    radius: '42px',
    notchType: 'hole',
  },
  'iphone-se': {
    name: 'Compact Mobile (375 × 667)',
    width: 375,
    height: 667,
    radius: '36px',
    notchType: 'bar',
  },
  'ipad-mini': {
    name: 'Tablet iPad Mini (768 × 1024)',
    width: 768,
    height: 1024,
    radius: '28px',
    notchType: 'hole',
  },
};

export const MobileWebFrame: React.FC<MobileWebFrameProps> = ({
  children,
  isMobileActive,
  onToggleMobileMode,
}) => {
  const [device, setDevice] = useState<DeviceModel>('iphone-16');
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(0.9);

  if (!isMobileActive) {
    return <>{children}</>;
  }

  const spec = DEVICE_SPECS[device];
  const activeWidth = isLandscape ? spec.height : spec.width;
  const activeHeight = isLandscape ? spec.width : spec.height;

  // Format current time
  const now = new Date();
  const timeString = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#1A0B10]/95 backdrop-blur-xl flex flex-col items-center overflow-hidden font-body text-[#F8F6F3]">
      
      {/* Top Mobile View Control Toolbar */}
      <header className="w-full bg-[#3D141E] border-b border-[#D4AF37]/40 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#5B1E2D] px-3 py-1 rounded-full border border-[#D4AF37]/50 text-[#D4AF37]">
            <Smartphone className="w-4 h-4" />
            <span className="text-xs font-serif font-bold tracking-wide">
              Modo Web Mobile Ativo
            </span>
          </div>

          {/* Model Selector */}
          <div className="relative">
            <select
              value={device}
              onChange={(e) => setDevice(e.target.value as DeviceModel)}
              className="bg-[#5B1E2D] text-[#F8F6F3] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#D4AF37]/30 cursor-pointer outline-none focus:border-[#D4AF37]"
            >
              <option value="iphone-16">iPhone 16 Pro (393px)</option>
              <option value="galaxy-s24">Galaxy S24 Ultra (412px)</option>
              <option value="iphone-se">Compact Mobile (375px)</option>
              <option value="ipad-mini">Tablet Mini (768px)</option>
            </select>
          </div>
        </div>

        {/* Middle Quick Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isLandscape
                ? 'bg-[#D4AF37] text-[#5B1E2D] border-[#D4AF37]'
                : 'bg-[#5B1E2D] text-[#EFE8DF] border-[#D4AF37]/30 hover:border-[#D4AF37]'
            }`}
            title="Girar Orientação"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isLandscape ? 'Paisagem' : 'Retrato'}</span>
          </button>

          {/* Scale Selector */}
          <div className="flex items-center bg-[#5B1E2D] border border-[#D4AF37]/30 rounded-xl p-0.5 text-xs font-bold">
            <button
              onClick={() => setScale(0.75)}
              className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                scale === 0.75 ? 'bg-[#D4AF37] text-[#5B1E2D]' : 'text-stone-300'
              }`}
            >
              75%
            </button>
            <button
              onClick={() => setScale(0.9)}
              className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                scale === 0.9 ? 'bg-[#D4AF37] text-[#5B1E2D]' : 'text-stone-300'
              }`}
            >
              90%
            </button>
            <button
              onClick={() => setScale(1.0)}
              className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                scale === 1.0 ? 'bg-[#D4AF37] text-[#5B1E2D]' : 'text-stone-300'
              }`}
            >
              100%
            </button>
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={onToggleMobileMode}
          className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] text-[#5B1E2D] hover:bg-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Sair da Visualização Mobile</span>
        </button>
      </header>

      {/* Frame Center Container */}
      <div className="flex-1 w-full flex items-center justify-center p-4 overflow-auto no-scrollbar">
        
        {/* Device Outer Metallic Frame */}
        <div
          className="relative transition-all duration-300 ease-out shadow-2xl shadow-black/80 border-[10px] border-[#2A1218] bg-black flex flex-col overflow-hidden"
          style={{
            width: `${activeWidth}px`,
            height: `${activeHeight}px`,
            borderRadius: spec.radius,
            transform: `scale(${scale})`,
            boxShadow:
              '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 0 2px rgba(212,175,55,0.4), inset 0 0 12px rgba(0,0,0,0.8)',
          }}
        >
          {/* Top Smartphone Status Bar */}
          <div className="w-full bg-[#5B1E2D] text-[#F8F6F3] text-[11px] font-semibold px-6 py-1.5 flex items-center justify-between shrink-0 select-none z-30 border-b border-[#D4AF37]/20">
            <span>{timeString}</span>

            {/* Dynamic Island / Camera Notch */}
            {spec.notchType === 'island' && (
              <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end px-2 gap-1 border border-white/10 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80" />
              </div>
            )}
            {spec.notchType === 'hole' && (
              <div className="w-3.5 h-3.5 bg-black rounded-full border border-white/10" />
            )}

            <div className="flex items-center gap-1.5 text-[#D4AF37]">
              <Wifi className="w-3 h-3" />
              <span className="text-[10px] font-mono">5G</span>
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Web App Scrollable Mobile Viewport */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F8F6F3] text-[#2B2B2B] relative custom-scrollbar">
            {children}
          </div>

          {/* Bottom Swipe Bar / Home Indicator */}
          <div className="w-full bg-[#5B1E2D] py-1.5 flex items-center justify-center shrink-0 z-30 border-t border-[#D4AF37]/20">
            <div className="w-28 h-1 bg-[#D4AF37] rounded-full opacity-80" />
          </div>

        </div>

      </div>

    </div>
  );
};
