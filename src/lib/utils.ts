import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple CSS class values into a single string, resolving Tailwind CSS conflicts.
 *
 * Combines `clsx` for conditional class joining with `twMerge` for intelligent
 * Tailwind CSS class deduplication. Later classes take precedence over earlier ones.
 *
 * @param inputs - Class values of any type accepted by `clsx` (strings, arrays, objects, etc.)
 * @returns A single merged class string
 *
 * @example
 * cn('px-4 py-2', 'px-6')       // => 'py-2 px-6'
 * cn({ 'bg-red-500': true })    // => 'bg-red-500'
 * cn(['text-sm', null, 'font-bold']) // => 'text-sm font-bold'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
