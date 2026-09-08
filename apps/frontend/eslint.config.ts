import baseConfig from '../../eslint.config.ts';

export default [
  ...baseConfig,
  {
    ignores: ['**/out-tsc'],
  },
];
