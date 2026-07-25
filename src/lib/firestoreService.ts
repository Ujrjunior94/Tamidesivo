import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { StickerItem } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // Do NOT throw inside background async snapshot subscriptions to prevent uncaught exceptions crashing the app.
  // Instead, log the error and allow the application to degrade gracefully.
}

/**
 * Real-time listener for cloud-synced custom stickers
 */
export function subscribeToCustomStickers(onStickersUpdated: (stickers: StickerItem[]) => void) {
  try {
    const q = query(collection(db, 'stickers'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const stickers: StickerItem[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          stickers.push({
            id: doc.id,
            title: data.title || '',
            category: data.category || 'estetica-facial',
            style: data.style || 'Minimalista',
            tags: data.tags || [],
            iconSymbol: data.iconSymbol,
            elements: data.elements || [],
            gradient: data.gradient,
            primaryColor: data.primaryColor,
            textColor: data.textColor,
            fontFamily: data.fontFamily,
            badge: data.badge,
            customSvgPath: data.customSvgPath,
            isCustomGenerated: true,
            previewUrl: data.previewUrl,
          });
        });
        onStickersUpdated(stickers);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'stickers');
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'stickers');
    return () => {};
  }
}

/**
 * Save or update a custom sticker in Firestore
 */
export async function saveCustomStickerToCloud(sticker: StickerItem, userId?: string) {
  try {
    const docRef = doc(db, 'stickers', sticker.id);
    await setDoc(
      docRef,
      {
        ...sticker,
        createdBy: userId || 'anonymous',
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `stickers/${sticker.id}`);
  }
}

/**
 * Real-time listener for user favorites
 */
export function subscribeToFavorites(userId: string, onFavoritesUpdated: (favorites: string[]) => void) {
  try {
    const userFavRef = doc(db, 'favorites', userId);
    return onSnapshot(
      userFavRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          onFavoritesUpdated(data.stickerIds || []);
        } else {
          onFavoritesUpdated([]);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `favorites/${userId}`);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `favorites/${userId}`);
    return () => {};
  }
}

/**
 * Toggle favorite status in cloud
 */
export async function syncFavoritesToCloud(userId: string, favoritesList: string[]) {
  try {
    const userFavRef = doc(db, 'favorites', userId);
    await setDoc(userFavRef, {
      userId,
      stickerIds: favoritesList,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `favorites/${userId}`);
  }
}

/**
 * Sync user profile and app config in cloud
 */
export async function syncUserConfigToCloud(userId: string, configData: Record<string, any>) {
  try {
    const configRef = doc(db, 'user_configs', userId);
    await setDoc(configRef, {
      userId,
      ...configData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `user_configs/${userId}`);
  }
}

/**
 * Real-time listener for user config
 */
export function subscribeToUserConfig(userId: string, onConfigUpdated: (data: Record<string, any>) => void) {
  try {
    const configRef = doc(db, 'user_configs', userId);
    return onSnapshot(
      configRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onConfigUpdated(docSnap.data());
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `user_configs/${userId}`);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `user_configs/${userId}`);
    return () => {};
  }
}

export interface BackupData {
  version: string;
  app: string;
  exportedAt: string;
  customStickers: StickerItem[];
  favorites: string[];
  userConfig?: Record<string, any>;
}

/**
 * Creates and downloads a JSON backup file of custom stickers and favorites
 */
export function exportBackupJSON(
  allStickers: StickerItem[],
  favoritesList: string[],
  userId?: string
) {
  const customStickers = allStickers.filter(
    (s) => s.isCustomGenerated || s.id.startsWith('cust-') || s.id.startsWith('gen-') || s.id.startsWith('edit-')
  );

  const backupPayload: BackupData = {
    version: '1.0',
    app: 'Tamiris Santana • Estúdio de Adesivos',
    exportedAt: new Date().toISOString(),
    customStickers,
    favorites: favoritesList,
    userConfig: {
      userId: userId || 'anonymous',
      exportClient: typeof window !== 'undefined' ? window.navigator.userAgent : 'web',
    },
  };

  const jsonString = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `backup-tamiris-santana-estudio-${dateStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    customStickersCount: customStickers.length,
    favoritesCount: favoritesList.length,
    fileName,
  };
}

/**
 * Restores custom stickers and favorites from a JSON backup payload and syncs with Firestore
 */
export async function restoreBackupData(
  jsonText: string,
  existingStickers: StickerItem[],
  existingFavorites: string[],
  userId?: string
): Promise<{
  success: boolean;
  stickersRestored: number;
  favoritesRestored: number;
  updatedStickers: StickerItem[];
  updatedFavorites: string[];
  message: string;
}> {
  try {
    const data = JSON.parse(jsonText) as BackupData;

    if (!data || (!Array.isArray(data.customStickers) && !Array.isArray(data.favorites))) {
      throw new Error('Arquivo de backup inválido ou em formato incompatível.');
    }

    let stickersRestoredCount = 0;
    let favoritesRestoredCount = 0;

    const customStickersToRestore: StickerItem[] = Array.isArray(data.customStickers)
      ? data.customStickers
      : [];
    const favoritesToRestore: string[] = Array.isArray(data.favorites) ? data.favorites : [];

    // Save imported custom stickers to Firestore
    for (const sticker of customStickersToRestore) {
      if (sticker && sticker.id && sticker.title) {
        await saveCustomStickerToCloud(sticker, userId);
        stickersRestoredCount++;
      }
    }

    // Merge custom stickers into state
    const existingStickerIds = new Set(existingStickers.map((s) => s.id));
    const newStickersToAppend = customStickersToRestore.filter(
      (s) => s && s.id && !existingStickerIds.has(s.id)
    );
    const updatedStickers = [...newStickersToAppend, ...existingStickers];

    // Merge favorites
    const mergedFavsSet = new Set([...existingFavorites, ...favoritesToRestore]);
    const updatedFavorites = Array.from(mergedFavsSet);
    favoritesRestoredCount = favoritesToRestore.length;

    // Sync merged favorites to Firestore
    if (userId) {
      await syncFavoritesToCloud(userId, updatedFavorites);
    }

    return {
      success: true,
      stickersRestored: stickersRestoredCount,
      favoritesRestored: favoritesRestoredCount,
      updatedStickers,
      updatedFavorites,
      message: `Backup restaurado com sucesso! ${stickersRestoredCount} adesivo(s) e ${favoritesRestoredCount} favorito(s) sincronizados com o Firestore.`,
    };
  } catch (err: any) {
    console.error('Error restoring backup:', err);
    return {
      success: false,
      stickersRestored: 0,
      favoritesRestored: 0,
      updatedStickers: existingStickers,
      updatedFavorites: existingFavorites,
      message: err?.message || 'Falha ao processar arquivo de backup JSON.',
    };
  }
}

