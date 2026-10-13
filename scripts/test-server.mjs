import { readFileSync, writeFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';

// Keep the emitted Worker's relative asset paths, but replace every remote
// binding with local storage. The generated config remains inside ignored dist.
const configPath = 'dist/server/wrangler.test.json';
const config = JSON.parse(readFileSync('dist/server/wrangler.json', 'utf8'));
config.d1_databases = config.d1_databases.map((database) => ({ ...database, remote: false }));
writeFileSync(configPath, JSON.stringify(config));
const storage = '.wrangler/test-state';
const seed = spawnSync('pnpm', [
  'exec', 'wrangler', 'd1', 'execute', 'DB', '--local', '--config', configPath,
  '--persist-to', storage, '--file', 'tests/fixtures/projects.sql',
], { stdio: 'inherit' });
if (seed.status !== 0) process.exit(seed.status ?? 1);

const server = spawn('pnpm', [
  'exec', 'wrangler', 'dev', '--config', configPath, '--local',
  '--persist-to', storage, '--port', process.env.PREVIEW_PORT ?? '4399',
], { stdio: 'inherit' });
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.kill(signal));
}
server.on('exit', (code) => process.exit(code ?? 1));
