-- The stack was stored once per language, like every other piece of prose on
-- the row. It is not prose: it is a list of tool names, and a tool is called
-- the same thing in both languages — "Astro" is "Astro". The second column
-- only ever held a copy of the first, and the admin panel asked for the list
-- twice to fill it.
--
-- One column now. The value kept is the English one, which is where the list
-- was actually maintained; the Spanish one is used only for a row that never
-- got an English stack.

ALTER TABLE projects ADD COLUMN stack TEXT;

UPDATE projects SET stack = COALESCE(NULLIF(stack_en, ''), NULLIF(stack_es, ''));

ALTER TABLE projects DROP COLUMN stack_en;
ALTER TABLE projects DROP COLUMN stack_es;
