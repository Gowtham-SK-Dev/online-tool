// Types for responsive image sizes
export type ResponsiveImageSizes = {
  mobile?: string
  tablet?: string
  desktop?: string
  default: string
}

/**
 * Generate responsive image sizes string for the Next.js Image component
 * @param sizes Responsive image sizes configuration
 * @returns A sizes string for the Next.js Image component
 */
export function getResponsiveSizes(sizes: ResponsiveImageSizes): string {
  const { mobile = "100vw", tablet = "100vw", desktop = "100vw", default: defaultSize } = sizes

  return `
    (max-width: 640px) ${mobile}, 
    (max-width: 1024px) ${tablet}, 
    (min-width: 1025px) ${desktop}, 
    ${defaultSize}
  `
    .trim()
    .replace(/\s+/g, " ")
}

/**
 * Image optimization guidelines
 *
 * 1. Always use Next.js Image component for automatic optimization
 * 2. Use WebP or AVIF formats when possible
 * 3. Implement lazy loading for images below the fold
 * 4. Provide proper width and height to prevent layout shifts
 * 5. Use responsive sizes for different viewports
 * 6. Add descriptive alt text for accessibility
 *
 * Example usage:
 *
 * import Image from 'next/image';
 * import { getResponsiveSizes } from '@/utils/image-optimization';
 *
 * <Image
 *   src="/path/to/image.webp"
 *   alt="Descriptive alt text"
 *   width={800}
 *   height={600}
 *   sizes={getResponsiveSizes({
 *     mobile: '100vw',
 *     tablet: '50vw',
 *     desktop: '33vw',
 *     default: '800px'
 *   })}
 *   priority={isAboveTheFold}
 *   quality={80}
 * />
 */

// Image quality presets
export const IMAGE_QUALITY = {
  LOW: 60,
  MEDIUM: 75,
  HIGH: 85,
  MAXIMUM: 100,
}

// Common image dimensions
export const IMAGE_DIMENSIONS = {
  THUMBNAIL: { width: 150, height: 150 },
  SMALL: { width: 300, height: 200 },
  MEDIUM: { width: 600, height: 400 },
  LARGE: { width: 1200, height: 800 },
  HERO: { width: 1920, height: 1080 },
}
