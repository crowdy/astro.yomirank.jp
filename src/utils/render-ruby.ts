function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderRuby(text: string): string {
  let out = '';
  let i = 0;
  const re = /\{([^|{}]+)\|([^|{}]+)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > i) out += escapeHtml(text.slice(i, m.index));
    out += `<ruby>${m[1]}<rt>${m[2]}</rt></ruby>`;
    i = m.index + m[0].length;
  }
  if (i < text.length) out += escapeHtml(text.slice(i));
  return out;
}
