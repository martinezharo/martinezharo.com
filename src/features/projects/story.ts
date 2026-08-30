import type { Project } from './model';

// A story, read: its blocks, and the other projects it names.
//
// The stories are written as prose about the work, and the work refers to the
// rest of it: a shop names the tool that stocks it, a tool names the shop it
// was written for. Those names are already in the text, so the portfolio turns
// them into the way through rather than asking anyone to go back to the list
// and find them by hand.
//
// Some of them stop the prose to count something off — three ideas a project
// was built around — and are typed as a line each behind a dash, which is how
// anyone writes a list into a textarea. Those lines are a list, and the page is
// told so here: run together into a paragraph they read as one sentence that
// keeps restarting, which is what the admin panel's own text does not look like.
//
// The text is cut into runs instead of having anchors or markup written into
// it, so the page renders prose as prose, a name as an element and a list as a
// list. Nothing here builds markup, which is what keeps a story out of the
// document's structure however it was typed into the admin panel.

/** A run of a story's text: prose, or the name of the project it points at. */
export interface StorySegment {
  text: string;
  slug?: string;
}

/**
 * A piece of a story the page draws on its own: a paragraph, or the list the
 * prose broke off to make. A list keeps whether it was numbered, because a
 * story that counts three ideas off wrote the numbers itself and the page
 * should not have to repeat them as dashes.
 */
export type StoryBlock =
  | { kind: 'paragraph'; segments: StorySegment[] }
  | { kind: 'list'; ordered: boolean; items: StorySegment[][] };

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
 * One run of text, cut at the names it mentions. `linked` carries across the
 * whole story: only the first mention of a project becomes a link. A story
 * that says a name six times would otherwise draw six identical links, which
 * reads as decoration and leaves the text harder to follow than the plain
 * words it was made from.
 */
function cutAtNames(text: string, mentions: Mention[], linked: Set<string>): StorySegment[] {
  if (mentions.length === 0) return [{ text }];

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
 * The mark that opens a list item, as a list is typed rather than as a format
 * is specified: a dash, an asterisk or a bullet, or a number. The space after
 * it is what keeps a sentence that opens on a dash — or a year written as
 * `2019 - 2021` at the head of a line — out of the list.
 */
const ITEM_MARK = /^\s*(?:[-*•]|\d{1,3}[.)])\s+/;
const NUMBERED_MARK = /^\s*\d/;

/** The lines of a block, with the blank ones a stray keystroke left behind. */
function lines(block: string): string[] {
  return block.split('\n').filter((line) => line.trim() !== '');
}

/**
 * A block of the story, as the parts the page draws. One block is usually one
 * paragraph; a block whose lines are marked off is a list, and a block that
 * introduces its list on the first line — written without the blank line
 * between — is both, in the order it was written.
 *
 * A line inside a list that carries no mark of its own continues the item
 * above it. That is a wrapped sentence rather than a new point: text typed
 * into a textarea comes back with the breaks the writer put in it, and a
 * fragment promoted to an item of its own would be a list item with no
 * beginning.
 */
function readBlock(block: string, cut: (text: string) => StorySegment[]): StoryBlock[] {
  const blocks: StoryBlock[] = [];
  const prose: string[] = [];
  const items: string[] = [];
  let ordered = false;

  const flushProse = () => {
    if (prose.length === 0) return;
    blocks.push({ kind: 'paragraph', segments: cut(prose.join(' ')) });
    prose.length = 0;
  };

  for (const line of lines(block)) {
    const mark = ITEM_MARK.exec(line);

    if (mark) {
      flushProse();
      if (items.length === 0) ordered = NUMBERED_MARK.test(mark[0]);
      items.push(line.slice(mark[0].length).trim());
    } else if (items.length > 0) {
      items[items.length - 1] = `${items[items.length - 1]} ${line.trim()}`;
    } else {
      prose.push(line.trim());
    }
  }

  flushProse();
  if (items.length > 0) blocks.push({ kind: 'list', ordered, items: items.map(cut) });
  return blocks;
}

/**
 * A story as the page draws it: paragraphs and lists, each cut into the runs
 * that make them up — with the names of other projects marked with the slug of
 * the page they lead to.
 *
 * The project the story belongs to is left out: a page does not link to
 * itself, and its own name is the one its story says most often. Matching is
 * case-sensitive, because these are names rather than words: the portfolio has
 * projects whose name is an ordinary word in one of the two languages, and
 * lower-cased prose is not a mention of them.
 */
export function readStory(
  history: readonly string[],
  projects: readonly Project[],
  currentSlug: string,
): StoryBlock[] {
  const mentions = projects
    .filter((project) => project.slug !== currentSlug && project.name !== '')
    .map((project) => ({ name: project.name, slug: project.slug }))
    .sort((left, right) => right.name.length - left.name.length);

  const linked = new Set<string>();
  const cut = (text: string) => cutAtNames(text, mentions, linked);
  return history.flatMap((block) => readBlock(block, cut));
}
