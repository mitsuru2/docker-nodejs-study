import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const DesignTokens = {
  primitive: {
    custom: {
      color: {
        brightBlue: 'oklch(51.01% 0.274 263.83)',
        brightPurple: 'fuchsia',
        lightGray: '#e6e6e6',
        electricViolet: 'oklch(53.18% 0.28 296.97)',
        frenchViolet: 'oklch(47.66% 0.246 305.88)',
        vividPink: 'oklch(69.02% 0.277 332.77)',
        hotRed: 'oklch(61.42% 0.238 15.34)',
        orangeRed: 'oklch(63.32% 0.24 31.68)',
      },
      gradient: {
        blueToPurpleHori:
          'linear-gradient(90deg, var(--p-custom-color-bright-blue) 0%, var(--p-custom-color-bright-purple) 100%)',
        blueToPurpleVert:
          'linear-gradient(var(--p-custom-color-bright-blue) 0%, var(--p-custom-color-bright-purple) 100%)',
        blueToPurpleCircular:
          'conic-gradient(from 0deg, var(--p-custom-color-bright-blue) 0%, var(--p-custom-color-bright-purple) 50%, var(--p-custom-color-bright-blue) 100%)',
      },
      margin: {
        xs: '2px',
        s: '0.5rem',
        m: '1rem',
        l: '2rem',
      },
      font: {
        size: '16px',
        sizeH1: '20px',
        color: '#495057',
        serif: "'Century', 'Times New Roman', Times, serif",
        sansSerif: "'Noto Sans JP', 'Arial', 'Helvetica', 'sans-serif'",
      },
    },
  },
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
      },
    },
    custom: {
      carousel: {
        image: {
          width: '800px',
        },
      },
      circularProgressBar: {
        background: 'var(--p-custom-gradient-blue-to-purple-circular)',
      },
      progressBar: {
        background: 'var(--p-custom-gradient-blue-to-purple-hori)',
        backgroundHeight: '4px',
        fontSize: 'small',
        fontWeight: 'normal',
        fontFamily: 'var(--p-custom-font-sans-serif)',
      },
    },
  },
  components: {
    menubar: {
      root: {
        padding: '0',
        gap: '0',
      },

      baseItem: {
        padding: '4px 8px',
      },
    },
  },
} as const;
export const CustomPreset = definePreset(Aura, DesignTokens);
