const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('important', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.\\!${rule.selector.slice(1)}`
          rule.walkDecls(decl => {
            decl.important = true
          })
        })
      })
    })
  ],
  variants: {
    extend: {
      scale: ['group-hover'],
      transitionProperty: ['important']
    },
  },
  theme: {
    extend: {
      colors: {
        gray: {
          '100': '#F8F8F8',
          '200': '#E0E0E0',
          '300': '#C8C8C8',
          '400': '#888888',
          '500': '#707070',
          '600': '#505050',
          '700': '#383838',
          '800': '#282828',
          '900': '#101010',
        }
      },
      transitionDuration: {
        DEFAULT: '250ms'
      },
      fontFamily: {
        'mono': ['"Fira Code"', ...defaultTheme.fontFamily.mono]
      }
    }
  }
}
