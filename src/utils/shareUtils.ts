/**
 * Utility for Web Share API and Direct Social Media Sharing (WhatsApp, Instagram, Clipboard)
 */

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  canvas?: HTMLCanvasElement | null;
  filename?: string;
}

/**
 * Safely generates the public, shareable URL. 
 * Converts private 'ais-dev-' URLs to their public 'ais-pre-' counterparts.
 */
export function getPublicShareUrl(): string {
  const defaultUrl = 'https://ais-pre-xo4gsmrhe2iji5kpex2nfq-627952343829.us-west2.run.app';
  if (typeof window === 'undefined') return defaultUrl;
  
  try {
    const origin = window.location.origin;
    if (origin.includes('ais-dev-')) {
      return origin.replace('ais-dev-', 'ais-pre-');
    }
    if (origin.includes('ais-pre-')) {
      return origin;
    }
    return defaultUrl;
  } catch (err) {
    return defaultUrl;
  }
}

/**
 * Sanitizes any URL to ensure it doesn't contain private dev domains,
 * converting them to public shareable ones.
 */
export function sanitizeShareUrl(url?: string): string {
  const defaultUrl = getPublicShareUrl();
  if (!url) return defaultUrl;
  try {
    if (url.includes('ais-dev-')) {
      return url.replace('ais-dev-', 'ais-pre-');
    }
    if (url.includes('localhost') || url.includes('127.0.0.1') || !url.includes('ais-pre-')) {
      return defaultUrl;
    }
    return url;
  } catch (err) {
    return defaultUrl;
  }
}

/**
 * Converts a HTMLCanvasElement into a PNG File object suitable for navigator.share
 */
export async function canvasToPngFile(
  canvas: HTMLCanvasElement,
  filename = 'adesivo-tamiris-santana.png'
): Promise<File | null> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const file = new File([blob], filename, { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    } catch (err) {
      console.error('Error converting canvas to file:', err);
      resolve(null);
    }
  });
}

/**
 * Perform Native Web Share API or return false if fallback is required
 */
export async function executeNativeShare(options: ShareOptions): Promise<{
  success: boolean;
  sharedNatively: boolean;
  cancelled?: boolean;
  error?: string;
}> {
  const title = options.title || 'Tamiris Santana • Estúdio de Adesivos';
  const text =
    options.text ||
    'Confira este adesivo de alta resolução da coleção Tamiris Santana para Instagram Stories, Reels e WhatsApp!';
  const url = sanitizeShareUrl(options.url);

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      let fileToShare: File | null = null;
      if (options.canvas) {
        fileToShare = await canvasToPngFile(options.canvas, options.filename || 'adesivo-3d-4k.png');
      }

      if (fileToShare && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
        await navigator.share({
          title,
          text,
          files: [fileToShare],
        });
        return { success: true, sharedNatively: true };
      } else {
        await navigator.share({
          title,
          text,
          url,
        });
        return { success: true, sharedNatively: true };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, sharedNatively: false, cancelled: true };
      }
      console.warn('Native share error or unsupported payload, fallback available:', err);
    }
  }

  return { success: false, sharedNatively: false };
}

/**
 * Direct WhatsApp Share
 */
export function shareToWhatsAppDirect(text: string, shareUrl?: string) {
  const url = sanitizeShareUrl(shareUrl);
  const message = `${text}\n\n✨ Confira em: ${url}`;
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Direct Instagram Stories Guidance or Link Share
 */
export function shareToInstagramDirect() {
  if (typeof window !== 'undefined') {
    window.open('https://instagram.com', '_blank', 'noopener,noreferrer');
  }
}

/**
 * Copy image or canvas to clipboard
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return resolve(false);
        try {
          if (navigator.clipboard && 'write' in navigator.clipboard) {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (e) {
          console.error('Clipboard write failed:', e);
          resolve(false);
        }
      }, 'image/png');
    });
  } catch (err) {
    console.error('Copy canvas error:', err);
    return false;
  }
}
