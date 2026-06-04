export function pdfDownloadFileName(name: string, suffix = 'report') {
  return `${
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'download'
  }-${suffix}.pdf`;
}

export function getResponseDownloadFileName(response: Response, fallbackName: string) {
  const disposition = response.headers.get('content-disposition');
  const match = disposition?.match(/filename="([^"]+)"/);

  return match?.[1] || pdfDownloadFileName(fallbackName);
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
