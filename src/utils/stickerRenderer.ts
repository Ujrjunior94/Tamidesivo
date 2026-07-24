import { StickerCustomizerState } from '../types';

export function renderStickerToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: StickerCustomizerState,
  renderIconSvg?: (ctx: CanvasRenderingContext2D, icon: string, x: number, y: number, size: number, color: string) => void
) {
  const cx = width / 2;
  const cy = height / 2;

  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((state.rotation * Math.PI) / 180);
  ctx.translate(-cx, -cy);

  // Setup scale according to resolution
  const scaleRatio = width / 1000; // Base reference size 1000px

  const fontSize = state.fontSize * scaleRatio;
  const isGeometric = state.textLayout === 'Espiral' || state.textLayout === 'Circular' || state.textLayout === 'Curva';
  const isSemBorda = state.styleEffect === 'Sem Borda' || state.strokeWidth === 0 || isGeometric;
  const strokeW = isSemBorda ? 0 : state.strokeWidth * scaleRatio;
  const iconSz = state.iconSize * scaleRatio;

  const textLower = (state.text || '').toLowerCase();
  const isSpiral = state.textLayout === 'Espiral' || state.iconSymbol === 'Spiral' || textLower.includes('espiral');
  const isCircular = state.textLayout === 'Circular' || state.iconSymbol === 'Circle' || textLower.includes('circular') || textLower.includes('círculo');
  const isCurva = state.textLayout === 'Curva' || state.iconSymbol === 'Wave' || textLower.includes('curva') || textLower.includes('onda') || textLower.includes('swoosh');
  const isShadow = state.iconSymbol === 'Shadow' || textLower.includes('sombra');

  // Render Shadow Overlay Stickers for Stories
  if (isShadow) {
    ctx.save();
    if (textLower.includes('inferior') || textLower.includes('rodapé') || textLower.includes('legenda')) {
      // Bottom Gradient Shadow for Stories readability
      const grad = ctx.createLinearGradient(0, height * 0.4, 0, height);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.45)');
      grad.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (textLower.includes('superior') || textLower.includes('topo') || textLower.includes('vinheta')) {
      // Top Vignette Shadow
      const grad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
      grad.addColorStop(0, 'rgba(0,0,0,0.80)');
      grad.addColorStop(0.6, 'rgba(0,0,0,0.30)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (textLower.includes('oval') || textLower.includes('produto') || textLower.includes('flutuante')) {
      // Soft Oval Drop Shadow for Floating Cards/Products
      const grad = ctx.createRadialGradient(cx, cy, 10 * scaleRatio, cx, cy, width * 0.42);
      grad.addColorStop(0, 'rgba(0,0,0,0.65)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.25)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, width * 0.42, height * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // General Soft Spotlight Shadow Patch
      const grad = ctx.createRadialGradient(cx, cy, 20 * scaleRatio, cx, cy, width * 0.48);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
  }

  // Render Drawing Shapes (Espiral, Circular, Curva) without borders
  if (isSpiral) {
    ctx.save();
    ctx.strokeStyle = state.gradientStart || '#D4AF37';
    ctx.lineWidth = Math.max(3, 6 * scaleRatio);
    ctx.lineCap = 'round';
    ctx.beginPath();
    const turns = 4.5;
    const maxRadius = width * 0.35;
    for (let a = 0; a < turns * Math.PI * 2; a += 0.05) {
      const r = (a / (turns * Math.PI * 2)) * maxRadius;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Subtle glow on spiral
    ctx.shadowColor = state.gradientStart || '#D4AF37';
    ctx.shadowBlur = 15 * scaleRatio;
    ctx.stroke();
    ctx.restore();
  }

  if (isCircular) {
    ctx.save();
    ctx.strokeStyle = state.gradientStart || '#D4AF37';
    ctx.lineWidth = Math.max(2, 4 * scaleRatio);
    ctx.beginPath();
    ctx.arc(cx, cy, width * 0.35, 0, Math.PI * 2);
    ctx.stroke();

    // Inner dashed accent ring
    ctx.setLineDash([12 * scaleRatio, 8 * scaleRatio]);
    ctx.strokeStyle = state.textColor || '#FFFFFF';
    ctx.lineWidth = Math.max(1, 2 * scaleRatio);
    ctx.beginPath();
    ctx.arc(cx, cy, width * 0.31, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (isCurva) {
    ctx.save();
    ctx.strokeStyle = state.gradientStart || '#D4AF37';
    ctx.lineWidth = Math.max(4, 7 * scaleRatio);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - width * 0.4, cy + height * 0.1);
    ctx.bezierCurveTo(
      cx - width * 0.15, cy - height * 0.25,
      cx + width * 0.15, cy + height * 0.25,
      cx + width * 0.4, cy - height * 0.1
    );
    ctx.stroke();

    // Parallel fine accent curve
    ctx.strokeStyle = state.gradientEnd || '#5B1E2D';
    ctx.lineWidth = Math.max(2, 3 * scaleRatio);
    ctx.beginPath();
    ctx.moveTo(cx - width * 0.38, cy + height * 0.15);
    ctx.bezierCurveTo(
      cx - width * 0.13, cy - height * 0.2,
      cx + width * 0.17, cy + height * 0.3,
      cx + width * 0.42, cy - height * 0.05
    );
    ctx.stroke();
    ctx.restore();
  }

  // Render Background Effects based on Visual Style
  if (state.styleEffect === 'Glassmorphism') {
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${state.glassOpacity || 0.18})`;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = Math.max(2, 4 * scaleRatio);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 20 * scaleRatio;

    const padX = fontSize * 1.2;
    const padY = fontSize * 0.8;
    const rw = Math.min(width * 0.85, (state.text.length * fontSize * 0.55) + padX + iconSz);
    const rh = fontSize * 1.8 + (state.subtext ? fontSize * 0.9 : 0) + (state.iconPosition === 'top' || state.iconPosition === 'bottom' ? iconSz : 0);
    const rx = cx - rw / 2;
    const ry = cy - rh / 2;

    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, 24 * scaleRatio);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  } else if (state.styleEffect === 'Traços Finos') {
    // Ultra-fine monoline & delicate line frame effect
    ctx.save();
    ctx.strokeStyle = state.strokeColor || 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = Math.max(1, 1.2 * scaleRatio);
    ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
    ctx.shadowBlur = 8 * scaleRatio;

    const padX = fontSize * 1.5;
    const padY = fontSize * 0.9;
    const rw = Math.min(width * 0.9, (state.text.length * fontSize * 0.5) + padX + iconSz);
    const rh = fontSize * 2.0 + (state.subtext ? fontSize * 0.8 : 0) + (state.iconPosition === 'top' || state.iconPosition === 'bottom' ? iconSz : 0);
    const rx = cx - rw / 2;
    const ry = cy - rh / 2;

    // Refined double monoline border (inner and outer)
    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, 20 * scaleRatio);
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(rx + 4 * scaleRatio, ry + 4 * scaleRatio, rw - 8 * scaleRatio, rh - 8 * scaleRatio, 16 * scaleRatio);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = Math.max(0.75, 0.8 * scaleRatio);
    ctx.stroke();

    // Delicate star / sparkle corner accents
    const drawFineSparkle = (sx: number, sy: number) => {
      ctx.save();
      ctx.strokeStyle = state.textColor || '#FFFFFF';
      ctx.lineWidth = Math.max(1, 1 * scaleRatio);
      ctx.beginPath();
      ctx.moveTo(sx - 5 * scaleRatio, sy);
      ctx.lineTo(sx + 5 * scaleRatio, sy);
      ctx.moveTo(sx, sy - 5 * scaleRatio);
      ctx.lineTo(sx, sy + 5 * scaleRatio);
      ctx.stroke();
      ctx.restore();
    };

    drawFineSparkle(rx + 10 * scaleRatio, ry + 10 * scaleRatio);
    drawFineSparkle(rx + rw - 10 * scaleRatio, ry + 10 * scaleRatio);
    drawFineSparkle(rx + 10 * scaleRatio, ry + rh - 10 * scaleRatio);
    drawFineSparkle(rx + rw - 10 * scaleRatio, ry + rh - 10 * scaleRatio);

    ctx.restore();
  }

  // Draw Icon if top/background
  if (state.iconSymbol && state.iconSymbol !== 'none') {
    let ix = cx;
    let iy = cy - fontSize * 0.9;

    if (state.iconPosition === 'left') {
      ix = cx - (state.text.length * fontSize * 0.28) - iconSz * 0.7;
      iy = cy;
    } else if (state.iconPosition === 'right') {
      ix = cx + (state.text.length * fontSize * 0.28) + iconSz * 0.7;
      iy = cy;
    } else if (state.iconPosition === 'bottom') {
      iy = cy + fontSize * 1.1;
    } else if (state.iconPosition === 'background') {
      iy = cy;
    }

    if (renderIconSvg) {
      renderIconSvg(ctx, state.iconSymbol, ix, iy, state.iconPosition === 'background' ? iconSz * 1.8 : iconSz, state.glowColor || state.textColor);
    }
  }

  // Font setup
  ctx.font = `bold ${fontSize}px ${getFontFamilyCSS(state.fontFamily)}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const textY = state.subtext ? cy - fontSize * 0.35 : cy;

  // 1. Die-cut Sticker White Outer Border Pass
  if (strokeW > 0) {
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.lineWidth = strokeW * 2;
    ctx.strokeStyle = state.strokeColor || '#FFFFFF';

    if (state.shadowBlur > 0) {
      ctx.shadowColor = state.shadowColor || 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = state.shadowBlur * scaleRatio;
      ctx.shadowOffsetY = state.shadowOffsetY * scaleRatio;
    }

    ctx.strokeText(state.text, cx, textY);
    if (state.subtext) {
      ctx.font = `bold ${fontSize * 0.55}px ${getFontFamilyCSS(state.fontFamily)}`;
      ctx.strokeText(state.subtext, cx, cy + fontSize * 0.65);
    }
    ctx.restore();
  }

  // 2. Glow Effect Pass (Neon Style)
  if (state.glowRadius > 0 || state.styleEffect === 'Neon') {
    ctx.save();
    ctx.shadowColor = state.glowColor || '#00F2FE';
    ctx.shadowBlur = (state.glowRadius || 25) * scaleRatio;
    ctx.fillStyle = state.textColor || '#FFFFFF';
    ctx.fillText(state.text, cx, textY);
    ctx.restore();
  }

  // 3. Fill Text Pass (Gradient or Solid)
  ctx.save();
  if (state.hasGradient) {
    const textWidth = ctx.measureText(state.text).width || 300;
    const grad = ctx.createLinearGradient(cx - textWidth / 2, cy - fontSize / 2, cx + textWidth / 2, cy + fontSize / 2);
    grad.addColorStop(0, state.gradientStart || '#FF7E5F');
    grad.addColorStop(1, state.gradientEnd || '#FEB47B');
    ctx.fillStyle = grad;
  } else if (state.styleEffect === 'Gold') {
    const grad = ctx.createLinearGradient(cx - 150, cy - 50, cx + 150, cy + 50);
    grad.addColorStop(0, '#BF953F');
    grad.addColorStop(0.25, '#FCF6BA');
    grad.addColorStop(0.5, '#B38728');
    grad.addColorStop(0.75, '#FBF5B7');
    grad.addColorStop(1, '#AA771C');
    ctx.fillStyle = grad;
  } else if (state.styleEffect === 'Silver' || state.styleEffect === 'Metal Cromado') {
    const grad = ctx.createLinearGradient(cx - 150, cy - 50, cx + 150, cy + 50);
    grad.addColorStop(0, '#E0E0E0');
    grad.addColorStop(0.3, '#FFFFFF');
    grad.addColorStop(0.5, '#999999');
    grad.addColorStop(0.8, '#EEEEEE');
    grad.addColorStop(1, '#777777');
    ctx.fillStyle = grad;
  } else if (state.styleEffect === 'Holográfico') {
    const grad = ctx.createLinearGradient(cx - 200, cy - 50, cx + 200, cy + 50);
    grad.addColorStop(0, '#FF007F');
    grad.addColorStop(0.2, '#7F00FF');
    grad.addColorStop(0.4, '#00F2FE');
    grad.addColorStop(0.6, '#4FACFE');
    grad.addColorStop(0.8, '#00FF87');
    grad.addColorStop(1, '#FF007F');
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = state.textColor || '#FFFFFF';
  }

  if (isCircular) {
    renderCircularText(ctx, state.text, cx, cy, width * 0.32, fontSize);
    if (state.subtext) {
      renderCircularText(ctx, state.subtext, cx, cy, width * 0.22, fontSize * 0.55);
    }
  } else if (isSpiral) {
    renderSpiralText(ctx, state.text, cx, cy, fontSize, scaleRatio);
    if (state.subtext) {
      ctx.font = `bold ${fontSize * 0.55}px ${getFontFamilyCSS(state.fontFamily)}`;
      ctx.fillText(state.subtext, cx, cy + fontSize * 1.2);
    }
  } else if (isCurva) {
    renderCurveText(ctx, state.text, cx, cy, fontSize, scaleRatio);
    if (state.subtext) {
      ctx.font = `bold ${fontSize * 0.55}px ${getFontFamilyCSS(state.fontFamily)}`;
      ctx.fillText(state.subtext, cx, cy + fontSize * 0.8);
    }
  } else {
    ctx.fillText(state.text, cx, textY);
    if (state.subtext) {
      ctx.font = `bold ${fontSize * 0.55}px ${getFontFamilyCSS(state.fontFamily)}`;
      ctx.fillText(state.subtext, cx, cy + fontSize * 0.65);
    }
  }

  ctx.restore();
  ctx.restore();

  // Apply Real-time Canvas Color Correction Aesthetic Filters
  if (state.aestheticFilter && state.aestheticFilter !== 'Normal') {
    applyAestheticFilter(ctx, width, height, state.aestheticFilter);
  }
}

export function applyAestheticFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filterName: string
) {
  if (!filterName || filterName === 'Normal') return;

  ctx.save();
  if (filterName === 'Dourado Glow') {
    ctx.globalCompositeOperation = 'source-atop';
    const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.6);
    grad.addColorStop(0, 'rgba(212, 175, 55, 0.35)');
    grad.addColorStop(0.7, 'rgba(243, 229, 171, 0.20)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0.05)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        data[i] = Math.min(255, data[i] * 1.08 + 15);
        data[i + 1] = Math.min(255, data[i + 1] * 1.05 + 10);
        data[i + 2] = Math.min(255, data[i + 2] * 0.90);
      }
    }
    ctx.putImageData(imgData, 0, 0);

  } else if (filterName === 'Vintage Matte') {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        let sr = (r * 0.393) + (g * 0.769) + (b * 0.189);
        let sg = (r * 0.349) + (g * 0.686) + (b * 0.168);
        let sb = (r * 0.272) + (g * 0.534) + (b * 0.131);

        r = r * 0.6 + sr * 0.4;
        g = g * 0.6 + sg * 0.4;
        b = b * 0.6 + sb * 0.4;

        data[i] = Math.min(255, r * 0.9 + 25);
        data[i + 1] = Math.min(255, g * 0.9 + 20);
        data[i + 2] = Math.min(255, b * 0.9 + 18);
      }
    }
    ctx.putImageData(imgData, 0, 0);

  } else if (filterName === 'Crystal Contrast') {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        r = (r - 128) * 1.22 + 128;
        g = (g - 128) * 1.22 + 128;
        b = (b - 128) * 1.22 + 128;

        data[i] = Math.max(0, Math.min(255, r * 0.95));
        data[i + 1] = Math.max(0, Math.min(255, g * 1.05));
        data[i + 2] = Math.max(0, Math.min(255, b * 1.15 + 10));
      }
    }
    ctx.putImageData(imgData, 0, 0);

  } else if (filterName === 'Bordeaux Chic') {
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(91, 30, 45, 0.25)';
    ctx.fillRect(0, 0, width, height);

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        data[i] = Math.min(255, data[i] * 1.15 + 10);
        data[i + 1] = Math.max(0, data[i + 1] * 0.88);
        data[i + 2] = Math.max(0, data[i + 2] * 0.92);
      }
    }
    ctx.putImageData(imgData, 0, 0);

  } else if (filterName === 'Rose Gold Soft') {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        data[i] = Math.min(255, r * 1.12 + 20);
        data[i + 1] = Math.min(255, g * 0.98 + 10);
        data[i + 2] = Math.min(255, b * 1.05 + 15);
      }
    }
    ctx.putImageData(imgData, 0, 0);

  } else if (filterName === 'Nude Minimal') {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        r = (r * 0.85) + 30;
        g = (g * 0.85) + 25;
        b = (b * 0.80) + 20;

        data[i] = Math.min(255, r);
        data[i + 1] = Math.min(255, g);
        data[i + 2] = Math.min(255, b);
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }
  ctx.restore();
}

function renderCircularText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  fontSize: number
) {
  if (!text) return;
  const chars = text.split('');
  let totalW = 0;
  chars.forEach((c) => {
    totalW += ctx.measureText(c).width || fontSize * 0.55;
  });

  const arcLength = Math.min(Math.PI * 1.6, Math.max(Math.PI * 0.6, totalW / radius));
  let angle = -Math.PI / 2 - arcLength / 2;

  chars.forEach((char) => {
    const charW = ctx.measureText(char).width || fontSize * 0.55;
    const charAngle = charW / radius;
    angle += charAngle / 2;

    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();

    angle += charAngle / 2;
  });
}

function renderSpiralText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  fontSize: number,
  scaleRatio: number
) {
  if (!text) return;
  const chars = text.split('');
  let angle = 0.6;
  const startR = 40 * scaleRatio;
  const growth = 22 * scaleRatio;

  chars.forEach((char) => {
    const charW = ctx.measureText(char).width || fontSize * 0.55;
    const r = startR + growth * angle;
    const dAngle = charW / Math.max(r, 12);

    angle += dAngle / 2;
    const currentR = startR + growth * angle;
    const x = cx + currentR * Math.cos(angle);
    const y = cy + currentR * Math.sin(angle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();

    angle += dAngle / 2;
  });
}

function renderCurveText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  fontSize: number,
  scaleRatio: number
) {
  if (!text) return;
  const chars = text.split('');
  let totalW = 0;
  chars.forEach((c) => {
    totalW += ctx.measureText(c).width || fontSize * 0.55;
  });

  const waveWidth = Math.max(totalW * 1.15, 380 * scaleRatio);
  const amplitude = 60 * scaleRatio;
  let startX = cx - totalW / 2;

  chars.forEach((char) => {
    const charW = ctx.measureText(char).width || fontSize * 0.55;
    const x = startX + charW / 2;
    const normX = (x - (cx - waveWidth / 2)) / waveWidth;
    const y = cy + amplitude * Math.sin(normX * Math.PI * 2);

    const slope = amplitude * ((2 * Math.PI) / waveWidth) * Math.cos(normX * Math.PI * 2);
    const angle = Math.atan(slope);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(char, 0, 0);
    ctx.restore();

    startX += charW;
  });
}

export function getFontFamilyCSS(fontName: string): string {
  switch (fontName) {
    case 'Script Elegante':
      return '"Dancing Script", "Great Vibes", "Caveat", cursive';
    case 'Cursiva Calligraphy':
      return '"Great Vibes", "Alex Brush", "Dancing Script", cursive';
    case 'Cursiva Delicada':
      return '"Sacramento", "Dancing Script", "Caveat", cursive';
    case 'Handwritten Script':
      return '"Caveat", "Dancing Script", cursive';
    case 'Bold Display 3D':
      return '"Dancing Script", "Impact", cursive';
    case 'Neon Brush':
      return '"Dancing Script", "Alex Brush", cursive';
    case 'Luxury Serif':
      return '"Great Vibes", "Playfair Display", serif';
    case 'Minimalist Clean':
      return '"Caveat", "Dancing Script", cursive';
    case 'Handwritten Cute':
      return '"Caveat", "Sacramento", cursive';
    case 'Cyber Gothic':
      return '"Dancing Script", "Orbitron", cursive';
    default:
      return '"Dancing Script", "Great Vibes", cursive';
  }
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
