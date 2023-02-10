/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  transformIgnorePatterns: [
    '<docDir>/node_modules/(?!lodash-es)',
  ],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
