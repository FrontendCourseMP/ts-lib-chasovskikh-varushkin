import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,          // чтобы использовать describe/it/expect без импорта
    environment: 'jsdom',   // JSDOM для работы с DOM
    setupFiles: './tests/setup.ts', // опционально, для глобальных настроек
  },
});
