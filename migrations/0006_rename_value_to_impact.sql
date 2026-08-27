-- Value described how useful a project could be. Impact describes how much
-- real-world benefit it has actually delivered, balancing the number of people
-- reached with how meaningfully the project helped them.
--
-- The existing ratings are retained as a starting point and should be reviewed
-- by hand against the outcome-based definition.

ALTER TABLE projects RENAME COLUMN score_value TO score_impact;
