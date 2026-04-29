# astro.yomirank.jp

[yomirank.jp](https://yomirank.jp) の Astro 기반 정적 사이트.
GitHub Pages에 배포된다.

## 개발

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # dist/ 생성
pnpm preview      # 빌드 결과 미리보기
pnpm test         # vitest 실행 (utils 테스트)
```

## 콘텐츠 흐름

서버측 cron(별도 yomirank.jp 레포)이 `src/content/blog/`에 MD를,
`src/data/`에 베스트셀러 JSON을 push한다. push가 GH Actions 빌드를
트리거하여 GitHub Pages로 배포된다.
