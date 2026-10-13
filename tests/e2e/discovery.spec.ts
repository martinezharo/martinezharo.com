import { expect, test } from '@playwright/test';

const production = 'https://martinezharo.com';

test('robots advertises a sitemap of every public page and its translations', async ({ page, request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(robots.headers()['content-type']).toContain('text/plain');
  expect(await robots.text()).toContain(`Sitemap: ${production}/sitemap.xml`);

  const response = await request.get('/sitemap.xml');
  expect(response.headers()['content-type']).toContain('application/xml');
  const document = await response.text();
  await page.goto('/stack');
  const entries = await page.evaluate((document) => {
    const xml = new DOMParser().parseFromString(document, 'application/xml');
    if (xml.getElementsByTagName('parsererror').length) throw new Error('Invalid sitemap XML');
    return [...xml.getElementsByTagName('url')].map((node) => ({
      url: node.getElementsByTagName('loc')[0]?.textContent,
      alternates: [...node.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')].map((link) => ({
        language: link.getAttribute('hreflang'), url: link.getAttribute('href'),
      })),
    }));
  }, document);
  const expected = ['/', '/stack', '/services', '/projects/fewya', '/projects/rankmaker', '/projects/kenobismo', '/projects/unsafe'];
  const paths = expected.flatMap((path) => [path, path === '/' ? '/es' : `/es${path}`]);
  expect(entries.map((entry) => entry.url).sort()).toEqual(paths.map((path) => `${production}${path}`).sort());
  for (const entry of entries) {
    expect(entry.alternates.map((alternate) => alternate.language)).toEqual(['en', 'es', 'x-default']);
    expect(entry.alternates.map((alternate) => alternate.url)).toContain(entry.url);
  }
  expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
  expect(document).not.toContain('<lastmod>');
});

test('agents can discover and fetch the same profile, stack and project stories', async ({ request }) => {
  const index = await request.get('/llms.txt', { headers: { 'Accept-Language': 'es' } });
  expect(index.status()).toBe(200);
  const body = await index.text();
  expect(body).toContain('# Oliver Martínez Haro');
  expect(body).toContain(`${production}/es/projects/fewya.md`);
  expect(body).not.toContain('/hidden');
  const urls = [...body.matchAll(/\]\(<(https:\/\/martinezharo\.com\/[^>]+\.md)>\)/g)].map((match) => match[1]);
  expect(urls.length).toBe(14);
  for (const url of urls) {
    const response = await request.get(new URL(url).pathname);
    expect(response.status(), url).toBe(200);
    expect(response.headers()['content-type']).toContain('text/markdown');
    expect(await response.text(), url).toContain('Source: https://martinezharo.com/');
  }
  const english = await request.get('/projects/fewya.md');
  expect(await english.text()).toContain('Before starting Octopus Control');
  const spanish = await request.get('/es/projects/fewya.md');
  expect(await spanish.text()).toContain('Antes de empezar con Octopus Control');
  const fallback = await request.get('/es/projects/unsafe.md');
  expect(await fallback.text()).toContain('First paragraph.');
  for (const path of ['/projects/hidden.md', '/projects/absent.md', '/fr/index.md', '/anything.md']) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
    expect(response.headers()['cache-control'] ?? '').not.toContain('public');
  }
});

test('HEAD and query variants cannot poison discovery caches with an empty body', async ({ request }) => {
  for (const path of ['/sitemap.xml', '/llms.txt', '/es/index.md', '/stack.md']) {
    const head = await request.head(path);
    expect(head.status(), path).toBe(200);
    expect(await head.text()).toBe('');
    const response = await request.get(`${path}?tracking=example`);
    expect(response.status(), path).toBe(200);
    expect((await response.text()).length).toBeGreaterThan(100);
    expect(response.headers()['cache-control']).toBe('public, max-age=300, s-maxage=3600');
    expect(await (await request.get(path)).text()).toBe(await response.text());
  }
});

test('HTML publishes linked data and Markdown discovery safely, including after navigation', async ({ page }) => {
  await page.goto('/');
  const data = async () => JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? '{}');
  let graph = (await data())['@graph'];
  expect(graph.find((node: { '@type': string }) => node['@type'] === 'ProfilePage').mainEntity['@id']).toBe(`${production}/#person`);
  await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveAttribute('href', `${production}/index.md`);
  await expect(page.locator('link[rel="describedby"]')).toHaveAttribute('href', `${production}/llms.txt`);

  await page.locator('a.project[href="/projects/fewya"]').click();
  await expect(page.locator('.story')).toBeVisible();
  graph = (await data())['@graph'];
  expect(graph.find((node: { '@type': string }) => node['@type'] === 'CreativeWork').name).toBe('Fewya');
  await expect(page.locator('link[type="text/markdown"]')).toHaveAttribute('href', `${production}/projects/fewya.md`);

  await page.goto('/es/projects/fewya');
  graph = (await data())['@graph'];
  const work = graph.find((node: { '@type': string }) => node['@type'] === 'CreativeWork');
  expect(work.inLanguage).toBe('es');
  expect(work.description).toContain('Un marketplace');

  await page.goto('/projects/unsafe');
  await expect(page.locator('#injected')).toHaveCount(0);
  graph = (await data())['@graph'];
  expect(graph.find((node: { '@type': string }) => node['@type'] === 'CreativeWork').description).toContain('</script>');
});

test('share cards use the profile image, or the project\'s own once it has one', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/home\.png$/);

  await page.goto('/projects/rankmaker');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/projects\/rankmaker\.png$/);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /\/og\/projects\/rankmaker\.png$/);

  await page.goto('/projects/fewya');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/home\.png$/);
});
