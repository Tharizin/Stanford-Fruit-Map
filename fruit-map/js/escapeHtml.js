// Escapes text before it's interpolated into an innerHTML template string,
// whether as element content or inside a quoted attribute. Every string
// that ends up in the DOM this way ultimately traces back to a database
// row, and several of those tables (plants, photo_submissions) accept
// public, unauthenticated inserts — so without this, a submitted common
// name, note, or photographer name containing HTML/script would execute
// in whoever's browser renders it, including an admin's while reviewing
// the queue.
export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
