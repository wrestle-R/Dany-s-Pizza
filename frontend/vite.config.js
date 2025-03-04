import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src', // This ensures that '@' points to the 'src' directory
      '@shadcn/ui': '/node_modules/@shadcn/ui', // Ensure proper resolution for @shadcn/ui
    },
  
  
  },
});
