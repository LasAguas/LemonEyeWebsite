import { resolve } from 'path'
import { defineConfig } from 'vite'
import fs from 'fs'

// Rewrite extensionless URLs (e.g. /socials) to their .html file in dev.
function cleanUrls() {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url.split('?')[0]
        if (url !== '/' && !url.includes('.') && !url.endsWith('/')) {
          const htmlPath = resolve(__dirname, '.' + url + '.html')
          if (fs.existsSync(htmlPath)) {
            req.url = url + '.html' + req.url.slice(url.length)
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [cleanUrls()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        gigs: resolve(__dirname, 'gigs.html'),
        socials: resolve(__dirname, 'socials.html'),
        'out-of-reach': resolve(__dirname, 'out-of-reach.html'),
      },
    },
  },
})
