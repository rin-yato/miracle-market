// eslint.config.js
import antfu from '@antfu/eslint-config';

export default antfu(
  {
    stylistic: false,
    typescript: true,
    jsonc: false,
  },
  {
    rules: {
      'node/global-require': 'off',
      'no-console': 'off',
      'node/prefer-global/process': 'off',
      'node/no-path-concat': 'off',
    },
  },
);
