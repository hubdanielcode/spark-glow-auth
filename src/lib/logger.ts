/**
 * Secure logging utility that only outputs detailed errors in development mode.
 * In production, sensitive error details are suppressed from the browser console.
 */
export const logError = (context: string, error: unknown) => {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
  // In production, we intentionally suppress detailed error output
  // to prevent leaking internal system details to attackers.
};
