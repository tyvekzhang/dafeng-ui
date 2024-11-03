export function extractFilename(disposition: string | undefined): string | null {
  if (!disposition) return null;

  const filenameMatch = disposition.split(/;(.+)/)[1]?.split(/=(.+)/)[1];
  if (!filenameMatch) return null;

  let filename = filenameMatch;
  if (filename.toLowerCase().startsWith("utf-8''")) {
    filename = decodeURIComponent(filename.replace("utf-8''", ''));
  } else {
    filename = filename.replace(/['"]/g, '');
  }
  return filename;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const binaryData = [];
  binaryData.push(blob);
  const url = window.URL.createObjectURL(
    new Blob(binaryData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
