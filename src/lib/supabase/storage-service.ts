import { supabase, isSupabaseConfigured } from './client';

/**
 * Uploads a file securely to cloud storage.
 * Uses server-side upload route first to prevent CORS, RLS failures, and avoid exposing database details.
 * 
 * @param file - The file to upload (Image file from <input type="file" />)
 * @param bucket - The storage bucket name ('product-images', 'banners', 'categories')
 * @returns Promise<string> - The public URL or Data URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: 'product-images' | 'banners' | 'categories' = 'product-images'
): Promise<string> {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  // 1. Try server-side upload API route (secure service_role, no client RLS or CORS issues)
  if (typeof window !== 'undefined') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          return json.url;
        }
      }
    } catch {
      // Fall through to direct or compressed fallback
    }
  }

  // 2. Direct client upload fallback
  const cleanName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-');
  const filePath = `${Date.now()}-${cleanName}`;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch {
      // Fall through
    }
  }

  // 3. Client-side compression fallback
  return compressImageToDataUrl(file);
}

function compressImageToDataUrl(file: File, maxWidth = 1000, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
