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
  /** The tool owner's canonical product or documentation page. */
  url: string;
}

export interface StackCategory {
  key: CategoryKey;
  tools: StackTool[];
  /** Last category of a run. The rule under it is drawn at `--line-strong`. */
  endsGroup?: true;
}

const tool = (name: string, slug: string, url: string): StackTool => ({
  name,
  logo: `/logos/${slug}.svg`,
  url,
});

export const STACK: StackCategory[] = [
  {
    key: 'languages',
    tools: [
      tool('TypeScript', 'typescript', 'https://www.typescriptlang.org/'),
      tool('JavaScript', 'javascript', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'),
    ],
  },
  {
    key: 'frameworks',
    tools: [tool('Next.js', 'nextjs', 'https://nextjs.org/'), tool('Astro', 'astro', 'https://astro.build/')],
  },
  {
    key: 'uiLibraries',
    tools: [tool('React', 'react', 'https://react.dev/'), tool('Preact', 'preact', 'https://preactjs.com/')],
  },
  { key: 'cssFramework', tools: [tool('Tailwind CSS', 'tailwind-css', 'https://tailwindcss.com/')] },
  { key: 'backendPlatform', tools: [tool('Convex', 'convex', 'https://www.convex.dev/')], endsGroup: true },

  {
    key: 'deploymentPlatform',
    tools: [tool('Cloudflare Workers', 'cloudflare-workers', 'https://workers.cloudflare.com/')],
    endsGroup: true,
  },

  { key: 'packageManager', tools: [tool('pnpm', 'pnpm', 'https://pnpm.io/')] },
  { key: 'buildTool', tools: [tool('Vite', 'vite', 'https://vite.dev/')] },
  {
    key: 'testing',
    tools: [tool('Vitest', 'vitest', 'https://vitest.dev/'), tool('Playwright', 'playwright', 'https://playwright.dev/')],
  },
  { key: 'ciCd', tools: [tool('GitHub Actions', 'github-actions', 'https://github.com/features/actions')], endsGroup: true },

  { key: 'versionControl', tools: [tool('Git', 'git', 'https://git-scm.com/')] },
  { key: 'codeHosting', tools: [tool('GitHub', 'github', 'https://github.com/')], endsGroup: true },

  { key: 'codeEditor', tools: [tool('VS Code', 'vs-code', 'https://code.visualstudio.com/')] },
  { key: 'devEnvironment', tools: [tool('WSL', 'wsl', 'https://learn.microsoft.com/windows/wsl/')] },
  { key: 'shell', tools: [tool('Bash', 'bash', 'https://www.gnu.org/software/bash/')], endsGroup: true },

  {
    key: 'aiAgents',
    tools: [
      tool('Claude Code', 'claude-code', 'https://www.anthropic.com/claude-code'),
      tool('Codex', 'codex', 'https://openai.com/codex/'),
    ],
  },
];

/** What the head of the section counts. Derived so it cannot drift from the list. */
export const TOOL_COUNT = STACK.reduce((total, category) => total + category.tools.length, 0);
