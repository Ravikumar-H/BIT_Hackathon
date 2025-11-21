import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Allow access to process.env for legacy compatibility if needed, 
  // though import.meta.env is preferred.
  define: {
    'process.env': {} 
  }
});