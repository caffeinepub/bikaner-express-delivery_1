export async function fileToBytes(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(arrayBuffer));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function bytesToImageUrl(bytes: Uint8Array | number[], mimeType: string = 'image/jpeg'): string {
  // Convert to a plain Uint8Array with ArrayBuffer to satisfy TypeScript
  const uint8Array = bytes instanceof Uint8Array ? new Uint8Array(bytes) : new Uint8Array(bytes);
  const blob = new Blob([uint8Array], { type: mimeType });
  return URL.createObjectURL(blob);
}

export function revokeImageUrl(url: string) {
  URL.revokeObjectURL(url);
}
