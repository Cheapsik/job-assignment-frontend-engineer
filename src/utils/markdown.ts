function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatInline(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

// TODO: Intentional timebox shortcut — subset of Markdown (paragraphs, headings, inline
// emphasis/code) with HTML escaping. A full parser library was skipped per README dependency guidance.
export function markdownToHtml(markdown: string): string {
  return escapeHtml(markdown)
    .split(/\n{2,}/)
    .map(block => {
      const heading = block.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        const level = heading[1].length;
        return `<h${level}>${formatInline(heading[2])}</h${level}>`;
      }

      return `<p>${formatInline(block).replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}
