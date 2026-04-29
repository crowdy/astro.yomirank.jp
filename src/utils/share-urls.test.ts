import { describe, it, expect } from 'vitest';
import { buildShareUrls } from './share-urls';

describe('buildShareUrls', () => {
  const input = {
    url: 'https://yomirank.jp/blog/2026/03/10/sample/',
    title: 'サンプルタイトル',
  };

  it('returns X (Twitter) intent URL with encoded url and title', () => {
    const r = buildShareUrls(input);
    expect(r.x).toBe(
      'https://twitter.com/intent/tweet'
      + '?url=https%3A%2F%2Fyomirank.jp%2Fblog%2F2026%2F03%2F10%2Fsample%2F'
      + '&text=%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB'
    );
  });

  it('returns LINE share URL', () => {
    const r = buildShareUrls(input);
    expect(r.line).toBe(
      'https://social-plugins.line.me/lineit/share'
      + '?url=https%3A%2F%2Fyomirank.jp%2Fblog%2F2026%2F03%2F10%2Fsample%2F'
    );
  });

  it('returns Hatena, Facebook, Threads, Bluesky, Pocket URLs', () => {
    const r = buildShareUrls(input);
    expect(r.hatena).toContain('b.hatena.ne.jp/add');
    expect(r.facebook).toContain('facebook.com/sharer');
    expect(r.threads).toContain('threads.net/intent/post');
    expect(r.bluesky).toContain('bsky.app/intent/compose');
    expect(r.pocket).toContain('getpocket.com/edit');
  });

  it('encodes title special characters in tweet text param', () => {
    const r = buildShareUrls({ url: 'https://x.test/', title: 'a&b=c' });
    expect(r.x).toContain('text=a%26b%3Dc');
  });
});
