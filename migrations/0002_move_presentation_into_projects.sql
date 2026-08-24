-- How the portfolio talks about a project used to live in the site's source,
-- in src/data/project-presentation.ts, keyed by slug. That split meant a
-- project could be created in the admin panel and still not appear on the site
-- until someone edited a TypeScript file and redeployed. These columns close
-- that gap: a project is now one row, editable in one place.
--
-- `hours` is not carried over. It was on the presentation record but no page
-- ever drew it.

-- One of: ecommerce, marketplace, app, tool, brand. NULL marks a row the site
-- cannot draw yet — the same state a project had when nobody had written its
-- presentation record — so the showcase leaves it out rather than inventing a
-- type for it.
ALTER TABLE projects ADD COLUMN kind TEXT;

-- 0-100, or NULL where the metric does not apply to the project. NULL is a
-- deliberate value here, not a missing one: a brand with no interface of its
-- own is not judged on craft, and the list draws that differently from a low
-- score. `kind` is what says whether a row has been described at all.
ALTER TABLE projects ADD COLUMN score_craft INTEGER;
ALTER TABLE projects ADD COLUMN score_depth INTEGER;
ALTER TABLE projects ADD COLUMN score_utility INTEGER;
ALTER TABLE projects ADD COLUMN score_impact INTEGER;

-- JSON-encoded arrays of tool names, one per language, as posts.image_urls
-- already does it. Two columns rather than one because the tools are named in
-- the language of the page: 'Content' is 'Contenido'.
ALTER TABLE projects ADD COLUMN stack_en TEXT;
ALTER TABLE projects ADD COLUMN stack_es TEXT;

UPDATE projects SET
  kind = 'ecommerce',
  score_craft = 88, score_depth = 82, score_utility = 94, score_impact = 97,
  stack_en = '["Astro","Workers","D1","Stripe"]',
  stack_es = '["Astro","Workers","D1","Stripe"]'
WHERE slug = 'octopus-control';

UPDATE projects SET
  kind = 'marketplace',
  score_craft = 92, score_depth = 95, score_utility = 86, score_impact = 61,
  stack_en = '["Astro","Workers","D1","R2","Queues"]',
  stack_es = '["Astro","Workers","D1","R2","Queues"]'
WHERE slug = 'fewya';

UPDATE projects SET
  kind = 'app',
  score_craft = 94, score_depth = 74, score_utility = 88, score_impact = 48,
  stack_en = '["React","IndexedDB","Workers"]',
  stack_es = '["React","IndexedDB","Workers"]'
WHERE slug = 'klipcode';

UPDATE projects SET
  kind = 'app',
  score_craft = 86, score_depth = 79, score_utility = 81, score_impact = 72,
  stack_en = '["Astro","Durable Objects","D1"]',
  stack_es = '["Astro","Durable Objects","D1"]'
WHERE slug = 'rankmaker';

UPDATE projects SET
  kind = 'tool',
  score_craft = 71, score_depth = 90, score_utility = 96, score_impact = 68,
  stack_en = '["React","Workers","D1","Hyperdrive"]',
  stack_es = '["React","Workers","D1","Hyperdrive"]'
WHERE slug = 'oliverp';

UPDATE projects SET
  kind = 'app',
  score_craft = 74, score_depth = 66, score_utility = 42, score_impact = 21,
  stack_en = '["Astro","Workers","KV"]',
  stack_es = '["Astro","Workers","KV"]'
WHERE slug = 'goal-partner';

UPDATE projects SET
  kind = 'ecommerce',
  score_craft = 63, score_depth = 48, score_utility = 55, score_impact = 34,
  stack_en = '["Shopify","Liquid"]',
  stack_es = '["Shopify","Liquid"]'
WHERE slug = 'elitebara';

-- Kenobismo has no interface of its own to judge: the work is content and
-- community, so craft stays NULL.
UPDATE projects SET
  kind = 'brand',
  score_craft = NULL, score_depth = 22, score_utility = 60, score_impact = 77,
  stack_en = '["Content","Community"]',
  stack_es = '["Contenido","Comunidad"]'
WHERE slug = 'kenobismo';
