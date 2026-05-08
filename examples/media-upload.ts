import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { OoopsStageClient } from '@ooopsstudio/stage-api';

const filePath = process.argv[2];
const baseUrl = process.env.STAGE_API_BASE_URL ?? 'http://stage.localhost:4275/api/stage/v1';
const token = process.env.STAGE_API_TOKEN ?? '';

if (!token) throw new Error('Set STAGE_API_TOKEN before running this example.');
if (!filePath) throw new Error('Usage: npm exec tsx examples/media-upload.ts ./image.png');

const fileName = path.basename(filePath);
const file = await readFile(filePath);
const mimeType = fileName.endsWith('.png') ? 'image/png' : fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? 'image/jpeg' : 'application/octet-stream';
const stage = new OoopsStageClient({ baseUrl, token });

const signed = await stage.media.signUpload<{
  ok: true;
  uploadUrl: string;
  objectKey: string;
  headers?: Record<string, string>;
}>({ fileName, mimeType, sizeBytes: file.byteLength });

const upload = await fetch(signed.uploadUrl, {
  method: 'PUT',
  headers: { 'content-type': mimeType, ...signed.headers },
  body: file
});
if (!upload.ok) throw new Error(`Upload failed with ${upload.status}`);

const completed = await stage.media.completeUpload<{
  ok: true;
  asset: { id: string; title?: string | null; url?: string | null };
}>({ fileName, objectKey: signed.objectKey, mimeType, sizeBytes: file.byteLength });

console.log(`Uploaded ${completed.asset.title ?? fileName}: ${completed.asset.id}`);

