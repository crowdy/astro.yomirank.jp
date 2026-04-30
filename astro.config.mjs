import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://yomirank.jp',
  output: 'static',
  integrations: [],
  build: {
    format: 'directory',
  },
  trailingSlash: 'always',
});
