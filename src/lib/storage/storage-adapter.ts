import { supabase } from '@/lib/db/supabase';

export interface UploadResult {
  url: string;
  storage_path: string;
  size_bytes: number;
  mime_type: 'image/jpeg' | 'image/png' | 'image/webp';
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export class StorageAdapter {
  validateFile(mimeType: string, sizeBytes: number): { valid: boolean; error?: string } {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return {
        valid: false,
        error: `Unsupported image format. Allowed formats: JPEG, PNG, WebP.`,
      };
    }
    if (sizeBytes > MAX_SIZE_BYTES) {
      return {
        valid: false,
        error: `Image size (${Math.round(sizeBytes / 1024 / 1024)}MB) exceeds maximum allowed limit of 5MB.`,
      };
    }
    return { valid: true };
  }

  async uploadPostImage(
    postId: string,
    fileBuffer: Buffer,
    mimeType: 'image/jpeg' | 'image/png' | 'image/webp',
    fileName = 'photo.jpg'
  ): Promise<UploadResult> {
    const validation = this.validateFile(mimeType, fileBuffer.length);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
    const cleanId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const storagePath = `posts/${postId}/${cleanId}.${ext}`;

    if (supabase) {
      const { data, error } = await supabase.storage
        .from('community-images')
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from('community-images')
          .getPublicUrl(storagePath);
        return {
          url: publicData.publicUrl,
          storage_path: storagePath,
          size_bytes: fileBuffer.length,
          mime_type: mimeType,
        };
      }
    }

    // Safe fallback URL representation
    const base64 = fileBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return {
      url: dataUrl,
      storage_path: storagePath,
      size_bytes: fileBuffer.length,
      mime_type: mimeType,
    };
  }
}

export const storageAdapter = new StorageAdapter();
