import baseConfig from '../../eslint.config';

export default [
  ...baseConfig,
  {
    ignores: ['**/out-tsc'],
  },
];
