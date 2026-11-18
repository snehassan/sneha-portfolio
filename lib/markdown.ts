/**
 * A small, dependency-free Markdown renderer for blog posts.
 * Pure (no fs), so the admin editor's live preview can use it in the browser too.
 *
 * Supports: # headings, paragraphs, **bold**, *italic*, `code`, ~~strike~~,
 * [links](url), ![images](url "caption"), > quotes, - / 1. lists,
 * ``` fenced code ```, | tables |, --- rules, and line breaks.
 * Raw HTML is escaped, never passed through.
 */

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeUrl(u: string) {
  const t = u.trim();
  if (/^(https?:|mailto:|\/|#)/i.test(t)) return esc(t);
  if (!/^[a-z]+:/i.test(t)) return esc(t); // relative
  return "#";
}

function inline(src: string): string {
  // Pull code spans out first so nothing inside them is formatted.
  const codes: string[] = [];
  let s = src.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(`<code>${esc(c)}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(((?:[^()\s]|\([^()\s]*\))+)(?:\s+&quot;([^&]*)&quot;)?\)/g, (_, alt, url, cap) => {
    const img = `<img src="${safeUrl(url)}" alt="${alt}" loading="lazy" />`;
    return cap ? `<figure>${img}<figcaption>${cap}</figcaption></figure>` : img;
  });
  s = s.replace(/\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g, (_, text, url) => {
    const ext = /^https?:/i.test(url);
    return `<a href="${safeUrl(url)}"${ext ? ' target="_blank" rel="noreferrer"' : ""}>${text}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  s = s.replace(/(^|\W)_([^_\s][^_]*)_(?=\W|$)/g, "$1<em>$2</em>");
  s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  s = s.replace(/ {2,}\n|\\\n/g, "<br />");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[Number(i)]);
}

function slugId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  const isBlockStart = (l: string) =>
    /^(#{1,4})\s/.test(l) || /^```/.test(l) || /^>\s?/.test(l) || /^\s*([-*+]|\d+\.)\s+/.test(l) || /^(-{3,}|\*{3,})\s*$/.test(l);

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    const fence = line.match(/^```\s*([\w-]*)/);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      const lang = fence[1] ? ` data-lang="${esc(fence[1])}"` : "";
      out.push(`<pre${lang}><code>${esc(buf.join("\n"))}</code></pre>`);
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = Math.max(2, h[1].length); // # and ## are h2 (the page owns h1), ### h3, #### h4
      out.push(`<h${level} id="${slugId(h[2])}">${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      out.push("<hr />");
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote>${renderMarkdown(buf.join("\n"))}</blockquote>`);
      continue;
    }

    // GitHub-style table: | a | b | then |---|---|
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(lines[i + 1])) {
      const cells = (l: string) =>
        l
          .trim()
          .replace(/^\|/, "")
          .replace(/(^|[^\\])\|$/, "$1")
          .split(/(?<!\\)\|/)
          .map((c) => inline(c.trim().replace(/\\\|/g, "|")));
      const head = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(cells(lines[i++]));
      out.push(
        `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
          .join("")}</tbody></table></div>`,
      );
      continue;
    }

    const li = line.match(/^\s*([-*+]|\d+\.)\s+/);
    if (li) {
      const ordered = /\d/.test(li[1]);
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\s*([-*+]|\d+\.)\s+(.*)$/);
        if (m && /\d/.test(m[1]) !== ordered) break; // bullets then numbers = two lists
        if (m) {
          items.push(m[2]);
          i++;
        } else if (lines[i].trim() && /^\s{2,}/.test(lines[i]) && items.length) {
          items[items.length - 1] += " " + lines[i].trim();
          i++;
        } else break;
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</${tag}>`);
      continue;
    }

    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) buf.push(lines[i++]);
    const text = buf.join("\n");
    const only = text.trim();
    // A lone image becomes a figure, not an image inside a paragraph.
    if (/^!\[[^\]]*\]\([^)]+\)$/.test(only)) out.push(inline(only));
    else out.push(`<p>${inline(text)}</p>`);
  }

  return out.join("\n");
}

export function readingMinutes(md: string) {
  const words = md.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
