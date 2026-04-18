/**
 * Utility for merging Tailwind CSS class names conditionally.
 * Filters out falsy values and joins classes with spaces.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
