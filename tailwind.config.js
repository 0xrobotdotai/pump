import {modal, nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      
      fontSize: {
        ssm: '0.625rem'
      },
      backgroundImage: {
        'banner': "url('/imgs/banner.png')",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      defaultTheme: 'dark',
      defaultExtendTheme: 'dark',
      themes: {
        dark: {
          colors: {
            background: '#090b1a',
            qls: '#84ccff',
            primary: {
              DEFAULT: '#b482ff',
            },
            default: {
              foreground: '#b482ff',
            },
            secondary: {
              DEFAULT: '#b482ff'
            },
          },
        },
      }
    })
  ],
}


