import type { Preset } from '@vite-pwa/assets-generator/config';
 
export const minimal2023Preset: Preset = {
  transparent: {
    sizes: [64, 192, 512],
    favicons: [[48, 'favicon.ico']]
  },
  maskable: {
    sizes: [512]
  },
  apple: {
    sizes: [180]
  },

  // Other configurations as needed
};
