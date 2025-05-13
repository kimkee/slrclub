// tailwind.config.js
module.exports = {
    content: [
      "./**/*.html", // 적용할 HTML 파일 또는 템플릿 경로
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // 'primary': '#00c16a',
          'primary': '#41b883',
          'secondary': '#facc15',
        },
        fontSize: {
          '9': ['0.5625rem', '1.4'], // 10px
          '10': ['0.625rem', '1.4'], // 10px
          'xt': ['0.6875rem', '1.4'], // 11px
          'ss': ['0.8125rem', '1.4'], // 13px
          'md': ['0.9375rem', '1.4'], // 15px
          'xx': ['1.375rem', '1.4'], // 22px
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  };
  