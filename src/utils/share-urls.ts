export interface ShareInput {
  url: string;
  title: string;
}

export interface ShareUrls {
  x: string;
  line: string;
  hatena: string;
  facebook: string;
  threads: string;
  bluesky: string;
  pocket: string;
}

export function buildShareUrls({ url, title }: ShareInput): ShareUrls {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const tu = encodeURIComponent(`${title} ${url}`);

  return {
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    line: `https://social-plugins.line.me/lineit/share?url=${u}`,
    hatena: `https://b.hatena.ne.jp/add?url=${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    threads: `https://www.threads.net/intent/post?text=${tu}`,
    bluesky: `https://bsky.app/intent/compose?text=${tu}`,
    pocket: `https://getpocket.com/edit?url=${u}&title=${t}`,
  };
}
