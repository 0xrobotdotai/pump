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
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shakeWithPause: {
          '0%': { transform: 'rotate(0deg)', backgroundColor: '#b482ff' },
          '5%': { transform: 'rotate(3deg)', backgroundColor: '#b482ff'  },
          '10%': { transform: 'rotate(-3deg)', backgroundColor: '#b482ff' },
          '15%': { transform: 'rotate(3deg)', backgroundColor: '#b482ff'  },
          '20%': { transform: 'rotate(-3deg)', backgroundColor: '#b482ff'  },
          '25%': { transform: 'rotate(0deg)', backgroundColor: 'transparent' },
          '100%': { transform: 'rotate(0deg)' }, // 保持不动
        },
      },
      animation: {
        shakeWithPause: 'shakeWithPause 1.2s ease-in-out infinite',
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


