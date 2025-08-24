import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';// <-- Import the 'path' module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
  // Add this resolve object
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
    },
  },
});