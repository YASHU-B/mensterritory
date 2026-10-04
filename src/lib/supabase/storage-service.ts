import { supabase, isSupabaseConfigured } from './client';

/**
 * Uploads a file directly to Supabase Storage bucket.
 * Falls back to Base64 Data URL if Supabase is not configured yet.
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

  // Sanitize filename and create unique path: [timestamp]-[clean-name]
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

      if (error) {
        console.warn(`Supabase Storage upload to "${bucket}" failed:`, error.message);
        // Fall through to Base64 fallback below
      } else if (data) {
        // Retrieve public URL from bucket
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Storage upload exception, using fallback:', err);
    }
  }

  // Fallback: Compress and convert file to web-friendly Base64 Data URL
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
