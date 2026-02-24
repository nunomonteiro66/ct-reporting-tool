import { nextJsConfig } from '@repo/config/eslint/next';

export default [
  ...nextJsConfig,
  {
    ignores: ['public/storybook-static/**'],
  },
];