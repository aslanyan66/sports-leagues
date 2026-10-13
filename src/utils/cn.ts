import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Joins class names and resolves Tailwind conflicts: cn('px-2', isWide && 'px-4') → 'px-4'. */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
