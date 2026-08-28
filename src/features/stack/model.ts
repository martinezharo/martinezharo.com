/**
 * The stack, as one ordered list of categories.
 *
 * A category is a question ("what do I write it in") and its answer is one or
 * two tools. What the category is called is copy and lives in the i18n bundle
 * under the same key; what a tool is called is its own name and is never
 * translated, so it lives here beside its mark.
 *
 * The order is the order it is read in, and it is not alphabetical: it runs
 * from what the software is made of down to what I am sitting in front of
 * while I make it. `endsGroup` marks where one of those runs hands over to the
 * next, which the list draws as a stronger rule rather than as a subheading.
 */

export const CATEGORY_KEYS = [
  'languages',
  'frameworks',
  'uiLibraries',
  'cssFramework',
  'backendPlatform',
  'deploymentPlatform',
  'packageManager',
  'buildTool',
  'testing',
  'ciCd',
  'versionControl',
  'codeHosting',
  'codeEditor',
  'devEnvironment',
  'shell',
  'aiAgents',
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export interface StackTool {
  /** What the tool calls itself, in either language. */
  name: string;
  /** Its mark, from `public/logos`. See the README there for where each came from. */
  logo: string;
}

export interface StackCategory {
  key: CategoryKey;
  tools: StackTool[];
  /** Last category of a run. The rule under it is drawn at `--line-strong`. */
  endsGroup?: true;
}

const tool = (name: string, slug: string): StackTool => ({ name, logo: `/logos/${slug}.svg` });

export const STACK: StackCategory[] = [
  { key: 'languages', tools: [tool('TypeScript', 'typescript'), tool('JavaScript', 'javascript')] },
  { key: 'frameworks', tools: [tool('Next.js', 'nextjs'), tool('Astro', 'astro')] },
  { key: 'uiLibraries', tools: [tool('React', 'react'), tool('Preact', 'preact')] },
  { key: 'cssFramework', tools: [tool('Tailwind CSS', 'tailwind-css')] },
  { key: 'backendPlatform', tools: [tool('Convex', 'convex')], endsGroup: true },

  { key: 'deploymentPlatform', tools: [tool('Cloudflare Workers', 'cloudflare-workers')], endsGroup: true },

  { key: 'packageManager', tools: [tool('pnpm', 'pnpm')] },
  { key: 'buildTool', tools: [tool('Vite', 'vite')] },
  { key: 'testing', tools: [tool('Vitest', 'vitest'), tool('Playwright', 'playwright')] },
  { key: 'ciCd', tools: [tool('GitHub Actions', 'github-actions')], endsGroup: true },

  { key: 'versionControl', tools: [tool('Git', 'git')] },
  { key: 'codeHosting', tools: [tool('GitHub', 'github')], endsGroup: true },

  { key: 'codeEditor', tools: [tool('VS Code', 'vs-code')] },
  { key: 'devEnvironment', tools: [tool('WSL', 'wsl')] },
  { key: 'shell', tools: [tool('Bash', 'bash')], endsGroup: true },

  { key: 'aiAgents', tools: [tool('Claude Code', 'claude-code'), tool('Codex', 'codex')] },
];

/** What the head of the section counts. Derived so it cannot drift from the list. */
export const TOOL_COUNT = STACK.reduce((total, category) => total + category.tools.length, 0);
