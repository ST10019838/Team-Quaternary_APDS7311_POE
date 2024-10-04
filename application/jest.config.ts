/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  // Automatically clear mock calls, instances, contexts, and results before every test
  clearMocks: true,

  // Collect coverage information while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Set the test environment to jsdom (for testing in a browser-like environment)
  testEnvironment: "jsdom",

  // Transform files with babel-jest for JavaScript and TypeScript
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest"
  },

  // Ignore transformation of node_modules and specific files
  transformIgnorePatterns: [
    "\\\\node_modules\\\\",
    "\\.pnp\\.[^\\\\]+$"
  ],
};

export default config;