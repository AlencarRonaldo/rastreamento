module.exports = {
  root: true,
  extends: ['expo'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
};
