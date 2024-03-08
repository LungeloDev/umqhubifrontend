module.exports = {
  content: ["./pages/**/**/**/**/**/*.js", "./components/**/*.js", "./layouts/**/*.js", 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'print': {'raw': 'print'},
      },
      colors: {
        main: '#FFE57E',
        main2: '#FFF4CB',
        font_color: '#000000',
        light: '#F3F4F9',

        twPrimary: {
          DEFAULT: '#FFE57E',
          shade50: '#FFFCF2',
          shade800: '#'
        },
        twSecondary: {
          DEFAULT: '#FDD835',
          shade700: '#FBC02D',
          shade800: '#F9A825',
          shade50: '#FFFDE7 '
        },
        twError: '#F44336',
        twSuccess: '#43A048',
        twWarning: {
          DEFAULT: '#FB8A00',
          shade50: '#FFF3E0'
        },
        twContent: {
          DEFAULT: '#5A5A5A',
          muted: '#B8B8B8',
          header: '#181818',
          light: '#646464'
        }
      },
      spacing: {
        sidebar: 250,
        'sidebar-mini': 65,
      },
      fontFamily: {
        Poppins: ['Poppins', 'sans-serif'],
        Roboto: ['Roboto', 'sans-serif'],
        Inter: ['Inter', 'sans-serif'],
        DM_Serif: ['DM Serif Display', 'sans-serif']
      },
      boxShadow: {
        'twCustom': '0px 2px 16px rgba(43, 43, 43, 0.08)',
      },
    },
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [
    require('tailwindcss-rtl'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require("daisyui"),
    require('flowbite/plugin')
  ],
}

