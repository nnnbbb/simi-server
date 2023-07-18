module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  rules: {
    'no-console': 'error',
    'prefer-const': 'off',
    // 不必要的分号
    '@typescript-eslint/no-extra-semi': 'off',
    // 使用 import 导入
    '@typescript-eslint/no-var-requires': 'off',
    // class empty constructor
    '@typescript-eslint/no-empty-function': 'off',
    // 函数参数设置默认值为数字, 会自动推导函数参数为数字类型, 不需要额外声明为number
    '@typescript-eslint/no-inferrable-types': 'off',
    // interface 为空
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': 'off'
  }
};
