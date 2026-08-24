-- The four scales were named for what a project was made of — craft, depth,
-- utility, impact. Two of them said the same thing twice (utility and impact
-- both asked "does this matter?") and none of them asked whether the thing is
-- actually finished, which is the question a visitor has first.
--
-- The scales are now design, engineering, value and maturity:
--   design       how strong the UI/UX is
--   engineering  how technically demanding or sophisticated it is
--   value        how useful it is, and how meaningful the problem it solves is
--   maturity     how complete, reliable, polished and real-world-ready it is
--
-- The first three are a rename of the scale that already asked that question,
-- so the stored numbers carry over unchanged. Maturity is not: it replaces
-- impact, which measured results rather than readiness. The numbers inherited
-- from impact are a starting point and want a pass by hand.

ALTER TABLE projects RENAME COLUMN score_craft   TO score_design;
ALTER TABLE projects RENAME COLUMN score_depth   TO score_engineering;
ALTER TABLE projects RENAME COLUMN score_utility TO score_value;
ALTER TABLE projects RENAME COLUMN score_impact  TO score_maturity;
