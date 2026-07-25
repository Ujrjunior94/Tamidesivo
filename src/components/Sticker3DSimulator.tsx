import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { StickerItem, StickerCustomizerState, VisualStyle } from '../types';
import { renderStickerToCanvas } from '../utils/stickerRenderer';
import { RotateCw, ZoomIn, ZoomOut, Download, Box, Smartphone, Laptop, Coffee, Sparkles, Check, RefreshCw, Layers } from 'lucide-react';

interface Sticker3DSimulatorProps {
  stickers: StickerItem[];
  selectedSticker?: StickerItem | null;
  onSelectSticker?: (sticker: StickerItem) => void;
}

type DeviceType = 'phone' | 'laptop' | 'tumbler';

const FINISH_COLORS = [
  { name: 'Rose Gold', hex: 0xb76e79, bgCss: '#B76E79' },
  { name: 'Dourado Champagne', hex: 0xd4af37, bgCss: '#D4AF37' },
  { name: 'Vinho Império', hex: 0x5b1e2d, bgCss: '#5B1E2D' },
  { name: 'Branco Pérola', hex: 0xf5f5f7, bgCss: '#F5F5F7' },
  { name: 'Preto Grafite', hex: 0x2b2b2b, bgCss: '#2B2B2B' },
];

export const Sticker3DSimulator: React.FC<Sticker3DSimulatorProps> = ({
  stickers,
  selectedSticker: initialSticker,
  onSelectSticker,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeSticker, setActiveSticker] = useState<StickerItem>(
    initialSticker || stickers[0] || {
      id: 'demo-3d',
      title: 'Harmonização Facial',
      category: 'estetica-facial',
      style: 'Gold',
      tags: ['demo'],
      primaryColor: '#D4AF37',
      textColor: '#FFFFFF',
      fontFamily: 'Script Elegante',
    }
  );

  const [deviceType, setDeviceType] = useState<DeviceType>('phone');
  const [finishHex, setFinishHex] = useState<number>(0x2b2b2b);
  const [stickerScale, setStickerScale] = useState<number>(1.0);
  const [stickerPosX, setStickerPosX] = useState<number>(0);
  const [stickerPosY, setStickerPosY] = useState<number>(0);

  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [snapshotTaken, setSnapshotTaken] = useState<boolean>(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectGroupRef = useRef<THREE.Group | null>(null);
  const stickerMeshRef = useRef<THREE.Mesh | null>(null);
  const deviceMeshRef = useRef<THREE.Mesh | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Pointer dragging state for 3D orbit
  const isDragging = useRef<boolean>(false);
  const previousPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationEuler = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0));

  useEffect(() => {
    if (initialSticker) {
      setActiveSticker(initialSticker);
    }
  }, [initialSticker]);

  // Create Sticker Canvas Texture dynamically
  const createStickerTexture = (sticker: StickerItem): THREE.CanvasTexture => {
    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = 1024;
    hiddenCanvas.height = 1024;
    const ctx = hiddenCanvas.getContext('2d');
    if (ctx) {
      const fullState: StickerCustomizerState = {
        text: sticker.title,
        subtext: sticker.category ? sticker.category.toUpperCase().replace('-', ' ') : 'TAMIRIS SANTANA',
        fontFamily: sticker.fontFamily || 'Script Elegante',
        fontSize: 48,
        gradientStart: sticker.primaryColor || '#D4AF37',
        gradientEnd: sticker.primaryColor === '#D4AF37' ? '#5B1E2D' : '#D4AF37',
        hasGradient: true,
        textColor: sticker.textColor || '#FFFFFF',
        strokeColor: '#FFFFFF',
        strokeWidth: 0,
        glowColor: sticker.primaryColor || '#D4AF37',
        glowRadius: 20,
        shadowColor: 'rgba(91, 30, 45, 0.3)',
        shadowOffsetY: 8,
        shadowBlur: 16,
        styleEffect: (sticker.style as VisualStyle) || 'Luxo',
        iconSymbol: sticker.iconSymbol || 'Sparkles',
        iconPosition: 'top',
        iconSize: 40,
        rotation: 0,
        glassOpacity: 0.3,
        aspectRatio: '1:1',
        exportResolution: '2048',
      };
      renderStickerToCanvas(ctx, 1024, 1024, fullState);
    }

    const texture = new THREE.CanvasTexture(hiddenCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  };

  // Build or update 3D Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff5ea, 2.5);
    dirLight1.position.set(5, 10, 7);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd4af37, 1.5);
    dirLight2.position.set(-8, -5, 5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.0, 20);
    pointLight.position.set(0, 3, 5);
    scene.add(pointLight);

    // 5. Parent Group for rotating the object
    const objectGroup = new THREE.Group();
    scene.add(objectGroup);
    objectGroupRef.current = objectGroup;

    // 6. Build initial geometry
    buildObjectGeometry(deviceType, finishHex, activeSticker);

    // Render loop
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      if (autoRotate && objectGroupRef.current && !isDragging.current) {
        objectGroupRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(containerRef.current);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Re-build 3D geometry when deviceType or finishHex changes
  useEffect(() => {
    buildObjectGeometry(deviceType, finishHex, activeSticker);
  }, [deviceType, finishHex, activeSticker, stickerScale, stickerPosX, stickerPosY]);

  const buildObjectGeometry = (
    type: DeviceType,
    finishColorHex: number,
    sticker: StickerItem
  ) => {
    if (!objectGroupRef.current) return;

    // Clear previous children
    while (objectGroupRef.current.children.length > 0) {
      const child = objectGroupRef.current.children[0];
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
      objectGroupRef.current.remove(child);
    }

    const stickerTexture = createStickerTexture(sticker);
    textureRef.current = stickerTexture;

    if (type === 'phone') {
      // SMARTPHONE GEOMETRY
      const phoneWidth = 3.6;
      const phoneHeight = 7.2;
      const phoneThickness = 0.4;
      const cornerRadius = 0.6;

      // Phone body
      const shape = new THREE.Shape();
      const x = -phoneWidth / 2;
      const y = -phoneHeight / 2;
      const w = phoneWidth;
      const h = phoneHeight;
      const r = cornerRadius;

      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);

      const extrudeSettings = {
        depth: phoneThickness,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.08,
        bevelThickness: 0.08,
      };

      const phoneGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      phoneGeometry.center();

      const phoneMaterial = new THREE.MeshStandardMaterial({
        color: finishColorHex,
        roughness: 0.25,
        metalness: 0.8,
      });

      const phoneMesh = new THREE.Mesh(phoneGeometry, phoneMaterial);
      deviceMeshRef.current = phoneMesh;
      objectGroupRef.current.add(phoneMesh);

      // Camera Bump
      const cameraGeom = new THREE.BoxGeometry(1.2, 1.4, 0.15);
      const cameraMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.9 });
      const cameraMesh = new THREE.Mesh(cameraGeom, cameraMat);
      cameraMesh.position.set(-0.8, 2.3, phoneThickness / 2 + 0.08);
      objectGroupRef.current.add(cameraMesh);

      // Camera Lenses
      const lensGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32);
      const lensMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.95 });
      const lens1 = new THREE.Mesh(lensGeom, lensMat);
      lens1.rotation.x = Math.PI / 2;
      lens1.position.set(-0.8, 2.6, phoneThickness / 2 + 0.16);
      objectGroupRef.current.add(lens1);

      const lens2 = new THREE.Mesh(lensGeom, lensMat);
      lens2.rotation.x = Math.PI / 2;
      lens2.position.set(-0.8, 2.0, phoneThickness / 2 + 0.16);
      objectGroupRef.current.add(lens2);

      // Sticker Decal / Plane on Phone Back
      const stickerAspect = 1.0;
      const stickerWidth = 2.2 * stickerScale;
      const stickerHeight = (2.2 * stickerAspect) * stickerScale;
      const stickerGeom = new THREE.PlaneGeometry(stickerWidth, stickerHeight);
      const stickerMat = new THREE.MeshStandardMaterial({
        map: stickerTexture,
        transparent: true,
        roughness: 0.3,
        metalness: 0.2,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      });

      const stickerMesh = new THREE.Mesh(stickerGeom, stickerMat);
      // Position on phone back surface
      stickerMesh.position.set(stickerPosX, stickerPosY - 0.5, phoneThickness / 2 + 0.09);
      stickerMeshRef.current = stickerMesh;
      objectGroupRef.current.add(stickerMesh);

    } else if (type === 'laptop') {
      // NOTEBOOK / LAPTOP COVER GEOMETRY
      const lidWidth = 8.5;
      const lidHeight = 5.5;
      const lidThickness = 0.3;

      const lidGeom = new THREE.BoxGeometry(lidWidth, lidHeight, lidThickness);
      const lidMat = new THREE.MeshStandardMaterial({
        color: finishColorHex,
        roughness: 0.3,
        metalness: 0.85,
      });

      const lidMesh = new THREE.Mesh(lidGeom, lidMat);
      objectGroupRef.current.add(lidMesh);

      // Sticker Plane on Lid Back
      const stickerWidth = 3.2 * stickerScale;
      const stickerHeight = 3.2 * stickerScale;
      const stickerGeom = new THREE.PlaneGeometry(stickerWidth, stickerHeight);
      const stickerMat = new THREE.MeshStandardMaterial({
        map: stickerTexture,
        transparent: true,
        roughness: 0.3,
        metalness: 0.2,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      });

      const stickerMesh = new THREE.Mesh(stickerGeom, stickerMat);
      stickerMesh.position.set(stickerPosX, stickerPosY, lidThickness / 2 + 0.02);
      stickerMeshRef.current = stickerMesh;
      objectGroupRef.current.add(stickerMesh);

    } else if (type === 'tumbler') {
      // LUXURY TUMBLER / COFFEE CUP GEOMETRY
      const cupGeom = new THREE.CylinderGeometry(2.0, 1.5, 6.0, 48);
      const cupMat = new THREE.MeshStandardMaterial({
        color: finishColorHex,
        roughness: 0.35,
        metalness: 0.6,
      });

      const cupMesh = new THREE.Mesh(cupGeom, cupMat);
      objectGroupRef.current.add(cupMesh);

      // Gold Metallic Lid
      const lidGeom = new THREE.CylinderGeometry(2.1, 2.1, 0.5, 48);
      const lidMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.9 });
      const lidMesh = new THREE.Mesh(lidGeom, lidMat);
      lidMesh.position.set(0, 3.25, 0);
      objectGroupRef.current.add(lidMesh);

      // Sticker Plane wrapped smoothly or placed on front curved surface
      const stickerWidth = 2.8 * stickerScale;
      const stickerHeight = 2.8 * stickerScale;
      const stickerGeom = new THREE.PlaneGeometry(stickerWidth, stickerHeight);
      const stickerMat = new THREE.MeshStandardMaterial({
        map: stickerTexture,
        transparent: true,
        roughness: 0.3,
        metalness: 0.2,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      });

      const stickerMesh = new THREE.Mesh(stickerGeom, stickerMat);
      stickerMesh.position.set(stickerPosX, stickerPosY, 1.82);
      stickerMeshRef.current = stickerMesh;
      objectGroupRef.current.add(stickerMesh);
    }
  };

  // Pointer event handlers for 3D Orbiting
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    previousPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !objectGroupRef.current) return;

    const deltaX = e.clientX - previousPointer.current.x;
    const deltaY = e.clientY - previousPointer.current.y;

    objectGroupRef.current.rotation.y += deltaX * 0.01;
    objectGroupRef.current.rotation.x += deltaY * 0.01;

    previousPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // Download High-Res 3D Snapshot PNG
  const handleTakeSnapshot = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = `tamiris-santana-simulacao-3d-${activeSticker.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = dataUrl;
    link.click();

    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 3000);
  };

  const handleResetRotation = () => {
    if (objectGroupRef.current) {
      objectGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Title Bar */}
      <div className="bg-[#5B1E2D] border border-[#D4AF37]/30 rounded-[32px] p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-6 h-6 text-[#D4AF37]" />
            <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-[#F8F6F3]">
              Simulador 3D Interativo (Three.js)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
              RECURSO 3D
            </span>
          </div>
          <p className="text-xs text-[#EFE8DF]/80 font-light mt-1">
            Visualize seu adesivo aplicado em objetos 3D reais (Smartphone, Notebook, Copo Luxo). Gire com o mouse/touch em 360°!
          </p>
        </div>

        <button
          onClick={handleTakeSnapshot}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#5B1E2D] font-serif font-bold text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105 border border-[#D4AF37] shrink-0"
        >
          {snapshotTaken ? (
            <>
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Foto 3D Salva!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Baixar Foto 3D HD</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 3D Viewport Stage */}
        <div className="lg:col-span-8 bg-[#1A1A1A] border-2 border-[#D4AF37]/40 rounded-[32px] p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[520px] sm:min-h-[600px] select-none">
          
          {/* Subtle Ambient Glow Background */}
          <div className="absolute inset-0 bg-radial from-[#5B1E2D]/40 via-transparent to-transparent pointer-events-none" />

          {/* Interactive Controls Bar Overlay */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2 bg-black/50 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 text-white">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#D4AF37]">3D Canvas:</span>
              <span className="text-xs font-bold text-white truncate max-w-[150px] sm:max-w-xs">{activeSticker.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRotate((prev) => !prev)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                  autoRotate ? 'bg-[#D4AF37] text-[#5B1E2D]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Ativar/Desativar Rotação Automática"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Rotação 360°</span>
              </button>

              <button
                onClick={handleResetRotation}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                title="Resetar Posição 3D"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Three.js Canvas Container */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-full h-[450px] sm:h-[520px] cursor-grab active:cursor-grabbing relative flex items-center justify-center"
          >
            <canvas ref={canvasRef} className="w-full h-full block touch-none" />
          </div>

          {/* Bottom Hint */}
          <div className="mt-2 text-center text-[11px] text-[#D4AF37]/70 font-light flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Arraste com o mouse para rotacionar o modelo 3D em tempo real.</span>
          </div>
        </div>

        {/* Right Column: Controls Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Device Model Selector */}
          <div className="bg-white border border-[#D4AF37]/30 rounded-[28px] p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-serif-title font-bold text-[#5B1E2D] flex items-center gap-2 border-b border-[#D4AF37]/20 pb-2">
              <Box className="w-4 h-4 text-[#D4AF37]" />
              <span>1. Objeto 3D de Aplicação</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDeviceType('phone')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  deviceType === 'phone'
                    ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
                    : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-[11px]">Smartphone</span>
              </button>

              <button
                onClick={() => setDeviceType('laptop')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  deviceType === 'laptop'
                    ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
                    : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                }`}
              >
                <Laptop className="w-5 h-5" />
                <span className="text-[11px]">Notebook</span>
              </button>

              <button
                onClick={() => setDeviceType('tumbler')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  deviceType === 'tumbler'
                    ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
                    : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                }`}
              >
                <Coffee className="w-5 h-5" />
                <span className="text-[11px]">Copo Luxo</span>
              </button>
            </div>
          </div>

          {/* Surface Finish Color Selector */}
          <div className="bg-white border border-[#D4AF37]/30 rounded-[28px] p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-serif-title font-bold text-[#5B1E2D] flex items-center gap-2 border-b border-[#D4AF37]/20 pb-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>2. Cor do Objeto (Acabamento)</span>
            </h3>

            <div className="flex items-center justify-between gap-2 pt-1">
              {FINISH_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setFinishHex(c.hex)}
                  className={`w-9 h-9 rounded-full border-2 transition-all transform hover:scale-110 flex items-center justify-center shadow-sm ${
                    finishHex === c.hex ? 'border-[#5B1E2D] ring-2 ring-[#D4AF37] scale-110' : 'border-white'
                  }`}
                  style={{ backgroundColor: c.bgCss }}
                  title={c.name}
                >
                  {finishHex === c.hex && <Check className="w-4 h-4 text-[#D4AF37] filter drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sticker Placement Adjustments */}
          <div className="bg-white border border-[#D4AF37]/30 rounded-[28px] p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-serif-title font-bold text-[#5B1E2D] flex items-center gap-2 border-b border-[#D4AF37]/20 pb-2">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              <span>3. Ajustes do Adesivo</span>
            </h3>

            {/* Scale Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#2B2B2B] mb-1">
                <span>Tamanho no Objeto:</span>
                <span className="text-[#5B1E2D]">{Math.round(stickerScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.05"
                value={stickerScale}
                onChange={(e) => setStickerScale(parseFloat(e.target.value))}
                className="w-full accent-[#5B1E2D] cursor-pointer"
              />
            </div>

            {/* Vertical Position Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#2B2B2B] mb-1">
                <span>Posição Vertical:</span>
                <span className="text-[#5B1E2D]">{stickerPosY.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-1.5"
                max="1.5"
                step="0.1"
                value={stickerPosY}
                onChange={(e) => setStickerPosY(parseFloat(e.target.value))}
                className="w-full accent-[#5B1E2D] cursor-pointer"
              />
            </div>
          </div>

          {/* Sticker Picker List */}
          <div className="bg-white border border-[#D4AF37]/30 rounded-[28px] p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-serif-title font-bold text-[#5B1E2D] flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
              <span>Selecionar Adesivo ({stickers.length})</span>
            </h3>

            <div className="max-h-56 overflow-y-auto no-scrollbar space-y-2 pr-1">
              {stickers.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setActiveSticker(st);
                    if (onSelectSticker) onSelectSticker(st);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                    activeSticker.id === st.id
                      ? 'bg-[#5B1E2D] text-[#D4AF37] border-[#D4AF37] shadow-md'
                      : 'bg-[#F8F6F3] text-[#2B2B2B] border-[#D4AF37]/20 hover:bg-[#EFE8DF]'
                  }`}
                >
                  <span className="font-serif font-bold text-xs truncate flex-1">{st.title}</span>
                  {activeSticker.id === st.id && <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
