const base = require('@umijs/fabric/dist/eslint');

const restrictedPackageDirectoryImports = [
  '@rc-component/*/es',
  '@rc-component/*/es/**',
  '@rc-component/*/lib',
  '@rc-component/*/lib/**',
  'rc-*/es',
  'rc-*/es/**',
  'rc-*/lib',
  'rc-*/lib/**',
];

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: restrictedPackageDirectoryImports,
            message: 'Do not import package internals from es/lib. Import from the package root.',
          },
        ],
      },
    ],
    'react/no-find-dom-node': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-for': 0,
  },
};
