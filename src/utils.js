import path from 'path';
import { fileURLToPath } from 'url';

export function getDirname (metaUrl) {
  return path.dirname(fileURLToPath(metaUrl));
}
