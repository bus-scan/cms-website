/**
 * Utility function for conditional className concatenation
 * Combines multiple className values into a single string
 */
export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}
