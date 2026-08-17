-- Keep the source repository separate from the project's public website URL.
ALTER TABLE projects ADD COLUMN github_url TEXT;

UPDATE projects
SET github_url = 'https://github.com/martinezharo/fewya'
WHERE slug = 'fewya';

UPDATE projects
SET github_url = 'https://github.com/martinezharo/klipcode'
WHERE slug = 'klipcode';

UPDATE projects
SET github_url = 'https://github.com/martinezharo/oliverp'
WHERE slug = 'oliverp';

UPDATE projects
SET github_url = 'https://github.com/martinezharo/goal-partner'
WHERE slug = 'goal-partner';

UPDATE projects
SET github_url = 'https://github.com/martinezharo/rankmaker'
WHERE slug = 'rankmaker';

UPDATE projects
SET github_url = 'https://github.com/martinezharo/octopus-control'
WHERE slug = 'octopus-control';

-- These projects have no matching GitHub repository.
UPDATE projects
SET github_url = NULL
WHERE slug IN ('elitebara', 'kenobismo');
