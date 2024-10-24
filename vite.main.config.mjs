import {defineConfig} from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['electron'], // указание, что electron импортируется извне
    },
  },
});
