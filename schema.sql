-- Cloudflare D1 schema for oliweb.
--
-- This is a schema-only snapshot through migration 0002. It intentionally
-- excludes rows and Wrangler's internal tables. For a fresh local database,
-- run this as the complete bootstrap; do not replay migrations 0001-0002 on
-- top of a database initialized from this file:
--   pnpm exec wrangler d1 execute oliweb --local --file=./schema.sql
--
-- Future schema changes should be added as numbered files in migrations/ and
-- reflected here in the next snapshot.

CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  content_es  TEXT NOT NULL,
  content_en  TEXT NOT NULL,
  -- JSON-encoded array of image URLs (e.g. '["/a.png","/b.png"]')
  image_urls  TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id                    TEXT PRIMARY KEY,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  slug                  TEXT NOT NULL UNIQUE,
  name                  TEXT NOT NULL,
  -- stored as 0/1
  is_active             INTEGER,
  start_date            TEXT,
  end_date              TEXT,
  url                   TEXT,
  logo_url              TEXT,
  short_description_es  TEXT,
  short_description_en  TEXT,
  history_es            TEXT,
  history_en            TEXT,
  github_url            TEXT,
  -- ecommerce | marketplace | app | tool | brand. NULL means the row has not
  -- been described yet, and the portfolio leaves it out of the showcase.
  kind                  TEXT,
  -- 0-100, or NULL where the metric does not apply to this project. That is a
  -- different statement from a low score and the list draws it as one.
  score_craft           INTEGER,
  score_depth           INTEGER,
  score_utility         INTEGER,
  score_impact          INTEGER,
  -- JSON-encoded arrays of tool names, one per language
  stack_en              TEXT,
  stack_es              TEXT
);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);
