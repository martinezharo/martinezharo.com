-- Icarus's story explains its name: it comes from the ICS file format, and the
-- letters that spell ICS are the ones set in bold inside the name. It was
-- written `**IC**ru**S**`, which loses the "a" and so spells "ICruS" — in all
-- three languages. The corrected form is `**IC**aru**S**`, which reads ICaruS.
--
-- REPLACE only touches the faulty spelling, so a story that someone has already
-- corrected by hand is left exactly as it is.
UPDATE projects SET
  history_en = REPLACE(history_en, '**IC**ru**S**', '**IC**aru**S**'),
  history_es = REPLACE(history_es, '**IC**ru**S**', '**IC**aru**S**'),
  history_de = REPLACE(history_de, '**IC**ru**S**', '**IC**aru**S**')
WHERE slug = 'icarus';
