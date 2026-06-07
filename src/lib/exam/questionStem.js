/** Plain-text preview of a question stem for navigation lists. */
export function questionStemPreview(text, maxLength = 56) {
  if (!text) return 'Untitled question';

  const plain = String(text)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) return 'Untitled question';
  if (plain.length <= maxLength) return plain;

  return `${plain.slice(0, maxLength)}…`;
}
