/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
      extend: {
        colors: {
          // Isso vincula as classes do Tailwind às suas variáveis do globals.css
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          // ... adicione as outras conforme necessário
        },
        keyframes: {
          "gradient-shift": {
            "0%, 100%": { "background-position": "0% center" },
            "50%": { "background-position": "100% center" },
          },
        },
        animation: {
          "gradient-shift": "gradient-shift 3s ease infinite",
        },
      },
    },
  }