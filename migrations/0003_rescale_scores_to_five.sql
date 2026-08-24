-- The ratings were stored 0-100 and drawn as five segments, which meant the
-- stored number carried a precision the portfolio never showed and nobody was
-- really judging in: the difference between 86 and 88 was invented at the point
-- of writing it down. The scale is now the one on the page.
--
-- The conversion is the rounding the site was already doing on the way out —
-- clamp(round(score / 20), 1, 5) — so every meter draws exactly what it drew
-- before this ran. The clamp is part of it: a score under 10 rounded to zero
-- segments, and zero segments is how "does not apply" is drawn. The site no
-- longer rounds anything; that step was deleted along with this scale.
--
-- This is not safe to replay — a second pass would rescale 1-5 down to 1 — but
-- migrations only run once, and this comment is here for whoever is tempted to
-- rerun it by hand.

UPDATE projects SET
  score_craft   = MAX(1, MIN(5, CAST(ROUND(score_craft   / 20.0) AS INTEGER))),
  score_depth   = MAX(1, MIN(5, CAST(ROUND(score_depth   / 20.0) AS INTEGER))),
  score_utility = MAX(1, MIN(5, CAST(ROUND(score_utility / 20.0) AS INTEGER))),
  score_impact  = MAX(1, MIN(5, CAST(ROUND(score_impact  / 20.0) AS INTEGER)));
