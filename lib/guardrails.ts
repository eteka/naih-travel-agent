/**
 * Simple helper to sanitise text for safe display by escaping HTML entities.
 * This is a minimal guardrail; more sophisticated checks could be added.
 */
export function sanitizeText(text: string): string {
  return text.replace(/[<>&]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      default:
        return c;
    }
  });
}

/**
 * Returns the standard advisory text used throughout the application.
 */
export function advisoryText(): string {
  return 'Advisory only; verify policies and prices before purchase.';
}
