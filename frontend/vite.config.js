import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss
 from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
<<<<<<< HEAD
   base: './',
=======
   build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.split('node_modules/')[1].split('/')[0];
          }
        }
      }
    }
  }
>>>>>>> 590755b4a8822aedf84acb3f3ada1bd045cf849b
})
