// setup.js
import { beforeEach } from 'vitest';

beforeEach(() => {
    import.meta.env.VITE_API_URL = 'https://example.nl';
    import.meta.env.VITE_MAILTO = 'mailto@example.com';
  });
  