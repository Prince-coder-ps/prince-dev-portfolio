/**
 * Returns a lighter version of an image URL without changing how the
 * rest of the app stores or uploads images.
 *
 * - Cloudinary URLs: injects f_auto (WebP/AVIF), q_auto and a max width, so the
 *   browser never downloads the original multi-MB upload.
 * - Bundled /legacy-assets PNG/JPG files: points to the pre-generated WebP copy.
 * - Anything else is returned untouched.
 */
export function optimizeImage(url, width = 800) {
  if (!url || typeof url !== 'string') return url;

  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // Skip if a transformation was already added.
    if (/\/upload\/[^/]*(f_auto|q_auto|w_\d+)/.test(url)) return url;
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }

  if (url.startsWith('/legacy-assets/')) {
    return url.replace(/\.(png|jpe?g)$/i, '.webp');
  }

  return url;
}
