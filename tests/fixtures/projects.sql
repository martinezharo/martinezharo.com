-- Synthetic local fixtures; this file must only run through --local.
DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_active INTEGER,
  start_date TEXT,
  end_date TEXT,
  url TEXT,
  logo_url TEXT,
  kind TEXT,
  score_design INTEGER,
  score_engineering INTEGER,
  score_impact INTEGER,
  score_maturity INTEGER,
  stack TEXT,
  short_description_en TEXT,
  short_description_es TEXT,
  history_en TEXT,
  history_es TEXT,
  github_url TEXT
);
INSERT INTO projects VALUES
('fewya', 'Fewya', 1, '2020-01-01', NULL, 'https://example.com/fewya', '/icon.svg', 'marketplace', 5, 5, 5, 5, '["TypeScript","React"]',
 'A marketplace for new products from professional sellers.',
 'Un marketplace especializado en productos nuevos de vendedores profesionales.',
 'Before starting Octopus Control, I built this marketplace. This is synthetic test content.',
 'Antes de empezar con Octopus Control, construí este marketplace. Synthetic test content.', NULL),
('rankmaker', 'Rankmaker', 0, '2023-01-01', '2024-01-01', 'https://example.com/rankmaker', '/icon.svg', 'app', 4, 4, 4, 4, '["Astro","Cloudflare Workers"]',
 'Build and share rankings.', 'Crea y comparte rankings.', 'A synthetic project story.', 'Synthetic translated story.', 'https://github.com/example/rankmaker'),
('kenobismo', 'Kenobismo', 0, '2018-01-01', '2019-01-01', NULL, '/icon.svg', 'brand', NULL, 3, 4, 3, '[]',
 'A test brand without an interface.', 'Synthetic brand description.', NULL, NULL, NULL),
('unsafe', 'Markup < & "quotes"', 1, '2024-01-01', NULL, NULL, '/icon.svg', 'app', 1, 1, 1, 1, '[]',
 'Literal </script><script id="injected">bad</script> & "quotes".', '',
 'First paragraph.

Second paragraph.', NULL, NULL),
('hidden', 'Incomplete project', 1, NULL, NULL, NULL, '/icon.svg', NULL, NULL, NULL, NULL, NULL, '[]',
 'This row must never be published.', NULL, NULL, NULL, NULL);
