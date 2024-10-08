// plugins/vuetify.js
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import type { ThemeDefinition } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

const MostroDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#14161c',
    surface: '#1D212C',
    primary: '#3e6601',
    'primary-darken-1': '#004940',
    secondary: '#304F00',
    'secondary-darken-1': '#1D212C',
    error: '#f44336',
    info: '#3a5a40',
    success: '#66bb6a',
    warning: '#ffa726',
  },
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    blueprint: md3,
    theme: {
      defaultTheme: 'MostroDarkTheme',
      themes: {
        MostroDarkTheme,
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
