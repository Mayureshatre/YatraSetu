"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storageAdapter = exports.StorageAdapter = void 0;
var _supabase = require("@/lib/db/supabase");
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

class StorageAdapter {
  validateFile(mimeType, sizeBytes) {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return {
        valid: false,
        error: `Unsupported image format. Allowed formats: JPEG, PNG, WebP.`
      };
    }
    if (sizeBytes > MAX_SIZE_BYTES) {
      return {
        valid: false,
        error: `Image size (${Math.round(sizeBytes / 1024 / 1024)}MB) exceeds maximum allowed limit of 5MB.`
      };
    }
    return {
      valid: true
    };
  }
  async uploadPostImage(postId, fileBuffer, mimeType, fileName = 'photo.jpg') {
    const validation = this.validateFile(mimeType, fileBuffer.length);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
    const cleanId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const storagePath = `posts/${postId}/${cleanId}.${ext}`;
    if (_supabase.supabase) {
      const {
        data,
        error
      } = await _supabase.supabase.storage.from('community-images').upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: false
      });
      if (!error && data) {
        const {
          data: publicData
        } = _supabase.supabase.storage.from('community-images').getPublicUrl(storagePath);
        return {
          url: publicData.publicUrl,
          storage_path: storagePath,
          size_bytes: fileBuffer.length,
          mime_type: mimeType
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
      mime_type: mimeType
    };
  }
}
exports.StorageAdapter = StorageAdapter;
const storageAdapter = new StorageAdapter();
exports.storageAdapter = storageAdapter;