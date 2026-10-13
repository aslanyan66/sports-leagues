import { IMAGE_SIZES, type ImageSize } from '@/constants/api';

export const getBadgeImageUrl = (url: string, size: ImageSize): string =>
  `${url.replace(/\/+$/, '')}/${size}`;

export interface IBadgeImageSources {
  src: string;
  srcSet: string;
  /** Original image, tried if the resized one fails to load. */
  fallbackSrc: string;
}

/**
 * Resized image for normal screens, original for 2x (retina) screens: season badges usually
 * have no `/medium` version, and the original is always available.
 */
export const getBadgeImageSources = (url: string): IBadgeImageSources => {
  const small = getBadgeImageUrl(url, IMAGE_SIZES.small);

  return { src: small, srcSet: `${small} 1x, ${url} 2x`, fallbackSrc: url };
};
