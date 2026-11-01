import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * Repository hygiene: cheap structural checks that back up the lint rules with
 * a test anyone can read. Scans every TypeScript file in src/, server/ and shared/.
 */

const ROOT = join(import.meta.dirname, '..');
const SOURCE_DIRS = ['src', 'server', 'shared'];
const MAX_FILE_LINES = 300;

/** Static content tables (seed data, demo copy): data, not logic. */
const DATA_FILES = [/^src\/data\//, /^shared\/demo\/(planContent|themeLibrary)\.ts$/];
/** The only modules allowed to write to the console. */
const LOGGERS = new Set(['src/lib/logger.ts', 'server/lib/logger.ts']);

interface SourceFile {
  path: string;
  text: string;
}

function listSources(dir: string): string[] {
  return readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listSources(path);
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

const sources: SourceFile[] = SOURCE_DIRS.flatMap(listSources).map((path) => ({
  path: relative(ROOT, join(ROOT, path)).split(sep).join('/'),
  text: readFileSync(join(ROOT, path), 'utf8'),
}));

/** Lines of `file` matching `pattern`, as `path:line` entries for a readable failure. */
function findAll(files: readonly SourceFile[], pattern: RegExp): string[] {
  return files.flatMap((file) =>
    file.text.split('\n').flatMap((line, index) => (pattern.test(line) ? [`${file.path}:${String(index + 1)}`] : [])),
  );
}

describe('source hygiene', () => {
  it('scans a realistic number of files', () => {
    expect(sources.length).toBeGreaterThan(100);
  });

  it(`keeps every non-data source file at or under ${String(MAX_FILE_LINES)} lines`, () => {
    const oversized = sources
      .filter((file) => !DATA_FILES.some((pattern) => pattern.test(file.path)))
      .filter((file) => file.text.split('\n').length > MAX_FILE_LINES)
      .map((file) => file.path);
    expect(oversized).toEqual([]);
  });

  it('never uses the any type', () => {
    expect(findAll(sources, /(:\s*any\b|\bas any\b|<any>|\bany\[\])/)).toEqual([]);
  });

  it('never suppresses the type checker', () => {
    expect(findAll(sources, /@ts-(ignore|nocheck)/)).toEqual([]);
  });

  it('never injects raw HTML', () => {
    expect(findAll(sources, /dangerouslySetInnerHTML/)).toEqual([]);
  });

  it('only writes to the console from the loggers', () => {
    const nonLoggers = sources.filter((file) => !LOGGERS.has(file.path));
    expect(findAll(nonLoggers, /\bconsole\./)).toEqual([]);
  });

  it('contains nothing shaped like an API key or secret', () => {
    const keyShapes = [
      /AIza[0-9A-Za-z_-]{35}/, // Google API key
      /\bsk-[A-Za-z0-9_-]{20,}/, // OpenAI/Anthropic-style secret key
      /\b(api[_-]?key|secret|token|password)\s*[:=]\s*['"][A-Za-z0-9_\-+/]{16,}['"]/i, // hard-coded credential
    ];
    const hits = keyShapes.flatMap((pattern) => findAll(sources, pattern));
    expect(hits).toEqual([]);
  });
});
