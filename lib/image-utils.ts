// Image optimization utilities
export interface CompressedImageResult {
  dataUrl: string;
  size: number;
  width: number;
  height: number;
}

export const compressImage = (
  file: File,
  maxWidth: number = 200,
  maxHeight: number = 200,
  quality: number = 0.8
): Promise<CompressedImageResult> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // Calculate compressed size (approximate)
      const size = Math.round((compressedDataUrl.length * 3) / 4);

      resolve({
        dataUrl: compressedDataUrl,
        size,
        width,
        height
      });

      // Cleanup
      canvas.remove();
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select a valid image file' };
  }

  // Check file size (max 10MB for original, will be compressed)
  if (file.size > 10 * 1024 * 1024) {
    return { isValid: false, error: 'Original image size must be less than 10MB' };
  }

  return { isValid: true };
};

// Debounced function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Imgur API integration
export interface ImgurUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  deleteHash?: string;
}

// Imgur Client ID for anonymous uploads (you can replace with your own)
const IMGUR_CLIENT_ID = 'YOUR_IMGUR_CLIENT_ID';

export const uploadToImgur = async (file: File): Promise<ImgurUploadResult> => {
  try {
    // Convert file to base64 for Imgur API
    const base64 = await fileToBase64(file);
    
    // Remove data:image/...;base64, prefix
    const imageData = base64.split(',')[1];
    
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageData,
        type: 'base64',
      }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      return {
        success: true,
        url: result.data.link,
        deleteHash: result.data.deletehash,
      };
    } else {
      return {
        success: false,
        error: result.data?.error || 'Failed to upload to Imgur',
      };
    }
  } catch (error) {
    console.error('Imgur upload error:', error);
    return {
      success: false,
      error: 'Failed to upload image. Please try again or use a direct URL.',
    };
  }
};

// Free image hosting with fallback to compressed storage
export const uploadImageFree = async (file: File): Promise<ImgurUploadResult> => {
  try {
    // First validate and compress the image
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }
    
    // Compress image to reasonable size
    const compressed = await compressImage(file, 800, 600, 0.8);
    
    // If compressed image is very small, just use it locally
    if (compressed.size < 30000) { // Under 30KB
      return {
        success: true,
        url: compressed.dataUrl,
      };
    }
    
    // For larger images, recommend using external hosting
    return {
      success: false,
      error: 'Image is too large for local storage. Please use a smaller image or upload to an image hosting service like Imgur and paste the URL.',
    };
  } catch (error) {
    console.error('Image processing error:', error);
    return {
      success: false,
      error: 'Failed to process image. Please try again with a different image.',
    };
  }
};



// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

// Validate URL format
export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    
    return validExtensions.some(ext => pathname.endsWith(ext)) || 
           url.includes('imgur.com') || 
           url.includes('imgbb.com') ||
           url.includes('i.postimg.cc') ||
           url.includes('ibb.co');
  } catch {
    return false;
  }
};

// Get image from URL for preview
export const loadImageFromUrl = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error('Failed to load image from URL'));
    img.src = url;
  });
}; 