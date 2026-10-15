import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { prepareLibrary } from '../lib/library.mjs';

// Build every effect route from the same cards used by the homepage.
export const catalog = prepareLibrary(readFileSync(resolve(process.cwd(), 'src/content/body.html'), 'utf8')).catalog;
