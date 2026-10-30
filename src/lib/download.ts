/** Turns free text into a safe, lowercase file-name stem, e.g. "Ayesha & Rohan" → "ayesha-rohan". */
export function toFileSlug(text: string, fallback = 'utsav'): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
}

/** Saves `contents` as a file in the browser without a server round trip. */
export function downloadTextFile(fileName: string, contents: string, mimeType: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
