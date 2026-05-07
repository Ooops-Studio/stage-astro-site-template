import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  vite: {
    resolve: {
      alias: {
        $lib: new URL('./src/lib', import.meta.url).pathname
      }
    }
  }
});
