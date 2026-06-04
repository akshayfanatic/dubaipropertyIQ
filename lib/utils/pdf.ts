export function readableStreamToArrayBuffer(stream: NodeJS.ReadableStream): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer);
    });
    stream.on('error', reject);
  });
}
