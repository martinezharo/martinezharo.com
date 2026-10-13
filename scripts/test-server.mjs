import { readFileSync, writeFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';

// Keep the emitted Worker's relative asset paths, but replace every remote
// binding with local storage. The generated config remains inside ignored dist.
const configPath = 'dist/server/wrangler.test.json';
const config = JSON.parse(readFileSync('dist/server/wrangler.json', 'utf8'));
config.d1_databases = config.d1_databases.map((database) => ({ ...database, remote: false }));
// Cloudflare's published Turnstile test pair: a widget that always passes and a
// secret that accepts its dummy token. The secret is a test value, not a real
// one, so it can live here.
config.vars = {
  ...config.vars,
  TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
  TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
};
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
