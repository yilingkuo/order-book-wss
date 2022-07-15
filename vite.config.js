import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import { presetWind , transformerDirectives } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      presets: [
        presetWind()
      ],
      theme: {
        colors: {
          'orderbookBg': '#131B29',
          'buy': {
            'price': '#00b15d'
            // 'price': 'hsla(var(--hue, 217), 78%, 51%)', //class="bg-brand-primary"
          },
          'sell': {
            'price': '#FF5B5A'
            // 'price': 'hsla(var(--hue, 217), 78%, 51%)', //class="bg-brand-primary"
          },
        }
      },
      transformers: [transformerDirectives()],
      rules: [],
      shortcuts: {
        // shortcuts to multiple utilities
        'btn': 'py-2 px-4 font-semibold rounded-lg shadow-md',
        'btn-green': 'text-white bg-green-500 hover:bg-green-700',
        // single utility alias
        'default-dark-bg': 'text-red-100'
      }
    })
  ]
})
