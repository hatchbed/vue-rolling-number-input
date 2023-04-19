// vite.config.js

const fs = require('fs')
import { resolve } from 'path'
import { defineConfig } from 'vite'
const vue = require('@vitejs/plugin-vue');

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'VueRollingNumberInput',
      // the proper extensions will be added
      fileName: 'vue-rolling-number-input',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    // Explicitly emit an index.html file for demo purposes
    {
      name: 'emit-index',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'index.html',
          source: fs.readFileSync(
            resolve(__dirname, 'index.dist.html'),
            'utf-8'
          )
        })
      }
    },
    // Vite Vue SFC plugin
    vue()
  ]
})