import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: 'src/index.ts',
  },
  format: ['cjs', 'esm'],
  outDir: 'dist',
  splitting: false,
  target: 'ES2020',
});
