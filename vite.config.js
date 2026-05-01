import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      include: /\.[jt]sx?$/,
    }),
  ],
  base: '/',
  esbuild: {
    loader: 'jsx',
    include: /\.js$/,
    exclude: [],
  },
});
