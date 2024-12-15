// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        profile: resolve(__dirname, 'profile/index.html'),
        listing: resolve(__dirname, 'listing/index.html'),
        create: resolve(__dirname, 'listing/create/index.html'),
        edit: resolve(__dirname, 'listing/edit/index.html'),
        profileEdit: resolve(__dirname, 'profile/edit/index.html'),
      },
    },
  },
})