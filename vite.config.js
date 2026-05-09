import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Raise chunk warning threshold slightly for vendor bundle
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor code into a separate long-lived cached chunk
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('scheduler') ||
              id.includes('react-router') ||
              id.includes('react-helmet')
            ) {
              return 'vendor'
            }
          }
        },
        // Content-hash filenames for optimal long-term caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Enable minification (default esbuild is fast; use terser for smaller output)
    minify: 'esbuild',
    // Generate source maps for production error tracking
    sourcemap: false,
    // Target modern browsers for smaller output
    target: 'es2020',
  },
  server: { port: 5173 },
})
