// setup.js
import { beforeEach } from 'vitest';

beforeEach(() => {
    import.meta.env.VITE_API_URL = 'https://api.winterswijkkegelen.nl';
    import.meta.env.VITE_MAILTO = 'ruudnaastepad@hotmail.com';
  });
  