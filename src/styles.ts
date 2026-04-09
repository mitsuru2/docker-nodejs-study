import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const DesignTokens = {
  primitive: {
    custom: {
      color: {
        brightBlue: 'oklch(51.01% 0.274 263.83)',
        brightPurple: 'fuchsia',
        electricViolet: 'oklch(53.18% 0.28 296.97)',
        frenchViolet: 'oklch(47.66% 0.246 305.88)',
        vividPink: 'oklch(69.02% 0.277 332.77)',
        hotRed: 'oklch(61.42% 0.238 15.34)',
        orangeRed: 'oklch(63.32% 0.24 31.68)',
      },
      gradient: {
        blueToPurpleHori:
          'linear-gradient(to right, var(--p-custom-color-bright-blue) 0%, var(--p-custom-color-bright-purple) 100%)',
        blueToPurpleHori20:
          'linear-gradient(to right, rgb(from var(--p-custom-color-bright-blue) r g b / 0.20) 0%, rgb(from var(--p-custom-color-bright-purple) r g b / 0.20) 100%)',
        blueToPurpleVert:
          'linear-gradient(to bottom, var(--p-custom-color-bright-blue) 0%, var(--p-custom-color-bright-purple) 100%)',
        blueToPurpleCircular:
          'conic-gradient(from 0deg, var(--p-custom-color-bright-blue) 0%, var(--p-custom-color-bright-purple) 50%, var(--p-custom-color-bright-blue) 100%)',
        whiteTransparentHori:
          'linear-gradient(to right, white 0%, rgb(from white r g b / 0.80) 50%, transparent 100%)',
        whiteTransparentHoriReverse:
          'linear-gradient(to left, white 0%, rgb(from white r g b / 0.80) 50%, transparent 100%)',
      },
      margin: {
        xs: '2px',
        s: '0.5rem',
        m: '1rem',
        l: '2rem',
        xl: '4rem',
      },
      font: {
        size: '16px',
        sizeH1: '20px',
        color: '#495057',
        serif: "'Century', 'Times New Roman', Times, serif",
        sansSerif: "'Noto Sans JP', 'Arial', 'Helvetica', 'sans-serif'",
      },
      bp: {
        mobile: '768px',
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
      article: {
        image: {
          height: '180px',
          width: '180px',
        },
        caption: {
          fontColor: 'var(--p-custom-font-color)',
          fontSize: 'small',
          fontWeight: 'normal',
        },
      },
      cardWithButton: {
        root: {
          border: '1px solid var(--p-surface-200)',
          borderRadius: '10px',
          shadow: '',
        },
        divider: {
          background: 'var(--p-custom-gradient-blue-to-purple-vert)',
        },
      },
      carousel: {
        root: {
          width: '300px',
        },
        track: {
          gap: '0',
        },
        image: {
          height: '100px',
          maxWidth: '100%',
          overlay: {
            fontSize: 'small',
            fontWeight: 'normal',
          },
          cursor: 'auto',
        },
        overlay: {
          backgroundLeft: 'var(--p-custom-gradient-white-transparent-hori)',
          backgroundRight: 'var(--p-custom-gradient-white-transparent-hori-reverse)',
          width: '10%',
        },
      },
      circularProgressBar: {
        background: 'var(--p-custom-gradient-blue-to-purple-circular)',
      },
      localeSelect: {
        flag: {
          height: '1.1em', // 文字サイズに追従
        },
        font: {
          size: 'normal',
          weight: 'normal',
        },
        padding: {
          x: '0.5rem',
          y: '0.75rem',
        },
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
} as const;
export const CustomPreset = definePreset(Aura, DesignTokens);
