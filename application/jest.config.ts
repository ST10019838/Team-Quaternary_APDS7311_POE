import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },

  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\\\]+$",
  ],

  // Add this section to ensure Next.js specific transformations
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // adjust based on your folder structure
  },  
};

export default config;