module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    // Plain JS project without PropTypes
    'react/prop-types': 'off',
  },
  overrides: [
    {
      // Phaser code relies on the global Phaser namespace
      files: ['src/game/**/*.js', 'src/components/game/**/*.js'],
      globals: { Phaser: 'readonly' },
    },
    {
      files: ['src/**/*.test.js'],
      env: { node: true },
    },
  ],
}
