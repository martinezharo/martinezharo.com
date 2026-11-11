-- The portfolio now speaks German as well. A project's description and story
-- are the only prose that lives in the database, and each language has its own
-- pair of columns (`short_description_es` and `short_description_en`, and
-- `history_es` and `history_en`), so German gets the same: one more column per
-- field, not a table of translations.
--
-- Both are nullable and stay NULL until someone writes the German. The site
-- reads them with a fallback — German, then English, then any other language
-- that has the text — so a project without a German version still shows, in
-- English, instead of going blank. That also makes this migration safe to
-- apply before the code that reads it is deployed.
ALTER TABLE projects ADD COLUMN short_description_de TEXT;
ALTER TABLE projects ADD COLUMN history_de TEXT;
