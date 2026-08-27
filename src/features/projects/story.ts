import type { Project } from './model';

// The other projects a story names.
//
// The stories are written as prose about the work, and the work refers to the
// rest of it: a shop names the tool that stocks it, a tool names the shop it
// was written for. Those names are already in the text, so the portfolio turns
// them into the way through rather than asking anyone to go back to the list
// and find them by hand.
//
// The text is cut into runs instead of having anchors written into it, so the
// page renders prose as prose and a name as an element. Nothing here builds
// markup, which is what keeps a story out of the document's structure however
// it was typed into the admin panel.

/** A run of a story's text: prose, or the name of the project it points at. */
export interface StorySegment {
  text: string;
  slug?: string;
}

/** A name the story can be pointing at, and the page it belongs to. */
interface Mention {
  name: string;
  slug: string;
}

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * A name only counts when it stands on its own. Word boundaries are `\b`'s
 * job, except that `\b` is written in ASCII and half the portfolio is not:
 * it would break a name apart at its own accent. Letters and digits of any
 * script are what a name cannot be buried in.
 */
const WORD = /[\p{L}\p{N}]/u;

function standsAlone(text: string, start: number, end: number): boolean {
  return !WORD.test(text[start - 1] ?? '') && !WORD.test(text[end] ?? '');
}

/**
 * Whether the name sits inside an address rather than in the sentence. A story
 * that quotes `https://akin.example` is naming a place to go, and turning the
 * middle of it into a link to somewhere else would be a trap.
 */
function insideAddress(text: string, start: number): boolean {
  const before = text.slice(0, start);
  return /^(https?:\/\/|www\.)/.test(before.slice(before.search(/\S*$/)));
}

/**
 * One paragraph, cut at the names it mentions. `linked` carries across the
 * whole story: only the first mention of a project becomes a link. A story
 * that says a name six times would otherwise draw six identical links, which
 * reads as decoration and leaves the paragraph harder to follow than the plain
 * text it was made from.
 */
function splitParagraph(text: string, mentions: Mention[], linked: Set<string>): StorySegment[] {
  // The alternation takes the first branch that matches at a position, so the
  // longest names go in first: a project called "Akin" must not claim the head
  // of "Akin Studio" when both are on the site.
  const names = new RegExp(mentions.map((mention) => escapeForRegExp(mention.name)).join('|'), 'g');
  const segments: StorySegment[] = [];
  let cut = 0;

  for (const match of text.matchAll(names)) {
    const start = match.index;
    const end = start + match[0].length;
    const mention = mentions.find((candidate) => candidate.name === match[0]);
    if (!mention || linked.has(mention.slug)) continue;
    if (!standsAlone(text, start, end) || insideAddress(text, start)) continue;

    linked.add(mention.slug);
    if (start > cut) segments.push({ text: text.slice(cut, start) });
    segments.push({ text: match[0], slug: mention.slug });
    cut = end;
  }

  if (cut < text.length) segments.push({ text: text.slice(cut) });
  return segments;
}

/**
 * A story's paragraphs, each cut into the runs the page draws — with the names
 * of other projects marked with the slug of the page they lead to.
 *
 * The project the story belongs to is left out: a page does not link to
 * itself, and its own name is the one its story says most often. Matching is
 * case-sensitive, because these are names rather than words: the portfolio has
 * projects whose name is an ordinary word in one of the two languages, and
 * lower-cased prose is not a mention of them.
 */
export function linkProjectNames(
  history: readonly string[],
  projects: readonly Project[],
  currentSlug: string,
): StorySegment[][] {
  const mentions = projects
    .filter((project) => project.slug !== currentSlug && project.name !== '')
    .map((project) => ({ name: project.name, slug: project.slug }))
    .sort((left, right) => right.name.length - left.name.length);

  if (mentions.length === 0) return history.map((paragraph) => [{ text: paragraph }]);

  const linked = new Set<string>();
  return history.map((paragraph) => splitParagraph(paragraph, mentions, linked));
}
